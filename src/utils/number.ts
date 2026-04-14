export function parseCurrencyToNumber(value: string): number {
	if (!value) return 0;
	const cleaned = value.replace(/\D+/g, "");
	return parseInt(cleaned) / 100;
}
