// 13º salário — Lei 4.090/1962 + Lei 4.749/1965
// 1ª parcela: até 30/nov, 50% sem desconto. 2ª parcela: até 20/dez, com INSS+IRRF sobre total.
// Adiantamento da 1ª parcela junto às férias: Lei 4.749/1965 art. 2º §2º.
// Solicitação até janeiro do ano corrente; pagamento ocorre na ocasião das férias do mesmo ano.

import { calculateInss, calculateIrrf } from "@/lib/payroll";

export type FirstInstallmentTiming = "november" | "vacation";

export type ChristmasBonusInput = {
	monthlySalary: number;
	monthsWorked: number;
	dependents?: number;
	averageAdditional?: number;
	firstInstallmentTiming?: FirstInstallmentTiming;
};

export type ChristmasBonusResult = {
	avos: number;
	grossBonus: number;
	firstInstallment: number;
	firstInstallmentTiming: FirstInstallmentTiming;
	firstInstallmentDueLabel: string;
	inss: number;
	irrf: number;
	secondInstallment: number;
	netTotal: number;
};

export function calculateChristmasBonus(
	input: ChristmasBonusInput,
): ChristmasBonusResult {
	const months = clamp(Math.floor(input.monthsWorked ?? 0), 0, 12);
	const baseSalary = (input.monthlySalary ?? 0) + (input.averageAdditional ?? 0);
	const timing: FirstInstallmentTiming = input.firstInstallmentTiming ?? "november";
	const dueLabel = dueLabelFor(timing);

	if (months === 0 || baseSalary <= 0) {
		return {
			avos: 0,
			grossBonus: 0,
			firstInstallment: 0,
			firstInstallmentTiming: timing,
			firstInstallmentDueLabel: dueLabel,
			inss: 0,
			irrf: 0,
			secondInstallment: 0,
			netTotal: 0,
		};
	}

	const grossBonus = round2((baseSalary * months) / 12);
	const firstInstallment = round2(grossBonus / 2);

	const inss = calculateInss(grossBonus).amount;
	const irrf = calculateIrrf({
		grossIncome: grossBonus,
		inssDeducted: inss,
		dependents: input.dependents ?? 0,
		applyRedutor: false,
	}).amount;

	const secondInstallment = round2(grossBonus - firstInstallment - inss - irrf);
	const netTotal = round2(grossBonus - inss - irrf);

	return {
		avos: months,
		grossBonus,
		firstInstallment,
		firstInstallmentTiming: timing,
		firstInstallmentDueLabel: dueLabel,
		inss,
		irrf,
		secondInstallment,
		netTotal,
	};
}

function dueLabelFor(timing: FirstInstallmentTiming): string {
	if (timing === "vacation") {
		return "Pago junto com as férias (Lei 4.749/1965 art. 2º §2º)";
	}
	return "Pago até 30 de novembro";
}

function clamp(value: number, min: number, max: number): number {
	return Math.min(max, Math.max(min, value));
}

function round2(value: number): number {
	return Math.round(value * 100) / 100;
}
