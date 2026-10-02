import { useEffect, useRef, useState } from 'react'
import silenceUrl from './silence.mp3'

export function clamp(value: number, min: number, max: number): number {
	return Math.min(Math.max(value, min), max)
}

export function map(value: number, inMin: number, inMax: number, outMin: number, outMax: number): number {
	return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin
}

export function circleLine(
	ctx: CanvasRenderingContext2D,
	cx: number,
	cy: number,
	angle: number,
	r: number,
	length: number,
) {
	ctx.beginPath()
	ctx.moveTo(
		cx + r * Math.cos(angle),
		cy + r * Math.sin(angle),
	)
	ctx.lineTo(
		cx + (r + length) * Math.cos(angle),
		cy + (r + length) * Math.sin(angle),
	)
	ctx.stroke()
}

export function circleDot(
	ctx: CanvasRenderingContext2D,
	cx: number,
	cy: number,
	angle: number,
	r: number,
	size: number,
) {
	ctx.beginPath()
	ctx.ellipse(
		cx + r * Math.cos(angle),
		cy + r * Math.sin(angle),
		size / 2,
		size / 2,
		0,
		0,
		2 * Math.PI,
	)
	ctx.fill()
}

export function circleLabel(
	ctx: CanvasRenderingContext2D, 
	cx: number, 
	cy: number, 
	angle: number, 
	r: number,
	text: string,
	isRotated: boolean = true,
) {
	ctx.save()
	
	const x = cx + r * Math.cos(angle)
	const y = cy + r * Math.sin(angle)
	
	ctx.translate(x, y)

	if (isRotated) ctx.rotate(angle + Math.PI / 2)
	
	ctx.textAlign = 'center'
	ctx.textBaseline = 'bottom'
	ctx.fillText(text, 0, 0)
	
	ctx.restore()
}

export function createSquareWave(ctx: AudioContext, frequency: number): AudioBufferSourceNode {
    const sampleRate = ctx.sampleRate
    const length = sampleRate
    const buffer = ctx.createBuffer(1, length, sampleRate)
    const data = buffer.getChannelData(0)

    const samplesPerCycle = sampleRate / frequency
    const samplesPerHalfCycle = samplesPerCycle / 2

    for (let i = 0; i < length; i++) {
        const positionInCycle = i % samplesPerCycle
        data[i] = positionInCycle < samplesPerHalfCycle ? 1.0 : -1.0
    }

    const source = ctx.createBufferSource()
    source.buffer = buffer
    source.loop = true
    
    return source
}

export interface UseMediaSessionOptions {
	isPlaying: boolean
	setIsPlaying: (isPlaying: boolean) => void
	title: string
}

export function useMediaSession(options: UseMediaSessionOptions) {
	const audioRef = useRef<HTMLAudioElement | null>(null)

	if (typeof window !== 'undefined' && audioRef.current === null) {
		audioRef.current = new Audio(silenceUrl)
		audioRef.current.loop = true
		audioRef.current.load()
		audioRef.current.addEventListener('pause', () => options.setIsPlaying(false))
		audioRef.current.addEventListener('play', () => options.setIsPlaying(true))
	}

	useEffect(() => {
		if ('mediaSession' in navigator) {
			navigator.mediaSession.playbackState = options.isPlaying ? 'playing' : 'paused'
		}

		if (options.isPlaying) {
			audioRef.current?.play()
		} else {
			audioRef.current?.pause()
		}
	}, [ options.isPlaying ])
	
	useEffect(() => {
		if ('mediaSession' in navigator) {
			navigator.mediaSession.metadata = new MediaMetadata({
				title: options.title,
				artist: 'Kognise',
				artwork: [
					{
						src: 'https://media.kognise.dev/logos/pfp.png',
						sizes: '500x500',
						type: 'image/png',
					}
				]
			})
		}
	}, [ options.title ])

	useEffect(() => {
		if ('mediaSession' in navigator) {
			navigator.mediaSession.setActionHandler('play', () => options.setIsPlaying(true))
			navigator.mediaSession.setActionHandler('pause', () => options.setIsPlaying(false))
		}
	}, [])
}
