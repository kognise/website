import { useEffect, useRef } from 'react'
import type { PortMessage } from '../lib/meter-worklet'
import meterWorkletUrl from '../lib/meter-worklet?url'
import { dbFromLinear, linearFromDb, sliderFromDb, sliderFromLinear } from '../lib/audio'

interface SharedState {
	peak: number,
	isPeakRendered: boolean,
}

const width = 400
const height = 200

const sliderMargin = 20
const sliderBounds = {
	x: sliderMargin,
	y: sliderMargin,
	width: width - sliderMargin * 2,
	height: 40,
}
const sliderLabels = [ 10, 5, 0, -5, -10, -20, -30, -40, -50, -70, -Infinity ]
const sliderTicks = [
	8.75, 7.5, 6.25,
	3.75, 2.5, 1.25,
	-1.25, -2.5, -3.75,
	-6.25, -7.5, -8.75,
	-12.5, -15, -17.5,
	-22.5, -25, -27.5,
	-32.5, -35, -37.5,
	-43.33, -46.67,
]

function render(ctx: CanvasRenderingContext2D, renderState: SharedState) {
	ctx.canvas.width = width * window.devicePixelRatio
	ctx.canvas.height = height * window.devicePixelRatio
	ctx.resetTransform()
	ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

	ctx.fillStyle = '#222222'
	ctx.fillRect(0, 0, width, height)

	ctx.fillStyle = '#000000'
	ctx.fillRect(sliderBounds.x, sliderBounds.y, sliderBounds.width, sliderBounds.height)

	const tickOffset = 2
	const bigTickHeight = 15
	const smallTickHeight = 10
	for (const labelDb of sliderLabels) {
		const tickWidth = 2
		const tickX = sliderBounds.x + sliderBounds.width * sliderFromDb(labelDb) - tickWidth / 2

		ctx.fillStyle = '#aaaaaa'
		ctx.fillRect(
			tickX - tickWidth / 2,
			sliderBounds.y + sliderBounds.height + tickOffset,
			tickWidth,
			bigTickHeight,
		)

		ctx.font = '12px sans-serif'
		ctx.textAlign = 'center'
		ctx.textBaseline = 'top'
		ctx.fillText(
			labelDb === -Infinity ? '∞' : labelDb <= 0 ? `${Math.abs(labelDb)}` : `+${labelDb}`,
			tickX,
			sliderBounds.y + sliderBounds.height + bigTickHeight + tickOffset + 4,
		)
	}

	for (const tickDb of sliderTicks) {
		const tickWidth = 1
		const tickX = sliderBounds.x + sliderBounds.width * sliderFromDb(tickDb) - tickWidth / 2

		ctx.fillStyle = '#aaaaaa'
		ctx.fillRect(
			tickX - tickWidth / 2,
			sliderBounds.y + sliderBounds.height + tickOffset + (bigTickHeight - smallTickHeight),
			tickWidth,
			smallTickHeight,
		)
	}

	ctx.fillStyle = 'lime'
	ctx.fillRect(
		sliderBounds.x,
		sliderBounds.y,
		sliderBounds.width * sliderFromLinear(renderState.peak),
		sliderBounds.height,
	)
	
	const label = 'dBFS: '
	const textY = height - sliderMargin
	ctx.font = '18px sans-serif'
	ctx.textBaseline = 'bottom'
	ctx.textAlign = 'left'
	ctx.fillStyle = '#aaaaaa'
	ctx.fillText(
		label,
		sliderBounds.x,
		textY,
	)
	ctx.fillStyle = '#ffffff'
	ctx.fillText(
		dbFromLinear(renderState.peak).toFixed(2),
		sliderBounds.x + ctx.measureText(label).width,
		textY,
	)
	
	renderState.isPeakRendered = true
}

async function startMeter(ctx: AudioContext, renderState: SharedState) {
	console.log(`Loading audio worklet from ${meterWorkletUrl}`)
	await ctx.audioWorklet.addModule(meterWorkletUrl)

	const worklet = new AudioWorkletNode(ctx, 'meter')
	worklet.port.onmessage = (event) => {
		const message = event.data as PortMessage
		
		if (message.kind === 'peak') {
			renderState.peak = renderState.isPeakRendered
				? message.peak
				: Math.max(renderState.peak, message.peak)
		}
	}

	const sine = new OscillatorNode(ctx, {
		type: 'sine',
		frequency: 220,
	})
	const sineGain = new GainNode(ctx, {
		gain: linearFromDb(-20),
	})
	sine.connect(sineGain)
	sineGain.connect(worklet)
	sineGain.connect(ctx.destination)
	sine.start()

	window.onclick = () => {
		if (ctx.state !== 'running') {
			ctx.resume()
			return
		}
		
		if (sineGain.gain.value === 0) {
			sineGain.gain.value = linearFromDb(-20)
		} else {
			sineGain.gain.value = 0
		}
	}
}

export default function Meter() {
	const canvasRef = useRef<HTMLCanvasElement>(null)
	const renderState = useRef<SharedState>({
		peak: 0,
		isPeakRendered: false,
	})

	useEffect(() => {
		if (!canvasRef.current) return

		const renderCtx = canvasRef.current.getContext('2d')
		const audioCtx = new AudioContext()

		startMeter(audioCtx, renderState.current).catch(console.error)

		let isCanceled = false
		function triggerRender() {
			render(renderCtx, renderState.current)
			if (!isCanceled) requestAnimationFrame(triggerRender)
		}
		triggerRender()

		return () => {
			isCanceled = true
			audioCtx.close()
		}
	}, [])

	return (
		<canvas
			ref={canvasRef}
			width={width}
			height={height}
			style={{ width, height }}
		/>
	)
}
