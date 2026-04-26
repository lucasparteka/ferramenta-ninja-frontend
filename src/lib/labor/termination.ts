// Rescisão — CLT arts. 477-479, 484-A (acordo Lei 13.467/2017)
// Aviso prévio proporcional — Lei 12.506/2011: 30 dias + 3 dias por ano completo, cap 90.
// Multa FGTS — Lei 8.036/1990 art. 18 §1º (40%); acordo: 20% (CLT 484-A).
// Férias indenizadas isentas IRRF — IN RFB 1500/2014.

import {
	calculateFgtsFine,
	calculateInss,
	calculateIrrf,
	fgtsWithdrawableShare,
	type TerminationType,
} from "@/lib/payroll";

export type NoticePolicy = "worked" | "indemnified" | "not-served";

export type TerminationInput = {
	monthlySalary: number;
	admissionDate: Date;
	terminationDate: Date;
	type: TerminationType;
	noticePolicy: NoticePolicy;
	hasExpiredVacation?: boolean;
	fgtsBalance?: number;
	dependents?: number;
};

export type TerminationLine = {
	label: string;
	amount: number;
};

export type TerminationResult = {
	yearsAtCompany: number;
	monthsAtCompany: number;
	totalDays: number;
	noticeDays: number;
	avos13th: number;
	avosVacation: number;

	salaryBalance: number;
	noticeIndemnified: number;
	thirteenthProportional: number;
	expiredVacation: number;
	expiredVacationOneThird: number;
	proportionalVacation: number;
	proportionalVacationOneThird: number;
	fgtsFine: number;
	fgtsWithdrawable: number;

	inss: number;
	irrf: number;

	grossTotal: number;
	netTotal: number;

	lines: TerminationLine[];
	unemploymentInsuranceEligible: boolean;
};

const DAY_MS = 86_400_000;

function diffYearsMonths(from: Date, to: Date): {
	years: number;
	months: number;
	totalDays: number;
	monthsTotal: number;
} {
	let years = to.getUTCFullYear() - from.getUTCFullYear();
	let months = to.getUTCMonth() - from.getUTCMonth();
	let days = to.getUTCDate() - from.getUTCDate();

	if (days < 0) {
		months -= 1;
	}
	if (months < 0) {
		years -= 1;
		months += 12;
	}
	const totalDays = Math.floor((to.getTime() - from.getTime()) / DAY_MS);
	const monthsTotal = years * 12 + months;
	return { years, months, totalDays, monthsTotal };
}

export function noticeDaysFor(yearsAtCompany: number): number {
	const extra = Math.max(0, Math.floor(yearsAtCompany)) * 3;
	return Math.min(90, 30 + extra);
}

function avosFromDay(date: Date, fullMonths: number, totalDays: number): number {
	const dayOfMonth = date.getUTCDate();
	const lastFullMonths = totalDays >= 14 ? fullMonths + (dayOfMonth >= 15 ? 1 : 0) : fullMonths;
	return Math.min(12, lastFullMonths);
}

export function calculateTermination(input: TerminationInput): TerminationResult {
	const salary = input.monthlySalary;
	const { years, totalDays, monthsTotal } = diffYearsMonths(
		input.admissionDate,
		input.terminationDate,
	);

	const dailyRate = salary / 30;
	const dayOfMonth = input.terminationDate.getUTCDate();
	const salaryBalance = round2(dailyRate * dayOfMonth);

	const noticeDays = noticeDaysFor(years);
	const noticeIndemnified =
		input.noticePolicy === "indemnified" ? round2(salary + (noticeDays - 30) * dailyRate) : 0;

	const avos13th = avosFromDay(
		input.terminationDate,
		input.terminationDate.getUTCMonth(),
		totalDays,
	);
	const avosVacation = Math.min(12, monthsTotal % 12);

	const showProportional13 = ["no-cause", "resignation", "agreement", "contract-end"].includes(input.type);
	const showProportionalVac = showProportional13;
	const showExpiredVac = input.hasExpiredVacation === true;
	const showNoticeIndem = input.type === "no-cause" || input.type === "agreement";

	const thirteenthProportional = showProportional13
		? round2((salary * avos13th) / 12)
		: 0;

	const expiredVacation = showExpiredVac ? round2(salary) : 0;
	const expiredVacationOneThird = showExpiredVac ? round2(salary / 3) : 0;

	const proportionalVacation = showProportionalVac
		? round2((salary * avosVacation) / 12)
		: 0;
	const proportionalVacationOneThird = showProportionalVac
		? round2(proportionalVacation / 3)
		: 0;

	const noticeFinal = showNoticeIndem
		? input.type === "agreement"
			? round2(noticeIndemnified / 2)
			: noticeIndemnified
		: 0;

	const fgtsBalance = input.fgtsBalance ?? 0;
	const fgtsFine = calculateFgtsFine(fgtsBalance, input.type);
	const withdrawShare = fgtsWithdrawableShare(input.type);
	const fgtsWithdrawable = round2(fgtsBalance * withdrawShare);

	const inssBaseSalary = calculateInss(salaryBalance).amount;
	const inss13 = calculateInss(thirteenthProportional).amount;
	const inss = round2(inssBaseSalary + inss13);

	const irrfSalary = calculateIrrf({
		grossIncome: salaryBalance,
		inssDeducted: inssBaseSalary,
		dependents: input.dependents ?? 0,
		applyRedutor: false,
	}).amount;
	const irrf13 = calculateIrrf({
		grossIncome: thirteenthProportional,
		inssDeducted: inss13,
		dependents: input.dependents ?? 0,
		applyRedutor: false,
	}).amount;
	const irrf = round2(irrfSalary + irrf13);

	const grossTotal = round2(
		salaryBalance +
			noticeFinal +
			thirteenthProportional +
			expiredVacation +
			expiredVacationOneThird +
			proportionalVacation +
			proportionalVacationOneThird +
			fgtsFine,
	);
	const netTotal = round2(grossTotal - inss - irrf);

	const lines: TerminationLine[] = [
		{ label: "Saldo de salário", amount: salaryBalance },
		{ label: "Aviso prévio indenizado", amount: noticeFinal },
		{ label: "13º proporcional", amount: thirteenthProportional },
		{ label: "Férias vencidas", amount: expiredVacation },
		{ label: "1/3 férias vencidas", amount: expiredVacationOneThird },
		{ label: "Férias proporcionais", amount: proportionalVacation },
		{ label: "1/3 férias proporcionais", amount: proportionalVacationOneThird },
		{ label: "Multa FGTS", amount: fgtsFine },
	].filter((l) => l.amount > 0);

	return {
		yearsAtCompany: years,
		monthsAtCompany: monthsTotal,
		totalDays,
		noticeDays,
		avos13th,
		avosVacation,
		salaryBalance,
		noticeIndemnified: noticeFinal,
		thirteenthProportional,
		expiredVacation,
		expiredVacationOneThird,
		proportionalVacation,
		proportionalVacationOneThird,
		fgtsFine,
		fgtsWithdrawable,
		inss,
		irrf,
		grossTotal,
		netTotal,
		lines,
		unemploymentInsuranceEligible: input.type === "no-cause",
	};
}

function round2(value: number): number {
	return Math.round(value * 100) / 100;
}
