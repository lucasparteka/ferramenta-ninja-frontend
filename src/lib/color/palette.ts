export type HSL = { h: number; s: number; l: number };
export type RGB = { r: number; g: number; b: number };

export function hexToRgb(hex: string): RGB | null {
	const cleaned = hex.replace("#", "");
	if (!/^[0-9A-Fa-f]{6}$/.test(cleaned)) return null;
	const bigint = Number.parseInt(cleaned, 16);
	return {
		r: (bigint >> 16) & 255,
		g: (bigint >> 8) & 255,
		b: bigint & 255,
	};
}

export function rgbToHex({ r, g, b }: RGB): string {
	const toHex = (n: number) => n.toString(16).padStart(2, "0");
	return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function rgbToHsl({ r, g, b }: RGB): HSL {
	const rNorm = r / 255;
	const gNorm = g / 255;
	const bNorm = b / 255;
	const max = Math.max(rNorm, gNorm, bNorm);
	const min = Math.min(rNorm, gNorm, bNorm);
	let h = 0;
	let s = 0;
	const l = (max + min) / 2;

	if (max !== min) {
		const d = max - min;
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
		switch (max) {
			case rNorm:
				h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0);
				break;
			case gNorm:
				h = (bNorm - rNorm) / d + 2;
				break;
			case bNorm:
				h = (rNorm - gNorm) / d + 4;
				break;
		}
		h /= 6;
	}

	return {
		h: Math.round(h * 360),
		s: Math.round(s * 100),
		l: Math.round(l * 100),
	};
}

export function hslToRgb({ h, s, l }: HSL): RGB {
	const hue = h / 360;
	const sat = s / 100;
	const light = l / 100;
	let r: number;
	let g: number;
	let b: number;

	if (sat === 0) {
		r = g = b = light;
	} else {
		const hue2rgb = (p: number, q: number, t: number) => {
			if (t < 0) t += 1;
			if (t > 1) t -= 1;
			if (t < 1 / 6) return p + (q - p) * 6 * t;
			if (t < 1 / 2) return q;
			if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
			return p;
		};
		const q = light < 0.5 ? light * (1 + sat) : light + sat - light * sat;
		const p = 2 * light - q;
		r = hue2rgb(p, q, hue + 1 / 3);
		g = hue2rgb(p, q, hue);
		b = hue2rgb(p, q, hue - 1 / 3);
	}

	return {
		r: Math.round(r * 255),
		g: Math.round(g * 255),
		b: Math.round(b * 255),
	};
}

export function hexToHsl(hex: string): HSL | null {
	const rgb = hexToRgb(hex);
	return rgb ? rgbToHsl(rgb) : null;
}

export function hslToHex(hsl: HSL): string {
	return rgbToHex(hslToRgb(hsl));
}

export function generateComplementary(base: HSL): HSL[] {
	return [base, { ...base, h: (base.h + 180) % 360 }];
}

export function generateAnalogous(base: HSL): HSL[] {
	return [
		{ ...base, h: (base.h - 30 + 360) % 360 },
		base,
		{ ...base, h: (base.h + 30) % 360 },
	];
}

export function generateTriadic(base: HSL): HSL[] {
	return [
		base,
		{ ...base, h: (base.h + 120) % 360 },
		{ ...base, h: (base.h + 240) % 360 },
	];
}

export function generateMonochromatic(base: HSL): HSL[] {
	return [
		{ ...base, l: Math.max(10, base.l - 30) },
		{ ...base, l: Math.max(10, base.l - 15) },
		base,
		{ ...base, l: Math.min(90, base.l + 15) },
		{ ...base, l: Math.min(90, base.l + 30) },
	];
}

export function generatePalette(
	type: "complementary" | "analogous" | "triadic" | "monochromatic",
	baseHex: string,
): string[] {
	const base = hexToHsl(baseHex);
	if (!base) return [];
	let hsls: HSL[];
	switch (type) {
		case "complementary":
			hsls = generateComplementary(base);
			break;
		case "analogous":
			hsls = generateAnalogous(base);
			break;
		case "triadic":
			hsls = generateTriadic(base);
			break;
		case "monochromatic":
			hsls = generateMonochromatic(base);
			break;
	}
	return hsls.map(hslToHex);
}

export type OKLCH = { l: number; c: number; h: number };

function linearize(v: number): number {
	return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
}

export function rgbToOklch({ r, g, b }: RGB): OKLCH {
	const lr = linearize(r / 255);
	const lg = linearize(g / 255);
	const lb = linearize(b / 255);

	const x = 0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb;
	const y = 0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb;
	const z = 0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb;

	const l_ = Math.cbrt(0.8189330101 * x + 0.3618667424 * y - 0.1288597137 * z);
	const m_ = Math.cbrt(0.0329845436 * x + 0.9293118715 * y + 0.0361456387 * z);
	const s_ = Math.cbrt(0.0482003018 * x + 0.2643662691 * y + 0.6300380129 * z);

	const L = 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_;
	const a = 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_;
	const bk = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_;

	const C = Math.sqrt(a * a + bk * bk);
	const H = (Math.atan2(bk, a) * 180) / Math.PI;

	return {
		l: Math.round(L * 1000) / 1000,
		c: Math.round(C * 1000) / 1000,
		h: Math.round(((H % 360) + 360) % 360),
	};
}

export function hexToOklch(hex: string): OKLCH | null {
	const rgb = hexToRgb(hex);
	return rgb ? rgbToOklch(rgb) : null;
}
