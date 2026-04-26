// IRRF 2026 — Receita Federal / MF (jan/2026)
// Tabela: https://www.gov.br/fazenda/pt-br/assuntos/noticias/2026/janeiro/receita-divulga-nova-tabela-do-irpf-com-as-mudancas-apos-isencao-para-quem-ganha-ate-r-5-mil
// Redutor (reforma IR 2025) e ordem de cálculo: https://www.gov.br/receitafederal/pt-br/assuntos/noticias/2025/dezembro/receita-federal-orienta-fontes-pagadoras-e-contribuintes-a-calcular-a-reducao-do-imposto-de-renda-a-partir-de-1o-de-janeiro-de-2026

export type IrrfBracket = {
	upTo: number;
	rate: number;
	deduction: number;
};

export const IRRF_TABLE_2026: IrrfBracket[] = [
	{ upTo: 2428.8, rate: 0, deduction: 0 },
	{ upTo: 2826.65, rate: 0.075, deduction: 182.16 },
	{ upTo: 3751.05, rate: 0.15, deduction: 394.16 },
	{ upTo: 4664.68, rate: 0.225, deduction: 675.49 },
	{ upTo: Number.POSITIVE_INFINITY, rate: 0.275, deduction: 908.73 },
];

export const IRRF_DEPENDENT_DEDUCTION_2026 = 189.59;
export const IRRF_SIMPLIFIED_DEDUCTION_2026 = 607.2;
export const IRRF_REDUCER_MAX_GROSS_2026 = 7350.0;
export const IRRF_REDUCER_BASE = 978.62;
export const IRRF_REDUCER_FACTOR = 0.133145;

export type IrrfInput = {
	grossIncome: number;
	inssDeducted?: number;
	dependents?: number;
	applyRedutor?: boolean;
};

export type IrrfMethod = "detailed" | "simplified";

export type IrrfResult = {
	amount: number;
	method: IrrfMethod;
	taxableBase: number;
	bracketIndex: number;
	rate: number;
	rawTax: number;
	redutorApplied: number;
};

function applyTable(base: number): {
	tax: number;
	bracketIndex: number;
	rate: number;
} {
	if (base <= 0) {
		return { tax: 0, bracketIndex: 0, rate: 0 };
	}
	const bracketIndex = IRRF_TABLE_2026.findIndex((b) => base <= b.upTo);
	const bracket = IRRF_TABLE_2026[bracketIndex];
	const tax = Math.max(0, base * bracket.rate - bracket.deduction);
	return { tax, bracketIndex, rate: bracket.rate };
}

export function calculateIrrf(input: IrrfInput): IrrfResult {
	const dependents = input.dependents ?? 0;
	const inss = input.inssDeducted ?? 0;
	const applyRedutor = input.applyRedutor ?? true;
	const gross = input.grossIncome;

	if (gross <= 0) {
		return {
			amount: 0,
			method: "detailed",
			taxableBase: 0,
			bracketIndex: 0,
			rate: 0,
			rawTax: 0,
			redutorApplied: 0,
		};
	}

	const detailedBase = Math.max(
		0,
		gross - inss - dependents * IRRF_DEPENDENT_DEDUCTION_2026,
	);
	const simplifiedBase = Math.max(0, gross - IRRF_SIMPLIFIED_DEDUCTION_2026);

	const detailed = applyTable(detailedBase);
	const simplified = applyTable(simplifiedBase);

	const useSimplified = simplified.tax < detailed.tax;
	const chosen = useSimplified ? simplified : detailed;
	const chosenBase = useSimplified ? simplifiedBase : detailedBase;

	let redutor = 0;
	if (applyRedutor && gross <= IRRF_REDUCER_MAX_GROSS_2026) {
		redutor = Math.max(0, IRRF_REDUCER_BASE - IRRF_REDUCER_FACTOR * gross);
	}

	const amount = round2(Math.max(0, chosen.tax - redutor));

	return {
		amount,
		method: useSimplified ? "simplified" : "detailed",
		taxableBase: round2(chosenBase),
		bracketIndex: chosen.bracketIndex,
		rate: chosen.rate,
		rawTax: round2(chosen.tax),
		redutorApplied: round2(redutor),
	};
}

function round2(value: number): number {
	return Math.round(value * 100) / 100;
}
