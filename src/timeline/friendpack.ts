import type { Stamp } from './stamp'

/*
Layout of graph.bin
===================

Section 1: Users
	u16 - User count
	Users: [
		u8 - Name length
		Variable - Name
		u8 - Stamp year after 2006
		u8 - Stamp month
		u8 - Stamp day
		i8 - Avatar
	]

Section 2: Connections
	u16 - Connection count
	Connections: [
		u16 - Source id
		u16 - Target id
	]

Section 3: Graph layouts
	Layouts: [
		u8 - Stamp year after 2006
		u8 - Stamp month
		u8 - Stamp day
		u16 - Coordinate count
		Coordinates: [
			i8 - X
			i8 - Y
			i8 - Z
		]
	]
*/

const res = await fetch('/friendpack/graph.bin')
const rawData = await res.arrayBuffer()
const buf = new DataView(rawData)
const decoder = new TextDecoder()
let p = 0

const userCount = buf.getUint16(p)
p += 2
export const users: GraphUser[] = new Array(userCount)
for (let id = 0; id < userCount; id++) {
	const nameLength = buf.getUint8(p)
	p += 1
	const name = decoder.decode(new DataView(rawData, p, nameLength))
	p += nameLength
	const year = buf.getUint8(p) + 2006
	p += 1
	const month = buf.getUint8(p)
	p += 1
	const day = buf.getUint8(p)
	p += 1
	const avatar = buf.getInt8(p)
	p += 1
	users[id] = {
		id,
		name,
		stamp: { year, month, day },
		defaultAvatar: avatar === -1 ? null : avatar,
	}
}

const connectionCount = buf.getUint16(p)
p += 2
export const connections: GraphConnection[] = new Array(connectionCount)
for (let i = 0; i < connectionCount; i++) {
	const sourceId = buf.getUint16(p)
	p += 2
	const targetId = buf.getUint16(p)
	p += 2
	connections[i] = { sourceId, targetId }
}

const remaining = new DataView(rawData, p, rawData.byteLength - p)
export function* graphLayouts(): Generator<GraphLayout> {
	let r = 0

	while (r < remaining.byteLength) {
		const year = remaining.getUint8(r) + 2006
		r += 1
		const month = remaining.getUint8(r)
		r += 1
		const day = remaining.getUint8(r)
		r += 1

		const coordinateCount = remaining.getUint16(r)
		r += 2
		const coordinateOffset = r
		r += coordinateCount * 3

		yield {
			stamp: { year, month, day },
			coordinateCount,
			coordinates: function*() {
				for (let i = 0; i < coordinateCount; i++) {
					const x = remaining.getInt8(coordinateOffset + i * 3)
					const y = remaining.getInt8(coordinateOffset + i * 3 + 1)
					const z = remaining.getInt8(coordinateOffset + i * 3 + 2)
					yield { x, y, z }
				}
			}
		}
	}
}

export interface GraphUser {
	id: number
	name: string
	stamp: Stamp
	defaultAvatar: number | null
}

export interface GraphConnection {
	sourceId: number
	targetId: number
}

export interface GraphLayout {
	stamp: Stamp
	coordinateCount: number
	coordinates(): Generator<GraphCoordinate>
}

export interface GraphCoordinate {
	x: number
	y: number
	z: number
}
