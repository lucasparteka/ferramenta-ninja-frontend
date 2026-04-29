import { describe, expect, it } from "vitest";
import {
	annualToMonthlyRate,
	calculateCompoundInterest,
} from "./compound-interest";

describe("annualToMonthlyRate", () => {
	it("converts 12% annual to ~0.9489% monthly", () => {
		const r = annualToMonthlyRate(0.12);
		expect(r).toBeCloseTo(0.009489, 5);
	});

	it("zero rate returns zero", () => {
		expect(annualToMonthlyRate(0)).toBe(0);
	});
});

describe("calculateCompoundInterest", () => {
	it("compounds without contributions", () => {
		const r = calculateCompoundInterest({
			principal: 1000,
			monthlyContribution: 0,
			annualRate: 0.12,
			months: 12,
		});
		expect(r.finalBalance).toBeCloseTo(1120, 0);
		expect(r.totalInvested).toBe(1000);
		expect(r.totalInterest).toBeCloseTo(120, 0);
	});

	it("zero rate yields total invested", () => {
		const r = calculateCompoundInterest({
			principal: 100,
			monthlyContribution: 50,
			annualRate: 0,
			months: 10,
		});
		expect(r.finalBalance).toBe(600);
		expect(r.totalInterest).toBe(0);
	});

	it("returns schedule with N entries", () => {
		const r = calculateCompoundInterest({
			principal: 0,
			monthlyContribution: 100,
			annualRate: 0.06,
			months: 6,
		});
		expect(r.schedule).toHaveLength(6);
		expect(r.schedule[5].month).toBe(6);
	});

	it("annuity-due yields more than annuity-end", () => {
		const base = {
			principal: 0,
			monthlyContribution: 100,
			annualRate: 0.12,
			months: 12,
		};
		const begin = calculateCompoundInterest({
			...base,
			contributionTiming: "begin",
		});
		const end = calculateCompoundInterest({
			...base,
			contributionTiming: "end",
		});
		expect(begin.finalBalance).toBeGreaterThan(end.finalBalance);
	});
});
