export const birthday = coerceStamp('2006-04-21')

export const yearHeight = 200

export interface Stamp {
	year: number
	/**
	 * 1-12
	 */
	month: number
	day: number
}

export function coerceStamp(date: Date | string): Stamp {
	if (typeof date === 'string') {
		return coerceStamp(new Date(date))
	}

	if (typeof date === 'number') {
		return {
			year: date,
			month: 1,
			day: 1,
		}
	}
	
	return {
		year: date.getUTCFullYear(),
		month: date.getUTCMonth() + 1,
		day: date.getUTCDate(),
	}
}

export function pxs(stamp: Stamp): number {
	// Calculate years since birthday
	const yearsSince = stamp.year - birthday.year
	
	// Calculate months since birthday (within the current year)
	const monthsSince = stamp.month - birthday.month
	
	// Calculate the day position within the month
	// Days are 1-indexed, so we need to subtract 1 to get 0-indexed position
	const daysInMonth = getDaysInMonth(stamp.year, stamp.month)
	const daysSince = stamp.day - birthday.day
	
	// Calculate pixel value
	const yearPx = yearsSince * yearHeight
	const monthPx = monthsSince * (yearHeight / 12)
	const dayPx = (daysSince / daysInMonth) * (yearHeight / 12)
	
	return yearPx + monthPx + dayPx
}

export function sxp(px: number): Stamp {
	const monthHeight = yearHeight / 12
	
	// Calculate years
	const yearOffset = Math.floor(px / yearHeight)
	const year = birthday.year + yearOffset
	
	// Calculate months
	const remainderAfterYears = px - (yearOffset * yearHeight)
	const monthOffset = Math.floor(remainderAfterYears / monthHeight)
	const month = birthday.month + monthOffset
	
	// Calculate days
	const remainderAfterMonths = remainderAfterYears - (monthOffset * monthHeight)
	const daysInMonth = getDaysInMonth(year, month)
	const dayOffset = Math.floor((remainderAfterMonths / monthHeight) * daysInMonth)
	const day = birthday.day + dayOffset
	
	return { year, month, day }
}

function getDaysInMonth(year: number, month: number): number {
	return new Date(year, month, 0).getDate()
}

export function cmp(a: Stamp, b: Stamp): -1 | 0 | 1 {
	for (const [ key, value ] of Object.entries(a)) {
		if (b[key as keyof Stamp] < value) return 1
		if (b[key as keyof Stamp] > value) return -1
	}
	return 0
}

export function maxStamp(stamps: Stamp[]): Stamp | null {
	let max: Stamp | null = null
	for (const stamp of stamps) {
		for (const [ key, value ] of Object.entries(stamp)) {
			if (max === null || value > max[key as keyof Stamp]) {
				max = { ...stamp }
			}
		}
	}
	return max
}

export function minStamp(stamps: Stamp[]): Stamp | null {
	let min: Stamp | null = null
	for (const stamp of stamps) {
		for (const [ key, value ] of Object.entries(stamp)) {
			if (min === null || value < min[key as keyof Stamp]) {
				min = { ...stamp }
			}
		}
	}
	return min
}

export function formatStamp(stamp: Stamp): string {
	return `${stamp.year.toString().padStart(4, '0')}-${stamp.month.toString().padStart(2, '0')}-${stamp.day.toString().padStart(2, '0')}`
}
