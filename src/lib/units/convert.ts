export type UnitCategoryId =
	| "length"
	| "mass"
	| "volume"
	| "area"
	| "time"
	| "temperature"
	| "speed"
	| "data";

export type UnitDef = {
	id: string;
	label: string;
	factor: number;
};

export type UnitCategory = {
	id: UnitCategoryId;
	label: string;
	baseLabel: string;
	units: UnitDef[];
};

export const UNIT_CATEGORIES: UnitCategory[] = [
	{
		id: "length",
		label: "Comprimento",
		baseLabel: "metro",
		units: [
			{ id: "mm", label: "Milímetro (mm)", factor: 0.001 },
			{ id: "cm", label: "Centímetro (cm)", factor: 0.01 },
			{ id: "m", label: "Metro (m)", factor: 1 },
			{ id: "km", label: "Quilômetro (km)", factor: 1000 },
			{ id: "in", label: "Polegada (in)", factor: 0.0254 },
			{ id: "ft", label: "Pé (ft)", factor: 0.3048 },
			{ id: "yd", label: "Jarda (yd)", factor: 0.9144 },
			{ id: "mi", label: "Milha (mi)", factor: 1609.344 },
			{ id: "nmi", label: "Milha náutica (nmi)", factor: 1852 },
		],
	},
	{
		id: "mass",
		label: "Massa",
		baseLabel: "grama",
		units: [
			{ id: "mg", label: "Miligrama (mg)", factor: 0.001 },
			{ id: "g", label: "Grama (g)", factor: 1 },
			{ id: "kg", label: "Quilograma (kg)", factor: 1000 },
			{ id: "t", label: "Tonelada (t)", factor: 1_000_000 },
			{ id: "oz", label: "Onça (oz)", factor: 28.349523125 },
			{ id: "lb", label: "Libra (lb)", factor: 453.59237 },
		],
	},
	{
		id: "volume",
		label: "Volume",
		baseLabel: "litro",
		units: [
			{ id: "ml", label: "Mililitro (ml)", factor: 0.001 },
			{ id: "l", label: "Litro (l)", factor: 1 },
			{ id: "m3", label: "Metro cúbico (m³)", factor: 1000 },
			{ id: "gal_us", label: "Galão americano (gal)", factor: 3.785411784 },
			{ id: "gal_uk", label: "Galão imperial (gal UK)", factor: 4.54609 },
			{ id: "cup", label: "Xícara (cup)", factor: 0.24 },
			{ id: "tbsp", label: "Colher de sopa (tbsp)", factor: 0.0147867648 },
			{ id: "tsp", label: "Colher de chá (tsp)", factor: 0.00492892159 },
		],
	},
	{
		id: "area",
		label: "Área",
		baseLabel: "metro quadrado",
		units: [
			{ id: "mm2", label: "Milímetro² (mm²)", factor: 0.000001 },
			{ id: "cm2", label: "Centímetro² (cm²)", factor: 0.0001 },
			{ id: "m2", label: "Metro² (m²)", factor: 1 },
			{ id: "ha", label: "Hectare (ha)", factor: 10000 },
			{ id: "km2", label: "Quilômetro² (km²)", factor: 1_000_000 },
			{ id: "ft2", label: "Pé² (ft²)", factor: 0.09290304 },
			{ id: "ac", label: "Acre", factor: 4046.8564224 },
			{ id: "alq_sp", label: "Alqueire paulista", factor: 24200 },
			{ id: "alq_mg", label: "Alqueire mineiro", factor: 48400 },
		],
	},
	{
		id: "time",
		label: "Tempo",
		baseLabel: "segundo",
		units: [
			{ id: "ms", label: "Milissegundo (ms)", factor: 0.001 },
			{ id: "s", label: "Segundo (s)", factor: 1 },
			{ id: "min", label: "Minuto (min)", factor: 60 },
			{ id: "h", label: "Hora (h)", factor: 3600 },
			{ id: "d", label: "Dia (d)", factor: 86400 },
			{ id: "wk", label: "Semana (wk)", factor: 604800 },
			{ id: "mo", label: "Mês (mo)", factor: 2_629_746 },
			{ id: "yr", label: "Ano (yr)", factor: 31_556_952 },
		],
	},
	{
		id: "speed",
		label: "Velocidade",
		baseLabel: "metro por segundo",
		units: [
			{ id: "mps", label: "Metro/segundo (m/s)", factor: 1 },
			{ id: "kmh", label: "Quilômetro/hora (km/h)", factor: 1 / 3.6 },
			{ id: "mph", label: "Milha/hora (mph)", factor: 0.44704 },
			{ id: "fts", label: "Pé/segundo (ft/s)", factor: 0.3048 },
			{ id: "kn", label: "Nó (kn)", factor: 0.514444 },
		],
	},
	{
		id: "data",
		label: "Armazenamento",
		baseLabel: "byte",
		units: [
			{ id: "bit", label: "Bit", factor: 1 / 8 },
			{ id: "byte", label: "Byte", factor: 1 },
			{ id: "kb", label: "Kilobyte (KB)", factor: 1000 },
			{ id: "mb", label: "Megabyte (MB)", factor: 1_000_000 },
			{ id: "gb", label: "Gigabyte (GB)", factor: 1_000_000_000 },
			{ id: "tb", label: "Terabyte (TB)", factor: 1_000_000_000_000 },
			{ id: "kib", label: "Kibibyte (KiB)", factor: 1024 },
			{ id: "mib", label: "Mebibyte (MiB)", factor: 1024 ** 2 },
			{ id: "gib", label: "Gibibyte (GiB)", factor: 1024 ** 3 },
			{ id: "tib", label: "Tebibyte (TiB)", factor: 1024 ** 4 },
		],
	},
	{
		id: "temperature",
		label: "Temperatura",
		baseLabel: "Celsius",
		units: [
			{ id: "c", label: "Celsius (°C)", factor: 1 },
			{ id: "f", label: "Fahrenheit (°F)", factor: 1 },
			{ id: "k", label: "Kelvin (K)", factor: 1 },
		],
	},
];

export function getCategory(id: UnitCategoryId): UnitCategory {
	const cat = UNIT_CATEGORIES.find((c) => c.id === id);
	if (!cat) throw new Error(`Unknown unit category: ${id}`);
	return cat;
}

export function getUnit(category: UnitCategory, unitId: string): UnitDef {
	const unit = category.units.find((u) => u.id === unitId);
	if (!unit) throw new Error(`Unknown unit ${unitId} for ${category.id}`);
	return unit;
}

function temperatureToCelsius(value: number, from: string): number {
	if (from === "c") return value;
	if (from === "f") return (value - 32) * (5 / 9);
	if (from === "k") return value - 273.15;
	throw new Error(`Unknown temperature unit: ${from}`);
}

function celsiusToTemperature(value: number, to: string): number {
	if (to === "c") return value;
	if (to === "f") return value * (9 / 5) + 32;
	if (to === "k") return value + 273.15;
	throw new Error(`Unknown temperature unit: ${to}`);
}

export function convertUnit(
	value: number,
	categoryId: UnitCategoryId,
	fromId: string,
	toId: string,
): number {
	if (categoryId === "temperature") {
		const celsius = temperatureToCelsius(value, fromId);
		return celsiusToTemperature(celsius, toId);
	}
	const category = getCategory(categoryId);
	const from = getUnit(category, fromId);
	const to = getUnit(category, toId);
	return (value * from.factor) / to.factor;
}

export function formatConverted(value: number): string {
	if (!Number.isFinite(value)) return "—";
	const abs = Math.abs(value);
	if (abs !== 0 && (abs < 0.0001 || abs >= 1e15)) {
		return value.toExponential(6);
	}
	const formatted = value.toFixed(6);
	return formatted.replace(/\.?0+$/, "");
}
