import { hexToRgb, hslToHex, hslToRgb, rgbToHex, rgbToHsl } from "./palette";
import type { RGB } from "./palette";

export type WCAGLevel = "fail" | "AA" | "AAA";

export type ContrastResult = {
	ratio: number;
	normalAA: WCAGLevel;
	normalAAA: WCAGLevel;
	largeAA: WCAGLevel;
	largeAAA: WCAGLevel;
	uiComponents: WCAGLevel;
};

export type ColorBlindnessType =
	| "normal"
	| "protanopia"
	| "deuteranopia"
	| "tritanopia";

function linearize(c: number): number {
	const v = c / 255;
	return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
}

function relativeLuminance({ r, g, b }: RGB): number {
	return (
		0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b)
	);
}

function contrastRatio(l1: number, l2: number): number {
	const lighter = Math.max(l1, l2);
	const darker = Math.min(l1, l2);
	return (lighter + 0.05) / (darker + 0.05);
}

export function checkContrast(fg: string, bg: string): ContrastResult | null {
	const fgRgb = hexToRgb(fg);
	const bgRgb = hexToRgb(bg);
	if (!fgRgb || !bgRgb) return null;

	const fgL = relativeLuminance(fgRgb);
	const bgL = relativeLuminance(bgRgb);
	const ratio = Math.round(contrastRatio(fgL, bgL) * 100) / 100;

	return {
		ratio,
		normalAA: ratio >= 7.0 ? "AAA" : ratio >= 4.5 ? "AA" : "fail",
		normalAAA: ratio >= 7.0 ? "AAA" : "fail",
		largeAA: ratio >= 4.5 ? "AAA" : ratio >= 3.0 ? "AA" : "fail",
		largeAAA: ratio >= 4.5 ? "AAA" : "fail",
		uiComponents: ratio >= 3.0 ? "AA" : "fail",
	};
}

// Machado 2009 simplified LMS matrices for color blindness simulation
const BLINDNESS_MATRICES: Record<
	Exclude<ColorBlindnessType, "normal">,
	number[][]
> = {
	protanopia: [
		[0.567, 0.433, 0.0],
		[0.558, 0.442, 0.0],
		[0.0, 0.242, 0.758],
	],
	deuteranopia: [
		[0.625, 0.375, 0.0],
		[0.7, 0.3, 0.0],
		[0.0, 0.3, 0.7],
	],
	tritanopia: [
		[0.95, 0.05, 0.0],
		[0.0, 0.433, 0.567],
		[0.0, 0.475, 0.525],
	],
};

export function simulateColorBlindness(
	hex: string,
	type: ColorBlindnessType,
): string {
	if (type === "normal") return hex;
	const rgb = hexToRgb(hex);
	if (!rgb) return hex;

	const m = BLINDNESS_MATRICES[type];
	const r = Math.round(
		Math.min(255, Math.max(0, m[0][0] * rgb.r + m[0][1] * rgb.g + m[0][2] * rgb.b)),
	);
	const g = Math.round(
		Math.min(255, Math.max(0, m[1][0] * rgb.r + m[1][1] * rgb.g + m[1][2] * rgb.b)),
	);
	const b = Math.round(
		Math.min(255, Math.max(0, m[2][0] * rgb.r + m[2][1] * rgb.g + m[2][2] * rgb.b)),
	);
	return rgbToHex({ r, g, b });
}

export function suggestPassingColor(
	fg: string,
	bg: string,
	minRatio = 4.5,
): string | null {
	const fgRgb = hexToRgb(fg);
	const bgRgb = hexToRgb(bg);
	if (!fgRgb || !bgRgb) return null;

	const bgL = relativeLuminance(bgRgb);
	const fgHsl = rgbToHsl(fgRgb);

	// Try darkening first (toward 0), then lightening (toward 100)
	for (const direction of [-1, 1] as const) {
		const start = direction === -1 ? fgHsl.l - 1 : fgHsl.l + 1;
		const end = direction === -1 ? 0 : 100;

		for (let l = start; direction === -1 ? l >= end : l <= end; l += direction) {
			const candidate = hslToHex({ ...fgHsl, l });
			const candidateRgb = hexToRgb(candidate);
			if (!candidateRgb) continue;
			const candL = relativeLuminance(candidateRgb);
			if (contrastRatio(candL, bgL) >= minRatio) return candidate;
		}
	}

	return null;
}
