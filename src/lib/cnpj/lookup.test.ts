import { describe, expect, it } from "vitest";
import { formatCnpjMask, sanitizeCnpj } from "./lookup";

describe("sanitizeCnpj", () => {
	it("strips non-digits", () => {
		expect(sanitizeCnpj("12.345.678/0001-90")).toBe("12345678000190");
	});

	it("caps at 14 digits", () => {
		expect(sanitizeCnpj("12345678000190123456")).toHaveLength(14);
	});

	it("returns empty for input without digits", () => {
		expect(sanitizeCnpj("abc-/.")).toBe("");
	});
});

describe("formatCnpjMask", () => {
	it("masks progressively", () => {
		expect(formatCnpjMask("12")).toBe("12");
		expect(formatCnpjMask("123")).toBe("12.3");
		expect(formatCnpjMask("12345")).toBe("12.345");
		expect(formatCnpjMask("12345678")).toBe("12.345.678");
		expect(formatCnpjMask("123456780001")).toBe("12.345.678/0001");
		expect(formatCnpjMask("12345678000190")).toBe("12.345.678/0001-90");
	});

	it("ignores non-digit input", () => {
		expect(formatCnpjMask("ab12.345cd")).toBe("12.345");
	});
});
