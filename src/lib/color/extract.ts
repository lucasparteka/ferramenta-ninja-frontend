import { rgbToHex, rgbToHsl } from "./palette";
import type { RGB } from "./palette";

export type ExtractedColor = {
	hex: string;
	rgb: RGB;
	hsl: { h: number; s: number; l: number };
};

function averageColor(pixels: RGB[]): RGB {
	if (pixels.length === 0) return { r: 0, g: 0, b: 0 };
	let r = 0;
	let g = 0;
	let b = 0;
	for (const p of pixels) {
		r += p.r;
		g += p.g;
		b += p.b;
	}
	const n = pixels.length;
	return { r: Math.round(r / n), g: Math.round(g / n), b: Math.round(b / n) };
}

function medianCut(pixels: RGB[], depth: number): RGB[] {
	if (depth === 0 || pixels.length === 0) {
		return [averageColor(pixels)];
	}

	let rMin = 255;
	let rMax = 0;
	let gMin = 255;
	let gMax = 0;
	let bMin = 255;
	let bMax = 0;

	for (const p of pixels) {
		if (p.r < rMin) rMin = p.r;
		if (p.r > rMax) rMax = p.r;
		if (p.g < gMin) gMin = p.g;
		if (p.g > gMax) gMax = p.g;
		if (p.b < bMin) bMin = p.b;
		if (p.b > bMax) bMax = p.b;
	}

	const rRange = rMax - rMin;
	const gRange = gMax - gMin;
	const bRange = bMax - bMin;

	let channel: "r" | "g" | "b";
	if (rRange >= gRange && rRange >= bRange) channel = "r";
	else if (gRange >= bRange) channel = "g";
	else channel = "b";

	const sorted = [...pixels].sort((a, b) => a[channel] - b[channel]);
	const mid = Math.floor(sorted.length / 2);

	return [
		...medianCut(sorted.slice(0, mid), depth - 1),
		...medianCut(sorted.slice(mid), depth - 1),
	];
}

function samplePixels(pixels: RGB[], maxSamples: number): RGB[] {
	if (pixels.length <= maxSamples) return pixels;
	const step = Math.floor(pixels.length / maxSamples);
	const result: RGB[] = [];
	for (let i = 0; i < pixels.length && result.length < maxSamples; i += step) {
		result.push(pixels[i]);
	}
	return result;
}

function toExtractedColor(rgb: RGB): ExtractedColor {
	return { hex: rgbToHex(rgb), rgb, hsl: rgbToHsl(rgb) };
}

export function extractColors(
	imageEl: HTMLImageElement,
	count: number,
): ExtractedColor[] {
	const MAX_DIM = 200;
	const scale = Math.min(
		1,
		MAX_DIM / Math.max(imageEl.naturalWidth, imageEl.naturalHeight),
	);
	const w = Math.max(1, Math.round(imageEl.naturalWidth * scale));
	const h = Math.max(1, Math.round(imageEl.naturalHeight * scale));

	const canvas = document.createElement("canvas");
	canvas.width = w;
	canvas.height = h;
	const ctx = canvas.getContext("2d");
	if (!ctx) return [];

	ctx.drawImage(imageEl, 0, 0, w, h);
	const { data } = ctx.getImageData(0, 0, w, h);

	const pixels: RGB[] = [];
	for (let i = 0; i < data.length; i += 4) {
		if (data[i + 3] < 128) continue;
		pixels.push({ r: data[i], g: data[i + 1], b: data[i + 2] });
	}

	if (pixels.length === 0) return [];

	const sampled = samplePixels(pixels, 10_000);
	const depth = Math.ceil(Math.log2(Math.max(count, 2)));
	const extracted = medianCut(sampled, depth).slice(0, count);

	return extracted.map(toExtractedColor).sort((a, b) => a.hsl.l - b.hsl.l);
}

export function pickPixelColor(
	canvas: HTMLCanvasElement,
	x: number,
	y: number,
): ExtractedColor {
	const ctx = canvas.getContext("2d");
	if (!ctx) return toExtractedColor({ r: 0, g: 0, b: 0 });
	const { data } = ctx.getImageData(
		Math.max(0, x),
		Math.max(0, y),
		1,
		1,
	);
	return toExtractedColor({ r: data[0], g: data[1], b: data[2] });
}
