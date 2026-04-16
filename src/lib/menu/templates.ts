import type { MenuTemplate } from "./types";

export const MENU_TEMPLATES: MenuTemplate[] = [
	{
		id: "classico",
		name: "Clássico",
		layout: { columns: 1, headerAlign: "center" },
		typography: { titleSize: 72, sectionSize: 32, itemSize: 24, priceSize: 24 },
		spacing: { sectionGap: 48, itemGap: 20 },
	},
	{
		id: "moderno",
		name: "Moderno",
		layout: { columns: 1, headerAlign: "left" },
		typography: { titleSize: 60, sectionSize: 28, itemSize: 22, priceSize: 22 },
		spacing: { sectionGap: 36, itemGap: 16 },
	},
	{
		id: "bistro",
		name: "Bistrô",
		layout: { columns: 2, headerAlign: "center" },
		typography: { titleSize: 60, sectionSize: 26, itemSize: 20, priceSize: 20 },
		spacing: { sectionGap: 32, itemGap: 14 },
	},
];
