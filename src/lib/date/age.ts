export type AgeBreakdown = {
	years: number;
	months: number;
	days: number;
	totalDays: number;
	totalWeeks: number;
	totalHours: number;
	totalMinutes: number;
	nextBirthday: { date: Date; daysUntil: number } | null;
};

const MS_PER_DAY = 86_400_000;

function startOfDay(date: Date): Date {
	const d = new Date(date);
	d.setHours(0, 0, 0, 0);
	return d;
}

export function diffYearsMonthsDays(
	from: Date,
	to: Date,
): { years: number; months: number; days: number } {
	let years = to.getFullYear() - from.getFullYear();
	let months = to.getMonth() - from.getMonth();
	let days = to.getDate() - from.getDate();

	if (days < 0) {
		months -= 1;
		const prevMonth = new Date(to.getFullYear(), to.getMonth(), 0);
		days += prevMonth.getDate();
	}
	if (months < 0) {
		years -= 1;
		months += 12;
	}
	return { years, months, days };
}

export function calculateAge(birth: Date, reference: Date = new Date()): AgeBreakdown {
	const from = startOfDay(birth);
	const to = startOfDay(reference);
	if (from.getTime() > to.getTime()) {
		throw new Error("Data de nascimento deve ser anterior à data de referência");
	}

	const { years, months, days } = diffYearsMonthsDays(from, to);
	const totalMs = to.getTime() - from.getTime();
	const totalDays = Math.floor(totalMs / MS_PER_DAY);

	let nextBirthday: AgeBreakdown["nextBirthday"] = null;
	const thisYear = new Date(
		to.getFullYear(),
		from.getMonth(),
		from.getDate(),
	);
	const nextDate =
		thisYear.getTime() >= to.getTime()
			? thisYear
			: new Date(to.getFullYear() + 1, from.getMonth(), from.getDate());
	const daysUntil = Math.ceil((nextDate.getTime() - to.getTime()) / MS_PER_DAY);
	nextBirthday = { date: nextDate, daysUntil };

	return {
		years,
		months,
		days,
		totalDays,
		totalWeeks: Math.floor(totalDays / 7),
		totalHours: totalDays * 24,
		totalMinutes: totalDays * 24 * 60,
		nextBirthday,
	};
}

export function dateDiff(
	start: Date,
	end: Date,
): { years: number; months: number; days: number; totalDays: number } {
	const from = startOfDay(start);
	const to = startOfDay(end);
	const reverse = from.getTime() > to.getTime();
	const a = reverse ? to : from;
	const b = reverse ? from : to;
	const ymd = diffYearsMonthsDays(a, b);
	const totalDays = Math.floor((b.getTime() - a.getTime()) / MS_PER_DAY);
	return { ...ymd, totalDays };
}
