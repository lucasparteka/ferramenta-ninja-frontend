import { describe, expect, it } from "vitest";
import { calculateOvertime } from "./overtime";

describe("calculateOvertime", () => {
	it("10 HE 50% on R$ 2.200 / 220h = R$ 150", () => {
		const r = calculateOvertime({
			monthlySalary: 2200,
			weeklyHours: 44,
			hours50: 10,
			hours100: 0,
		});
		expect(r.hourlyRate).toBe(10);
		expect(r.overtime50Total).toBe(150);
		expect(r.total).toBe(150);
	});

	it("HE in 40h base uses 200h divisor", () => {
		const r = calculateOvertime({
			monthlySalary: 2000,
			weeklyHours: 40,
			hours50: 1,
			hours100: 0,
		});
		expect(r.hourlyRate).toBe(10);
		expect(r.overtime50Total).toBe(15);
	});

	it("only HE 100%", () => {
		const r = calculateOvertime({
			monthlySalary: 2200,
			weeklyHours: 44,
			hours50: 0,
			hours100: 4,
		});
		expect(r.overtime100Total).toBe(80);
		expect(r.total).toBe(80);
	});

	it("DSR reflex (5 rest days, 22 useful)", () => {
		const r = calculateOvertime({
			monthlySalary: 2200,
			weeklyHours: 44,
			hours50: 10,
			hours100: 0,
			includeDsr: true,
			usefulDays: 22,
			restDays: 5,
		});
		expect(r.dsr).toBeCloseTo(34.09, 1);
		expect(r.total).toBeCloseTo(184.09, 1);
	});

	it("no DSR when disabled", () => {
		const r = calculateOvertime({
			monthlySalary: 2200,
			weeklyHours: 44,
			hours50: 10,
			hours100: 0,
			includeDsr: false,
			usefulDays: 22,
			restDays: 5,
		});
		expect(r.dsr).toBe(0);
	});

	it("custom rate (60%)", () => {
		const r = calculateOvertime({
			monthlySalary: 2200,
			weeklyHours: 44,
			hours50: 0,
			hours100: 0,
			customRateHours: 5,
			customRatePercent: 60,
		});
		expect(r.customTotal).toBe(80);
	});
});
