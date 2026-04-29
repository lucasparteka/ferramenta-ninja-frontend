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
