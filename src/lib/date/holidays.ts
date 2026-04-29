/**
 * Feriados nacionais brasileiros e cálculo de dias úteis.
 * Inclui feriados fixos, móveis (baseados na Páscoa) e pontos facultativos.
 */

export type Holiday = {
	date: string; // MM-DD
	name: string;
	fixed: boolean;
};

export const FIXED_HOLIDAYS: Holiday[] = [
	{ date: "01-01", name: "Confraternização Universal", fixed: true },
	{ date: "04-21", name: "Tiradentes", fixed: true },
	{ date: "05-01", name: "Dia do Trabalhador", fixed: true },
	{ date: "09-07", name: "Independência do Brasil", fixed: true },
	{ date: "10-12", name: "Nossa Senhora Aparecida", fixed: true },
	{ date: "11-02", name: "Finados", fixed: true },
	{ date: "11-15", name: "Proclamação da República", fixed: true },
	{ date: "11-20", name: "Dia Nacional de Zumbi e da Consciência Negra", fixed: true },
	{ date: "12-25", name: "Natal", fixed: true },
];

export type OptionalHoliday = {
	date: string; // MM-DD
	name: string;
};

export const OPTIONAL_HOLIDAYS: OptionalHoliday[] = [
	{ date: "10-28", name: "Dia do Servidor Público" },
	{ date: "12-24", name: "Véspera de Natal" },
	{ date: "12-31", name: "Véspera de Ano-Novo" },
];

/**
 * Calcula a data da Páscoa para um ano usando o algoritmo de Meeus/Jones/Butcher.
 */
export function getEasterDate(year: number): Date {
	const a = year % 19;
	const b = Math.floor(year / 100);
	const c = year % 100;
	const d = Math.floor(b / 4);
	const e = b % 4;
	const f = Math.floor((b + 8) / 25);
	const g = Math.floor((b - f + 1) / 3);
	const h = (19 * a + b - d - g + 15) % 30;
	const i = Math.floor(c / 4);
	const k = c % 4;
	const l = (32 + 2 * e + 2 * i - h - k) % 7;
	const m = Math.floor((a + 11 * h + 22 * l) / 451);
	const month = Math.floor((h + l - 7 * m + 114) / 31) - 1; // 0-indexed
	const day = ((h + l - 7 * m + 114) % 31) + 1;
	return new Date(year, month, day);
}

function addDays(date: Date, days: number): Date {
	const result = new Date(date);
	result.setDate(result.getDate() + days);
	return result;
}

function formatDate(date: Date): string {
	const m = String(date.getMonth() + 1).padStart(2, "0");
	const d = String(date.getDate()).padStart(2, "0");
	return `${m}-${d}`;
}

function formatFullDate(date: Date): string {
	return date.toLocaleDateString("pt-BR", {
		day: "2-digit",
		month: "long",
		year: "numeric",
	});
}

export type MovableHoliday = {
	date: string; // YYYY-MM-DD
	name: string;
};

export function getMovableHolidays(year: number): MovableHoliday[] {
	const easter = getEasterDate(year);
	const carnivalTuesday = addDays(easter, -47);
	const goodFriday = addDays(easter, -2);
	const corpusChristi = addDays(easter, 60);

	return [
		{
			date: `${year}-${formatDate(carnivalTuesday)}`,
			name: "Carnaval (terça-feira)",
		},
		{
			date: `${year}-${formatDate(goodFriday)}`,
			name: "Sexta-feira Santa",
		},
		{
			date: `${year}-${formatDate(corpusChristi)}`,
			name: "Corpus Christi",
		},
	];
}

export type HolidayInfo = {
	date: string; // YYYY-MM-DD
	name: string;
	type: "fixo" | "movel" | "facultativo";
};

export function getAllHolidaysForYear(
	year: number,
	includeOptional: boolean,
): HolidayInfo[] {
	const holidays: HolidayInfo[] = [];

	// Fixos
	for (const h of FIXED_HOLIDAYS) {
		holidays.push({
			date: `${year}-${h.date}`,
			name: h.name,
			type: "fixo",
		});
	}

	// Móveis
	for (const h of getMovableHolidays(year)) {
		holidays.push({
			date: h.date,
			name: h.name,
			type: "movel",
		});
	}

	// Facultativos
	if (includeOptional) {
		for (const h of OPTIONAL_HOLIDAYS) {
			holidays.push({
				date: `${year}-${h.date}`,
				name: h.name,
				type: "facultativo",
			});
		}
	}

	return holidays.sort((a, b) => a.date.localeCompare(b.date));
}

function isWeekend(date: Date): boolean {
	const day = date.getDay();
	return day === 0 || day === 6;
}

function toDateInputString(date: Date): string {
	const y = date.getFullYear();
	const m = String(date.getMonth() + 1).padStart(2, "0");
	const d = String(date.getDate()).padStart(2, "0");
	return `${y}-${m}-${d}`;
}

function parseDateInput(str: string): Date | null {
	if (!str) return null;
	const [y, m, d] = str.split("-").map(Number);
	if (!y || !m || !d) return null;
	const date = new Date(y, m - 1, d);
	if (
		date.getFullYear() !== y ||
		date.getMonth() !== m - 1 ||
		date.getDate() !== d
	) {
		return null;
	}
	return date;
}

export type BusinessDaysResult = {
	totalDays: number;
	businessDays: number;
	weekendDays: number;
	holidayDays: number;
	holidays: HolidayInfo[];
	dateRangeValid: boolean;
};

export function calculateBusinessDays(
	startStr: string,
	endStr: string,
	includeOptional: boolean,
): BusinessDaysResult {
	const start = parseDateInput(startStr);
	const end = parseDateInput(endStr);

	if (!start || !end || start > end) {
		return {
			totalDays: 0,
			businessDays: 0,
			weekendDays: 0,
			holidayDays: 0,
			holidays: [],
			dateRangeValid: false,
		};
	}

	// Gather all holidays in the date range
	const years = new Set<number>();
	for (let y = start.getFullYear(); y <= end.getFullYear(); y++) {
		years.add(y);
	}

	const holidayMap = new Map<string, HolidayInfo>();
	for (const year of years) {
		const holidays = getAllHolidaysForYear(year, includeOptional);
		for (const h of holidays) {
			if (!holidayMap.has(h.date)) {
				holidayMap.set(h.date, h);
			}
		}
	}

	let totalDays = 0;
	let businessDays = 0;
	let weekendDays = 0;
	let holidayDays = 0;
	const encounteredHolidays: HolidayInfo[] = [];
	const seenHolidays = new Set<string>();

	const current = new Date(start);
	while (current <= end) {
		totalDays++;
		const dateStr = toDateInputString(current);
		const weekend = isWeekend(current);
		const holiday = holidayMap.get(dateStr);

		if (weekend) {
			weekendDays++;
		} else if (holiday) {
			holidayDays++;
			if (!seenHolidays.has(dateStr)) {
				seenHolidays.add(dateStr);
				encounteredHolidays.push(holiday);
			}
		} else {
			businessDays++;
		}

		current.setDate(current.getDate() + 1);
	}

	return {
		totalDays,
		businessDays,
		weekendDays,
		holidayDays,
		holidays: encounteredHolidays,
		dateRangeValid: true,
	};
}

/**
 * Calcula a data que está X dias úteis a partir de uma data inicial.
 */
export function addBusinessDays(
	startStr: string,
	businessDaysToAdd: number,
	includeOptional: boolean,
): { date: string; businessDaysUsed: number; totalDaysElapsed: number } | null {
	const start = parseDateInput(startStr);
	if (!start || businessDaysToAdd < 0) return null;

	const years = new Set<number>();
	for (let y = start.getFullYear(); y <= start.getFullYear() + 2; y++) {
		years.add(y);
	}

	const holidayMap = new Map<string, HolidayInfo>();
	for (const year of years) {
		const holidays = getAllHolidaysForYear(year, includeOptional);
		for (const h of holidays) {
			if (!holidayMap.has(h.date)) {
				holidayMap.set(h.date, h);
			}
		}
	}

	let businessDaysCounted = 0;
	let totalDaysElapsed = 0;
	const current = new Date(start);

	if (businessDaysToAdd === 0) {
		return {
			date: toDateInputString(current),
			businessDaysUsed: 0,
			totalDaysElapsed: 0,
		};
	}

	while (businessDaysCounted < businessDaysToAdd) {
		current.setDate(current.getDate() + 1);
		totalDaysElapsed++;
		const dateStr = toDateInputString(current);
		if (!isWeekend(current) && !holidayMap.has(dateStr)) {
			businessDaysCounted++;
		}
	}

	return {
		date: toDateInputString(current),
		businessDaysUsed: businessDaysCounted,
		totalDaysElapsed,
	};
}

export { formatFullDate, toDateInputString, parseDateInput };
