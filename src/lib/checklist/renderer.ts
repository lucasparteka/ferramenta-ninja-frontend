import type { ChecklistState } from "./types";

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

const CHECKBOX_SIZE = 24;
const CHECKBOX_RADIUS = 4;
const TEXT_OFFSET_CB = CHECKBOX_SIZE + 16;

const FONT_SIZES = { sm: 20, md: 26, lg: 32 } as const;
const TITLE_FONT_SIZES = { sm: 38, md: 50, lg: 70 } as const;
const FONT_FAMILY = "system-ui, Arial, sans-serif";

const COLOR_TITLE = "#111827";
const COLOR_TEXT = "#374151";
const COLOR_CHECKBOX = "#374151";
const COLOR_DIVIDER = "#e5e7eb";

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
	const { title, items, layout, style } = state;
	const itemH =
		layout.spacing === "compact" ? ITEM_H_COMPACT : ITEM_H_COMFORTABLE;
	const itemFontSize = FONT_SIZES[style.fontSize];
	const titleFontSize = TITLE_FONT_SIZES[style.fontSize];
	const colWidth = layout.columns === 2 ? COL_WIDTH_2 : CONTENT_WIDTH;

	ctx.fillStyle = style.backgroundColor;
	ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

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

	const colX = [MARGIN, MARGIN + COL_WIDTH_2 + COL_GAP];
	const colY = [ITEMS_TOP, ITEMS_TOP];

	for (let i = 0; i < items.length; i++) {
		const col = layout.columns === 2 ? i % 2 : 0;
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
		ctx.fillText(items[i], textX, y + itemH / 2, textMaxWidth);
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
}
