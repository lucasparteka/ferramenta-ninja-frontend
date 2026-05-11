import type {
	CalculateNightAllowanceResult,
	NightAllowanceParams,
} from "./types";

export function calculateNightAllowance(
	params: NightAllowanceParams,
): CalculateNightAllowanceResult {
	const {
		grossSalary,
		contractualHours,
		workedHours,
		minutes,
		percentageAllowance,
		usefulDays,
		holidaysAndSundays,
		isRural,
		isNighttimeWork,
	} = params;

	const totalWorkedHours = workedHours + minutes / 60;

	let nightHoursWorked = totalWorkedHours;

	if (!isRural && !isNighttimeWork) {
		nightHoursWorked = (totalWorkedHours / 52.5) * 60;
	}

	const hourValue = grossSalary / contractualHours;
	const allowanceValuePerHour = hourValue * (percentageAllowance / 100);
	const baseAllowance =
		Math.round(allowanceValuePerHour * nightHoursWorked * 100) / 100;
	const rsrDsr =
		usefulDays > 0
			? Math.round((baseAllowance / usefulDays) * holidaysAndSundays * 100) /
				100
			: 0;
	const totalAllowanceDue = baseAllowance + rsrDsr;
	const hourWithAllowance = hourValue + allowanceValuePerHour;

	return {
		grossSalary: Math.round(grossSalary * 100) / 100,
		contractualHours,
		workedHours: Math.round(totalWorkedHours * 100) / 100,
		minutes,
		percentageAllowance,
		isRural,
		isNighttimeWork,
		usefulDays,
		holidaysAndSundays,
		hourValue: Math.round(hourValue * 100) / 100,
		nightHoursWorked: Math.round(nightHoursWorked * 100) / 100,
		allowanceValue: Math.round(allowanceValuePerHour * 100) / 100,
		baseAllowance,
		rsrDsr,
		hourWithAllowance: Math.round(hourWithAllowance * 100) / 100,
		totalAllowanceDue,
	};
}
