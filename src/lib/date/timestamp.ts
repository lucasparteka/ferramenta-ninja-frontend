import { format, fromUnixTime, getUnixTime, isValid, parseISO } from "date-fns";

export type TimestampUnit = "seconds" | "milliseconds";

export function parseDateToTimestamp(
	dateStr: string,
	unit: TimestampUnit = "seconds",
): number | null {
	const parsed = parseISO(dateStr);
	if (!isValid(parsed)) return null;
	const unix = getUnixTime(parsed);
	return unit === "milliseconds" ? unix * 1000 : unix;
}

export function formatTimestampToDate(
	timestamp: number,
	unit: TimestampUnit = "seconds",
	formatStr = "dd/MM/yyyy HH:mm:ss",
): string | null {
	const seconds =
		unit === "milliseconds" ? Math.floor(timestamp / 1000) : timestamp;
	try {
		const date = fromUnixTime(seconds);
		if (!isValid(date)) return null;
		return format(date, formatStr);
	} catch {
		return null;
	}
}

export function getCurrentTimestamp(unit: TimestampUnit = "seconds"): number {
	const now = Date.now();
	return unit === "milliseconds" ? now : Math.floor(now / 1000);
}

export function getCurrentISO(): string {
	return new Date().toISOString();
}
