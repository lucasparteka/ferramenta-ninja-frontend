// Jornada CLT — art. 7º XIII CF + CLT art. 58
// 44h semana padrão = 220h mensais; 40h semana = 200h mensais (divisor convencional).

export const MONTHLY_HOURS_44H = 220;
export const MONTHLY_HOURS_40H = 200;
export const MONTHLY_HOURS_36H = 180;
export const MONTHLY_HOURS_30H = 150;

export type WeeklyHours = 30 | 36 | 40 | 44;

export function monthlyHoursForWeekly(weekly: WeeklyHours): number {
	if (weekly === 44) return MONTHLY_HOURS_44H;
	if (weekly === 40) return MONTHLY_HOURS_40H;
	if (weekly === 36) return MONTHLY_HOURS_36H;
	return MONTHLY_HOURS_30H;
}

export function hourlyRate(monthlySalary: number, monthlyHours: number): number {
	if (monthlyHours <= 0) return 0;
	return monthlySalary / monthlyHours;
}
