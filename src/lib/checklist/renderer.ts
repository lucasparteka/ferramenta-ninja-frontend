import type { ChecklistHeader, ChecklistState } from "./types";

export const CANVAS_WIDTH = 1240;
export const CANVAS_HEIGHT = 1754;

const MARGIN = 60;
const CONTENT_WIDTH = CANVAS_WIDTH - MARGIN * 2;
const COL_GAP = 40;
const COL_WIDTH_2 = (CONTENT_WIDTH - COL_GAP) / 2;
const TITLE_HEIGHT = 80;
const TITLE_GAP = 20;
const ITEMS_TOP = MARGIN + TITLE_HEIGHT + TITLE_GAP;

const ITEM_H_COMPACT = 40;
const ITEM_H_COMFORTABLE = 60;
const GROUP_SPACING_TOP = 32;
const GROUP_H_COMPACT = 36;
const GROUP_H_COMFORTABLE = 48;

const CHECKBOX_SIZE = 24;
const CHECKBOX_RADIUS = 4;
const TEXT_OFFSET_CB = CHECKBOX_SIZE + 16;

const FONT_SIZES = { sm: 20, md: 26, lg: 32 } as const;
const GROUP_FONT_SIZES = { sm: 22, md: 28, lg: 36 } as const;
const TITLE_FONT_SIZES = { sm: 38, md: 50, lg: 70 } as const;
const FONT_FAMILY = "system-ui, Arial, sans-serif";

const COLOR_TITLE = "#111827";
const COLOR_TEXT = "#374151";
const COLOR_GROUP = "#111827";
const COLOR_GROUP_LINE = "#d1d5db";
const COLOR_CHECKBOX = "#374151";
const COLOR_DIVIDER = "#e5e7eb";

const HEADER_PAD_H = MARGIN;
const HEADER_PAD_V = 36;
const HEADER_TITLE_H = 72;
const HEADER_SUBTITLE_H = 40;
const HEADER_META_H = 36;
const HEADER_CONTENT_GAP = 24;

function calcHeaderHeight(header: ChecklistHeader): number {
	let h = HEADER_PAD_V * 2 + HEADER_TITLE_H;
	if (header.subtitle) h += HEADER_SUBTITLE_H;
	if (header.date || header.name) h += HEADER_META_H;
	return h;
}

function renderHeader(
	ctx: CanvasRenderingContext2D,
	header: ChecklistHeader,
	title: string,
	titleFontSize: number,
	titleAlign: "left" | "center",
): number {
	const h = calcHeaderHeight(header);

	ctx.fillStyle = header.backgroundColor;
	ctx.fillRect(0, 0, CANVAS_WIDTH, h);

	ctx.save();
	ctx.fillStyle = "#ffffff";
	ctx.textBaseline = "middle";

	const titleX = titleAlign === "center" ? CANVAS_WIDTH / 2 : HEADER_PAD_H;
	ctx.font = `bold ${titleFontSize}px ${FONT_FAMILY}`;
	ctx.textAlign = titleAlign;
	ctx.fillText(title, titleX, HEADER_PAD_V + HEADER_TITLE_H / 2, CONTENT_WIDTH);

	let cursorY = HEADER_PAD_V + HEADER_TITLE_H;

	if (header.subtitle) {
		const subtitleFontSize = Math.round(titleFontSize * 0.46);
		ctx.font = `${subtitleFontSize}px ${FONT_FAMILY}`;
		ctx.textAlign = titleAlign;
		ctx.fillText(
			header.subtitle,
			titleX,
			cursorY + HEADER_SUBTITLE_H / 2,
			CONTENT_WIDTH,
		);
		cursorY += HEADER_SUBTITLE_H;
	}

	if (header.date || header.name) {
		const metaFontSize = Math.round(titleFontSize * 0.38);
		ctx.font = `${metaFontSize}px ${FONT_FAMILY}`;
		const metaY = cursorY + HEADER_META_H / 2;

		if (header.date) {
			ctx.textAlign = "left";
			ctx.fillText(header.date, HEADER_PAD_H, metaY, CONTENT_WIDTH / 2);
		}
		if (header.name) {
			ctx.textAlign = "right";
			ctx.fillText(
				header.name,
				CANVAS_WIDTH - HEADER_PAD_H,
				metaY,
				CONTENT_WIDTH / 2,
			);
		}
	}

	ctx.restore();
	return h;
}

function drawRoundedRect(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	w: number,
	h: number,
	r: number,
): void {
	ctx.beginPath();
	ctx.moveTo(x + r, y);
	ctx.lineTo(x + w - r, y);
	ctx.arcTo(x + w, y, x + w, y + r, r);
	ctx.lineTo(x + w, y + h - r);
	ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
	ctx.lineTo(x + r, y + h);
	ctx.arcTo(x, y + h, x, y + h - r, r);
	ctx.lineTo(x, y + r);
	ctx.arcTo(x, y, x + r, y, r);
	ctx.closePath();
}

export function renderChecklist(
	ctx: CanvasRenderingContext2D,
	state: ChecklistState,
): void {
	const { title, items, layout, style, header } = state;
	const itemH =
		layout.spacing === "compact" ? ITEM_H_COMPACT : ITEM_H_COMFORTABLE;
	const itemFontSize = FONT_SIZES[style.fontSize];
	const titleFontSize = TITLE_FONT_SIZES[style.fontSize];
	const colWidth = layout.columns === 2 ? COL_WIDTH_2 : CONTENT_WIDTH;

	ctx.fillStyle = style.backgroundColor;
	ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

	let itemsTopY: number;

	if (header.enabled) {
		const headerH = renderHeader(
			ctx,
			header,
			title,
			titleFontSize,
			style.titleAlign,
		);
		itemsTopY = headerH + HEADER_CONTENT_GAP;
	} else {
		ctx.save();
		ctx.fillStyle = COLOR_TITLE;
		ctx.font = `bold ${titleFontSize}px ${FONT_FAMILY}`;
		ctx.textBaseline = "middle";
		if (style.titleAlign === "center") {
			ctx.textAlign = "center";
			ctx.fillText(
				title,
				CANVAS_WIDTH / 2,
				MARGIN + TITLE_HEIGHT / 2,
				CONTENT_WIDTH,
			);
		} else {
			ctx.textAlign = "left";
			ctx.fillText(title, MARGIN, MARGIN + TITLE_HEIGHT / 2, CONTENT_WIDTH);
		}
		ctx.restore();
		itemsTopY = ITEMS_TOP;
	}

	const groupFontSize = GROUP_FONT_SIZES[style.fontSize];
	const groupH =
		layout.spacing === "compact" ? GROUP_H_COMPACT : GROUP_H_COMFORTABLE;

	const colX = [MARGIN, MARGIN + COL_WIDTH_2 + COL_GAP];
	const colY = [itemsTopY, itemsTopY];
	let columnCounter = 0;

	for (let i = 0; i < items.length; i++) {
		const item = items[i];

		if (item.kind === "group") {
			const syncY = Math.max(colY[0], colY[1]);
			const y = i === 0 ? syncY : syncY + GROUP_SPACING_TOP;

			if (y + groupH > CANVAS_HEIGHT - MARGIN) break;

			if (i > 0) {
				const lineY = syncY + GROUP_SPACING_TOP / 2;
				ctx.save();
				ctx.strokeStyle = COLOR_GROUP_LINE;
				ctx.lineWidth = 1;
				ctx.beginPath();
				ctx.moveTo(MARGIN, lineY);
				ctx.lineTo(MARGIN + CONTENT_WIDTH, lineY);
				ctx.stroke();
				ctx.restore();
			}

			ctx.save();
			ctx.fillStyle = COLOR_GROUP;
			ctx.font = `bold ${groupFontSize}px ${FONT_FAMILY}`;
			ctx.textBaseline = "middle";
			ctx.textAlign = "left";
			ctx.fillText(item.text, MARGIN, y + groupH / 2, CONTENT_WIDTH);
			ctx.restore();

			colY[0] = y + groupH;
			colY[1] = y + groupH;
			columnCounter = 0;
			continue;
		}

		const col = layout.columns === 2 ? columnCounter % 2 : 0;
		columnCounter++;
		const x = colX[col];
		const y = colY[col];

		if (y + itemH > CANVAS_HEIGHT - MARGIN) break;

		if (layout.showCheckbox) {
			const cbY = y + (itemH - CHECKBOX_SIZE) / 2;
			ctx.save();
			ctx.strokeStyle = COLOR_CHECKBOX;
			ctx.lineWidth = 2;
			drawRoundedRect(
				ctx,
				x,
				cbY,
				CHECKBOX_SIZE,
				CHECKBOX_SIZE,
				CHECKBOX_RADIUS,
			);
			ctx.stroke();
			ctx.restore();
		}

		const textX = x + (layout.showCheckbox ? TEXT_OFFSET_CB : 0);
		const textMaxWidth = colWidth - (layout.showCheckbox ? TEXT_OFFSET_CB : 0);

		ctx.save();
		ctx.fillStyle = COLOR_TEXT;
		ctx.font = `${itemFontSize}px ${FONT_FAMILY}`;
		ctx.textBaseline = "middle";
		ctx.textAlign = "left";
		ctx.fillText(item.text, textX, y + itemH / 2, textMaxWidth);
		ctx.restore();

		if (layout.showDividers) {
			ctx.save();
			ctx.strokeStyle = COLOR_DIVIDER;
			ctx.lineWidth = 1;
			ctx.beginPath();
			ctx.moveTo(x, y + itemH);
			ctx.lineTo(x + colWidth, y + itemH);
			ctx.stroke();
			ctx.restore();
		}

		colY[col] += itemH;
	}

	if (layout.writingLines > 0) {
		const lineStartY = Math.max(colY[0], colY[1] ?? colY[0]) + itemH * 0.5;
		for (let i = 0; i < layout.writingLines; i++) {
			const y = lineStartY + i * itemH;
			if (y + itemH > CANVAS_HEIGHT - MARGIN) break;

			if (layout.showCheckbox) {
				const cbY = y + (itemH - CHECKBOX_SIZE) / 2;
				ctx.save();
				ctx.strokeStyle = COLOR_CHECKBOX;
				ctx.lineWidth = 2;
				drawRoundedRect(
					ctx,
					MARGIN,
					cbY,
					CHECKBOX_SIZE,
					CHECKBOX_SIZE,
					CHECKBOX_RADIUS,
				);
				ctx.stroke();
				ctx.restore();
			}

			ctx.save();
			ctx.strokeStyle = COLOR_DIVIDER;
			ctx.lineWidth = 1;
			ctx.beginPath();
			ctx.moveTo(MARGIN, y + itemH);
			ctx.lineTo(MARGIN + CONTENT_WIDTH, y + itemH);
			ctx.stroke();
			ctx.restore();
		}
	}
}
