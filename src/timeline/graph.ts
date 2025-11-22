import '../styles/global.css'
import './timeline.css'

import { connections, graphLayouts, users, type GraphLayout } from './friendpack'
import { AmbientLight, BufferGeometry, DirectionalLight, Line, LineBasicMaterial, Mesh, MeshLambertMaterial, Object3D, Quaternion, SphereGeometry, Spherical, Vector3 } from 'three'
import ThreeRenderObjects from 'three-render-objects'
import { cmp, coerceStamp, formatStamp, maxStamp, type Stamp } from './stamp'

const graph = new ThreeRenderObjects(document.getElementById('graph')!, { controlType: 'trackball' })
	.backgroundColor('rgba(0, 0, 0, 0)')
	.lights([
		new AmbientLight(0xcccccc, Math.PI),
		new DirectionalLight(0xffffff, 0.6 * Math.PI)
	])

interface AnimatableUserObject {
	targetPosition: Vector3
	mesh: Mesh
}

const sphereMaterial = new MeshLambertMaterial({
	color: 0xff0000,
	transparent: false,
	opacity: 1,
})
const userObjects = new Map<number, AnimatableUserObject>()
const lineMaterial = new LineBasicMaterial({ color: 0x0000ff })
const lineGeometry = new BufferGeometry()
const lineObject = new Line(lineGeometry, lineMaterial)

const normalizeAngle = (angle: number) => {
  while (angle > Math.PI) angle -= 2 * Math.PI
  while (angle < -Math.PI) angle += 2 * Math.PI
  return angle
}

let prevTime = 0
;(function animate(time: number) {
	const deltaTime = time - prevTime
	prevTime = time

	graph.width(window.innerWidth / 2)
	graph.height(window.innerHeight)

	for (const userObject of userObjects.values()) {
		const currentDir = userObject.mesh.position.clone().normalize()
		const targetDir = userObject.targetPosition.clone().normalize()
		const fullRotation = new Quaternion().setFromUnitVectors(currentDir, targetDir)
		const radius = userObject.mesh.position.length()
		const stepAngle = (0.75 * deltaTime) / radius
		const stepRotation = new Quaternion().identity().rotateTowards(fullRotation, stepAngle)
		userObject.mesh.position.applyQuaternion(stepRotation)
	}

	graph.tick()
	requestAnimationFrame(animate)
})(0)

export function setStamp(stamp: Stamp) {
	const visibleUsers = users.filter((user) => cmp(user.stamp, stamp) <= 0)
	const layoutStamp = maxStamp(visibleUsers.map((user) => user.stamp))
	if (layoutStamp === null) {
		graph.objects([])
		return
	}
	const layout = graphLayouts().find((layout) => cmp(layout.stamp, layoutStamp) === 0)!
	
	if (visibleUsers.length !== layout.coordinateCount) {
		throw new Error(`Visible users mismatches coordinate count: ${visibleUsers.length} != ${layout.coordinateCount}`)
	}

	const objects: Object3D[] = [ lineObject ]

	const coordinates = [ ...layout.coordinates() ]
	const userIdToLocalIndex = new Map<number, number>()

	for (let i = 0; i < layout.coordinateCount; i++) {
		const { x, y, z } = coordinates[i]
		const user = visibleUsers[i]

		const pos = new Vector3(x, y, z)
		userIdToLocalIndex.set(user.id, i)

		if (userObjects.has(user.id)) {
			const object = userObjects.get(user.id)!
			object.targetPosition.copy(pos)
			objects.push(object.mesh)
		} else {
			const geometry = new SphereGeometry(1, 12, 12)
			const mesh = new Mesh(geometry, sphereMaterial)
			mesh.position.copy(pos)
			userObjects.set(user.id, {
				targetPosition: pos,
				mesh,
			})
			objects.push(mesh)
		}
	}

	// const points: Vector3[] = []
	// for (const { sourceId, targetId } of connections) {
	// 	const sourceIndex = userIdToLocalIndex.get(sourceId)
	// 	const targetIndex = userIdToLocalIndex.get(targetId)
	// 	if (sourceIndex === undefined || targetIndex === undefined) continue

	// 	const source = coordinates[sourceIndex]
	// 	const target = coordinates[targetIndex]
	// 	points.push(
	// 		new Vector3(source.x, source.y, source.z),
	// 		new Vector3(target.x, target.y, target.z),
	// 	)
	// }

	// const padding = connections.length * 2 - points.length
	// for (let i = 0; i < padding; i++) points.push(new Vector3(0, 0, 0))
	// lineGeometry.setFromPoints(points)

	graph.objects(objects)
}
