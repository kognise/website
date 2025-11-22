import '../styles/global.css'
import './timeline.css'

// @ts-expect-error
import timeline from './timeline.yml'
import { birthday, cmp, coerceStamp, formatStamp, pxs, sxp, yearHeight } from './stamp'
import { setStamp } from './graph'

// // const sizes: Record<string, number> = {}
// // const getSize = (id) => {
// // 	if (!sizes[id]) {
// // 		sizes[id] = 10 + Math.log(friends.connections.filter(({ sourceId }) => sourceId === id).length + 1) * 6.1
// // 	}
// // 	return sizes[id]
// // }

// const avatars: Record<string, Sprite> = {}
// for (const { id, avatar } of Object.values(friends.users)) {
// 	const map = new TextureLoader().load(avatar
// 		? `https://cdn.discordapp.com/avatars/${id}/${avatar}.png`
// 		: `/discord-default/${Number(BigInt(id) >> 22n) % 6}.png`)
// 	const material = new SpriteMaterial({map})
// 	const sprite = new Sprite(material)

// 	const size = getSize(id)
// 	sprite.scale.set(size, size, size)

// 	avatars[id] = sprite
// }

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

const now = coerceStamp(new Date())
const end: Stamp = { year: now.year + 2, month: birthday.month, day: birthday.day }
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
		if (cmp(range.from, birthday) < 0) range.from = birthday
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
	label.innerText = formatStamp(stamp)
	setStamp(stamp)
}

window.addEventListener('scroll', onScroll, { passive: false })
onScroll()
