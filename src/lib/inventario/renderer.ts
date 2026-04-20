import type { InventarioState } from "./types";

export const PORTRAIT_W = 1240;
export const PORTRAIT_H = 1754;
export const LANDSCAPE_W = 1754;
export const LANDSCAPE_H = 1240;

const MARGIN = 60;
const FONT = "system-ui, Arial, sans-serif";

const COLOR_BG = "#ffffff";
const COLOR_TITLE = "#111827";
const COLOR_HEADER_FIELD_BG = "#f1f5f9";
const COLOR_HEADER_FIELD_LABEL = "#64748b";
const COLOR_HEADER_FIELD_VALUE = "#111827";
const COLOR_TABLE_BORDER = "#1a1a1a";
const COLOR_TABLE_ROW_ALT = "#f0f0f0";
const COLOR_TABLE_HEADER_TEXT = "#ffffff";

function truncate(
	ctx: CanvasRenderingContext2D,
	text: string,
	maxWidth: number,
): string {
	if (!text) return "";
	if (ctx.measureText(text).width <= maxWidth) return text;
	const ellipsis = "…";
	let t = text;
	while (t.length > 0 && ctx.measureText(t + ellipsis).width > maxWidth) {
		t = t.slice(0, -1);
	}
	return t + ellipsis;
}

export function renderInventario(
	ctx: CanvasRenderingContext2D,
	state: InventarioState,
): void {
	const isLandscape = state.orientation === "landscape";
	const W = isLandscape ? LANDSCAPE_W : PORTRAIT_W;
	const H = isLandscape ? LANDSCAPE_H : PORTRAIT_H;
	const contentW = W - MARGIN * 2;

	ctx.fillStyle = COLOR_BG;
	ctx.fillRect(0, 0, W, H);

	let y = MARGIN;

	ctx.save();
	ctx.fillStyle = COLOR_TITLE;
	ctx.font = `bold 52px ${FONT}`;
	ctx.textBaseline = "alphabetic";
	ctx.textAlign = "center";
	ctx.fillText(state.title || "Controle de Estoque", W / 2, y + 48, contentW);
	ctx.restore();

	y += 48 + 28;

	if (state.headerFields.length > 0) {
		const FIELD_H = 52;
		const BLOCK_PAD_H = 24;
		const BLOCK_PAD_V = 12;
		const fieldsPerRow = Math.min(state.headerFields.length, 4);
		const numRows = Math.ceil(state.headerFields.length / fieldsPerRow);
		const blockH = BLOCK_PAD_V * 2 + numRows * FIELD_H;

		ctx.save();
		ctx.fillStyle = COLOR_HEADER_FIELD_BG;
		ctx.beginPath();
		ctx.roundRect(MARGIN, y, contentW, blockH, 10);
		ctx.fill();
		ctx.restore();

		const fieldW = (contentW - BLOCK_PAD_H * 2) / fieldsPerRow;

		for (let i = 0; i < state.headerFields.length; i++) {
			const field = state.headerFields[i];
			const col = i % fieldsPerRow;
			const row = Math.floor(i / fieldsPerRow);
			const fx = MARGIN + BLOCK_PAD_H + col * fieldW;
			const fy = y + BLOCK_PAD_V + row * FIELD_H;

			ctx.save();
			ctx.textBaseline = "alphabetic";
			ctx.textAlign = "left";

			ctx.fillStyle = COLOR_HEADER_FIELD_LABEL;
			ctx.font = `500 20px ${FONT}`;
			ctx.fillText(truncate(ctx, field.label, fieldW - 8), fx, fy + 20);

			ctx.fillStyle = COLOR_HEADER_FIELD_VALUE;
			ctx.font = `400 24px ${FONT}`;
			ctx.fillText(
				truncate(ctx, field.value || "___________________", fieldW - 8),
				fx,
				fy + 48,
			);
			ctx.restore();
		}

		y += blockH + 32;
	}

	if (state.columns.length === 0) return;

	const HEADER_H = 52;
	const ROW_H = 44;
	const CELL_PAD_H = 14;

	const tableY = y;
	const availableH = H - MARGIN - tableY - HEADER_H;
	const numRows = Math.max(1, Math.floor(availableH / ROW_H));

	const totalWeight = state.columns.reduce((s, c) => s + c.width, 0);
	const colWidths = state.columns.map(
		(c) => (c.width / totalWeight) * contentW,
	);

	ctx.save();
	ctx.fillStyle = state.tableHeaderColor || "#1e293b";
	ctx.beginPath();
	ctx.roundRect(MARGIN, tableY, contentW, HEADER_H, [8, 8, 0, 0]);
	ctx.fill();

	ctx.fillStyle = COLOR_TABLE_HEADER_TEXT;
	ctx.font = `600 22px ${FONT}`;
	ctx.textBaseline = "middle";
	ctx.textAlign = "left";

	let hx = MARGIN;
	for (let i = 0; i < state.columns.length; i++) {
		const cw = colWidths[i];
		ctx.fillText(
			truncate(ctx, state.columns[i].label, cw - CELL_PAD_H * 2),
			hx + CELL_PAD_H,
			tableY + HEADER_H / 2,
		);
		hx += cw;
	}
	ctx.restore();

	for (let ri = 0; ri < numRows; ri++) {
		const ry = tableY + HEADER_H + ri * ROW_H;

		if (state.zebraStripes && ri % 2 === 1) {
			ctx.save();
			ctx.fillStyle = COLOR_TABLE_ROW_ALT;
			ctx.fillRect(MARGIN, ry, contentW, ROW_H);
			ctx.restore();
		}

		ctx.save();
		ctx.strokeStyle = COLOR_TABLE_BORDER;
		ctx.lineWidth = 1;
		ctx.beginPath();
		ctx.moveTo(MARGIN, ry + ROW_H);
		ctx.lineTo(MARGIN + contentW, ry + ROW_H);
		ctx.stroke();
		ctx.restore();
	}

	const tableH = HEADER_H + numRows * ROW_H;

	ctx.save();
	ctx.strokeStyle = COLOR_TABLE_BORDER;
	ctx.lineWidth = 1;
	let vx = MARGIN;
	for (let i = 0; i < state.columns.length - 1; i++) {
		vx += colWidths[i];
		ctx.beginPath();
		ctx.moveTo(vx, tableY);
		ctx.lineTo(vx, tableY + tableH);
		ctx.stroke();
	}
	ctx.restore();

	ctx.save();
	ctx.strokeStyle = COLOR_TABLE_BORDER;
	ctx.lineWidth = 1;
	ctx.beginPath();
	ctx.roundRect(MARGIN, tableY, contentW, tableH, [8, 8, 8, 8]);
	ctx.stroke();
	ctx.restore();
}
