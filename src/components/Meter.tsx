import { useEffect, useRef, useState, type ReactNode } from 'react'
import type { MeterKind } from '../meter/worklet'
import { createSquareWave, useMediaSession } from '../meter/util'
import { linearFromDb } from '../meter/dsp'
import { height, render, startMeter, width, type Controls, type SharedState } from '../meter/display'
import styles from './Meter.module.css'
import { IoPauseSharp, IoPlaySharp } from 'react-icons/io5'
import drumsUrl from '../meter/drums.wav'
import musicUrl from '../meter/music.mp3'

type AudioClip = 'sine' | 'square' | 'drums' | 'music'

const audioClipNames: Record<AudioClip, string> = {
	music: 'Music',
	drums: 'Drums',
	sine: 'Sine',
	square: 'Square',
}

interface MeterInfo {
	name: string
	description: ReactNode
}

const meterInfoMap: Record<MeterKind, MeterInfo> = {
	vu: {
		name: 'VU Meter',
		description: <>
			<p>
				<a href='https://en.wikipedia.org/wiki/VU_meter' target='_blank'>VU meters</a> are analog devices that electromechanically display audio levels smoothed over an approximate 300ms period. A reading of 0 on the VU meter (0 VU) is typically calibrated to +4 dBu.
			</p>
			<p>
				Digital simulations of VU meters need to be similarly calibrated such that 0 VU corresponds to some reference level in dBFS RMS.
			</p>
			<p>
				When calibrating a digital VU meter, the <em>AES17 standard</em> for RMS is typically used. AES17 RMS adds a +3 dB offset to the RMS, so a full-scale sine wave registers as 0 VU and a square wave registers as roughly 3 VU. You can see this in action by comparing different sounds in the simulation above.
			</p>
		</>
	},
	uk_ppm: {
		name: 'UK PPM',
		description: <>
			<p>
				The British <a href='https://en.wikipedia.org/wiki/Peak_programme_meter' target='_blank'>peak programme meter</a> was another analog meter that displays the true peak level of audio on a scale from 1–7, with ticks spaced by 4 dB (except for 1 and 2, which are spaced by 6 dB). They are often calibrated such that 4 represents the alignment level and 6 is the maximum permitted broadcast level.
			</p>
			<p>
				Peak programme meters didn't catch on in the United States because VU meters were already prevalent and cheaper to manufacture.
			</p>
		</>
	},
	ebu_ppm: {
		name: 'EBU PPM',
		description: (
			<p>
				European Broadcasting Union (EBU) PPMs are essentially the same as UK PPMs. The only difference is in the display: instead of unitless tick marks, readings are in decibels relative to the alignment level, which is marked as &ldquo;TEST&rdquo; in the center of the meter.
			</p>
		)
	},
	peak: {
		name: 'Peak Meter',
		description: <>
			<p>
				Peak meters show the instantaneous peak level of the audio signal. Some peak meters have a hold feature that keeps the maximum peak visible for some time period.
			</p>
			<p>
				Most LED meters on mixing consoles are peak meters. In digital audio software, these are the easiest meter for software developers to create and typically display in dBFS.
			</p>
		</>
	},
	true_peak: {
		name: 'True Peak Meter',
		description: <>
			<p>
				Typical digital peak meters only show the maximum <em>sampled</em> amplitude of the <em>digital</em> signal, but the corresponding <em>analog</em> signal might actually have higher peaks. This is explained in greater depth later in this article.
			</p>
			<p>
				Some digital peak meters will oversample the signal to show these inter-sample peaks; these are called true peak meters. Often, digital peak meters will not identify themselves as true peak meters despite oversampling.
			</p>
			<p>
				ITU-R BS.1770, the same standard that defines LUFS, defines a standard way to calculate true-peak volume that is used in some contexts.
			</p>
			<p>
				You can test this meter by comparing the sine tone to the square tone.
			</p>
		</>
	},
	rms: {
		name: 'RMS Meter',
		description: <>
			<p>
				These meters show the root mean square (RMS) level over some time period (called the <em>integration period</em>). A common integration period is 300 ms, matching that of traditional VU meters. The meter above uses a 600 ms integration period.
			</p>
			<p>
				Like digital VU meters, many digital RMS meters have a +3&nbsp;dB offset as provided by AES17, such that a sine wave reads 0 dBFS RMS.
			</p>
		</>
	},
	lufs: {
		name: 'LUFS Meter',
		description: <>
			<p>
				<a href='https://en.wikipedia.org/wiki/LUFS' target='_blank'>LUFS</a> is a unit of loudness defined by ITU-R BS.1770.
			</p>
			<p>
				LUFS meters often show measurements across multiple time intervals, specified by the EBU R 128 standard: <em>integrated</em>, taken over the whole song, <em>short-term</em>, taken over 3 seconds, and <em>momentary</em>, taken over 400 ms. The integrated measurement is <em>gated</em>, excluding quiet portions of the song. Some meters show <em>loudness range</em> (LRA), which is a measure of the dynamic range of your mix.
			</p>
			<p>
				While some LUFS meters have a +3dB offset because they use AES17 RMS in their calculations, this is technically incorrect and doesn't conform to the standard.
			</p>
		</>
	},
	ebu_mode: {
		name: 'EBU Mode Meter',
		description: <>
			<p>
				&ldquo;EBU mode&rdquo; meters display loudness with the same features as a normal LUFS meter, but instead of absolute LUFS, they use relative &ldquo;LU&rdquo; units where 0 LU = −23 LUFS.
			</p>
			<p>
				This is specified in the EBU R 128 standard, which recommends −23 LUFS as a target loudness for mastering television and radio programs.
			</p>
		</>
	},
	hybrid: {
		name: 'Hybrid Meter',
		description: (
			<p>
				Many DAWs and mixers combine multiple meter types into one hybrid meter. A common combination, demonstrated in the meter above, is RMS, instantaneous peak, and peak hold.
			</p>
		)
	},
	k: {
		name: 'K-Meter',
		description: <>
			<p>
				Some tools, including <a href='https://en.wikipedia.org/wiki/Bitwig_Studio'>Bitwig</a>, include meters based on Bob Katz's K-system of loudness metering: K-20, K-14, and K-12 meters. A K-20 meter is shown above.
			</p>
			<p>
				The original K-meter was a VU meter where 0 VU is calibrated to the K-system offset. For example, on a K-20 meter, 0 VU would correspond to −20 dBFS and −10 VU to −30 dBFS. Even if you aren't using the 85 dBC calibrated K-system for your speakers, it can be useful to use a K-20 meter if you're mixing around a −20 dBFS alignment level.
			</p>
			<p>
				Often, these are actually AES17 RMS meters instead of VU meters. It is easier to program a tool that calculates an RMS level than one that simulates the physical properties of a VU meter. This was reflected in Katz's later publications.
			</p>
		</>
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
	const [ meterKind, setMeterKind ] = useState<MeterKind>('vu')
	const [ audioClip, setAudioClip ] = useState<AudioClip>('music')
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

		const renderCtx = canvasRef.current.getContext('2d')!
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
			
			if (isClipPlaying) loaded.ensurePlaying?.()
			loaded.toggle.gain.cancelScheduledValues(currentTime)
			loaded.toggle.gain.setValueAtTime(loaded.toggle.gain.value, currentTime)
			loaded.toggle.gain.linearRampToValueAtTime(target, rampTime)
		}
	}, [isPlaying, audioClip])

	const meterInfo = meterInfoMap[meterKind]
	const isPhotoreal = meterKind === 'ebu_ppm' || meterKind === 'uk_ppm' || meterKind === 'vu'

	return (
		<div className={styles.container}>
			<div className={styles.navigation}>
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
