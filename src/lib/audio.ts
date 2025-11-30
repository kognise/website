export function linearFromDb(db: number): number {
	return Math.pow(10, db / 20)
}

export function dbFromLinear(linear: number): number {
	return 20 * Math.log10(linear)
}

export function linearFromSlider(slider: number): number {
	return Math.pow(slider, 3) * 3.162278
}

export function sliderFromLinear(linear: number): number {
	return Math.pow(linear / 3.162278, 1 / 3)
}

export function sliderFromDb(db: number): number {
	return sliderFromLinear(linearFromDb(db))
}

export function dbFromSlider(slider: number): number {
	return dbFromLinear(linearFromSlider(slider))
}

export function clamp(value: number, min: number, max: number): number {
	return Math.min(Math.max(value, min), max)
}
