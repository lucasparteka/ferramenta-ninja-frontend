import { describe, expect, it } from "vitest";
import { calculateAmortization } from "./amortization";

describe("SAC", () => {
	it("amortização constante", () => {
		const r = calculateAmortization({
			principal: 12000,
			annualRate: 0.12,
			months: 12,
			system: "sac",
		});
		expect(r.schedule).toHaveLength(12);
		const amorts = r.schedule.map((e) => e.amortization);
		expect(Math.max(...amorts) - Math.min(...amorts)).toBeLessThan(0.05);
		expect(r.firstPayment).toBeGreaterThan(r.lastPayment);
		expect(r.schedule[11].balance).toBeCloseTo(0, 1);
	});

	it("zero juros: payment = principal/n", () => {
		const r = calculateAmortization({
			principal: 1200,
			annualRate: 0,
			months: 12,
			system: "sac",
		});
		expect(r.firstPayment).toBeCloseTo(100, 2);
		expect(r.totalInterest).toBe(0);
		expect(r.totalPaid).toBeCloseTo(1200, 2);
	});
});

describe("Price", () => {
	it("parcela fixa", () => {
		const r = calculateAmortization({
			principal: 12000,
			annualRate: 0.12,
			months: 12,
			system: "price",
		});
		const payments = r.schedule.map((e) => e.payment);
		expect(Math.max(...payments) - Math.min(...payments)).toBeLessThan(0.05);
		expect(r.schedule[11].balance).toBeCloseTo(0, 1);
	});

	it("Price total > SAC total para mesmo principal/taxa/prazo", () => {
		const base = {
			principal: 100000,
			annualRate: 0.12,
			months: 60,
		} as const;
		const sac = calculateAmortization({ ...base, system: "sac" });
		const price = calculateAmortization({ ...base, system: "price" });
		expect(price.totalInterest).toBeGreaterThan(sac.totalInterest);
	});

	it("zero juros: payment = principal/n", () => {
		const r = calculateAmortization({
			principal: 1200,
			annualRate: 0,
			months: 12,
			system: "price",
		});
		expect(r.firstPayment).toBeCloseTo(100, 2);
		expect(r.totalInterest).toBe(0);
	});
});
