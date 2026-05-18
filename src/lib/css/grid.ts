export type GridTrack = { id: string; value: string };

export type GridConfig = {
	columns: GridTrack[];
	rows: GridTrack[];
	columnGap: number;
	rowGap: number;
	gapLinked: boolean;
};

export const DEFAULT_GRID_CONFIG: GridConfig = {
	columns: [
		{ id: "c1", value: "1fr" },
		{ id: "c2", value: "1fr" },
		{ id: "c3", value: "1fr" },
	],
	rows: [
		{ id: "r1", value: "auto" },
		{ id: "r2", value: "auto" },
	],
	columnGap: 16,
	rowGap: 16,
	gapLinked: true,
};

export const COLUMN_PRESETS = ["1fr", "2fr", "auto", "200px"] as const;
export const ROW_PRESETS = ["auto", "1fr", "100px"] as const;

export type GridPreset = {
	label: string;
	description: string;
	columns: string[];
	rows: string[];
	columnGap: number;
	rowGap: number;
};

export const GRID_PRESETS: GridPreset[] = [
	{
		label: "3 iguais",
		description: "Três colunas de mesma largura",
		columns: ["1fr", "1fr", "1fr"],
		rows: ["auto"],
		columnGap: 16,
		rowGap: 16,
	},
	{
		label: "Sidebar + Main",
		description: "Barra lateral fixa + conteúdo flexível",
		columns: ["280px", "1fr"],
		rows: ["auto"],
		columnGap: 24,
		rowGap: 0,
	},
	{
		label: "Holy Grail",
		description: "Duas sidebars com conteúdo central",
		columns: ["1fr", "3fr", "1fr"],
		rows: ["auto"],
		columnGap: 16,
		rowGap: 16,
	},
	{
		label: "12 colunas",
		description: "Grade de 12 colunas para sistemas de layout",
		columns: Array.from({ length: 12 }, () => "1fr"),
		rows: ["auto"],
		columnGap: 8,
		rowGap: 0,
	},
];

export function buildContainerCSS(config: GridConfig): string {
	const cols = config.columns.map((c) => c.value || "1fr").join(" ");
	const rws = config.rows.map((r) => r.value || "auto").join(" ");

	const lines: string[] = [
		"display: grid;",
		`grid-template-columns: ${cols};`,
		`grid-template-rows: ${rws};`,
	];

	if (config.gapLinked && config.columnGap === config.rowGap) {
		if (config.columnGap > 0) lines.push(`gap: ${config.columnGap}px;`);
	} else {
		if (config.columnGap > 0) lines.push(`column-gap: ${config.columnGap}px;`);
		if (config.rowGap > 0) lines.push(`row-gap: ${config.rowGap}px;`);
	}

	return lines.join("\n");
}

export function buildFullCSS(config: GridConfig, selector = ".container"): string {
	const css = buildContainerCSS(config);
	return `${selector} {\n  ${css.replace(/\n/g, "\n  ")}\n}`;
}
