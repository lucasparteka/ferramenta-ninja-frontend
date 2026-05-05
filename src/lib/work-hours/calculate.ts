import type { DayEntry, DayResult, WeekResult } from "./types";

export function parseTime(time: string): number {
	const parts = time.split(":");
	const hours = Number.parseInt(parts[0], 10);
	const minutes = Number.parseInt(parts[1], 10);
	if (Number.isNaN(hours) || Number.isNaN(minutes)) return 0;
	return hours * 60 + minutes;
}

export function parseTimeSafe(time: string): number {
	if (!time || !/^\d{1,2}:\d{2}$/.test(time)) return 0;
	return parseTime(time);
}

export function calculateDayMinutes(
	start: string,
	end: string,
	breakMinutes: number,
): number {
	const startMin = parseTimeSafe(start);
	const endMin = parseTimeSafe(end);
	if (startMin === 0 && endMin === 0) return 0;
	if (endMin < startMin) return 0;
	const total = endMin - startMin - breakMinutes;
	return Math.max(total, 0);
}

export function formatMinutes(minutes: number): string {
	const h = Math.floor(minutes / 60);
	const m = minutes % 60;
	if (h === 0) return `${m}min`;
	if (m === 0) return `${h}h`;
	return `${h}h ${m}min`;
}

export function formatDecimal(minutes: number): string {
	return (minutes / 60).toFixed(2);
}

export function calculateDay(entry: DayEntry): DayResult {
	const totalMinutes = calculateDayMinutes(
		entry.startTime,
		entry.endTime,
		entry.breakMinutes,
	);
	return {
		day: entry.day,
		totalMinutes,
		formatted: formatMinutes(totalMinutes),
	};
}

export function calculateWeek(entries: DayEntry[]): WeekResult {
	const days = entries.map(calculateDay);
	const weeklyTotalMinutes = days.reduce((acc, d) => acc + d.totalMinutes, 0);
	const daysWorked = days.filter((d) => d.totalMinutes > 0).length;
	const dailyAverageMinutes = daysWorked > 0 ? Math.round(weeklyTotalMinutes / daysWorked) : 0;
	const monthlyEstimateMinutes = daysWorked > 0
		? Math.round((weeklyTotalMinutes / daysWorked) * 21.67 * daysWorked / 5)
		: 0;

	return {
		days,
		weeklyTotalMinutes,
		weeklyTotalFormatted: formatMinutes(weeklyTotalMinutes),
		dailyAverageMinutes,
		dailyAverageFormatted: formatMinutes(dailyAverageMinutes),
		monthlyEstimateMinutes,
		monthlyEstimateFormatted: formatMinutes(monthlyEstimateMinutes),
	};
}
