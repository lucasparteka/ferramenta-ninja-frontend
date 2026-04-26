import { describe, expect, it } from "vitest";
import {
	calculateVacation,
	entitledVacationDays,
	maxAbonoDays,
	MIN_VACATION_PERIOD_DAYS,
} from "./vacation";

describe("entitledVacationDays", () => {
	it("CLT 130 brackets", () => {
		expect(entitledVacationDays(0)).toBe(30);
		expect(entitledVacationDays(5)).toBe(30);
		expect(entitledVacationDays(6)).toBe(24);
		expect(entitledVacationDays(14)).toBe(24);
		expect(entitledVacationDays(15)).toBe(18);
		expect(entitledVacationDays(23)).toBe(18);
		expect(entitledVacationDays(24)).toBe(12);
		expect(entitledVacationDays(32)).toBe(12);
		expect(entitledVacationDays(33)).toBe(0);
	});
});

describe("maxAbonoDays (CLT 143 — 1/3 do direito)", () => {
	it("calcula 1/3 floor dos dias direito", () => {
		expect(maxAbonoDays(30)).toBe(10);
		expect(maxAbonoDays(24)).toBe(8);
		expect(maxAbonoDays(18)).toBe(6);
		expect(maxAbonoDays(12)).toBe(4);
		expect(maxAbonoDays(0)).toBe(0);
	});
});

describe("calculateVacation", () => {
	it("integral 12 months, 0 absences, R$ 3.000", () => {
		const r = calculateVacation({
			monthlySalary: 3000,
			monthsAtCompany: 12,
		});
		expect(r.entitledDays).toBe(30);
		expect(r.vacationDaysTaken).toBe(30);
		expect(r.vacationBase).toBe(3000);
		expect(r.oneThirdBonus).toBe(1000);
		expect(r.taxableAmount).toBe(4000);
	});

	it("integral with 8 absences = 24 days, abono = 8 dias", () => {
		const r = calculateVacation({
			monthlySalary: 3000,
			monthsAtCompany: 12,
			unjustifiedAbsences: 8,
			sellAbono: true,
		});
		expect(r.entitledDays).toBe(24);
		expect(r.abonoDays).toBe(8);
		expect(r.vacationDaysTaken).toBe(16);
	});

	it("proportional 6 months", () => {
		const r = calculateVacation({
			monthlySalary: 3000,
			monthsAtCompany: 6,
		});
		expect(r.entitledDays).toBe(15);
		expect(r.vacationBase).toBe(1500);
	});

	it("abono pecuniário (sells 10 days)", () => {
		const r = calculateVacation({
			monthlySalary: 3000,
			monthsAtCompany: 12,
			sellAbono: true,
		});
		expect(r.abonoDays).toBe(10);
		expect(r.vacationDaysTaken).toBe(20);
		expect(r.abonoPecuniario).toBe(1000);
		expect(r.abonoOneThird).toBeCloseTo(333.33, 2);
	});

	it("R$ 2.000 isento de IRRF", () => {
		const r = calculateVacation({
			monthlySalary: 2000,
			monthsAtCompany: 12,
		});
		expect(r.irrf).toBe(0);
	});

	it("R$ 6.000 sem aplicar redutor (não é mensal)", () => {
		const r = calculateVacation({
			monthlySalary: 6000,
			monthsAtCompany: 12,
		});
		expect(r.irrf).toBeGreaterThan(0);
	});

	it("33+ absences perde direito", () => {
		const r = calculateVacation({
			monthlySalary: 3000,
			monthsAtCompany: 12,
			unjustifiedAbsences: 33,
		});
		expect(r.entitledDays).toBe(0);
		expect(r.netAmount).toBe(0);
	});

	it("dependents reduce IRRF", () => {
		const noDeps = calculateVacation({
			monthlySalary: 5000,
			monthsAtCompany: 12,
		});
		const twoDeps = calculateVacation({
			monthlySalary: 5000,
			monthsAtCompany: 12,
			dependents: 2,
		});
		expect(twoDeps.irrf).toBeLessThanOrEqual(noDeps.irrf);
	});

	it("abono não tributa (Súmula 328)", () => {
		const noAbono = calculateVacation({
			monthlySalary: 5000,
			monthsAtCompany: 12,
		});
		const withAbono = calculateVacation({
			monthlySalary: 5000,
			monthsAtCompany: 12,
			sellAbono: true,
		});
		expect(withAbono.inss).toBeLessThan(noAbono.inss);
		expect(withAbono.irrf).toBeLessThanOrEqual(noAbono.irrf);
	});

	it("daysToTake reduz proporcionalmente o valor (CLT 134 §1)", () => {
		const r = calculateVacation({
			monthlySalary: 3000,
			monthsAtCompany: 12,
			daysToTake: 15,
		});
		expect(r.vacationDaysTaken).toBe(15);
		expect(r.vacationBase).toBe(1500);
		expect(r.oneThirdBonus).toBe(500);
	});

	it("daysToTake mínimo 5 dias por período (CLT 134 §1)", () => {
		const r = calculateVacation({
			monthlySalary: 3000,
			monthsAtCompany: 12,
			daysToTake: 3,
		});
		expect(r.validationError).toBe("days-below-minimum");
		expect(r.vacationDaysTaken).toBe(MIN_VACATION_PERIOD_DAYS);
	});

	it("daysToTake = total disponível mesmo abaixo de 5 é permitido", () => {
		const r = calculateVacation({
			monthlySalary: 3000,
			monthsAtCompany: 1,
			daysToTake: 3,
		});
		expect(r.entitledDays).toBe(3);
		expect(r.validationError).toBeUndefined();
		expect(r.vacationDaysTaken).toBe(3);
	});

	it("daysToTake além do disponível reporta erro", () => {
		const r = calculateVacation({
			monthlySalary: 3000,
			monthsAtCompany: 12,
			sellAbono: true,
			daysToTake: 25,
		});
		expect(r.availableForVacation).toBe(20);
		expect(r.validationError).toBe("days-exceed-available");
		expect(r.vacationDaysTaken).toBe(20);
	});

	it("daysToTake omitido usa availableForVacation por padrão", () => {
		const r = calculateVacation({
			monthlySalary: 3000,
			monthsAtCompany: 12,
			sellAbono: true,
		});
		expect(r.vacationDaysTaken).toBe(20);
	});
});
