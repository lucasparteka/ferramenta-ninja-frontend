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

	let inss = 0;
	const baseINSS = grossSalary;

	if (grossSalary <= 1518.0) {
		inss = grossSalary * 0.075;
	} else if (grossSalary <= 2793.88) {
		inss = 113.85 + (grossSalary - 1518) * 0.09;
	} else if (grossSalary <= 4190.83) {
		inss = 113.85 + 114.83 + (grossSalary - 2793.88) * 0.12;
	} else if (grossSalary <= 8157.41) {
		inss = 113.85 + 114.83 + 167.63 + (grossSalary - 4190.83) * 0.14;
	} else {
		inss = 113.85 + 114.83 + 167.63 + 555.32;
	}
	if (inss > 951.62) inss = 951.62;
	inss = Math.round(inss * 100) / 100;

	const descontoDependentes = dependents * 189.59;

	let baseIR = baseINSS - inss - descontoDependentes;
	if (inss + descontoDependentes < 607.2) {
		baseIR = baseINSS - 607.2;
	}

	let irrf = 0;
	if (baseIR <= 2428.8) irrf = 0;
	else if (baseIR <= 2826.65) irrf = baseIR * 0.075 - 182.16;
	else if (baseIR <= 3751.05) irrf = baseIR * 0.15 - 394.16;
	else if (baseIR <= 4664.68) irrf = baseIR * 0.225 - 675.49;
	else irrf = baseIR * 0.275 - 908.73;

	irrf = Math.max(0, Math.round(irrf * 100) / 100);

	const totalDiscounts = Math.round((inss + irrf + otherDiscounts) * 100) / 100;

	const netSalary =
		Math.round((grossSalary + benefits - totalDiscounts) * 100) / 100;

	return {
		grossSalary: Math.round(grossSalary * 100) / 100,
		netSalary,
		inss,
		irrf,
		totalDiscounts,
		benefits,
	};
}
