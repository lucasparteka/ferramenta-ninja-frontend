import { describe, expect, it } from "vitest";
import { calculateChristmasBonus } from "./christmas-bonus";

describe("calculateChristmasBonus", () => {
	it("12 months full bonus = 1 salary gross", () => {
		const r = calculateChristmasBonus({
			monthlySalary: 3000,
			monthsWorked: 12,
		});
		expect(r.grossBonus).toBe(3000);
		expect(r.avos).toBe(12);
	});

	it("6 months = half salary", () => {
		const r = calculateChristmasBonus({
			monthlySalary: 3000,
			monthsWorked: 6,
		});
		expect(r.grossBonus).toBe(1500);
	});

	it("first installment is half of gross", () => {
		const r = calculateChristmasBonus({
			monthlySalary: 4000,
			monthsWorked: 12,
		});
		expect(r.firstInstallment).toBe(2000);
	});

	it("second installment = gross - first - INSS - IRRF", () => {
		const r = calculateChristmasBonus({
			monthlySalary: 4000,
			monthsWorked: 12,
		});
		expect(round2(r.firstInstallment + r.secondInstallment + r.inss + r.irrf)).toBe(
			r.grossBonus,
		);
	});

	it("R$ 2.000 isento de IRRF", () => {
		const r = calculateChristmasBonus({
			monthlySalary: 2000,
			monthsWorked: 12,
		});
		expect(r.irrf).toBe(0);
	});

	it("13º não aplica redutor (não é salário mensal)", () => {
		const r = calculateChristmasBonus({
			monthlySalary: 6000,
			monthsWorked: 12,
		});
		expect(r.irrf).toBeGreaterThan(0);
	});

	it("zero months = zero bonus", () => {
		const r = calculateChristmasBonus({
			monthlySalary: 3000,
			monthsWorked: 0,
		});
		expect(r.grossBonus).toBe(0);
		expect(r.netTotal).toBe(0);
	});

	it("dependents reduce IRRF", () => {
		const noDeps = calculateChristmasBonus({
			monthlySalary: 5000,
			monthsWorked: 12,
		});
		const twoDeps = calculateChristmasBonus({
			monthlySalary: 5000,
			monthsWorked: 12,
			dependents: 2,
		});
		expect(twoDeps.irrf).toBeLessThanOrEqual(noDeps.irrf);
	});

	it("includes average additional in base", () => {
		const r = calculateChristmasBonus({
			monthlySalary: 3000,
			monthsWorked: 12,
			averageAdditional: 500,
		});
		expect(r.grossBonus).toBe(3500);
	});

	it("default firstInstallmentTiming = november", () => {
		const r = calculateChristmasBonus({
			monthlySalary: 3000,
			monthsWorked: 12,
		});
		expect(r.firstInstallmentTiming).toBe("november");
		expect(r.firstInstallmentDueLabel).toMatch(/30 de novembro/);
	});

	it("adiantamento nas férias mantém valores e troca o due label (Lei 4.749 art. 2º §2º)", () => {
		const november = calculateChristmasBonus({
			monthlySalary: 3000,
			monthsWorked: 12,
		});
		const onVacation = calculateChristmasBonus({
			monthlySalary: 3000,
			monthsWorked: 12,
			firstInstallmentTiming: "vacation",
		});
		expect(onVacation.firstInstallment).toBe(november.firstInstallment);
		expect(onVacation.grossBonus).toBe(november.grossBonus);
		expect(onVacation.netTotal).toBe(november.netTotal);
		expect(onVacation.firstInstallmentTiming).toBe("vacation");
		expect(onVacation.firstInstallmentDueLabel).toMatch(/férias/);
	});
});

function round2(value: number): number {
	return Math.round(value * 100) / 100;
}
