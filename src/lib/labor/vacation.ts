// Férias — CLT arts. 129–149
// Adicional 1/3: CF/88 art. 7º XVII
// Faltas (CLT 130): 0–5=30; 6–14=24; 15–23=18; 24–32=12; >32=0
// Fracionamento (CLT 134 §1, Lei 13.467/2017): até 3 períodos, um ≥14 dias e os demais ≥5 dias.
// Abono pecuniário (CLT 143): até 1/3 dos dias de direito, isento INSS/IRRF (Súmula 328 TST + IN RFB 1500/2014).

import { calculateInss, calculateIrrf } from "@/lib/payroll";

export const MIN_VACATION_PERIOD_DAYS = 5;

export type VacationInput = {
	monthlySalary: number;
	monthsAtCompany: number;
	unjustifiedAbsences?: number;
	sellAbono?: boolean;
	dependents?: number;
	daysToTake?: number;
};

export type VacationValidationError =
	| "days-below-minimum"
	| "days-exceed-available";

export type VacationResult = {
	entitledDays: number;
	avos: number;
	abonoDays: number;
	vacationDaysTaken: number;
	availableForVacation: number;
	vacationBase: number;
	oneThirdBonus: number;
	abonoPecuniario: number;
	abonoOneThird: number;
	taxableAmount: number;
	inss: number;
	irrf: number;
	netAmount: number;
	validationError?: VacationValidationError;
};

export function entitledVacationDays(absences: number): number {
	if (absences <= 5) return 30;
	if (absences <= 14) return 24;
	if (absences <= 23) return 18;
	if (absences <= 32) return 12;
	return 0;
}

export function maxAbonoDays(entitledDays: number): number {
	return Math.floor(entitledDays / 3);
}

export function calculateVacation(input: VacationInput): VacationResult {
	const salary = input.monthlySalary ?? 0;
	const months = clamp(Math.floor(input.monthsAtCompany ?? 0), 0, 12);
	const absences = Math.max(0, Math.floor(input.unjustifiedAbsences ?? 0));
	const sellAbono = input.sellAbono ?? false;
	const dependents = input.dependents ?? 0;

	const fullEntitled = entitledVacationDays(absences);
	const proportionalEntitled = Math.round((fullEntitled * months) / 12);
	const entitledDays = months >= 12 ? fullEntitled : proportionalEntitled;

	const abonoDays = sellAbono ? maxAbonoDays(entitledDays) : 0;
	const availableForVacation = Math.max(0, entitledDays - abonoDays);

	if (entitledDays === 0 || salary <= 0) {
		return zeroResult(entitledDays, months, abonoDays, availableForVacation);
	}

	const requestedDays = input.daysToTake ?? availableForVacation;

	let validationError: VacationValidationError | undefined;
	let vacationDaysTaken = requestedDays;

	if (requestedDays > availableForVacation) {
		validationError = "days-exceed-available";
		vacationDaysTaken = availableForVacation;
	} else if (
		requestedDays > 0 &&
		requestedDays < MIN_VACATION_PERIOD_DAYS &&
		requestedDays !== availableForVacation
	) {
		validationError = "days-below-minimum";
		vacationDaysTaken = MIN_VACATION_PERIOD_DAYS;
	}

	const dailyRate = salary / 30;
	const vacationBase = round2(dailyRate * vacationDaysTaken);
	const oneThirdBonus = round2(vacationBase / 3);
	const abonoPecuniario = round2(dailyRate * abonoDays);
	const abonoOneThird = round2(abonoPecuniario / 3);

	const taxableAmount = round2(vacationBase + oneThirdBonus);

	const inss = calculateInss(taxableAmount).amount;
	const irrf = calculateIrrf({
		grossIncome: taxableAmount,
		inssDeducted: inss,
		dependents,
		applyRedutor: false,
	}).amount;

	const netAmount = round2(
		taxableAmount + abonoPecuniario + abonoOneThird - inss - irrf,
	);

	return {
		entitledDays,
		avos: months,
		abonoDays,
		vacationDaysTaken,
		availableForVacation,
		vacationBase,
		oneThirdBonus,
		abonoPecuniario,
		abonoOneThird,
		taxableAmount,
		inss,
		irrf,
		netAmount,
		validationError,
	};
}

function zeroResult(
	entitledDays: number,
	avos: number,
	abonoDays: number,
	availableForVacation: number,
): VacationResult {
	return {
		entitledDays,
		avos,
		abonoDays,
		vacationDaysTaken: 0,
		availableForVacation,
		vacationBase: 0,
		oneThirdBonus: 0,
		abonoPecuniario: 0,
		abonoOneThird: 0,
		taxableAmount: 0,
		inss: 0,
		irrf: 0,
		netAmount: 0,
	};
}

function clamp(v: number, min: number, max: number): number {
	return Math.min(max, Math.max(min, v));
}

function round2(value: number): number {
	return Math.round(value * 100) / 100;
}
