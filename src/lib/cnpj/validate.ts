function calcDigit(digits: number[], weights: number[]): number {
	const sum = digits.reduce((acc, d, i) => acc + d * weights[i], 0);
	const remainder = sum % 11;
	return remainder < 2 ? 0 : 11 - remainder;
}

export function validateCNPJ(cnpj: string): boolean {
	const digits = cnpj.replace(/\D/g, "");

	if (digits.length !== 14) return false;
	if (/^(\d)\1{13}$/.test(digits)) return false;

	const nums = digits.split("").map(Number);
	const d1 = calcDigit(nums.slice(0, 12), [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
	if (d1 !== nums[12]) return false;

	const d2 = calcDigit(
		nums.slice(0, 13),
		[6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2],
	);
	return d2 === nums[13];
}
