export type TimeString = string;

export type DayEntry = {
	day: string;
	startTime: TimeString;
	endTime: TimeString;
	breakMinutes: number;
};

export type DayResult = {
	day: string;
	totalMinutes: number;
	formatted: string;
};

export type WeekResult = {
	days: DayResult[];
	weeklyTotalMinutes: number;
	weeklyTotalFormatted: string;
	dailyAverageMinutes: number;
	dailyAverageFormatted: string;
	monthlyEstimateMinutes: number;
	monthlyEstimateFormatted: string;
};
