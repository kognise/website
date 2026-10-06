import { map, circleLine, circleLabel, clamp, circleDot } from './util'
import { dbFromLinear, linearFromDb } from './dsp'
import type { MeterKind, PortMessage } from './worklet'
import meterWorkletUrl from '../meter/worklet?worker&url'

const LUFS_CHART_UPDATE_RATE = 60
const LUFS_CHART_SECONDS = 10
const LUFS_CHART_UPDATE_INTERVAL_MS = 1000 / LUFS_CHART_UPDATE_RATE
const LUFS_CHART_LENGTH = LUFS_CHART_SECONDS * LUFS_CHART_UPDATE_RATE

export interface SharedState {
	peak: number
	peakHoldPeak: number
	rms: number
	lufs: {
		momentary: number
		shortTerm: number
		chart: Array<{
			momentary: number
			shortTerm: number
		}>
		lastChartUpdateTimeMs: number
	}
	isPeakRendered: boolean
	meterKind: MeterKind
}

export interface Controls {
	updateMeterKind: (meterKind: MeterKind) => void
	setSource: (source: AudioNode) => void
}

export const width = 400
export const height = 200

async function getPatternSource() {
	if (typeof Image === 'undefined') return null

	const size = 200

	const image = new Image()
	image.src = 'https://www.transparenttextures.com/patterns/beige-paper.png'
	await new Promise((resolve, reject) => {
		image.onload = resolve
		image.onerror = reject
	})

	const destCanvas = document.createElement('canvas')
	destCanvas.width = size
	destCanvas.height = size
	const destCtx = destCanvas.getContext('2d')
	if (!destCtx) return null

	destCtx.drawImage(image, 0, 0, size, size)

	return destCanvas
}

const patternSource = await getPatternSource()

export function render(ctx: CanvasRenderingContext2D, sharedState: SharedState): void {
	ctx.canvas.width = width * window.devicePixelRatio
	ctx.canvas.height = height * window.devicePixelRatio
	ctx.resetTransform()
	ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
	ctx.clearRect(0, 0, width, height)

	const now = Date.now()
	if (now - sharedState.lufs.lastChartUpdateTimeMs > LUFS_CHART_UPDATE_INTERVAL_MS) {
		sharedState.lufs.chart.push({
			momentary: sharedState.lufs.momentary,
			shortTerm: sharedState.lufs.shortTerm,
		})
		if (sharedState.lufs.chart.length > LUFS_CHART_LENGTH) {
			sharedState.lufs.chart.shift()
		}
		sharedState.lufs.lastChartUpdateTimeMs = now
	}

	if (sharedState.meterKind === 'peak' || sharedState.meterKind === 'true_peak' || sharedState.meterKind === 'rms' || sharedState.meterKind === 'hybrid' || sharedState.meterKind === 'k') {
		const offset = sharedState.meterKind === 'k' ? -20 : 0
		const isHybridMeter = sharedState.meterKind === 'hybrid' || sharedState.meterKind === 'k'

		// function peakSliderFromLinear(linear: number): number {
		// 	return Math.pow(linear / linearFromDb(offset) / 3.162278, 1 / 3)
		// }

		ctx.fillStyle = '#222222'
		ctx.fillRect(0, 0, width, height)

		const sliderMarginX = 20
		const sliderMarginY = isHybridMeter ? 15 : 20
		const sliderBounds = {
			x: sliderMarginX,
			y: sliderMarginY,
			width: width - sliderMarginX * 2,
			height: 40,
		}

		let sliderLabels: number[]
		let sliderTicks: number[]
		if (sharedState.meterKind === 'k') {
			sliderLabels = [ -30, -20, -10, 0, 10, 20 ]
			sliderTicks = [
				-27.5, -25, -22.5,
				-17.5, -15, -12.5,
				-7.5, -5, -2.5,
				7.5, 5, 2.5,
				17.5, 15, 12.5,
			]
		} else {
			sliderLabels = [ 10, 5, 0, -5, -10, -20, -30, -40, -50, -70, -Infinity ]
			sliderTicks = [
				8.75, 7.5, 6.25,
				3.75, 2.5, 1.25,
				-1.25, -2.5, -3.75,
				-6.25, -7.5, -8.75,
				-12.5, -15, -17.5,
				-22.5, -25, -27.5,
				-32.5, -35, -37.5,
				-43.33, -46.67,
			]
		}
		const minSliderLabel = Math.min(...sliderLabels)
		const maxSliderLabel = Math.max(...sliderLabels)
		
		function peakSliderFromDb(db: number): number {
			if (sharedState.meterKind === 'k') {
				return clamp(
					map(
						db,
						minSliderLabel + offset,
						maxSliderLabel + offset,
						0,
						1,
					),
					0,
					1,
				)
			} else {
				return Math.pow(linearFromDb(db) / 3.162278, 1 / 3)
			}
		}

		ctx.fillStyle = '#000000'
		ctx.fillRect(sliderBounds.x, sliderBounds.y, sliderBounds.width, sliderBounds.height)

		const tickOffset = 2
		const bigTickHeight = 15
		const smallTickHeight = 10
		for (const labelDb of sliderLabels) {
			const tickWidth = 2
			const tickX = sliderBounds.x + sliderBounds.width * peakSliderFromDb(labelDb + offset) - tickWidth / 2

			ctx.fillStyle = '#aaaaaa'
			ctx.fillRect(
				tickX - tickWidth / 2,
				sliderBounds.y + sliderBounds.height + tickOffset,
				tickWidth,
				bigTickHeight,
			)

			ctx.font = '12px "IBM Plex Sans", sans-serif'
			ctx.textAlign = 'center'
			ctx.textBaseline = 'top'
			ctx.fillText(
				labelDb === -Infinity
					? '∞'
					: labelDb > 0
						? `+${labelDb}`
						: sharedState.meterKind === 'k'
							? `${labelDb}`
							: `${Math.abs(labelDb)}`,
				tickX,
				sliderBounds.y + sliderBounds.height + bigTickHeight + tickOffset + 4,
			)
		}

		for (const tickDb of sliderTicks) {
			const tickWidth = 1
			const tickX = sliderBounds.x + sliderBounds.width * peakSliderFromDb(tickDb + offset) - tickWidth / 2

			ctx.fillStyle = '#aaaaaa'
			ctx.fillRect(
				tickX - tickWidth / 2,
				sliderBounds.y + sliderBounds.height + tickOffset + (bigTickHeight - smallTickHeight),
				tickWidth,
				smallTickHeight,
			)
		}

		const grad = ctx.createLinearGradient(
			sliderBounds.x,
			sliderBounds.y,
			sliderBounds.x + sliderBounds.width,
			sliderBounds.y + sliderBounds.height,
		)
		if (sharedState.meterKind === 'rms') {
			grad.addColorStop(0, `#03aff7`)
			grad.addColorStop(0.5, `#8bdbff`)
		} else {
			grad.addColorStop(0, `#5df455`)
			grad.addColorStop(0.5, `#c6e76c`)
		}
		ctx.fillStyle = grad

		function drawSlider(linear: number, opacity: number, isPeakHold: boolean = false) {
			ctx.globalAlpha = opacity

			const widthPos = sliderBounds.width * peakSliderFromDb(dbFromLinear(linear))
			if (isPeakHold) {
				const peakHoldWidth = 1.5

				ctx.fillRect(
					sliderBounds.x + widthPos - peakHoldWidth / 2,
					sliderBounds.y,
					peakHoldWidth,
					sliderBounds.height,
				)
			} else {
				ctx.fillRect(
					sliderBounds.x,
					sliderBounds.y,
					widthPos,
					sliderBounds.height,
				)
			}
		}
		
		if (isHybridMeter) {
			drawSlider(sharedState.peak, 0.5)
			drawSlider(sharedState.rms, 1)
			if (sharedState.peakHoldPeak > linearFromDb(minSliderLabel + offset)) {
				drawSlider(sharedState.peakHoldPeak, 1, true)
			}
		} else if (sharedState.meterKind === 'rms') {
			drawSlider(sharedState.rms, 1)
		} else {
			drawSlider(sharedState.peak, 1)
		}
		ctx.globalAlpha = 1
		
		ctx.font = '18px "IBM Plex Sans", sans-serif'
		ctx.textBaseline = 'bottom'
		ctx.textAlign = 'left'

		const rmsLabel = isHybridMeter ? 'RMS: ' : 'dBFS RMS: '
		const label = sharedState.meterKind === 'peak'
			? 'dBFS: '
			: sharedState.meterKind === 'rms'
				? rmsLabel
				: isHybridMeter
					? 'Peak: '
					: 'dBTP: '
		const measurement = ctx.measureText(label)
		const textY = height - sliderMarginY

		function labelText(db: number) {
			db *= 10
			db = Math.round(db)
			db /= 10
			db -= offset
			if (db <= minSliderLabel) db = -Infinity
			const string = db.toFixed(1)
			return string === '-0.0' ? '0.0' : string
		}

		const mainLabelValue = sharedState.meterKind === 'rms'
			? sharedState.rms
			: sharedState.peak
		ctx.fillStyle = '#aaaaaa'
		ctx.fillText(
			label,
			sliderBounds.x,
			textY,
		)
		ctx.fillStyle = '#ffffff'
		ctx.fillText(
			labelText(dbFromLinear(mainLabelValue)),
			sliderBounds.x + measurement.width,
			textY,
		)

		if (isHybridMeter) {
			const rmsTextY = textY - measurement.actualBoundingBoxAscent - 10
			const maxTextY = rmsTextY - measurement.actualBoundingBoxAscent - 10

			ctx.fillStyle = '#aaaaaa'
			ctx.fillText(
				rmsLabel,
				sliderBounds.x,
				rmsTextY,
			)
			ctx.fillText(
				'Max: ',
				sliderBounds.x,
				maxTextY,
			)
			ctx.fillStyle = '#ffffff'
			ctx.fillText(
				labelText(dbFromLinear(sharedState.rms)),
				sliderBounds.x + measurement.width,
				rmsTextY,
			)
			ctx.fillText(
				labelText(dbFromLinear(sharedState.peakHoldPeak)),
				sliderBounds.x + measurement.width,
				maxTextY,
			)
		}
	} else if (sharedState.meterKind === 'uk_ppm' || sharedState.meterKind === 'ebu_ppm') {
		ctx.fillStyle = '#111111'
		ctx.fillRect(0, 0, width, height)
		
		const circleBounds = {
			cx: width / 2,
			cy: height + 30,
			r: (width - 90) / 2,
		}
		const angleMargin = 0.15
		const angleStart = (1 + angleMargin) * Math.PI
		const angleEnd = (2 - angleMargin) * Math.PI
		const angleFirstTick = angleStart + 0.055 * Math.PI
		const angleLastTick = angleEnd - 0.03 * Math.PI

		ctx.strokeStyle = '#ffffff'
		ctx.fillStyle = '#ffffff'
		const fontSize = sharedState.meterKind === 'uk_ppm' ? 20 : 18
		ctx.font = `${fontSize}px "Gill Sans", sans-serif`
		ctx.lineWidth = 3
		circleLine(ctx, circleBounds.cx, circleBounds.cy, angleStart, circleBounds.r, 20)
		circleLine(ctx, circleBounds.cx, circleBounds.cy, angleEnd, circleBounds.r, 20)
		for (const level of [ 1, 2, 3, 4, 5, 6, 7 ]) {
			const angle = map((level - 1) / 6, 0, 1, angleFirstTick, angleLastTick)
			const tickSize = 30
			circleLine(
				ctx,
				circleBounds.cx,
				circleBounds.cy,
				angle,
				circleBounds.r,
				tickSize,
			)

			let label: string
			if (sharedState.meterKind === 'uk_ppm') {
				label = `${level}`
			} else {
				const db = -12 + (level - 1) * 4
				if (db === 0) {
					label = 'TEST'
				} else if (db < 0) {
					label = `${db}`
				} else {
					label = `+${db}`
				}
			}

			const verticalOffset = sharedState.meterKind === 'ebu_ppm' && (level === 1 || level === 7)
				? 2
				: 1
			const xOffset = sharedState.meterKind === 'ebu_ppm' && level <= 3 ? -5 : 0
			circleLabel(
				ctx,
				circleBounds.cx + xOffset,
				circleBounds.cy,
				angle,
				circleBounds.r + tickSize + verticalOffset,
				label,
				sharedState.meterKind === 'uk_ppm',
			)
		}
		if (sharedState.meterKind === 'ebu_ppm') {
			circleLabel(
				ctx,
				circleBounds.cx,
				circleBounds.cy,
				(angleStart + angleEnd) / 2,
				60,
				'dB',
				false,
			)
		}
		
		const reference = -20
		const relativeDb = dbFromLinear(sharedState.peak) - reference
		const level = sharedState.meterKind === 'uk_ppm' && relativeDb < -8
			? 2 + (relativeDb + 8) / 6
			: 4 + relativeDb / 4
		const needleAngle = clamp(
			map((level - 1) / 6, 0, 1, angleFirstTick, angleLastTick),
			angleStart,
			angleEnd,
		)
		ctx.lineWidth = 4
		circleLine(ctx, circleBounds.cx, circleBounds.cy, needleAngle, 0, circleBounds.r + 10)
	} else if (sharedState.meterKind === 'vu') {
		ctx.fillStyle = '#ffe6a6' // From the standard Munsell color: 2.93Y 9.18/4.61
		ctx.fillRect(0, 0, width, height)

		const circleBounds = {
			cx: width / 2,
			cy: height + 110,
			r: (width + 100) / 2,
		}
		const angleMargin = 0.3
		const angleStart = (1 + angleMargin) * Math.PI
		const angleEnd = (2 - angleMargin) * Math.PI
		const angleFirstTick = angleStart - 0.02 * Math.PI
		const angleZero = map(Math.SQRT1_2, 0, 1, angleFirstTick, angleEnd)

		const calibration = 0.06366196 // Calibrated with a 997 Hz sine wave at -20 dBFS

		ctx.strokeStyle = '#000000'
		ctx.lineWidth = 1.5
		ctx.beginPath()
		ctx.ellipse(
			circleBounds.cx,
			circleBounds.cy,
			circleBounds.r,
			circleBounds.r,
			0,
			angleStart,
			angleZero,
		)
		ctx.stroke()

		ctx.strokeStyle = '#ff0000'
		ctx.lineWidth = 8
		ctx.beginPath()
		ctx.ellipse(
			circleBounds.cx,
			circleBounds.cy,
			circleBounds.r + 3.5,
			circleBounds.r + 3.5,
			0,
			angleZero,
			angleEnd,
		)
		ctx.stroke()

		ctx.lineWidth = 1.5
		ctx.font = '18px "IBM Plex Sans", sans-serif'
		for (const vu of [ -20, -10, -7, -5, -3, -2, -1, 0, 1, 2, 3 ]) {
			const angle = map(linearFromDb(vu) * Math.SQRT1_2, 0, 1, angleFirstTick, angleEnd)
			const tickSize = 20

			const color = vu >= 0 ? '#ff0000' : '#000000'
			ctx.fillStyle = color
			ctx.strokeStyle = color

			circleLine(
				ctx,
				circleBounds.cx,
				circleBounds.cy,
				angle,
				circleBounds.r,
				tickSize,
			)
			
			circleLabel(
				ctx,
				circleBounds.cx,
				circleBounds.cy,
				angle,
				circleBounds.r + tickSize + 1,
				`${Math.abs(vu)}`,
			)
		}

		for (const vu of [ -6, -4 ]) {
			const angle = map(linearFromDb(vu) * Math.SQRT1_2, 0, 1, angleFirstTick, angleEnd)
			const tickSize = 15

			const color = vu >= 0 ? '#ff0000' : '#000000'
			ctx.fillStyle = color
			ctx.strokeStyle = color

			circleLine(
				ctx,
				circleBounds.cx,
				circleBounds.cy,
				angle,
				circleBounds.r,
				tickSize,
			)
		}

		ctx.fillStyle = '#000000'
		ctx.font = '12px "IBM Plex Sans", sans-serif'
		for (const percent of [ 0, 20, 30, 40, 50, 60, 70, 80, 90, 100 ]) {
			const hasLabel = [ 0, 20, 40, 60, 80, 100 ].includes(percent)
			const angle = clamp(map(percent / 100, 0, 1, angleFirstTick, angleZero), angleStart, angleZero)

			circleDot(
				ctx,
				circleBounds.cx,
				circleBounds.cy,
				angle,
				circleBounds.r - 10,
				5,
			)

			if (hasLabel) {
				circleLabel(
					ctx,
					circleBounds.cx + (percent === 100 ? 5 : 0),
					circleBounds.cy,
					angle,
					circleBounds.r - 30,
					percent === 100 ? '100%' : `${percent}`,
				)
			}
		}

		const plusMinusMargin = 20
		const plusMinusY = 20
		ctx.font = '24px "IBM Plex Sans", sans-serif'
		ctx.textBaseline = 'top'
		ctx.fillStyle = '#000000'
		ctx.textAlign = 'left'
		ctx.fillText('−', plusMinusMargin, plusMinusY)
		ctx.fillStyle = '#ff0000'
		ctx.textAlign = 'right'
		ctx.fillText('+', width - plusMinusMargin, plusMinusY)

		ctx.textAlign = 'center'
		ctx.textBaseline = 'bottom'
		ctx.fillStyle = '#000000'
		ctx.font = '30px "IBM Plex Sans", sans-serif'
		ctx.fillText('VU', width / 2, height - 50)
		ctx.font = '12px "IBM Plex Sans", sans-serif'
		ctx.fillText('POWER LEVEL', width / 2, height - 35)

		const needleAngle = clamp(
			map(
				sharedState.peak / calibration * Math.SQRT1_2,
				0,
				1,
				angleFirstTick,
				angleEnd,
			),
			angleStart,
			angleEnd,
		)
		ctx.lineWidth = 2
		ctx.strokeStyle = '#000000'
		circleLine(ctx, circleBounds.cx, circleBounds.cy, needleAngle, 0, circleBounds.r + 10)
	} else if (sharedState.meterKind === 'lufs' || sharedState.meterKind === 'ebu_mode') {
		ctx.fillStyle = '#222222'
		ctx.fillRect(0, 0, width, height)

		const offsetLufs = sharedState.meterKind === 'ebu_mode' ? 23 : 0
		const calcLufs = (power: number) => dbFromLinear(power) - 0.691

		const formatLufs = (lufs: number, decimals: number = 0) => lufs + offsetLufs > 0
			? `+${(lufs + offsetLufs).toFixed(decimals)}`
			: `${(lufs + offsetLufs).toFixed(decimals)}`

		const margin = 7.5
		const boxHeight = 60
		const boxWidth = 130
		function drawLufsBox(value: number, label: string, y: number, color: string = '#dddddd') {
			const bounds = {
				x: margin,
				y,
				width: boxWidth,
				height: boxHeight,
			}

			ctx.fillStyle = '#333333'
			ctx.fillRect(bounds.x, bounds.y, bounds.width, bounds.height)
			
			const baselineY = bounds.y + 26

			if (value >= linearFromDb(-70)) {
				const gapX = bounds.x + bounds.width - 52
				const gapSize = 6
				ctx.font = '16px "IBM Plex Sans", sans-serif'
				ctx.fillStyle = color
				ctx.textAlign = 'left'
				ctx.textBaseline = 'alphabetic'
				ctx.fillText(
					sharedState.meterKind === 'ebu_mode' ? 'LU' : 'LUFS',
					gapX + gapSize / 2,
					baselineY - 1,
				)
				ctx.font = 'bold 23px "IBM Plex Sans", sans-serif'
				ctx.textAlign = 'right'
				ctx.fillText(formatLufs(calcLufs(value), 1), gapX - gapSize / 2, baselineY)
			} else {
				ctx.font = 'bold 23px "IBM Plex Sans", sans-serif'
				ctx.fillStyle = '#dddddd'
				ctx.textAlign = 'center'
				ctx.textBaseline = 'alphabetic'
				ctx.fillText('−', bounds.x + bounds.width / 2, baselineY)
			}

			ctx.font = '14px "IBM Plex Sans", sans-serif'
			ctx.textBaseline = 'top'
			ctx.textAlign = 'center'
			ctx.fillStyle = '#aaaaaa'
			ctx.fillText(label.toUpperCase(), bounds.x + bounds.width / 2, baselineY + 13)
		}

		drawLufsBox(
			sharedState.lufs.shortTerm,
			'Short-Term',
			margin,
			sharedState.meterKind === 'ebu_mode' ? '#69db7c' : '#74c0fc',
		)
		drawLufsBox(
			sharedState.lufs.momentary,
			'Momentary',
			margin + boxHeight + margin,
		)

		ctx.lineWidth = 2
		const chartBounds = {
			x: margin + boxWidth + margin,
			y: margin + 5,
			width: width - margin - (margin + boxWidth + margin) - 20,
			height: height - margin * 2 - 2,
		}

		const momentaryPath = new Path2D()
		const shortTermPath = new Path2D()
		const chartMin = -63
		const chartMax = sharedState.meterKind === 'ebu_mode' ? -3 : 0
		const step = sharedState.meterKind === 'ebu_mode' ? 10 : 9
		
		const chartLineWidth = 2
		const pointY = (lufs: number) => map(
			clamp(lufs, chartMin, chartMax),
			chartMin,
			chartMax,
			chartBounds.y + chartBounds.height - chartLineWidth / 2,
			chartBounds.y + chartLineWidth / 2,
		)

		// Draw the chart lines
		ctx.lineWidth = 1
		ctx.strokeStyle = '#444444'
		ctx.font = '12px "IBM Plex Sans", sans-serif'
		ctx.textBaseline = 'middle'
		ctx.textAlign = 'right'
		const dbs = [ -23 ]
		for (let i = chartMax; i > chartMin; i -= step) dbs.push(i)
		for (const db of dbs) {
			const y = pointY(db)

			ctx.beginPath()
			ctx.moveTo(chartBounds.x, y)
			ctx.lineTo(chartBounds.x + chartBounds.width, y)
			ctx.stroke()

			ctx.fillStyle = db === -23 ? '#ffd43b' : '#aaaaaa'
			ctx.fillText(`${formatLufs(db)}`, width - 5, y)
		}

		// Draw the chart
		const pointXy = (i: number, value: number) => [
			map(i, 0, LUFS_CHART_LENGTH - 1, chartBounds.x + chartBounds.width, chartBounds.x),
			pointY(calcLufs(value)),
		] as const

		for (let i = 0; i < sharedState.lufs.chart.length && i < LUFS_CHART_LENGTH; i++) {
			const datum = sharedState.lufs.chart[sharedState.lufs.chart.length - 1 - i]

			if (i === 0) {
				momentaryPath.moveTo(...pointXy(i, datum.momentary))
				shortTermPath.moveTo(...pointXy(i, datum.shortTerm))
			} else {
				momentaryPath.lineTo(...pointXy(i, datum.momentary))
				shortTermPath.lineTo(...pointXy(i, datum.shortTerm))
			}
		}

		ctx.lineWidth = 1
		ctx.strokeStyle = '#666666'
		ctx.stroke(momentaryPath)
		ctx.lineWidth = chartLineWidth
		ctx.strokeStyle = sharedState.meterKind === 'ebu_mode' ? '#51cf66' : '#4dabf7'
		ctx.stroke(shortTermPath)
	}


	if ((sharedState.meterKind === 'ebu_ppm' || sharedState.meterKind === 'uk_ppm' || sharedState.meterKind === 'vu') && patternSource) {
		const pattern = ctx.createPattern(patternSource, 'repeat')
		if (pattern) {
			ctx.fillStyle = pattern
			ctx.globalAlpha = sharedState.meterKind === 'vu' ? 1 : 0.2
			ctx.fillRect(0, 0, width, height)
			ctx.globalAlpha = 1
		}
	}
	
	sharedState.isPeakRendered = true
}

export async function startMeter(ctx: AudioContext, sharedState: SharedState): Promise<Controls> {
	console.log(`Loading audio worklet from ${meterWorkletUrl}`)
	await ctx.audioWorklet.addModule(meterWorkletUrl)

	const worklet = new AudioWorkletNode(ctx, 'meter')
	worklet.port.onmessage = (event) => {
		const message = event.data as PortMessage
		
		if (message.kind === 'peak') {
			sharedState.peak = sharedState.isPeakRendered
				? message.peak
				: Math.max(sharedState.peak, message.peak)
		} else if (message.kind === 'rms') {
			sharedState.rms = message.rms
		} else if (message.kind === 'lufs') {
			sharedState.lufs.momentary = message.momentary
			sharedState.lufs.shortTerm = message.shortTerm
		} else if (message.kind === 'peak_hold') {
			sharedState.peakHoldPeak = message.peak
		}
	}
	worklet.port.postMessage(sharedState.meterKind)

	let currentSource: AudioNode | null = null
	return {
		updateMeterKind(meterKind: MeterKind) {
			if (meterKind === sharedState.meterKind) return
			worklet.port.postMessage(meterKind)
			sharedState.meterKind = meterKind
		},
		setSource(source: AudioNode) {
			ctx.resume()
			if (source === currentSource) return
			currentSource?.disconnect()
			source.connect(worklet)
			source.connect(ctx.destination)
			currentSource = source
		},
	}
}
