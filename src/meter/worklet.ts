import { BinnedRMS, Biquad, dbFromLinear, linearFromDb, PolyphaseUpsampler, type BiquadConfig } from './util'

const MIN_AMPLITUDE = linearFromDb(-130)
const MIN_PEAK_HOLD_AMPLITUDE = linearFromDb(-100)

const PEAK_DECAY_DB_PER_SECOND = 40
const HYBRID_RMS_DECAY_DB_PER_SECOND = 37

const PEAK_HOLD_SECONDS = 1
const PEAK_HOLD_DACAY_DB_PER_SECOND = 30

// This should technically be 10ms but 20ms does a better job illustrating
// that it's a physical needle.
const UK_PPM_ATTACK_SECONDS = 0.02
const UK_PPM_DECAY_RATE_DB_PER_SECOND = 24 / 2.8

const EBU_PPM_ATTACK_SECONDS = UK_PPM_ATTACK_SECONDS
const EBU_PPM_DECAY_RATE_DB_PER_SECOND = UK_PPM_DECAY_RATE_DB_PER_SECOND

const RMS_WINDOW_SECONDS = 0.6
const HYBRID_RMS_WINDOW_SECONDS = 0.01
const LUFS_MOMENTARY_SECONDS = 0.4
const LUFS_SHORT_TERM_SECONDS = 2

export type PortMessage =
	| { kind: 'peak', peak: number }
	| { kind: 'peak_hold', peak: number }
	| { kind: 'rms', rms: number }
	| { kind: 'lufs', momentary: number, shortTerm: number }

export type MeterKind = 'peak' | 'true_peak' | 'uk_ppm' | 'ebu_ppm' | 'vu' | 'rms' | 'lufs' | 'ebu_mode' | 'hybrid' | 'k'

function oversampleFactor() {
	return sampleRate >= 96000 ? 2 : 4
}

// Now, you might be wondering where the frequency/Q values for these filters came
// from. You probably aren't, but BOY DID I SPENT 7 STRAIGHT HOURS DOING BASIC
// ALGEBRA AND RIPPING MY HAIR OUT for these! See, it turns out ITU-R BS.1770
// basically just says "here is what the graphs of your filters should look like"
// and it does provide some coefficients but they aren't sample-rate independent.
// Does it provide the actual filter parameters? Of course not! So I had to figure
// out how to reverse-engineer the original filter parameters from the provided
// coefficients.
//
// My process for doing so is documented in the ./filter-reversing/ folder including
// the final script. The algebra.pdf file documents all the math I did and is an
// export of https://corca.app/doc/mZA0kP_S4V9etSu4N_jnH which you can also look at.
//
// Now, it turns out the parameters are really simple — 1500/0.7 and 38/0.5 — but
// BY GOD, I DID THE MATH, SO I WILL USE AT LEAST 4 DECIMAL POINTS OF PRECISION!
const stage1Config: BiquadConfig = {
	kind: 'high_shelf',
	sampleRate,
	gainDb: 4,
	frequency: 1500.305,
	q: 0.7071,
}
const stage2Config: BiquadConfig = {
	kind: 'high_pass',
	sampleRate,
	frequency: 38.135,
	q: 0.5003,
}

class MeterProcessor extends AudioWorkletProcessor {
	lastTime = currentTime
	peak = 0
	rms = 0
	peakHold = {
		peak: 0,
		timeSeconds: 0,
	}
	meter: MeterKind = 'peak'
	skipInterpolation = true
	unweightedRms = new BinnedRMS(sampleRate, RMS_WINDOW_SECONDS, 100)
	upsampler = new PolyphaseUpsampler(oversampleFactor())
	// Filter values for VU ballistics simulation provided by Greg Berchin in a random
	// forum thread (see https://archive.is/gyqkh).
	vuFilter = new Biquad({
		kind: 'low_pass',
		sampleRate,
		frequency: 2.224,
		q: 0.6053,
	})

	// State for LUFS measurement.
	stage1Left = new Biquad(stage1Config)
	stage2Left = new Biquad(stage2Config)
	stage1Right = new Biquad(stage1Config)
	stage2Right = new Biquad(stage2Config)
	kRms = new BinnedRMS(sampleRate, LUFS_SHORT_TERM_SECONDS, 120)
	
	constructor() {
		super()

		this.port.onmessage = (event) => {
			if (event.data !== this.meter) {
				this.meter = event.data
				this.skipInterpolation = true
			}
		}
	}

	process(inputs: Float32Array[][]) {
		const deltaSeconds = currentTime - this.lastTime
		this.lastTime = currentTime
		this.vuFilter.setSampleRate(sampleRate)
		this.upsampler.setOversampleFactor(oversampleFactor())
		this.unweightedRms.setSampleRate(sampleRate)
		this.kRms.setSampleRate(sampleRate)

		const isHybridMeter = this.meter === 'hybrid' || this.meter === 'k'

		let peak = 0
		for (const input of inputs.slice(0, 1)) {
			const left = input[0]
			const right = input[1] ?? left
			if (!left?.length) continue

			for (let i = 0; i < left.length; i++) {
				const leftSample = left[i]
				const rightSample = right[i]
				const averageSample = (leftSample + rightSample) / 2
				
				// Always update the stateful processors.
				const interSamplePeak = this.interSamplePeak(averageSample)
				this.vuFilter.process(Math.abs(averageSample))
				this.unweightedRms.update([averageSample])
				this.kRms.update([
					this.stage2Left.process(this.stage1Left.process(leftSample)),
					this.stage2Right.process(this.stage1Right.process(rightSample)),
				])

				const usedSample = this.meter === 'peak' || isHybridMeter
					? Math.abs(averageSample) // Regular peak meter and hybrid meter don't use true peak.
					: interSamplePeak
				
				peak = Math.max(peak, usedSample)
			}
		}
		
		const isBasicPeakMeter = this.meter === 'peak' || this.meter === 'true_peak' || isHybridMeter
		if (this.meter === 'vu') {
			this.peak = this.vuFilter.value()
		} else if (this.skipInterpolation && isBasicPeakMeter) {
			this.peak = peak
		} else {
			if (peak > this.peak) {
				if (isBasicPeakMeter) {
					this.peak = peak
				} else {
					const attackSeconds = this.meter === 'ebu_ppm'
						? EBU_PPM_ATTACK_SECONDS
						: UK_PPM_ATTACK_SECONDS
					this.peak += (peak - this.peak) * (deltaSeconds / attackSeconds)
				}
			} else {
				const decayRate = this.meter === 'ebu_ppm'
					? EBU_PPM_DECAY_RATE_DB_PER_SECOND
					: this.meter === 'uk_ppm'
						? UK_PPM_DECAY_RATE_DB_PER_SECOND
						: PEAK_DECAY_DB_PER_SECOND
				const releaseCoeff = linearFromDb(-decayRate * deltaSeconds)
				this.peak = peak + (this.peak - peak) * releaseCoeff
				if (this.peak < MIN_AMPLITUDE) this.peak = 0
			}
		}

		const prevPeakHoldPeak = this.peakHold.peak
		if (this.peak >= this.peakHold.peak) {
			this.peakHold.peak = this.peak
			this.peakHold.timeSeconds = currentTime
		} else if (currentTime - this.peakHold.timeSeconds > PEAK_HOLD_SECONDS) {
			const releaseCoeff = linearFromDb(-PEAK_HOLD_DACAY_DB_PER_SECOND * deltaSeconds)
			this.peakHold.peak = this.peak + (this.peakHold.peak - this.peak) * releaseCoeff
			if (this.peakHold.peak < MIN_PEAK_HOLD_AMPLITUDE) this.peakHold.peak = 0
		}

		const isRmsMeter = this.meter === 'rms' || isHybridMeter
		if (isRmsMeter) {
			const window = isHybridMeter ? HYBRID_RMS_WINDOW_SECONDS : RMS_WINDOW_SECONDS
			const calculatedRms = this.unweightedRms.calculate(window) * linearFromDb(3)

			if (!isHybridMeter || this.skipInterpolation || calculatedRms > this.rms) {
				this.rms = calculatedRms
			} else {
				const releaseCoeff = linearFromDb(-HYBRID_RMS_DECAY_DB_PER_SECOND * deltaSeconds)
				this.rms = calculatedRms + (this.rms - calculatedRms) * releaseCoeff
				if (this.peak < MIN_AMPLITUDE) this.rms = 0
			}

			this.postMessage({
				kind: 'rms',
				rms: this.rms,
			})
		}

		if (isHybridMeter && prevPeakHoldPeak !== this.peakHold.peak) {
			this.postMessage({
				kind: 'peak_hold',
				peak: this.peakHold.peak,
			})
		}

		if (this.meter === 'lufs' || this.meter === 'ebu_mode') {
			this.postMessage({
				kind: 'lufs',
				momentary: this.kRms.calculate(LUFS_MOMENTARY_SECONDS),
				shortTerm: this.kRms.calculate(LUFS_SHORT_TERM_SECONDS),
			})
		} else if (this.meter !== 'rms') {
			this.postMessage({
				kind: 'peak',
				peak: this.peak,
			})
		}

		this.skipInterpolation = false
		return true
	}

	interSamplePeak(sample: number) {
		return this.upsampler.process(sample).reduce((acc, x) => Math.max(acc, Math.abs(x)), 0)
	}

	postMessage(message: PortMessage) {
		this.port.postMessage(message)
	}
}

registerProcessor('meter', MeterProcessor)
