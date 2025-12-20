// Reversing the filter coefficients specified in ITU-R BS.1770 to
// their configuration values.
//
// See https://corca.app/doc/mZA0kP_S4V9etSu4N_jnH or ./algebra.pdf
// for where all the math came from.

const Fs = 48000

console.log('Stage 1')
{
	const G = 4
	const A = Math.pow(10, G / 40)
	const A1 = -1.69065929318241
	const A2 = 0.73248077421585

	let Q: number
	let f0: number
	{
		const ω0 = Math.acos(
			((1 + A2) * (A - 1) - A1 * (A + 1)) /
			((1 + A2) * (A + 1) - A1 * (A - 1))
		)

		// Calculate the cutoff frequency
		f0 = ω0 * Fs / (2 * Math.PI)

		// Calculate the Q
		const a0 = 2 * ((A + 1) - (A - 1) * Math.cos(ω0)) / (1 + A2)
		Q = 2 * Math.sin(ω0) * Math.sqrt(A) / (a0 * (1 - A2))
	}
	console.log('Frequency:', f0)
	console.log('Q:', Q)
	console.log('Gain:', G)

	// Here's our boundary where we can only use our calculated parameters.

	const ω0 = 2 * Math.PI * f0 / Fs

	const cosω0 = Math.cos(ω0)
	const sinω0 = Math.sin(ω0)

	// Calculate α
	const α = sinω0 / (2 * Q)
	const twoSqrtAα = 2 * Math.sqrt(A) * α

	// And now start spitting out coefficients
	const a0 = (A + 1) - (A - 1) * cosω0 + twoSqrtAα
	const a1 = 2 * ((A - 1) - (A + 1) * cosω0)
	const a2 = (A + 1) - (A - 1) * cosω0 - twoSqrtAα

	console.log(a1 / a0, a2 / a0)

	const b0 = A * ((A + 1) + (A - 1) * cosω0 + twoSqrtAα)
	const b1 = -2 * A * ((A - 1) + (A + 1) * cosω0)
	const b2 = A * ((A + 1) + (A - 1) * cosω0 - twoSqrtAα)

	// const B0 = 1.53512485958697
	// const B1 = -2.69169618940638
	// const B2 = 1.19839281085285
	console.log(b0 / a0, b1 / a0, b2 / a0)
}

console.log()
console.log('Stage 2')
{
	const A1 = -1.99004745483398
	const A2 = 0.99007225036621

	let Q: number
	let f0: number
	{
		const ω0 = Math.acos(-A1 / (A2 + 1))
		Q = Math.sin(ω0) * (A2 + 1) / (2 * (1 - A2))
		f0 = ω0 * Fs / (2 * Math.PI)
	}
	console.log('Frequency:', f0)
	console.log('Q:', Q)

	// Here's our boundary where we can only use our calculated parameters.

	const ω0 = 2 * Math.PI * f0 / Fs

	const cosω0 = Math.cos(ω0)
	const sinω0 = Math.sin(ω0)

	// Calculate α
	const α = sinω0 / (2 * Q)

	const a0 = 1 + α
	const a1 = -2 * cosω0
	const a2 = 1 - α

	console.log(a1 / a0, a2 / a0)

	const b0 = (1 + cosω0) / 2
	const b1 = -(1 + cosω0)
	const b2 = (1 + cosω0) / 2

	// const B0 = 1.0
	// const B1 = -2.0
	// const B2 = 1.0
	console.log(b0 / a0, b1 / a0, b2 / a0)
}
