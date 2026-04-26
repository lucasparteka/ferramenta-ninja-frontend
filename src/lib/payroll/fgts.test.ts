import { describe, expect, it } from "vitest";
import {
	calculateFgtsDeposit,
	calculateFgtsFine,
	fgtsWithdrawableShare,
} from "./fgts";

describe("FGTS", () => {
	it("8% deposit on R$ 3.000 = R$ 240", () => {
		expect(calculateFgtsDeposit(3000)).toBe(240);
	});

	it("zero deposit on non-positive base", () => {
		expect(calculateFgtsDeposit(0)).toBe(0);
		expect(calculateFgtsDeposit(-1)).toBe(0);
	});

	it("40% fine on no-cause termination", () => {
		expect(calculateFgtsFine(10000, "no-cause")).toBe(4000);
	});

	it("20% fine on agreement termination", () => {
		expect(calculateFgtsFine(10000, "agreement")).toBe(2000);
	});

	it("0 fine on with-cause / resignation / contract-end", () => {
		expect(calculateFgtsFine(10000, "with-cause")).toBe(0);
		expect(calculateFgtsFine(10000, "resignation")).toBe(0);
		expect(calculateFgtsFine(10000, "contract-end")).toBe(0);
	});

	it("withdrawable share by type", () => {
		expect(fgtsWithdrawableShare("no-cause")).toBe(1);
		expect(fgtsWithdrawableShare("agreement")).toBe(0.8);
		expect(fgtsWithdrawableShare("with-cause")).toBe(0);
		expect(fgtsWithdrawableShare("resignation")).toBe(0);
	});
});
