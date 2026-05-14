export function percentOf(percent: number, value: number): number {
	return (percent / 100) * value;
}

export function whatPercent(part: number, total: number): number {
	if (total === 0) return NaN;
	return (part / total) * 100;
}

export function percentageChange(from: number, to: number): number {
	if (from === 0) return NaN;
	return ((to - from) / Math.abs(from)) * 100;
}

export function increaseByPercent(value: number, percent: number): number {
	return value * (1 + percent / 100);
}

export function decreaseByPercent(value: number, percent: number): number {
	return value * (1 - percent / 100);
}

export function absolutePercentDiff(a: number, b: number): number {
	if (a + b === 0) return NaN;
	return (Math.abs(a - b) / ((a + b) / 2)) * 100;
}

export function stackedDiscounts(
	v: number,
	d1: number,
	d2: number,
): { result: number; equivalentDiscount: number } {
	const afterFirst = v * (1 - d1 / 100);
	const result = afterFirst * (1 - d2 / 100);
	const equivalentDiscount = (1 - result / v) * 100;
	return { result, equivalentDiscount };
}
