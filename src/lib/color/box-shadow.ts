export type ShadowLayer = {
	id: string;
	offsetX: number;
	offsetY: number;
	blur: number;
	spread: number;
	color: string;
	opacity: number;
	inset: boolean;
};

let _id = 0;
export function generateLayerId(): string {
	return `layer-${++_id}`;
}

export function createDefaultLayer(): ShadowLayer {
	return {
		id: generateLayerId(),
		offsetX: 0,
		offsetY: 4,
		blur: 6,
		spread: -1,
		color: "#000000",
		opacity: 10,
		inset: false,
	};
}

function hexToRgba(hex: string, opacityPercent: number): string {
	const clean = hex.replace("#", "");
	const bigint = Number.parseInt(clean, 16);
	const r = (bigint >> 16) & 255;
	const g = (bigint >> 8) & 255;
	const b = bigint & 255;
	const a = Math.round((opacityPercent / 100) * 1000) / 1000;
	return `rgba(${r}, ${g}, ${b}, ${a})`;
}

export function buildLayerCSS(layer: ShadowLayer): string {
	const { offsetX, offsetY, blur, spread, color, opacity, inset } = layer;
	const rgba = hexToRgba(color, opacity);
	return `${inset ? "inset " : ""}${offsetX}px ${offsetY}px ${blur}px ${spread}px ${rgba}`;
}

export function buildAllShadowsCSS(layers: ShadowLayer[]): string {
	return layers.map(buildLayerCSS).join(", ");
}

export const PRESETS: { name: string; layers: ShadowLayer[] }[] = [
	{
		name: "Sombra Suave",
		layers: [
			{
				id: generateLayerId(),
				offsetX: 0,
				offsetY: 4,
				blur: 6,
				spread: -1,
				color: "#000000",
				opacity: 10,
				inset: false,
			},
		],
	},
	{
		name: "Sombra Média",
		layers: [
			{
				id: generateLayerId(),
				offsetX: 0,
				offsetY: 10,
				blur: 15,
				spread: -3,
				color: "#000000",
				opacity: 15,
				inset: false,
			},
		],
	},
	{
		name: "Sombra Forte",
		layers: [
			{
				id: generateLayerId(),
				offsetX: 0,
				offsetY: 20,
				blur: 25,
				spread: -5,
				color: "#000000",
				opacity: 25,
				inset: false,
			},
		],
	},
	{
		name: "Card Elevado",
		layers: [
			{
				id: generateLayerId(),
				offsetX: 0,
				offsetY: 1,
				blur: 3,
				spread: 0,
				color: "#000000",
				opacity: 12,
				inset: false,
			},
			{
				id: generateLayerId(),
				offsetX: 0,
				offsetY: 8,
				blur: 16,
				spread: -9,
				color: "#000000",
				opacity: 16,
				inset: false,
			},
		],
	},
	{
		name: "Sombra Interna",
		layers: [
			{
				id: generateLayerId(),
				offsetX: 0,
				offsetY: 2,
				blur: 4,
				spread: 0,
				color: "#000000",
				opacity: 15,
				inset: true,
			},
		],
	},
	{
		name: "Efeito Neon",
		layers: [
			{
				id: generateLayerId(),
				offsetX: 0,
				offsetY: 0,
				blur: 15,
				spread: 5,
				color: "#3b82f6",
				opacity: 100,
				inset: false,
			},
		],
	},
	{
		name: "Sombra Colorida",
		layers: [
			{
				id: generateLayerId(),
				offsetX: 5,
				offsetY: 5,
				blur: 0,
				spread: 0,
				color: "#ef4444",
				opacity: 100,
				inset: false,
			},
		],
	},
];
