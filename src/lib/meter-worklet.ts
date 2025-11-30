import { dbFromLinear, linearFromDb } from './audio'

const PEAK_DECAY_RATE_DB_PER_SECOND = 50

export type PortMessage =
	| { kind: 'peak', peak: number }

class MeterProcessor extends AudioWorkletProcessor {
	lastTime = 0
	peak = 0
	
	constructor() {
		super()
	}

	process(inputs: Float32Array[][]) {
		const deltaSeconds = this.lastTime ? currentTime - this.lastTime : 0
		this.lastTime = currentTime

		let peak = 0
		for (const input of inputs) {
			const channel = input[0]
			if (!channel?.length) continue

			for (const sample of channel) {
				peak = Math.max(peak, Math.abs(sample))
			}
		}

		if (peak > this.peak) {
			this.peak = peak
		} else {
			let decayed = this.peak * linearFromDb(-PEAK_DECAY_RATE_DB_PER_SECOND * deltaSeconds)
			if (dbFromLinear(decayed) < -130) decayed = 0
			this.peak = Math.max(decayed, peak)
		}

		this.postMessage({ kind: 'peak', peak: this.peak })

		return true
	}

	postMessage(message: PortMessage) {
		this.port.postMessage(message)
	}
}

registerProcessor('meter', MeterProcessor)
