// Renda fixa: CDB/LCI/LCA atrelados a CDI ou Selic.
// IR regressivo (Lei 11.033/2004 art. 1º):
//   até 180 dias: 22.5%
//   181-360: 20%
//   361-720: 17.5%
//   acima de 720: 15%
// IOF regressivo até 30 dias (Decreto 6.306/2007 anexo): 96% no dia 1, 0% a partir do dia 30.
// LCI/LCA são isentos de IR (Lei 11.033/2004 art. 1º §1º) e isentos de IOF.

export type IndexType = "cdi" | "selic" | "prefixed" | "ipca-plus";

export type FixedIncomeKind = "cdb" | "lci-lca" | "tesouro-selic";

export type FixedIncomeInput = {
	principal: number;
	days: number;
	annualIndexRate: number;
	indexPercentage?: number;
	prefixedAnnualRate?: number;
	kind: FixedIncomeKind;
	indexType: IndexType;
};

export type FixedIncomeResult = {
	grossYield: number;
	grossFinal: number;
	iof: number;
	ir: number;
	netYield: number;
	netFinal: number;
	iofRate: number;
	irRate: number;
	effectiveAnnualRate: number;
};

export function iofRateForDays(days: number): number {
	if (days >= 30) return 0;
	const table = [
		96, 93, 90, 86, 83, 80, 76, 73, 70, 66, 63, 60, 56, 53, 50, 46, 43, 40, 36,
		33, 30, 26, 23, 20, 16, 13, 10, 6, 3, 0,
	];
	return table[Math.max(0, days - 1)] / 100;
}

export function irRateForDays(days: number): number {
	if (days <= 180) return 0.225;
	if (days <= 360) return 0.2;
	if (days <= 720) return 0.175;
	return 0.15;
}

export function calculateFixedIncome(
	input: FixedIncomeInput,
): FixedIncomeResult {
	const annualEffective =
		input.indexType === "prefixed"
			? input.prefixedAnnualRate ?? 0
			: input.annualIndexRate * (input.indexPercentage ?? 100) / 100;

	const dailyRate = (1 + annualEffective) ** (1 / 252) - 1;
	const businessDays = Math.round(input.days * (252 / 365));
	const grossFinal = input.principal * (1 + dailyRate) ** businessDays;
	const grossYield = grossFinal - input.principal;

	const iofRate = input.kind === "lci-lca" ? 0 : iofRateForDays(input.days);
	const iof = grossYield * iofRate;
	const yieldAfterIof = grossYield - iof;

	const irRate = input.kind === "lci-lca" ? 0 : irRateForDays(input.days);
	const ir = yieldAfterIof * irRate;

	const netYield = yieldAfterIof - ir;
	const netFinal = input.principal + netYield;

	const years = input.days / 365;
	const effectiveAnnualRate =
		years > 0 ? (netFinal / input.principal) ** (1 / years) - 1 : 0;

	return {
		grossYield: round2(grossYield),
		grossFinal: round2(grossFinal),
		iof: round2(iof),
		ir: round2(ir),
		netYield: round2(netYield),
		netFinal: round2(netFinal),
		iofRate,
		irRate,
		effectiveAnnualRate,
	};
}

function round2(value: number): number {
	return Math.round(value * 100) / 100;
}
