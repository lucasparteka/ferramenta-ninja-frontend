export type FlexDirection = "row" | "row-reverse" | "column" | "column-reverse";
export type FlexWrap = "nowrap" | "wrap" | "wrap-reverse";
export type JustifyContent =
	| "flex-start"
	| "flex-end"
	| "center"
	| "space-between"
	| "space-around"
	| "space-evenly";
export type AlignItems =
	| "flex-start"
	| "flex-end"
	| "center"
	| "stretch"
	| "baseline";
export type AlignContent =
	| "flex-start"
	| "flex-end"
	| "center"
	| "stretch"
	| "space-between"
	| "space-around"
	| "space-evenly";
export type AlignSelf =
	| "auto"
	| "flex-start"
	| "flex-end"
	| "center"
	| "stretch"
	| "baseline";

export type FlexItem = {
	id: string;
	label: string;
	color: string;
	flexGrow: number;
	flexShrink: number;
	flexBasis: string;
	alignSelf: AlignSelf;
	order: number;
	width: string;
	height: string;
};

export type FlexContainer = {
	display: "flex" | "inline-flex";
	flexDirection: FlexDirection;
	flexWrap: FlexWrap;
	justifyContent: JustifyContent;
	alignItems: AlignItems;
	alignContent: AlignContent;
	rowGap: number;
	columnGap: number;
	minHeight: number;
};

export const DEFAULT_CONTAINER: FlexContainer = {
	display: "flex",
	flexDirection: "row",
	flexWrap: "nowrap",
	justifyContent: "flex-start",
	alignItems: "stretch",
	alignContent: "stretch",
	rowGap: 8,
	columnGap: 8,
	minHeight: 320,
};

export const ITEM_COLORS = [
	"#3b82f6",
	"#ef4444",
	"#22c55e",
	"#f59e0b",
	"#a855f7",
	"#ec4899",
	"#06b6d4",
	"#f97316",
];

export function createDefaultItem(index: number): FlexItem {
	return {
		id: crypto.randomUUID(),
		label: `${index + 1}`,
		color: ITEM_COLORS[index % ITEM_COLORS.length] ?? ITEM_COLORS[0],
		flexGrow: 0,
		flexShrink: 1,
		flexBasis: "auto",
		alignSelf: "auto",
		order: 0,
		width: "auto",
		height: "auto",
	};
}

export function createDefaultItems(count = 4): FlexItem[] {
	return Array.from({ length: count }, (_, i) => createDefaultItem(i));
}

export function buildContainerCSS(container: FlexContainer): string {
	const lines: string[] = [
		`display: ${container.display};`,
		`flex-direction: ${container.flexDirection};`,
		`flex-wrap: ${container.flexWrap};`,
		`justify-content: ${container.justifyContent};`,
		`align-items: ${container.alignItems};`,
	];

	if (container.flexWrap !== "nowrap") {
		lines.push(`align-content: ${container.alignContent};`);
	}

	if (container.rowGap === container.columnGap) {
		if (container.rowGap > 0) {
			lines.push(`gap: ${container.rowGap}px;`);
		}
	} else {
		if (container.rowGap > 0) lines.push(`row-gap: ${container.rowGap}px;`);
		if (container.columnGap > 0)
			lines.push(`column-gap: ${container.columnGap}px;`);
	}

	if (container.minHeight !== 320) {
		lines.push(`min-height: ${container.minHeight}px;`);
	}

	return lines.join("\n");
}

export function buildItemCSS(item: FlexItem): string {
	const lines: string[] = [
		`flex-grow: ${item.flexGrow};`,
		`flex-shrink: ${item.flexShrink};`,
		`flex-basis: ${item.flexBasis};`,
	];

	if (item.width !== "auto") lines.push(`width: ${item.width};`);
	if (item.height !== "auto") lines.push(`height: ${item.height};`);

	if (item.alignSelf !== "auto") {
		lines.push(`align-self: ${item.alignSelf};`);
	}

	if (item.order !== 0) {
		lines.push(`order: ${item.order};`);
	}

	return lines.join("\n");
}

export function buildFullCSS(
	container: FlexContainer,
	items: FlexItem[],
	selector = ".container",
	itemSelector = ".item",
): string {
	const containerCSS = buildContainerCSS(container);
	const parts: string[] = [
		`${selector} {\n  ${containerCSS.replace(/\n/g, "\n  ")}\n}`,
	];

	if (items.length === 0) return parts.join("\n\n");

	const itemCSSList = items.map((item) => buildItemCSS(item));
	const allSame = itemCSSList.every((css) => css === itemCSSList[0]);

	if (allSame) {
		const indented = (itemCSSList[0] ?? "")
			.split("\n")
			.map((line) => `  ${line}`)
			.join("\n");
		parts.push(`${itemSelector} {\n${indented}\n}`);
	} else {
		for (let i = 0; i < items.length; i++) {
			const indented = (itemCSSList[i] ?? "")
				.split("\n")
				.map((line) => `  ${line}`)
				.join("\n");
			parts.push(`${itemSelector}-${i + 1} {\n${indented}\n}`);
		}
	}

	return parts.join("\n\n");
}

export const FLEX_DIRECTION_OPTIONS: { label: string; value: FlexDirection }[] =
	[
		{ label: "Row", value: "row" },
		{ label: "Row reverse", value: "row-reverse" },
		{ label: "Column", value: "column" },
		{ label: "Column reverse", value: "column-reverse" },
	];

export const FLEX_WRAP_OPTIONS: { label: string; value: FlexWrap }[] = [
	{ label: "No wrap", value: "nowrap" },
	{ label: "Wrap", value: "wrap" },
	{ label: "Wrap reverse", value: "wrap-reverse" },
];

export const JUSTIFY_CONTENT_OPTIONS: {
	label: string;
	value: JustifyContent;
}[] = [
	{ label: "Flex start", value: "flex-start" },
	{ label: "Flex end", value: "flex-end" },
	{ label: "Center", value: "center" },
	{ label: "Space between", value: "space-between" },
	{ label: "Space around", value: "space-around" },
	{ label: "Space evenly", value: "space-evenly" },
];

export const ALIGN_ITEMS_OPTIONS: { label: string; value: AlignItems }[] = [
	{ label: "Flex start", value: "flex-start" },
	{ label: "Flex end", value: "flex-end" },
	{ label: "Center", value: "center" },
	{ label: "Stretch", value: "stretch" },
	{ label: "Baseline", value: "baseline" },
];

export const ALIGN_CONTENT_OPTIONS: { label: string; value: AlignContent }[] = [
	{ label: "Flex start", value: "flex-start" },
	{ label: "Flex end", value: "flex-end" },
	{ label: "Center", value: "center" },
	{ label: "Stretch", value: "stretch" },
	{ label: "Space between", value: "space-between" },
	{ label: "Space around", value: "space-around" },
	{ label: "Space evenly", value: "space-evenly" },
];

export const ALIGN_SELF_OPTIONS: { label: string; value: AlignSelf }[] = [
	{ label: "Auto", value: "auto" },
	{ label: "Flex start", value: "flex-start" },
	{ label: "Flex end", value: "flex-end" },
	{ label: "Center", value: "center" },
	{ label: "Stretch", value: "stretch" },
	{ label: "Baseline", value: "baseline" },
];
