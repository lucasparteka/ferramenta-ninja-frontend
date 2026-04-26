import { describe, expect, it } from "vitest";
import {
	detectKind,
	modulo10,
	modulo11Banking,
	parseBoleto,
	sanitizeBoleto,
} from "./parse";

describe("sanitizeBoleto", () => {
	it("strips non-digits", () => {
		expect(sanitizeBoleto("00190.00009 02711.177007 00194.600000 4 12345678901")).toBe(
			"00190000090271117700700194600000412345678901",
		);
	});
});

describe("detectKind", () => {
	it("classifies by length", () => {
		expect(detectKind("0".repeat(47))).toBe("banking");
		expect(detectKind("0".repeat(48))).toBe("collection");
		expect(detectKind("0".repeat(40))).toBe("unknown");
	});
});

describe("modulo10", () => {
	it("returns DV from FEBRABAN example 001900000", () => {
		expect(modulo10("001900000")).toBe(9);
	});
});

describe("modulo11Banking", () => {
	it("returns 1 when result is 0/10/11", () => {
		expect(modulo11Banking("0")).toBe(1);
	});
});

describe("parseBoleto", () => {
	it("rejects wrong length", () => {
		const r = parseBoleto("123");
		expect(r.valid).toBe(false);
		expect(r.kind).toBe("unknown");
	});

	it("parses banking structure even when DVs invalid", () => {
		const line = "0".repeat(47);
		const r = parseBoleto(line);
		expect(r.kind).toBe("banking");
		if (r.kind !== "banking") return;
		expect(r.bankCode).toBe("000");
		expect(r.amount).toBe(0);
	});

	it("extracts amount and bank code from banking line", () => {
		const line = `2379338029${"0".repeat(27)}0000010000`;
		const padded = line.length === 47 ? line : line.padEnd(47, "0");
		const r = parseBoleto(padded);
		expect(r.kind).toBe("banking");
		if (r.kind !== "banking") return;
		expect(r.bankCode).toBe("237");
		expect(r.amount).toBe(100);
	});
});
