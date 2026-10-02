export function linearFromDb(db: number): number {
	return Math.pow(10, db / 20)
}

export function dbFromLinear(linear: number): number {
	return 20 * Math.log10(linear)
}

export type BiquadConfig =
	| {
		kind: 'low_pass' | 'high_pass'
		sampleRate: number
		frequency: number
		q: number
	}
	| {
		kind: 'high_shelf'
		gainDb: number
		sampleRate: number
		frequency: number
		q: number
	}

/**
 * An implementation of a second-order filter per
 * "Cookbook formulae for audio equalizer biquad filter coefficients"
 * (see https://archive.is/xEbHu).
 */
export class Biquad {
	private config: BiquadConfig

	// State
	private x1: number = 0
	private x2: number = 0
	private y1: number = 0
	private y2: number = 0

	// Coefficients
	private a0!: number
	private a1!: number
	private a2!: number
	private b0!: number
	private b1!: number
	private b2!: number

	constructor(config: BiquadConfig) {
		this.config = config
		this.configureCoefficients()
	}

	setSampleRate(sampleRate: number) {
		if (sampleRate !== this.config.sampleRate) {
			this.config.sampleRate = sampleRate
			this.configureCoefficients()
		}
	}

	private configureCoefficients() {
		const ω0 = 2 * Math.PI * this.config.frequency / this.config.sampleRate
		const cosω0 = Math.cos(ω0)
		const sinω0 = Math.sin(ω0)

		const α = sinω0 / (2 * this.config.q)

		if (this.config.kind === 'low_pass') {
			this.b0 = (1 - cosω0) / 2
			this.b1 = 1 - cosω0
			this.b2 = (1 - cosω0) / 2
			this.a0 = 1 + α
			this.a1 = -2 * cosω0
			this.a2 = 1 - α
		} else if (this.config.kind === 'high_pass') {
			this.b0 = (1 + cosω0) / 2
			this.b1 = -(1 + cosω0)
			this.b2 = (1 + cosω0) / 2
			this.a0 = 1 + α
			this.a1 = -2 * cosω0
			this.a2 = 1 - α
		} else if (this.config.kind === 'high_shelf') {
			const A = Math.pow(10, this.config.gainDb / 40)
			const twoSqrtAα = 2 * Math.sqrt(A) * α

			this.b0 = A * ((A + 1) + (A - 1) * cosω0 + twoSqrtAα)
			this.b1 = -2 * A * ((A - 1) + (A + 1) * cosω0)
			this.b2 = A * ((A + 1) + (A - 1) * cosω0 - twoSqrtAα)
			this.a0 = (A + 1) - (A - 1) * cosω0 + twoSqrtAα
			this.a1 = 2 * ((A - 1) - (A + 1) * cosω0)
			this.a2 = (A + 1) - (A - 1) * cosω0 - twoSqrtAα
		}
	}

	process(x: number) {
		const y = (this.b0 / this.a0) * x + (this.b1 / this.a0) * this.x1 + (this.b2 / this.a0) * this.x2
			- (this.a1 / this.a0) * this.y1 - (this.a2 / this.a0) * this.y2

		this.x2 = this.x1
		this.x1 = x
		this.y2 = this.y1
		this.y1 = y

		return y
	}

	value() {
		return this.y1
	}
}

/**
 * A polyphase oversampling FIR filter.
 *
 * Useful for calculating true peak levels as specified by ITU-R BS.1770.
 */
export class PolyphaseUpsampler {
	private order = 32
	private oversampleFactor: number // Phase count
	private coefficients!: Float32Array

	private buffer: number[] = []

	constructor(oversampleFactor: number) {
		this.oversampleFactor = oversampleFactor
		this.configure()
	}

	setOversampleFactor(oversampleFactor: number) {
		if (oversampleFactor !== this.oversampleFactor) {
			this.oversampleFactor = oversampleFactor
			this.configure()
		}
	}

	private configure() {
		const length = this.order * this.oversampleFactor
		this.coefficients = new Float32Array(length)
		this.buffer = new Array(this.order).fill(0)

		const fc = 1 / (2 * this.oversampleFactor)

		for (let n = 0; n < length; n++) {
			const x = n - (length - 1) / 2

			const sinc = x === 0
				? 2 * Math.PI * fc
				: Math.sin(2 * Math.PI * fc * x) / (Math.PI * x)

			const blackmanWindow = 0.42
				- 0.5 * Math.cos(2 * Math.PI * n / (length - 1))
				+ 0.08 * Math.cos(4 * Math.PI * n / (length - 1))

			this.coefficients[n] = blackmanWindow * sinc * this.oversampleFactor
		}
	}

	process(sample: number): Float32Array {
		this.buffer.push(sample)
		this.buffer.shift()

		const output = new Float32Array(this.oversampleFactor)

		for (let i = 0; i < this.oversampleFactor; i++) {
			let filterResult = 0

			for (let c = 0; c < this.order; c++) {
				const coefficient = this.coefficients[c * this.oversampleFactor + i]
				const value = this.buffer.at(-c - 1) ?? 0
				filterResult += coefficient * value
			}

			output[i] = filterResult
		}

		return output
	}
}

/**
 * A utility for RMS measurement that uses less memory by binning
 * multiple samples into one stored value.
 */
export class BinnedRMS {
	private buffer: number[] = []
	private currentBinValue = 0
	private currentBinSize = 0

	private binSize: number
	private sampleRate: number
	private maxWindowSeconds: number

	constructor(sampleRate: number, maxWindowSeconds: number, binSize: number = 100) {
		this.sampleRate = sampleRate
		this.binSize = binSize
		this.maxWindowSeconds = maxWindowSeconds
	}

	setSampleRate(sampleRate: number) {
		this.sampleRate = sampleRate
	}

	update(samples: number[]) {
		this.currentBinValue += samples.reduce((acc, x) => acc + x * x, 0)
		this.currentBinSize++

		if (this.currentBinSize >= this.binSize) {
			const averageSquare = this.currentBinValue / this.currentBinSize

			this.buffer.push(averageSquare)

			if (this.buffer.length > this.windowLength(this.maxWindowSeconds)) {
				this.buffer.shift()
			}

			this.currentBinValue = 0
			this.currentBinSize = 0
		}
	}

	calculate(windowSeconds: number) {
		const windowLength = this.windowLength(windowSeconds)
		const sum = this.buffer.slice(-windowLength).reduce((a, b) => a + b, 0)
		return Math.sqrt(sum / windowLength)
	}

	windowLength(windowSeconds: number) {
		return Math.ceil(windowSeconds * this.sampleRate / this.binSize)
	}
}
