import { useEffect, useRef, useState, type ReactNode } from 'react'
import type { MeterKind, PortMessage } from '../meter/worklet'
import { circleLabel, circleLine, clamp, createSquareWave, dbFromLinear, linearFromDb, map, useMediaSession } from '../meter/util'
import { height, render, startMeter, width, type Controls, type SharedState } from '../meter/display'
import styles from './Meter.module.css'
import { IoPauseSharp, IoPlaySharp } from 'react-icons/io5'
import drumsUrl from '../meter/drums.wav'
import musicUrl from '../meter/music.mp3'

type AudioClip = 'sine' | 'square' | 'drums' | 'music'

const audioClipNames: Record<AudioClip, string> = {
	sine: 'Sine',
	square: 'Square',
	drums: 'Drums',
	music: 'Music',
}

interface MeterInfo {
	name: string
	description: ReactNode
}

const meterInfoMap: Record<MeterKind, MeterInfo> = {
	peak: {
		name: 'Peak Meter',
		description: (
			<p>
				Shows the instantaneous peak level. In the digital world, these are the easiest meter to implement and typically display relative to 0 dBFS. Some peak meters have a hold feature or hold display that keep the maximum peak visible for some delay.
			</p>
		)
	},
	true_peak: {
		name: 'True Peak Meter',
		description: <>
			<p>
				Some digital peak meters will oversample to show inter-sample peaks. Sometimes these are labeled as true peak meters, but oftentimes they aren't.
			</p>
			<p>
				The same standard that specifies LUFS, ITU-R BS.1770, also defines a standard way to calculate true-peak volume.
			</p>
		</>
	},
	uk_ppm: {
		name: 'UK PPM',
		description: (
			<p>
				The British style of analog peak program meter displays the true peak level of audio using a scale from 1-7, where 4 is the alignment level, 6 is the permitted maximum level, and the ticks are spaced by 4 dB. These didn't catch on in the United States because VU meters were cheaper.
			</p>
		)
	},
	ebu_ppm: {
		name: 'EBU PPM',
		description: (
			<p>
				European PPMs are essentially the same as British PPMs, except instead of unitless tick marks they display dB relative to the alignment level, which is marked &ldquo;TEST&rdquo; in the center of the meter.
			</p>
		)
	},
	vu: {
		name: 'VU Meter',
		description: (
			<p>
				Originally an analog device that electromechanically displays audio levels smoothed over 300ms, where 0 VU was calibrated to +4 dBu. Has digital replicas that must be calibrated to some reference value in dBFS RMS, which is usually AES17 RMS.
			</p>
		)
	},
	rms: {
		name: 'RMS Meter',
		description: (
			<p>
				Shows the RMS level over some integration period, often 300 ms due to historical context from VU meters. Many digital RMS meters have a +3 dB offset as provided by AES17 so full-scale sine waves register as 0 dBFS RMS. Common values are 300, 600.
			</p>
		)
	},
	lufs: {
		name: 'LUFS Meter',
		description: <>
			<p>
				A display of LUFS as defined by ITU-R BS.1770. Some LUFS meters use RMS + 3 dB as a basis, but this is incorrect.
			</p>
			<p>
				Measurements are often available in multiple time intervals: integrated, taken over the whole song, short-term, taken over 3 seconds, and momentary, taken over 400 ms. The integrated measurement is designed to be gated to exclude quiet portions. Some meters show LRA, or loudness range, which is a statistical measure of the dynamic range of your mix. These features are specified by EBU R 128.
			</p>
		</>
	},
	ebu_mode: {
		name: 'EBU Mode Meter',
		description: (
			<p>
				EBU mode meters display loudness with the features described in the previous meter, but instead of absolute LUFS, they use relative units where 0 LU = -23 LUFS.
			</p>
		)
	},
	hybrid: {
		name: 'Hybrid Meter',
		description: (
			<p>
				Many DAWs and mixers will combine multiple meter types. A common combination is RMS, instantaneous peak, and peak hold.
			</p>
		)
	},
	k: {
		name: 'K-Meter',
		description: (
			<p>
				Some metering systems support a K-20, K-14, and/or K-12 display. These are VU meters where 0 VU is set to the K-system offset; for example, a K-20 meter would go from 0 VU (-20 dBFS) to +20 VU (0 dBFS). Even if you aren't using the 85 dBC calibrated K-system, it can be useful to use a K-20 meter if you're mixing around a -20 dBFS alignment level.
			</p>
		)
	},
}

interface LoadedAudio {
	toggle: GainNode
	ensurePlaying?: () => void
}

function loadAudio(ctx: AudioContext, setIsPlaying: (isPlaying: boolean) => void): Record<AudioClip, LoadedAudio> {
	const wrapToggle = (node: AudioNode) => {
		const toggle = ctx.createGain()
		toggle.gain.value = 0
		node.connect(toggle)
		return toggle
	}

	const sineOscillator = ctx.createOscillator()
	sineOscillator.type = 'sine'
	sineOscillator.frequency.value = 220
	sineOscillator.start()
	const sineGain = ctx.createGain()
	sineGain.gain.value = linearFromDb(-20)
	sineOscillator.connect(sineGain)

	const squareWave = createSquareWave(ctx, 220)
	squareWave.start()
	const squareGain = ctx.createGain()
	squareGain.gain.value = linearFromDb(-20)
	squareWave.connect(squareGain)

	const drumsAudio = new Audio(drumsUrl)
	drumsAudio.loop = true
	drumsAudio.load()
	drumsAudio.addEventListener('play', () => setIsPlaying(true))
	drumsAudio.addEventListener('pause', () => setIsPlaying(false))
	const drumsSource = ctx.createMediaElementSource(drumsAudio)
	const drumsGain = ctx.createGain()
	drumsGain.gain.value = linearFromDb(-5)
	drumsSource.connect(drumsGain)

	const musicAudio = new Audio(musicUrl)
	musicAudio.loop = true
	musicAudio.load()
	musicAudio.addEventListener('play', () => setIsPlaying(true))
	musicAudio.addEventListener('pause', () => setIsPlaying(false))
	const musicSource = ctx.createMediaElementSource(musicAudio)

	return {
		sine: {
			toggle: wrapToggle(sineGain),
			ensurePlaying: () => ctx.resume(),
		},
		square: {
			toggle: wrapToggle(squareGain),
			ensurePlaying: () => ctx.resume(),
		},
		drums: {
			toggle: wrapToggle(drumsGain),
			ensurePlaying: () => {
				ctx.resume()
				drumsAudio.play()
			},
		},
		music: {
			toggle: wrapToggle(musicSource),
			ensurePlaying: () => {
				ctx.resume()
				musicAudio.play()
			},
		},
	}
}

export default function Meter() {
	const canvasRef = useRef<HTMLCanvasElement>(null)
	const [ meterKind, setMeterKind ] = useState<MeterKind>('lufs')
	const [ audioClip, setAudioClip ] = useState<AudioClip>('sine')
	const controlsRef = useRef<Controls | null>(null)
	const sharedStateRef = useRef<SharedState>({
		peak: 0,
		peakHoldPeak: 0,
		rms: 0,
		lufs: {
			momentary: 0,
			shortTerm: 0,
			chart: [],
			lastChartUpdateTimeMs: 0,
		},
		isPeakRendered: false,
		meterKind,
	})
	const audioTogglesRef = useRef<Record<AudioClip, LoadedAudio> | null>(null)
	const [ isPlaying, setIsPlaying ] = useState(false)

	useMediaSession({
		title: audioClipNames[audioClip],
		isPlaying,
		setIsPlaying,
	})

	useEffect(() => {
		if (!canvasRef.current) return

		const renderCtx = canvasRef.current.getContext('2d')
		const audioCtx = new AudioContext()

		const sum = audioCtx.createGain()
		sum.gain.value = 1
		
		audioTogglesRef.current = loadAudio(audioCtx, setIsPlaying)
		for (const toggle of Object.values(audioTogglesRef.current)) {
			toggle.toggle.connect(sum)
		}

		startMeter(audioCtx, sharedStateRef.current)
			.then((controls) => {
				controlsRef.current = controls
				controls.setSource(sum)
			})
			.catch(console.error)

		let isCanceled = false
		function triggerRender() {
			render(renderCtx, sharedStateRef.current)
			if (!isCanceled) requestAnimationFrame(triggerRender)
		}
		triggerRender()

		return () => {
			isCanceled = true
			audioCtx.close()
		}
	}, [])

	controlsRef.current?.updateMeterKind(meterKind)

	useEffect(() => {
		for (const [ clip, loaded ] of Object.entries(audioTogglesRef.current ?? {})) {
			const isClipPlaying = clip === audioClip && isPlaying

			const target = isClipPlaying ? 1 : 0
			const currentTime = loaded.toggle.context.currentTime
			const rampTime = currentTime + 0.01
			
			if (isClipPlaying) loaded.ensurePlaying()
			loaded.toggle.gain.cancelScheduledValues(currentTime)
			loaded.toggle.gain.setValueAtTime(loaded.toggle.gain.value, currentTime)
			loaded.toggle.gain.linearRampToValueAtTime(target, rampTime)
		}
	}, [isPlaying, audioClip])

	const meterInfo = meterInfoMap[meterKind]
	const isPhotoreal = meterKind === 'ebu_ppm' || meterKind === 'uk_ppm' || meterKind === 'vu'

	return (
		<div className={styles.container}>
			<div className={styles.controls}>
				<div className={styles.tabs}>
					{Object.entries(meterInfoMap).map(([ kind, info ]) => (
						<button
							key={kind}
							className={`${styles.tab} ${meterKind === kind ? styles.isActive : ''}`}
							onClick={() => setMeterKind(kind as MeterKind)}
						>
							{info.name}
						</button>
					))}
				</div>

				<div className={styles.metadata}>
					<h3>{meterInfo.name}</h3>

					{meterInfo.description}
				</div>
			</div>

			<div className={styles.playback}>
				<div className={styles.controls}>
					<h3>Playback Controls</h3>

					<div className={styles.buttons}>
						<button
							className={`${styles.play} ${isPlaying ? styles.isActive : ''}`}
							onClick={() => setIsPlaying(!isPlaying)}
						>
							{isPlaying ? <IoPauseSharp /> : <IoPlaySharp />}
						</button>

						<div className={styles.options}>
							{Object.entries(audioClipNames).map(([ clip, name ]) => (
								<button
									key={clip}
									className={`${styles.option} ${audioClip === clip ? styles.isActive : ''}`}
									onClick={() => setAudioClip(clip as AudioClip)}
								>
									{name}
								</button>
							))}
						</div>
					</div>
				</div>

				<div className={styles.meterContainer}>
					<canvas
						className={styles.meter}
						ref={canvasRef}
						width={width}
						height={height}
						style={{
							borderRadius: isPhotoreal ? 8 : 0,
						}}
					/>

					<div
						className={styles.meterOverlay}
						style={{
							borderRadius: isPhotoreal ? 8 : 0,
							boxShadow: isPhotoreal
								? 'inset 15px 32px 18px rgba(0, 0, 0, 0.33)'
								: 'none',
							backgroundImage: isPhotoreal
								? 'linear-gradient(140deg, rgba(0, 0, 0, 0.1), rgba(255, 255, 255, 0.1))'
								: 'linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0))',
						}}
					/>
				</div>
			</div>
		</div>
	)
}
