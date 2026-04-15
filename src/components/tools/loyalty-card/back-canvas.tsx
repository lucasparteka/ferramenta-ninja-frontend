"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { drawBackground, drawSocialIcon } from "./front-canvas";
import type { BackData, BackLayout, CanvasHandle, Template } from "./types";

const CANVAS_WIDTH = 360;
const CANVAS_HEIGHT = 200;

type BackCanvasProps = {
	backData: BackData;
	template: Template;
};

type StampGrid = { cols: number; rows: number };

function computeGrid(count: number): StampGrid {
	if (count === 5) return { cols: 5, rows: 1 };
	if (count === 6) return { cols: 3, rows: 2 };
	if (count === 8) return { cols: 4, rows: 2 };
	return { cols: 5, rows: 2 };
}

function getContrastColor(hex: string): string {
	const r = parseInt(hex.slice(1, 3), 16);
	const g = parseInt(hex.slice(3, 5), 16);
	const b = parseInt(hex.slice(5, 7), 16);
	const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
	return luminance > 0.5 ? "#1c1917" : "#ffffff";
}

function drawStamps(
	ctx: CanvasRenderingContext2D,
	data: BackData,
	areaX: number,
	areaY: number,
	areaW: number,
	areaH: number,
	labeled = false,
	maxStampSize = 50,
	labelFontSize = 8,
) {
	const { cols, rows } = computeGrid(data.stampCount);
	const gap = 10;
	const targetSize = maxStampSize;
	const maxByWidth = Math.floor((areaW - (cols - 1) * gap) / cols);
	const maxByHeight = Math.floor((areaH - (rows - 1) * gap) / rows);
	const stampSize = Math.min(targetSize, maxByWidth, maxByHeight);
	const gapX = gap;
	const gapY = gap;
	const totalW = cols * stampSize + (cols - 1) * gapX;
	const totalH = rows * stampSize + (rows - 1) * gapY;
	const startX = areaX + (areaW - totalW) / 2;
	const startY = areaY + (areaH - totalH) / 2;

	ctx.strokeStyle = data.primaryColor;
	ctx.lineWidth = 2;

	let rendered = 0;
	for (let row = 0; row < rows; row++) {
		for (let col = 0; col < cols; col++) {
			if (rendered >= data.stampCount) break;
			const x = startX + col * (stampSize + gapX);
			const y = startY + row * (stampSize + gapY);

			ctx.beginPath();
			if (data.stampStyle === "circle") {
				ctx.arc(
					x + stampSize / 2,
					y + stampSize / 2,
					stampSize / 2,
					0,
					Math.PI * 2,
				);
			} else {
				const r = 4;
				ctx.moveTo(x + r, y);
				ctx.lineTo(x + stampSize - r, y);
				ctx.arcTo(x + stampSize, y, x + stampSize, y + r, r);
				ctx.lineTo(x + stampSize, y + stampSize - r);
				ctx.arcTo(
					x + stampSize,
					y + stampSize,
					x + stampSize - r,
					y + stampSize,
					r,
				);
				ctx.lineTo(x + r, y + stampSize);
				ctx.arcTo(x, y + stampSize, x, y + stampSize - r, r);
				ctx.lineTo(x, y + r);
				ctx.arcTo(x, y, x + r, y, r);
			}
			ctx.stroke();

			if (labeled) {
				ctx.fillStyle = data.primaryColor;
				ctx.globalAlpha = 0.5;
				ctx.font = `${labelFontSize}px Inter, sans-serif`;
				ctx.textAlign = "center";
				ctx.fillText(
					String(rendered + 1),
					x + stampSize / 2,
					y + stampSize / 2 + 3,
				);
				ctx.textAlign = "left";
				ctx.globalAlpha = 1;
			}

			rendered++;
		}
	}
}

function getBgBaseColor(data: BackData): string {
	const bg = data.background;
	if (bg.type === "solid") return bg.color;
	if (bg.type === "gradient") return bg.color1;
	return bg.color;
}

type LayoutFn = (
	ctx: CanvasRenderingContext2D,
	data: BackData,
	w: number,
	h: number,
) => void;

const BACK_LAYOUTS: Record<BackLayout, LayoutFn> = {
	classico(ctx, data, w, h) {
		const textColor = getContrastColor(getBgBaseColor(data));
		const footerH = 28;
		const rulesH = 32;

		if (data.rulesText) {
			const maxLineW = w - 32;
			const words = data.rulesText.split(" ");
			const lines: string[] = [];
			let current = "";
			ctx.font = "9px Inter, sans-serif";
			for (const word of words) {
				const test = current ? `${current} ${word}` : word;
				if (ctx.measureText(test).width > maxLineW && current) {
					lines.push(current);
					current = word;
					if (lines.length >= 2) break;
				} else {
					current = test;
				}
			}
			if (current && lines.length < 2) lines.push(current);

			const lineH = 13;
			const totalH = lines.length * lineH;
			const startY = (rulesH - totalH) / 2 + lineH;
			ctx.fillStyle = textColor;
			ctx.globalAlpha = 0.75;
			ctx.textAlign = "center";
			for (let i = 0; i < lines.length; i++) {
				ctx.fillText(lines[i], w / 2, startY + i * lineH);
			}
			ctx.globalAlpha = 1;
		}

		drawStamps(ctx, data, 0, rulesH, w, h - rulesH - footerH);

		const sepY = h - footerH;
		ctx.strokeStyle = data.primaryColor;
		ctx.globalAlpha = 0.3;
		ctx.lineWidth = 0.5;
		ctx.beginPath();
		ctx.moveTo(16, sepY);
		ctx.lineTo(w - 16, sepY);
		ctx.stroke();
		ctx.globalAlpha = 1;

		const footerCY = sepY + footerH / 2;
		ctx.font = "9px Inter, sans-serif";
		ctx.textBaseline = "middle";

		if (data.whatsapp) {
			drawSocialIcon(
				ctx,
				"whatsapp",
				16,
				footerCY - 7,
				14,
				data.primaryColor,
				"flat",
			);
			ctx.fillStyle = textColor;
			// ctx.globalAlpha = 0.8;
			ctx.textAlign = "left";
			ctx.fillText(data.whatsapp, 34, footerCY);
			ctx.globalAlpha = 1;
		}

		if (data.extraText) {
			ctx.fillStyle = textColor;
			ctx.textAlign = "right";
			ctx.fillText(data.extraText, w - 16, footerCY);
			ctx.globalAlpha = 1;
		}

		ctx.textBaseline = "alphabetic";
		ctx.textAlign = "left";
	},

	moderno(ctx, data, w, h) {
		const textColor = getContrastColor(getBgBaseColor(data));

		if (data.rewardText) {
			ctx.fillStyle = data.primaryColor;
			ctx.font = "bold 13px Inter, sans-serif";
			ctx.textAlign = "right";
			ctx.fillText(data.rewardText, w - 16, 28);
			ctx.textAlign = "left";
		}

		ctx.fillStyle = data.primaryColor;
		ctx.globalAlpha = 0.15;
		ctx.fillRect(0, h - 36, w, 36);
		ctx.globalAlpha = 1;

		drawStamps(ctx, data, 0, 25, w, h - 60);

		ctx.fillStyle = data.primaryColor;
		ctx.font = "bold 9px Inter, sans-serif";
		ctx.letterSpacing = "1px";
		ctx.textAlign = "right";
		ctx.fillText("CARTÃO FIDELIDADE", w - 16, h - 20);
		ctx.letterSpacing = "0px";

		if (data.rulesText) {
			ctx.fillStyle = textColor;
			ctx.font = "9px Inter, sans-serif";
			ctx.fillText(data.rulesText, w - 16, h - 8);
			ctx.globalAlpha = 1;
		}
		ctx.textAlign = "left";
	},

	dividido(ctx, data, w, h) {
		const bandH = Math.floor(h * 0.3);
		ctx.fillStyle = data.primaryColor;
		ctx.fillRect(0, 0, w, bandH);

		const bandTextColor = getContrastColor(data.primaryColor);
		ctx.fillStyle = bandTextColor;
		ctx.font = "bold 12px Inter, sans-serif";
		ctx.textAlign = "center";
		ctx.fillText(data.rewardText || "CARTÃO FIDELIDADE", w / 2, bandH / 2 + 5);

		drawStamps(ctx, data, 0, bandH + 4, w, h - bandH - 32);

		const textColor = getContrastColor(getBgBaseColor(data));
		if (data.rulesText) {
			ctx.fillStyle = textColor;
			ctx.font = "12px Inter, sans-serif";
			ctx.fillText(data.rulesText, w / 2, h - 10);
			ctx.globalAlpha = 1;
		}

		ctx.textAlign = "left";
	},

	elegante(ctx, data, w, h) {
		const margin = 20;
		const rectX = margin;
		const rectY = margin;
		const rectW = w - margin * 2;
		const rectH = h - margin * 2;
		const innerTextColor = "#1c1917";

		ctx.fillStyle = "#ffffff";
		ctx.fillRect(rectX, rectY, rectW, rectH);

		ctx.strokeStyle = data.primaryColor;
		ctx.lineWidth = 1.2;
		ctx.strokeRect(rectX, rectY, rectW, rectH);

		ctx.fillStyle = innerTextColor;
		ctx.font = "bold 14px Inter, sans-serif";
		ctx.letterSpacing = "2px";
		ctx.textAlign = "center";
		ctx.fillText("CARTÃO FIDELIDADE", w / 2, rectY + 30);
		ctx.letterSpacing = "0px";

		const hasFooter = !!data.rewardText;
		const footerH = hasFooter ? 20 : 8;
		const stampAreaTop = rectY + 30;
		const stampAreaH = rectH - 30 - footerH;
		drawStamps(
			ctx,
			data,
			rectX + 6,
			stampAreaTop,
			rectW - 12,
			stampAreaH,
			true,
			34,
			11,
		);

		if (data.rewardText) {
			ctx.fillStyle = innerTextColor;
			ctx.font = "500 14px Inter, sans-serif";
			ctx.textAlign = "center";
			ctx.fillText(data.rewardText, w / 2, rectY + rectH - 8, rectW - 20);
			ctx.globalAlpha = 1;
		}

		ctx.textAlign = "left";
	},

	compacto(ctx, data, w, h) {
		const textColor = getContrastColor(getBgBaseColor(data));

		ctx.fillStyle = data.primaryColor;
		ctx.font = "bold 11px Inter, sans-serif";
		ctx.textAlign = "left";
		ctx.fillText("CARTÃO FIDELIDADE", 16, 20);

		if (data.rewardText) {
			ctx.fillStyle = textColor;
			ctx.font = "11px Inter, sans-serif";
			ctx.textAlign = "right";
			ctx.fillText(data.rewardText, w - 16, 20);
		}

		ctx.fillStyle = data.primaryColor;
		ctx.fillRect(16, 26, w - 32, 1);

		drawStamps(ctx, data, 0, 30, w, h - 60);

		if (data.rulesText) {
			ctx.fillStyle = textColor;
			ctx.font = "12px Inter, sans-serif";
			ctx.textAlign = "center";
			ctx.fillText(data.rulesText, w / 2, h - 10);
			ctx.globalAlpha = 1;
		}

		ctx.textAlign = "left";
	},

	minimalista(ctx, data, w, h) {
		const textColor = getContrastColor(getBgBaseColor(data));

		const headerH = 34;
		const headerText = "CARTÃO FIDELIDADE";
		ctx.font = "bold 11px Inter, sans-serif";
		ctx.letterSpacing = "1.5px";
		ctx.textAlign = "center";

		const textW = ctx.measureText(headerText).width;
		const lineGap = 10;
		const lineY = 22;

		ctx.strokeStyle = textColor;
		ctx.globalAlpha = 0.4;
		ctx.lineWidth = 0.8;
		ctx.beginPath();
		ctx.moveTo(16, lineY);
		ctx.lineTo(w / 2 - textW / 2 - lineGap, lineY);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(w / 2 + textW / 2 + lineGap, lineY);
		ctx.lineTo(w - 16, lineY);
		ctx.stroke();
		ctx.globalAlpha = 1;

		ctx.fillStyle = textColor;
		ctx.fillText(headerText, w / 2, lineY + 4);
		ctx.letterSpacing = "0px";

		const hasFooter = !!(data.rewardText || data.rulesText);
		const footerH = hasFooter
			? data.rewardText && data.rulesText
				? 46
				: 28
			: 10;

		drawStamps(ctx, data, 0, headerH, w, h - headerH - footerH, false, 40);

		if (data.rewardText) {
			ctx.fillStyle = textColor;
			ctx.font = "bold 10px Inter, sans-serif";
			ctx.textAlign = "center";
			ctx.fillText(
				data.rewardText,
				w / 2,
				h - (data.rulesText ? 24 : 12),
				w - 32,
			);
		}

		if (data.rulesText) {
			ctx.fillStyle = textColor;
			ctx.globalAlpha = 0.65;
			ctx.font = "9px Inter, sans-serif";
			ctx.textAlign = "center";
			ctx.fillText(data.rulesText, w / 2, h - 10, w - 32);
			ctx.globalAlpha = 1;
		}

		ctx.textAlign = "left";
	},

	negrito(ctx, data, w, h) {
		const splitX = Math.floor(w * 0.38);
		ctx.fillStyle = data.primaryColor;
		ctx.fillRect(0, 0, splitX, h);

		const leftTextColor = getContrastColor(data.primaryColor);
		const rightTextColor = getContrastColor(getBgBaseColor(data));

		if (data.rewardText) {
			ctx.save();
			ctx.fillStyle = leftTextColor;
			ctx.font = "bold 12px Inter, sans-serif";
			ctx.textAlign = "center";
			const lines = data.rewardText.split(" ");
			const mid = Math.ceil(lines.length / 2);
			const line1 = lines.slice(0, mid).join(" ");
			const line2 = lines.slice(mid).join(" ");
			ctx.fillText(line1, splitX / 2, h / 2 - (line2 ? 8 : 0));
			if (line2) ctx.fillText(line2, splitX / 2, h / 2 + 10);
			ctx.restore();
		} else {
			ctx.fillStyle = leftTextColor;
			ctx.globalAlpha = 0.3;
			ctx.font = "bold 9px Inter, sans-serif";
			ctx.letterSpacing = "1px";
			ctx.textAlign = "center";
			ctx.fillText("PRÊMIO", splitX / 2, h / 2);
			ctx.letterSpacing = "0px";
			ctx.globalAlpha = 1;
		}

		drawStamps(ctx, data, splitX + 8, 16, w - splitX - 16, h - 44);

		ctx.fillStyle = rightTextColor;
		ctx.globalAlpha = 0.45;
		ctx.font = "9px Inter, sans-serif";
		ctx.textAlign = "center";
		ctx.fillText(
			data.rulesText || `${data.stampCount} carimbos`,
			(splitX + w) / 2,
			h - 12,
		);
		ctx.globalAlpha = 1;
		ctx.textAlign = "left";
	},

	grade(ctx, data, w, h) {
		const textColor = getContrastColor(getBgBaseColor(data));

		ctx.fillStyle = data.primaryColor;
		ctx.font = "bold 11px Inter, sans-serif";
		ctx.letterSpacing = "2px";
		ctx.textAlign = "center";
		ctx.fillText("CARTÃO FIDELIDADE", w / 2, 20);
		ctx.letterSpacing = "0px";

		drawStamps(ctx, data, 0, 28, w, h - 60, true);

		if (data.rewardText) {
			ctx.fillStyle = data.primaryColor;
			ctx.font = "10px Inter, sans-serif";
			ctx.fillText(data.rewardText, w / 2, h - 26);
		}

		if (data.rulesText) {
			ctx.fillStyle = textColor;
			ctx.globalAlpha = 0.5;
			ctx.font = "9px Inter, sans-serif";
			ctx.fillText(data.rulesText, w / 2, h - 12);
			ctx.globalAlpha = 1;
		}

		ctx.textAlign = "left";
	},
};

export const BackCanvas = forwardRef<CanvasHandle, BackCanvasProps>(
	function BackCanvas({ backData, template }, ref) {
		const canvasRef = useRef<HTMLCanvasElement>(null);

		useImperativeHandle(ref, () => ({
			getDataURL() {
				return canvasRef.current?.toDataURL("image/png") ?? "";
			},
		}));

		useEffect(() => {
			const canvas = canvasRef.current;
			if (!canvas) return;
			const ctx = canvas.getContext("2d");
			if (!ctx) return;

			ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
			drawBackground(ctx, backData.background, CANVAS_WIDTH, CANVAS_HEIGHT);

			const renderLayout = BACK_LAYOUTS[template.backLayout];
			renderLayout(ctx, backData, CANVAS_WIDTH, CANVAS_HEIGHT);
		}, [backData, template]);

		return (
			<div
				className="rounded-lg border border-border shadow-sm"
				style={{ display: "inline-block" }}
			>
				<canvas
					ref={canvasRef}
					width={CANVAS_WIDTH}
					height={CANVAS_HEIGHT}
					aria-label="Prévia do verso do cartão fidelidade com área de carimbos"
					style={{ display: "block" }}
				/>
			</div>
		);
	},
);
