// INSS 2026 — Portaria Interministerial MPS/MF nº 13 (09/01/2026)
// https://www.gov.br/previdencia/pt-br/assuntos/rpps/documentos/PortariaInterministerialMPSMF13de9dejaneirode2026.pdf

export type InssBracket = {
	upTo: number;
	rate: number;
};

export const INSS_TABLE_2026: InssBracket[] = [
	{ upTo: 1621.0, rate: 0.075 },
	{ upTo: 2902.84, rate: 0.09 },
	{ upTo: 4354.27, rate: 0.12 },
	{ upTo: 8475.55, rate: 0.14 },
];

export const INSS_CEILING_2026 = 8475.55;

export type InssResult = {
	amount: number;
	effectiveRate: number;
	cappedBase: number;
	bracketIndex: number;
};

export function calculateInss(base: number): InssResult {
	if (base <= 0) {
		return { amount: 0, effectiveRate: 0, cappedBase: 0, bracketIndex: -1 };
	}

	const cappedBase = Math.min(base, INSS_CEILING_2026);
	let total = 0;
	let previous = 0;
	let bracketIndex = 0;

	for (let i = 0; i < INSS_TABLE_2026.length; i++) {
		const bracket = INSS_TABLE_2026[i];
		const upper = Math.min(cappedBase, bracket.upTo);
		const taxable = upper - previous;
		if (taxable > 0) {
			total += taxable * bracket.rate;
			bracketIndex = i;
		}
		previous = bracket.upTo;
		if (cappedBase <= bracket.upTo) break;
	}

	const amount = round2(total);
	return {
		amount,
		effectiveRate: amount / base,
		cappedBase,
		bracketIndex,
	};
}

function round2(value: number): number {
	return Math.round(value * 100) / 100;
}
