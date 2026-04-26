import { describe, expect, it } from "vitest";
import { calculateInss, INSS_CEILING_2026 } from "./inss";

describe("calculateInss 2026", () => {
	it("returns zero for non-positive base", () => {
		expect(calculateInss(0).amount).toBe(0);
		expect(calculateInss(-100).amount).toBe(0);
	});

	it("applies 7.5% to first bracket only", () => {
		const r = calculateInss(1500);
		expect(r.amount).toBeCloseTo(112.5, 2);
		expect(r.bracketIndex).toBe(0);
	});

	it("crosses bracket 1 -> 2 progressively at R$ 2.000", () => {
		const r = calculateInss(2000);
		const expected = 1621 * 0.075 + (2000 - 1621) * 0.09;
		expect(r.amount).toBeCloseTo(expected, 2);
		expect(r.bracketIndex).toBe(1);
	});

	it("crosses three brackets at R$ 4.000", () => {
		const r = calculateInss(4000);
		const expected =
			1621 * 0.075 + (2902.84 - 1621) * 0.09 + (4000 - 2902.84) * 0.12;
		expect(r.amount).toBeCloseTo(expected, 2);
		expect(r.bracketIndex).toBe(2);
	});

	it("applies max INSS at ceiling R$ 8.475,55", () => {
		const r = calculateInss(INSS_CEILING_2026);
		const expected =
			1621 * 0.075 +
			(2902.84 - 1621) * 0.09 +
			(4354.27 - 2902.84) * 0.12 +
			(8475.55 - 4354.27) * 0.14;
		expect(r.amount).toBeCloseTo(expected, 2);
	});

	it("caps base above ceiling", () => {
		const atCeiling = calculateInss(INSS_CEILING_2026).amount;
		const above = calculateInss(20000).amount;
		expect(above).toBeCloseTo(atCeiling, 2);
	});

	it("computes effective rate", () => {
		const r = calculateInss(3000);
		expect(r.effectiveRate).toBeGreaterThan(0.075);
		expect(r.effectiveRate).toBeLessThan(0.12);
	});
});
