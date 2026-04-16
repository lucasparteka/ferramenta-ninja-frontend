import { getCanvasFamily } from "./fonts";
import type { MenuItem, MenuData, MenuTemplate, PageSection, PageSlice } from "./types";

export const CANVAS_WIDTH = 1240;
export const CANVAS_HEIGHT = 1754;
const MARGIN = 60;
const CONTENT_WIDTH = CANVAS_WIDTH - MARGIN * 2;
const COL_GAP = 40;
const COL_WIDTH_2 = (CONTENT_WIDTH - COL_GAP) / 2;
const CONTINUATION_HEADER_H = 36;

const COLOR_SUBTITLE = "#6b7280";
const COLOR_SECTION_LINE = "#d1d5db";
const COLOR_ITEM_DESC = "#6b7280";
const COLOR_PRICE = "#374151";

const BOTTOM = CANVAS_HEIGHT - MARGIN;

function getTextColor(backgroundColor: string): string {
	const hex = backgroundColor.replace("#", "");
	if (hex.length !== 6) return "#111827";
	const r = parseInt(hex.slice(0, 2), 16);
	const g = parseInt(hex.slice(2, 4), 16);
	const b = parseInt(hex.slice(4, 6), 16);
	const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
	return luminance > 0.5 ? "#111827" : "#f9fafb";
}

function truncateText(
	ctx: CanvasRenderingContext2D,
	text: string,
	maxWidth: number,
): string {
	if (ctx.measureText(text).width <= maxWidth) return text;
	let truncated = text;
	while (truncated.length > 0 && ctx.measureText(`${truncated}…`).width > maxWidth) {
		truncated = truncated.slice(0, -1);
	}
	return `${truncated}…`;
}

function sectionHeaderH(typography: MenuTemplate["typography"]): number {
	return typography.sectionSize + 8 + 16;
}

function itemBlockH(
	item: MenuItem,
	typography: MenuTemplate["typography"],
	spacing: MenuTemplate["spacing"],
): number {
	const descH = Math.round(typography.itemSize * 0.85);
	return typography.itemSize + (item.description ? descH + 4 : 0) + spacing.itemGap;
}

function headerEndY(data: MenuData, template: MenuTemplate): number {
	let y = MARGIN;
	y += template.typography.titleSize + 16;
	if (data.subtitle) {
		y += Math.round(template.typography.titleSize * 0.45) + 12;
	}
	y += 16 + 2 + 24;
	return y;
}

// --- Pagination ---

export function paginateMenu(data: MenuData, template: MenuTemplate): PageSlice[] {
	const { layout, typography, spacing } = template;
	const secH = sectionHeaderH(typography);

	const pages: PageSlice[] = [];
	let currentSections: PageSection[] = [];

	let y = headerEndY(data, template);
	let col0Y = y;
	let col1Y = y;

	function commitPage() {
		pages.push({ sections: currentSections });
		currentSections = [];
		y = MARGIN + CONTINUATION_HEADER_H;
		col0Y = y;
		col1Y = y;
	}

	for (const section of data.sections) {
		const firstItemH =
			section.items[0] ? itemBlockH(section.items[0], typography, spacing) : 0;

		if (layout.columns === 1) {
			const nextY = y + spacing.sectionGap;
			if (nextY + secH + firstItemH > BOTTOM && currentSections.length > 0) {
				commitPage();
			}

			y += spacing.sectionGap + secH;

			const pageItems: MenuItem[] = [];
			let isPartial = false;

			for (const item of section.items) {
				const h = itemBlockH(item, typography, spacing);
				if (y + h > BOTTOM) {
					currentSections.push({ name: section.name, isPartial, items: [...pageItems] });
					commitPage();
					y += secH;
					pageItems.length = 0;
					isPartial = true;
				}
				pageItems.push(item);
				y += h;
			}

			currentSections.push({ name: section.name, isPartial, items: pageItems });
		} else {
			const syncY = Math.max(col0Y, col1Y);
			if (syncY + spacing.sectionGap + secH + firstItemH > BOTTOM && currentSections.length > 0) {
				commitPage();
			}

			col0Y = Math.max(col0Y, col1Y) + spacing.sectionGap + secH;
			col1Y = col0Y;

			const pageItems: MenuItem[] = [];
			let isPartial = false;
			let colIdx = 0;

			for (const item of section.items) {
				const col = (colIdx % 2) as 0 | 1;
				const curColY = col === 0 ? col0Y : col1Y;
				const h = itemBlockH(item, typography, spacing);

				if (curColY + h > BOTTOM) {
					currentSections.push({ name: section.name, isPartial, items: [...pageItems] });
					commitPage();
					col0Y = (MARGIN + CONTINUATION_HEADER_H) + secH;
					col1Y = col0Y;
					pageItems.length = 0;
					isPartial = true;
					colIdx = 0;
				}

				pageItems.push(item);
				if (colIdx % 2 === 0) col0Y += h;
				else col1Y += h;
				colIdx++;
			}

			currentSections.push({ name: section.name, isPartial, items: pageItems });
		}
	}

	if (currentSections.length > 0) {
		pages.push({ sections: currentSections });
	}

	return pages.length > 0 ? pages : [{ sections: [] }];
}

// --- Rendering ---

function renderSections1Col(
	ctx: CanvasRenderingContext2D,
	sections: PageSection[],
	data: MenuData,
	template: MenuTemplate,
	startY: number,
): void {
	const { typography, spacing } = template;
	const { style } = data;
	const fontFamily = getCanvasFamily(style.fontFamily);
	const descLineH = Math.round(typography.itemSize * 0.85);
	const textColor = getTextColor(style.backgroundColor);
	let y = startY;

	for (const section of sections) {
		if (y > BOTTOM) break;

		y += section.isPartial ? 0 : spacing.sectionGap;

		ctx.save();
		ctx.fillStyle = style.primaryColor;
		ctx.font = `bold ${typography.sectionSize}px ${fontFamily}`;
		ctx.textBaseline = "top";
		ctx.textAlign = "left";
		ctx.fillText(
			truncateText(
				ctx,
				section.name + (section.isPartial ? " (cont.)" : ""),
				CONTENT_WIDTH,
			),
			MARGIN,
			y,
			CONTENT_WIDTH,
		);
		y += typography.sectionSize + 8;

		ctx.strokeStyle = COLOR_SECTION_LINE;
		ctx.lineWidth = 1;
		ctx.beginPath();
		ctx.moveTo(MARGIN, y);
		ctx.lineTo(MARGIN + CONTENT_WIDTH, y);
		ctx.stroke();
		ctx.restore();

		y += 16;

		for (const item of section.items) {
			if (y > BOTTOM) break;
			const hasDesc = Boolean(item.description);
			const itemH = typography.itemSize + (hasDesc ? descLineH + 4 : 0);

			ctx.save();
			ctx.fillStyle = textColor;
			ctx.font = `${typography.itemSize}px ${fontFamily}`;
			ctx.textBaseline = "top";
			ctx.textAlign = "left";

			const priceText = style.showPrices && item.price ? item.price : null;
			const priceWidth = priceText ? ctx.measureText(priceText).width + 16 : 0;
			const nameMaxW = CONTENT_WIDTH - priceWidth;

			ctx.fillText(truncateText(ctx, item.name, nameMaxW), MARGIN, y, nameMaxW);

			if (priceText) {
				ctx.fillStyle = COLOR_PRICE;
				ctx.font = `bold ${typography.priceSize}px ${fontFamily}`;
				ctx.textAlign = "right";
				ctx.fillText(priceText, MARGIN + CONTENT_WIDTH, y);
			}

			if (hasDesc) {
				ctx.fillStyle = COLOR_ITEM_DESC;
				ctx.font = `${descLineH}px ${fontFamily}`;
				ctx.textAlign = "left";
				ctx.fillText(
					truncateText(ctx, item.description ?? "", CONTENT_WIDTH - priceWidth),
					MARGIN,
					y + typography.itemSize + 4,
					CONTENT_WIDTH,
				);
			}
			ctx.restore();

			y += itemH + spacing.itemGap;
		}
	}
}

function renderSections2Col(
	ctx: CanvasRenderingContext2D,
	sections: PageSection[],
	data: MenuData,
	template: MenuTemplate,
	startY: number,
): void {
	const { typography, spacing } = template;
	const { style } = data;
	const fontFamily = getCanvasFamily(style.fontFamily);
	const descLineH = Math.round(typography.itemSize * 0.85);
	const colX = [MARGIN, MARGIN + COL_WIDTH_2 + COL_GAP] as const;
	const colY: [number, number] = [startY, startY];

	for (const section of sections) {
		const syncY = Math.max(colY[0], colY[1]);
		if (syncY > BOTTOM) break;

		colY[0] = section.isPartial ? syncY : syncY + spacing.sectionGap;
		colY[1] = colY[0];

		ctx.save();
		ctx.fillStyle = style.primaryColor;
		ctx.font = `bold ${typography.sectionSize}px ${fontFamily}`;
		ctx.textBaseline = "top";
		ctx.textAlign = "left";
		ctx.fillText(
			truncateText(
				ctx,
				section.name + (section.isPartial ? " (cont.)" : ""),
				CONTENT_WIDTH,
			),
			MARGIN,
			colY[0],
			CONTENT_WIDTH,
		);
		colY[0] += typography.sectionSize + 8;

		ctx.strokeStyle = COLOR_SECTION_LINE;
		ctx.lineWidth = 1;
		ctx.beginPath();
		ctx.moveTo(MARGIN, colY[0]);
		ctx.lineTo(MARGIN + CONTENT_WIDTH, colY[0]);
		ctx.stroke();
		ctx.restore();

		colY[0] += 16;
		colY[1] = colY[0];

		let colIdx = 0;
		for (const item of section.items) {
			const col = (colIdx % 2) as 0 | 1;
			if (colY[col] > BOTTOM) break;

			const hasDesc = Boolean(item.description);
			const itemH = typography.itemSize + (hasDesc ? descLineH + 4 : 0);
			const x = colX[col];

			ctx.save();
			ctx.fillStyle = getTextColor(style.backgroundColor);
			ctx.font = `${typography.itemSize}px ${fontFamily}`;
			ctx.textBaseline = "top";
			ctx.textAlign = "left";

			const priceText = style.showPrices && item.price ? item.price : null;
			const priceWidth = priceText ? ctx.measureText(priceText).width + 8 : 0;
			const nameMaxW = COL_WIDTH_2 - priceWidth;

			ctx.fillText(truncateText(ctx, item.name, nameMaxW), x, colY[col], nameMaxW);

			if (priceText) {
				ctx.fillStyle = COLOR_PRICE;
				ctx.font = `bold ${typography.priceSize}px ${fontFamily}`;
				ctx.textAlign = "right";
				ctx.fillText(priceText, x + COL_WIDTH_2, colY[col]);
			}

			if (hasDesc) {
				ctx.fillStyle = COLOR_ITEM_DESC;
				ctx.font = `${descLineH}px ${fontFamily}`;
				ctx.textAlign = "left";
				ctx.fillText(
					truncateText(ctx, item.description ?? "", nameMaxW),
					x,
					colY[col] + typography.itemSize + 4,
					COL_WIDTH_2,
				);
			}
			ctx.restore();

			colY[col] += itemH + spacing.itemGap;
			colIdx++;
		}
	}
}

export function renderMenuPage(
	ctx: CanvasRenderingContext2D,
	data: MenuData,
	template: MenuTemplate,
	slice: PageSlice,
	pageIndex: number,
): void {
	const { style } = data;
	const { layout, typography } = template;
	const fontFamily = getCanvasFamily(style.fontFamily);

	ctx.fillStyle = style.backgroundColor;
	ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

	let contentStartY: number;

	if (pageIndex === 0) {
		let y = MARGIN;
		const titleAlign = layout.headerAlign;
		const titleX = titleAlign === "center" ? CANVAS_WIDTH / 2 : MARGIN;

		ctx.save();
		ctx.fillStyle = style.primaryColor;
		ctx.font = `bold ${typography.titleSize}px ${fontFamily}`;
		ctx.textBaseline = "top";
		ctx.textAlign = titleAlign;
		ctx.fillText(truncateText(ctx, data.title, CONTENT_WIDTH), titleX, y, CONTENT_WIDTH);
		y += typography.titleSize + 16;

		if (data.subtitle) {
			const subSize = Math.round(typography.titleSize * 0.45);
			ctx.font = `${subSize}px ${fontFamily}`;
			ctx.fillStyle = COLOR_SUBTITLE;
			ctx.textAlign = titleAlign;
			ctx.fillText(truncateText(ctx, data.subtitle, CONTENT_WIDTH), titleX, y, CONTENT_WIDTH);
			y += subSize + 12;
		}
		ctx.restore();

		y += 16;
		ctx.save();
		ctx.strokeStyle = style.primaryColor;
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.moveTo(MARGIN, y);
		ctx.lineTo(MARGIN + CONTENT_WIDTH, y);
		ctx.stroke();
		ctx.restore();

		contentStartY = y + 24;
	} else {
		ctx.save();
		ctx.fillStyle = style.primaryColor;
		ctx.fillRect(0, 0, CANVAS_WIDTH, 8);
		ctx.restore();
		contentStartY = MARGIN + CONTINUATION_HEADER_H;
	}

	if (layout.columns === 1) {
		renderSections1Col(ctx, slice.sections, data, template, contentStartY);
	} else {
		renderSections2Col(ctx, slice.sections, data, template, contentStartY);
	}
}
