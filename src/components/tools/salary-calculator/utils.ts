import { calculateInss, calculateIrrf } from "@/lib/payroll";
import type { CalculateResult } from "./types";

export function calculateSalary(params: {
	grossSalary: number;
	dependents?: number;
	benefits?: number;
	otherDiscounts?: number;
}): CalculateResult {
	const {
		grossSalary,
		dependents = 0,
		benefits = 0,
		otherDiscounts = 0,
	} = params;

	const inss = calculateInss(grossSalary).amount;
	const irrf = calculateIrrf({
		grossIncome: grossSalary,
		inssDeducted: inss,
		dependents,
	}).amount;

	const totalDiscounts = round2(inss + irrf + otherDiscounts);
	const netSalary = round2(grossSalary + benefits - totalDiscounts);

	return {
		grossSalary: round2(grossSalary),
		netSalary,
		inss,
		irrf,
		totalDiscounts,
		benefits,
	};
}

function round2(value: number): number {
	return Math.round(value * 100) / 100;
}
