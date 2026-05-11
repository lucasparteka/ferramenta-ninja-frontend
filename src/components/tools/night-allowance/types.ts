export type CalculateNightAllowanceResult = {
	grossSalary: number;
	contractualHours: number;
	workedHours: number;
	minutes: number;
	percentageAllowance: number;
	isRural: boolean;
	isNighttimeWork: boolean;
	usefulDays: number;
	holidaysAndSundays: number;
	hourValue: number;
	nightHoursWorked: number;
	allowanceValue: number;
	baseAllowance: number;
	rsrDsr: number;
	hourWithAllowance: number;
	totalAllowanceDue: number;
};

export type NightAllowanceParams = {
	grossSalary: number;
	contractualHours: number;
	workedHours: number;
	minutes: number;
	percentageAllowance: number;
	usefulDays: number;
	holidaysAndSundays: number;
	isRural: boolean;
	isNighttimeWork: boolean;
};
