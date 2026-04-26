// FGTS — Lei 8.036/1990 (depósito 8%) e art. 18 §1º (multa rescisória 40%)
// Multa 20% para acordo: Lei 13.467/2017 (Reforma Trabalhista) art. 484-A CLT

export const FGTS_DEPOSIT_RATE = 0.08;
export const FGTS_FINE_NO_CAUSE = 0.4;
export const FGTS_FINE_AGREEMENT = 0.2;
export const FGTS_FINE_NONE = 0;

export type TerminationType =
	| "no-cause"
	| "with-cause"
	| "resignation"
	| "agreement"
	| "contract-end";

export function calculateFgtsDeposit(base: number): number {
	if (base <= 0) return 0;
	return round2(base * FGTS_DEPOSIT_RATE);
}

export function fgtsFineRate(type: TerminationType): number {
	if (type === "no-cause") return FGTS_FINE_NO_CAUSE;
	if (type === "agreement") return FGTS_FINE_AGREEMENT;
	return FGTS_FINE_NONE;
}

export function calculateFgtsFine(
	balance: number,
	type: TerminationType,
): number {
	if (balance <= 0) return 0;
	return round2(balance * fgtsFineRate(type));
}

export function fgtsWithdrawableShare(type: TerminationType): number {
	if (type === "no-cause") return 1;
	if (type === "agreement") return 0.8;
	return 0;
}

function round2(value: number): number {
	return Math.round(value * 100) / 100;
}
