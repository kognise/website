import '../styles/global.css'
import './timeline.css'

// @ts-expect-error
import timeline from './timeline.yml'
import friends from './friends.json'
import { Sprite, SpriteMaterial, TextureLoader } from 'three'
import ForceGraph3D, { type ForceGraph3DInstance, type LinkObject, type NodeObject } from '3d-force-graph'

const sizes: Record<string, number> = {}
const getSize = (id) => {
	if (!sizes[id]) {
		sizes[id] = 10 + Math.log(friends.connections.filter(({ sourceId }) => sourceId === id).length + 1) * 6.1
	}
	return sizes[id]
}

const avatars: Record<string, Sprite> = {}
for (const { id, avatar } of Object.values(friends.users)) {
	const map = new TextureLoader().load(avatar
		? `https://cdn.discordapp.com/avatars/${id}/${avatar}.png`
		: `/discord-default/${Number(BigInt(id) >> 22n) % 6}.png`)
	const material = new SpriteMaterial({map})
	const sprite = new Sprite(material)

	const size = getSize(id)
	sprite.scale.set(size, size, size)

	avatars[id] = sprite
}

type GraphNode = NodeObject & typeof friends.users[number] & { name: string }
type GraphLink = LinkObject<GraphNode> & { source: GraphNode, target: GraphNode }

const highlightNodes: Set<string> = new Set()
const highlightLinks: Set<GraphLink> = new Set()
let hoverNode: string | null = null

const updateHighlight = () => {
	for (const node of highlightNodes) {
		if (node) avatars[node]?.material.color.setHex(hoverNode === node ? 0xff0000 : 0xffa500)
	}

	graph
		.nodeColor(graph.nodeColor())
		.linkWidth(graph.linkWidth())
		.linkDirectionalParticles(graph.linkDirectionalParticles())
}

const graph = (new ForceGraph3D(document.getElementById('graph')!) as ForceGraph3DInstance<GraphNode, GraphLink>)
	.backgroundColor('rgba(0, 0, 0, 0)')
	.linkWidth((link) => highlightLinks.has(link) ? 4 : 1)
	.linkDirectionalParticles((link) => highlightLinks.has(link) ? 8 : 0)
	.linkDirectionalParticleWidth(2)
	.onNodeHover((node) => {
		for (const node of highlightNodes) {
			if (node) avatars[node].material.color.setHex(0xffffff)
		}
		highlightNodes.clear()
		highlightLinks.clear()

		if (node) {
			highlightNodes.add(node.id)
			friends.connections
				.filter((relationship) => relationship.sourceId === node.id)
				.forEach((relationship) => highlightNodes.add(relationship.targetId))
			graph.graphData().links
				.filter((link) => link.source.id === node.id)
				.forEach((link) => highlightLinks.add(link))
		}
		hoverNode = node ? node.id : null
		updateHighlight()
	})
	.onLinkHover((link) => {
		for (const node of highlightNodes) {
			if (node) avatars[node]?.material.color.setHex(0xffffff)
		}
		highlightNodes.clear()
		highlightLinks.clear()

		if (link) {
			highlightLinks.add(link)
			highlightNodes.add(link.source.id)
			highlightNodes.add(link.target.id)
		}
		updateHighlight()
	})
	.onNodeDragEnd(node => {
		node.fx = node.x
		node.fy = node.y
		node.fz = node.z
	})
	.nodeThreeObject(({ id }) => avatars[id])

window.addEventListener('resize', () => {
	graph.width(window.innerWidth / 2)
	graph.height(window.innerHeight)
})
graph.width(window.innerWidth / 2)
graph.height(window.innerHeight)

function updateGraphData(date: number) {
	const graphData = {
		nodes: [ ...graph.graphData().nodes ],
		links: [ ...graph.graphData().links ],
	}

	const enabledNodes = Object.values(friends.users).filter((info) => info.date <= date)
	const enabledLinks = friends.connections.filter((conn) => enabledNodes.some((node) => node.id === conn.sourceId) && enabledNodes.some((node) => node.id === conn.targetId))

	const isNodeEnabled = (node: GraphNode) => enabledNodes.some((enabledNode) => enabledNode.id === node.id)
	const isLinkEnabled = (link: GraphLink) => enabledLinks.some((enabledLink) => enabledLink.sourceId === link.source.id && enabledLink.targetId === link.target.id)
	const isNodeInGraph = (node: GraphNode) => graphData.nodes.some((graphNode) => graphNode.id === node.id)
	const isLinkInGraph = (link: GraphLink) => graphData.links.some((graphLink) => graphLink.source.id === link.source.id && graphLink.target.id === link.target.id)

	console.log(`updating graph data: ${enabledNodes.length} visible nodes and ${enabledLinks.length} visible links`)

	for (const node of graphData.nodes) {
		if (!isNodeEnabled(node)) graphData.nodes.splice(graphData.nodes.indexOf(node), 1)
	}
	for (const node of enabledNodes) {
		const graphNode = {
			...node,
			name: `${node.globalName ?? node.username} (...)`
		}
		if (!isNodeInGraph(graphNode)) graphData.nodes.push(graphNode)
	}

	for (const link of graphData.links) {
		if (!isLinkEnabled(link)) graphData.links.splice(graphData.links.indexOf(link), 1)
	}
	for (const link of enabledLinks) {
		const graphLink = {
			source: graphData.nodes.find((node) => node.id === link.sourceId)!,
			target: graphData.nodes.find((node) => node.id === link.targetId)!,
		}
		if (!isLinkInGraph(graphLink)) graphData.links.push(graphLink)
	}

	graph.graphData(graphData)
	// graph.refresh()
}

interface Range {
	from: Stamp
	to: Stamp | null
	text: string
	startText: string | null
}

interface Event {
	date: Stamp
	text: string
}

interface Stamp {
	year: number
	month: number // 1-12
	day: number
}

function coerceStamp(date: Date | string): Stamp {
	if (typeof date === 'string') {
		return coerceStamp(new Date(date))
	}

	if (typeof date === 'number') {
		return {
			year: date,
			month: 1,
			day: 1,
		}
	}
	
	return {
		year: date.getUTCFullYear(),
		month: date.getUTCMonth() + 1,
		day: date.getUTCDate(),
	}
}

function pxs(stamp: Stamp): number {
	// Calculate years since birthday
	const yearsSince = stamp.year - birthday.year
	
	// Calculate months since birthday (within the current year)
	const monthsSince = stamp.month - birthday.month
	
	// Calculate the day position within the month
	// Days are 1-indexed, so we need to subtract 1 to get 0-indexed position
	const daysInMonth = getDaysInMonth(stamp.year, stamp.month)
	const daysSince = stamp.day - birthday.day
	
	// Calculate pixel value
	const yearPx = yearsSince * yearHeight
	const monthPx = monthsSince * (yearHeight / 12)
	const dayPx = (daysSince / daysInMonth) * (yearHeight / 12)
	
	return yearPx + monthPx + dayPx
}

function sxp(px: number): Stamp {
	const monthHeight = yearHeight / 12
	
	// Calculate years
	const yearOffset = Math.floor(px / yearHeight)
	const year = birthday.year + yearOffset
	
	// Calculate months
	const remainderAfterYears = px - (yearOffset * yearHeight)
	const monthOffset = Math.floor(remainderAfterYears / monthHeight)
	const month = birthday.month + monthOffset
	
	// Calculate days
	const remainderAfterMonths = remainderAfterYears - (monthOffset * monthHeight)
	const daysInMonth = getDaysInMonth(year, month)
	const dayOffset = Math.floor((remainderAfterMonths / monthHeight) * daysInMonth)
	const day = birthday.day + dayOffset
	
	return { year, month, day }
}

function getDaysInMonth(year: number, month: number): number {
	return new Date(year, month, 0).getDate()
}

function px(input: Stamp | number): string {
	if (typeof input === 'number') {
		if (input === 0) return '0'
		return `${input}px`
	}

	return px(pxs(input))
}

const container = document.getElementById('timeline')!

function syncWidth(
	from: HTMLElement,
	to: HTMLElement,
	process: ((width: number) => number) = ((x) => x),
) {
	new ResizeObserver((entries) => {
		const [ entry ] = entries
		const width = process(entry.borderBoxSize[0].inlineSize)
		to.style.width = px(width)
	}).observe(from)
}

function el(options: {
	rotated?: boolean
	tag?: keyof HTMLElementTagNameMap
	class?: string
	style?: Partial<CSSStyleDeclaration>
	html?: string
}): HTMLElement {
	const div = document.createElement(options.tag ?? 'div')
	div.style.position = 'absolute'
	div.style.overflow = 'hidden'
	if (options.class) div.className = options.class
	if (options.style) Object.assign(div.style, options.style)
	
	if (options.html) {
		if (options.rotated) {
			const inner = document.createElement('div')
			inner.style.transform = 'rotate(-90deg)'
			inner.style.transformOrigin = 'top left'
			inner.style.textAlign = 'right'
			inner.style.position = 'absolute'
			inner.style.paddingRight = '10px'
			if (options.style?.height) {
				inner.style.width = options.style.height
				inner.style.top = options.style.height
			}
			inner.innerHTML = options.html
			div.appendChild(inner)
		} else {
			div.innerHTML = options.html
		}
	}
		
	container.appendChild(div)
	return div
}

function cmp(a: Stamp, b: Stamp): -1 | 0 | 1 {
	for (const [ key, value ] of Object.entries(a)) {
		if (b[key as keyof Stamp] < value) return -1
		if (b[key as keyof Stamp] > value) return 1
	}
	return 0
}

const birthday = coerceStamp('2006-04-21')
const now = coerceStamp(new Date())
const end: Stamp = { year: now.year + 2, month: birthday.month, day: birthday.day }
const yearHeight = 200
const tickWidth = 20
const rangeColumnStart = tickWidth + 10
const rangeColumnWidth = 40
const colors = [ '#f03e3e', '#f76707', '#f59f00', '#37b24d', '#1098ad', '#4263eb', '#7048e8', '#ae3ec9', '#d6336c' ]

container.style.height = px(end)

for (let year = birthday.year; year <= end.year; year++) {
	const age = year - birthday.year

	el({
		class: 'line',
		style: {
			top: px(age * yearHeight),
			left: '0',
			width: px(tickWidth),
			height: px(1),
		}
	})

	for (let month = 1; month < 12; month++) {
		el({
			class: 'line',
			style: {
				top: px((age + month / 12) * yearHeight),
				left: '0',
				width: px(tickWidth / 2),
				height: px(1),
			}
		})
	}
}

el({
	class: 'cursor',
	style: {
		position: 'fixed',
		top: '50dvh',
		width: '100%',
		height: px(1),
	}
})

el({
	class: 'now',
	style: {
		top: px(now),
		width: '100%',
		height: px(1),
	}
})

const rangeColumns: Range[][] = []

const presidents = Object.entries(timeline.presidents)
rangeColumns.push(presidents.map(([ date, name ], i) => ({
	from: coerceStamp(date),
	to: i < presidents.length - 1
		? coerceStamp(presidents[i + 1][0])
		: null,
	startText: `${name} is inaugurated`,
	text: `President: ${name}`,
})))

const locations = Object.entries(timeline.locations)
rangeColumns.push(locations.map(([ date, name ], i) => ({
	from: coerceStamp(date),
	to: i < locations.length - 1
		? coerceStamp(locations[i + 1][0])
		: null,
	startText: `I move to ${name}`,
	// startText: null,
	text: `Living in ${name}`,
})))

rangeColumns.push(timeline.jobs.map((job) => ({
	from: coerceStamp(job.from),
	to: coerceStamp(job.to),
	text: job.text,
	startText: job.start_text,
})))

// rangeColumns.push(...timeline.other_ranges.map((range) => [{
// 	from: coerceStamp(range.from),
// 	to: coerceStamp(range.to),
// 	text: range.text,
// 	startText: range.text,
// }]))

let ci = 0
const tops: number[] = []
for (let col = 0; col < rangeColumns.length; col++) {
	const rangeColumn = rangeColumns[col]

	for (const range of rangeColumn) {
		if (cmp(range.from, birthday) > 0) range.from = birthday
		const color = colors[ci++ % colors.length]

		const columnLeft = rangeColumnStart + rangeColumnWidth * col
		const labelWidth = 300
		const connectorThickness = 3

		// Column
		el({
			rotated: true,
			html: range.text,
			style: {
				background: color,
				top: px(range.from),
				height: px(pxs(range.to ?? end) - pxs(range.from) - 2),
				left: px(columnLeft),
				width: px(rangeColumnWidth - 2),
				zIndex: '1',
			}
		})

		if (range.startText) {
			let labelLeft = rangeColumnStart + rangeColumns.length * rangeColumnWidth + 10
			if (tops.some((top) => pxs(range.from) > top - 40 && pxs(range.from) < top + 40)) {
				labelLeft += labelWidth
			} else {
				tops.push(pxs(range.from))
			}

			// Label
			const label = el({
				html: range.startText,
				class: 'label',
				style: {
					top: px(pxs(range.from) + connectorThickness),
					left: px(labelLeft),
					width: 'fit-content',
					maxWidth: px(labelWidth),
					zIndex: '3',
					padding: '2px 6px',
				}
			})

			// Connector line
			const connector = el({
				style: {
					background: color,
					top: px(range.from),
					height: px(connectorThickness),
					left: px(columnLeft),
					zIndex: '2',
				}
			})

			syncWidth(label, connector, (width) => labelLeft - columnLeft + width)
		}
	}
}

const label = el({
	class: 'stamp',
	style: {
		position: 'fixed',
		top: '50dvh',
		right: px(20),
		fontSize: '1.5em',
	}
})
function onScroll() {
	const stamp = sxp(window.scrollY)
	label.innerText = `${stamp.year.toString().padStart(4, '0')}-${stamp.month.toString().padStart(2, '0')}-${stamp.day.toString().padStart(2, '0')}`
	updateGraphData(new Date(stamp.year, stamp.month - 1, stamp.day).getTime())
}

window.addEventListener('scroll', onScroll, { passive: true })
onScroll()
