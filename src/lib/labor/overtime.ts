// Hora extra — CLT art. 7º XVI (50% mínimo) e arts. 67-70 (100% domingo/feriado)
// DSR sobre HE — Súmula 172 TST: HE habituais geram reflexo no DSR.

import {
	hourlyRate as computeHourlyRate,
	monthlyHoursForWeekly,
	type WeeklyHours,
} from "@/lib/payroll/working-hours";

export type OvertimeInput = {
	monthlySalary: number;
	weeklyHours: WeeklyHours;
	hours50: number;
	hours100: number;
	customRateHours?: number;
	customRatePercent?: number;
	includeDsr?: boolean;
	usefulDays?: number;
	restDays?: number;
};

export type OvertimeResult = {
	hourlyRate: number;
	overtime50Total: number;
	overtime100Total: number;
	customTotal: number;
	overtimeBeforeDsr: number;
	dsr: number;
	total: number;
};

export function calculateOvertime(input: OvertimeInput): OvertimeResult {
	const monthlyHours = monthlyHoursForWeekly(input.weeklyHours);
	const rate = computeHourlyRate(input.monthlySalary, monthlyHours);

	const overtime50Total = round2(rate * 1.5 * Math.max(0, input.hours50));
	const overtime100Total = round2(rate * 2 * Math.max(0, input.hours100));

	const customPercent = input.customRatePercent ?? 0;
	const customHours = input.customRateHours ?? 0;
	const customTotal = round2(rate * (1 + customPercent / 100) * customHours);

	const overtimeBeforeDsr = round2(
		overtime50Total + overtime100Total + customTotal,
	);

	let dsr = 0;
	const include = input.includeDsr ?? false;
	const usefulDays = input.usefulDays ?? 0;
	const restDays = input.restDays ?? 0;
	if (include && usefulDays > 0) {
		dsr = round2((overtimeBeforeDsr / usefulDays) * restDays);
	}

	return {
		hourlyRate: round2(rate),
		overtime50Total,
		overtime100Total,
		customTotal,
		overtimeBeforeDsr,
		dsr,
		total: round2(overtimeBeforeDsr + dsr),
	};
}

function round2(value: number): number {
	return Math.round(value * 100) / 100;
}
