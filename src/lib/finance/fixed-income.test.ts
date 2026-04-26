import { describe, expect, it } from "vitest";
import {
	calculateFixedIncome,
	iofRateForDays,
	irRateForDays,
} from "./fixed-income";

describe("irRateForDays", () => {
	it("regressive table per Lei 11.033/2004", () => {
		expect(irRateForDays(30)).toBe(0.225);
		expect(irRateForDays(180)).toBe(0.225);
		expect(irRateForDays(181)).toBe(0.2);
		expect(irRateForDays(360)).toBe(0.2);
		expect(irRateForDays(361)).toBe(0.175);
		expect(irRateForDays(720)).toBe(0.175);
		expect(irRateForDays(721)).toBe(0.15);
	});
});

describe("iofRateForDays", () => {
	it("zero from day 30", () => {
		expect(iofRateForDays(30)).toBe(0);
		expect(iofRateForDays(60)).toBe(0);
	});

	it("96% on day 1", () => {
		expect(iofRateForDays(1)).toBe(0.96);
	});

	it("decreases monotonically until day 29", () => {
		for (let d = 1; d < 29; d++) {
			expect(iofRateForDays(d)).toBeGreaterThan(iofRateForDays(d + 1));
		}
	});
});

describe("calculateFixedIncome", () => {
	it("CDB 100% CDI por 1 ano: IR 17.5%, sem IOF", () => {
		const r = calculateFixedIncome({
			principal: 10000,
			days: 365,
			annualIndexRate: 0.1,
			indexPercentage: 100,
			kind: "cdb",
			indexType: "cdi",
		});
		expect(r.iof).toBe(0);
		expect(r.irRate).toBe(0.175);
		expect(r.netFinal).toBeGreaterThan(10000);
		expect(r.netFinal).toBeLessThan(r.grossFinal);
	});

	it("LCI/LCA isento de IR e IOF", () => {
		const r = calculateFixedIncome({
			principal: 10000,
			days: 30,
			annualIndexRate: 0.1,
			indexPercentage: 95,
			kind: "lci-lca",
			indexType: "cdi",
		});
		expect(r.iof).toBe(0);
		expect(r.ir).toBe(0);
		expect(r.netYield).toBe(r.grossYield);
	});

	it("CDB com 15 dias paga IOF e IR 22.5%", () => {
		const r = calculateFixedIncome({
			principal: 10000,
			days: 15,
			annualIndexRate: 0.1,
			indexPercentage: 100,
			kind: "cdb",
			indexType: "cdi",
		});
		expect(r.iofRate).toBeGreaterThan(0);
		expect(r.irRate).toBe(0.225);
		expect(r.iof).toBeGreaterThan(0);
	});

	it("prefixado usa prefixedAnnualRate", () => {
		const r = calculateFixedIncome({
			principal: 10000,
			days: 365,
			annualIndexRate: 0,
			prefixedAnnualRate: 0.12,
			kind: "cdb",
			indexType: "prefixed",
		});
		expect(r.grossFinal).toBeGreaterThan(11000);
	});
});
