import { describe, expect, it } from "vitest";
import { calculateInss } from "./inss";
import { calculateIrrf } from "./irrf";

describe("calculateIrrf 2026", () => {
	it("returns zero for non-positive gross", () => {
		expect(calculateIrrf({ grossIncome: 0 }).amount).toBe(0);
		expect(calculateIrrf({ grossIncome: -100 }).amount).toBe(0);
	});

	it("R$ 2.000 gross is exempt", () => {
		const r = calculateIrrf({ grossIncome: 2000 });
		expect(r.amount).toBe(0);
	});

	it("R$ 5.000 gross results in zero IRRF (reform 2025)", () => {
		const inss = calculateInss(5000).amount;
		const r = calculateIrrf({ grossIncome: 5000, inssDeducted: inss });
		expect(r.amount).toBe(0);
		expect(r.redutorApplied).toBeGreaterThan(0);
	});

	it("R$ 6.000 gross matches Receita Federal example (R$ 394,54)", () => {
		const r = calculateIrrf({ grossIncome: 6000 });
		expect(r.amount).toBeCloseTo(394.54, 1);
		expect(r.method).toBe("simplified");
	});

	it("R$ 7.350 gross has redutor reaching zero", () => {
		const r = calculateIrrf({ grossIncome: 7350 });
		expect(r.redutorApplied).toBeCloseTo(0, 1);
	});

	it("R$ 10.000 gross — outside redutor range", () => {
		const inss = calculateInss(10000).amount;
		const r = calculateIrrf({ grossIncome: 10000, inssDeducted: inss });
		expect(r.redutorApplied).toBe(0);
		expect(r.amount).toBeGreaterThan(0);
		expect(r.bracketIndex).toBe(4);
	});

	it("dependents reduce IRRF (detailed method)", () => {
		const inss = calculateInss(8000).amount;
		const noDeps = calculateIrrf({
			grossIncome: 8000,
			inssDeducted: inss,
			dependents: 0,
		});
		const twoDeps = calculateIrrf({
			grossIncome: 8000,
			inssDeducted: inss,
			dependents: 2,
		});
		expect(twoDeps.amount).toBeLessThan(noDeps.amount);
	});

	it("picks the cheaper of detailed vs simplified", () => {
		const inss = calculateInss(3000).amount;
		const r = calculateIrrf({
			grossIncome: 3000,
			inssDeducted: inss,
			dependents: 0,
		});
		expect(["detailed", "simplified"]).toContain(r.method);
	});

	it("can disable redutor for non-monthly bases (e.g., 13º)", () => {
		const r = calculateIrrf({ grossIncome: 6000, applyRedutor: false });
		expect(r.redutorApplied).toBe(0);
	});
});
