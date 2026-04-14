"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import type {
	Background,
	CanvasHandle,
	FrontData,
	FrontLayout,
	Template,
} from "./types";

const CANVAS_WIDTH = 360;
const CANVAS_HEIGHT = 200;

type FrontCanvasProps = {
	frontData: FrontData;
	template: Template;
};

export const FrontCanvas = forwardRef<CanvasHandle, FrontCanvasProps>(
	function FrontCanvas({ frontData, template }, ref) {
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
			drawBackground(ctx, frontData.background, CANVAS_WIDTH, CANVAS_HEIGHT);

			const renderLayout = FRONT_LAYOUTS[template.frontLayout];
			renderLayout(ctx, frontData, CANVAS_WIDTH, CANVAS_HEIGHT);
		}, [frontData, template]);

		return (
			<div
				className="rounded-lg border border-border shadow-sm"
				style={{ display: "inline-block" }}
			>
				<canvas
					ref={canvasRef}
					width={CANVAS_WIDTH}
					height={CANVAS_HEIGHT}
					aria-label="Prévia da frente do cartão fidelidade"
					style={{ display: "block" }}
				/>
			</div>
		);
	},
);

export function drawBackground(
	ctx: CanvasRenderingContext2D,
	bg: Background,
	w: number,
	h: number,
) {
	if (bg.type === "solid") {
		ctx.fillStyle = bg.color;
		ctx.fillRect(0, 0, w, h);
		return;
	}

	if (bg.type === "gradient") {
		let grad: CanvasGradient;
		if (bg.direction === "to-right") {
			grad = ctx.createLinearGradient(0, 0, w, 0);
		} else if (bg.direction === "to-bottom") {
			grad = ctx.createLinearGradient(0, 0, 0, h);
		} else {
			grad = ctx.createLinearGradient(0, 0, w, h);
		}
		grad.addColorStop(0, bg.color1);
		grad.addColorStop(1, bg.color2);
		ctx.fillStyle = grad;
		ctx.fillRect(0, 0, w, h);
		return;
	}

	ctx.fillStyle = bg.color;
	ctx.fillRect(0, 0, w, h);

	const patternColor = getContrastColor(bg.color);
	ctx.save();
	ctx.globalAlpha = 0.08;
	ctx.strokeStyle = patternColor;
	ctx.fillStyle = patternColor;

	if (bg.texture === "dots") {
		const spacing = 8;
		for (let x = spacing; x < w; x += spacing) {
			for (let y = spacing; y < h; y += spacing) {
				ctx.beginPath();
				ctx.arc(x, y, 1.5, 0, Math.PI * 2);
				ctx.fill();
			}
		}
	} else if (bg.texture === "lines") {
		ctx.lineWidth = 0.8;
		const spacing = 8;
		for (let i = -h; i < w + h; i += spacing) {
			ctx.beginPath();
			ctx.moveTo(i, 0);
			ctx.lineTo(i + h, h);
			ctx.stroke();
		}
	} else if (bg.texture === "grid") {
		ctx.lineWidth = 0.5;
		const spacing = 10;
		for (let x = 0; x <= w; x += spacing) {
			ctx.beginPath();
			ctx.moveTo(x, 0);
			ctx.lineTo(x, h);
			ctx.stroke();
		}
		for (let y = 0; y <= h; y += spacing) {
			ctx.beginPath();
			ctx.moveTo(0, y);
			ctx.lineTo(w, y);
			ctx.stroke();
		}
	} else if (bg.texture === "stripes") {
		const stripeW = 4;
		const spacing = 8;
		for (let x = 0; x < w; x += spacing) {
			ctx.fillRect(x, 0, stripeW, h);
		}
	}

	ctx.restore();
}

type LayoutFn = (
	ctx: CanvasRenderingContext2D,
	data: FrontData,
	w: number,
	h: number,
) => void;

function renderLogo(
	ctx: CanvasRenderingContext2D,
	preview: string | null,
	x: number,
	y: number,
	maxW: number,
	maxH: number,
	centered = false,
) {
	if (!preview) return;
	const img = new Image();
	img.onload = () => {
		const scale = Math.min(maxW / img.width, maxH / img.height);
		const dw = img.width * scale;
		const dh = img.height * scale;
		const dx = centered ? x - dw / 2 : x;
		const dy = centered ? y - dh / 2 : y;
		ctx.drawImage(img, dx, dy, dw, dh);
	};
	img.src = preview;
}

function getContrastColor(hex: string): string {
	const r = parseInt(hex.slice(1, 3), 16);
	const g = parseInt(hex.slice(3, 5), 16);
	const b = parseInt(hex.slice(5, 7), 16);
	const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
	return luminance > 0.5 ? "#1c1917" : "#ffffff";
}

function getBgBaseColor(bg: Background): string {
	if (bg.type === "solid") return bg.color;
	if (bg.type === "gradient") return bg.color1;
	return bg.color;
}

const FRONT_LAYOUTS: Record<FrontLayout, LayoutFn> = {
	classico(ctx, data, w, h) {
		const textColor = getContrastColor(getBgBaseColor(data.background));
		ctx.fillStyle = data.primaryColor;
		ctx.fillRect(0, 0, w, 8);
		ctx.fillRect(0, 8, 4, h - 8);

		ctx.fillStyle = data.primaryColor;
		ctx.font = "bold 22px Inter, sans-serif";
		ctx.textAlign = "left";
		ctx.fillText(data.businessName || "Nome do Negócio", 20, 52);

		if (data.slogan) {
			ctx.fillStyle = textColor;
			ctx.font = "13px Inter, sans-serif";
			ctx.fillText(data.slogan, 20, 78);
		}

		if (data.contactInfo) {
			ctx.fillStyle = textColor;
			ctx.globalAlpha = 0.7;
			ctx.font = "11px Inter, sans-serif";
			ctx.fillText(data.contactInfo, 20, 98);
			ctx.globalAlpha = 1;
		}

		renderLogo(ctx, data.logoPreview, w - 100, 20, 80, 80);
	},

	moderno(ctx, data, w, h) {
		const textColor = getContrastColor(getBgBaseColor(data.background));

		ctx.fillStyle = data.primaryColor;
		ctx.font = "bold 26px Inter, sans-serif";
		ctx.textAlign = "left";
		ctx.fillText(data.businessName || "Nome do Negócio", 20, 90);

		const nameWidth = ctx.measureText(
			data.businessName || "Nome do Negócio",
		).width;
		ctx.fillStyle = data.primaryColor;
		ctx.fillRect(20, 98, Math.min(nameWidth, w - 130), 2);

		if (data.slogan) {
			ctx.fillStyle = textColor;
			ctx.font = "12px Inter, sans-serif";
			ctx.fillText(data.slogan, 20, 118);
		}

		if (data.contactInfo) {
			ctx.fillStyle = textColor;
			ctx.globalAlpha = 0.5;
			ctx.font = "10px Inter, sans-serif";
			ctx.textAlign = "right";
			ctx.fillText(data.contactInfo, w - 16, h - 14);
			ctx.globalAlpha = 1;
			ctx.textAlign = "left";
		}

		renderLogo(ctx, data.logoPreview, w - 80, 16, 64, 64);
	},

	dividido(ctx, data, w, h) {
		const divX = Math.floor(w * 0.4);
		ctx.fillStyle = data.primaryColor;
		ctx.fillRect(0, 0, divX, h);

		const logoColor = getContrastColor(data.primaryColor);
		if (data.logoPreview) {
			renderLogo(ctx, data.logoPreview, divX / 2, h / 2, 64, 64, true);
		} else {
			ctx.fillStyle = logoColor;
			ctx.globalAlpha = 0.3;
			ctx.beginPath();
			ctx.arc(divX / 2, h / 2, 24, 0, Math.PI * 2);
			ctx.fill();
			ctx.globalAlpha = 1;
		}

		const textColor = getContrastColor(getBgBaseColor(data.background));
		const textX = divX + 16;

		ctx.fillStyle = data.primaryColor;
		ctx.font = "bold 18px Inter, sans-serif";
		ctx.textAlign = "left";
		const maxTextW = w - textX - 12;
		const name = data.businessName || "Nome do Negócio";
		ctx.fillText(name, textX, 56, maxTextW);

		if (data.slogan) {
			ctx.fillStyle = textColor;
			ctx.font = "12px Inter, sans-serif";
			ctx.fillText(data.slogan, textX, 76, maxTextW);
		}

		if (data.contactInfo) {
			ctx.fillStyle = textColor;
			ctx.globalAlpha = 0.6;
			ctx.font = "10px Inter, sans-serif";
			ctx.fillText(data.contactInfo, textX, 96, maxTextW);
			ctx.globalAlpha = 1;
		}
	},

	elegante(ctx, data, w, h) {
		const bandH = Math.floor(h * 0.35);
		const bandY = h - bandH;

		ctx.fillStyle = data.primaryColor;
		ctx.fillRect(0, bandY, w, bandH);

		const bandTextColor = getContrastColor(data.primaryColor);
		const topTextColor = getContrastColor(getBgBaseColor(data.background));

		ctx.fillStyle = topTextColor;
		ctx.font = "bold 20px Inter, sans-serif";
		ctx.textAlign = "left";
		ctx.fillText(data.businessName || "Nome do Negócio", 20, 36);

		if (data.slogan) {
			ctx.fillStyle = topTextColor;
			ctx.globalAlpha = 0.7;
			ctx.font = "12px Inter, sans-serif";
			ctx.fillText(data.slogan, 20, 56);
			ctx.globalAlpha = 1;
		}

		ctx.fillStyle = bandTextColor;
		ctx.globalAlpha = 0.9;
		ctx.font = "10px Inter, sans-serif";
		ctx.textAlign = "center";
		ctx.fillText(data.contactInfo || "", w / 2, bandY + bandH / 2 + 4);
		ctx.globalAlpha = 1;
		ctx.textAlign = "left";

		if (data.logoPreview) {
			renderLogo(ctx, data.logoPreview, w - 84, 16, 64, 64);
		}
	},

	compacto(ctx, data, w, h) {
		const textColor = getContrastColor(getBgBaseColor(data.background));
		const logoSize = 44;

		if (data.logoPreview) {
			renderLogo(ctx, data.logoPreview, 16, 16, logoSize, logoSize);
		} else {
			ctx.fillStyle = data.primaryColor;
			ctx.globalAlpha = 0.15;
			ctx.fillRect(16, 16, logoSize, logoSize);
			ctx.globalAlpha = 1;
			ctx.strokeStyle = data.primaryColor;
			ctx.lineWidth = 1.5;
			ctx.strokeRect(16, 16, logoSize, logoSize);
		}

		ctx.fillStyle = data.primaryColor;
		ctx.font = "bold 16px Inter, sans-serif";
		ctx.textAlign = "left";
		ctx.fillText(data.businessName || "Nome do Negócio", 70, 32);

		if (data.slogan) {
			ctx.fillStyle = textColor;
			ctx.font = "12px Inter, sans-serif";
			ctx.fillText(data.slogan, 70, 50);
		}

		ctx.fillStyle = data.primaryColor;
		ctx.fillRect(16, 72, w - 32, 1.5);

		if (data.contactInfo) {
			ctx.fillStyle = textColor;
			ctx.globalAlpha = 0.6;
			ctx.font = "10px Inter, sans-serif";
			ctx.textAlign = "right";
			ctx.fillText(data.contactInfo, w - 16, h - 14);
			ctx.globalAlpha = 1;
			ctx.textAlign = "left";
		}
	},

	minimalista(ctx, data, w, h) {
		const textColor = getContrastColor(getBgBaseColor(data.background));

		ctx.fillStyle = textColor;
		ctx.font = "bold 24px Inter, sans-serif";
		ctx.textAlign = "center";
		ctx.fillText(data.businessName || "Nome do Negócio", w / 2, h / 2 - 8);

		if (data.slogan) {
			ctx.fillStyle = textColor;
			ctx.globalAlpha = 0.55;
			ctx.font = "12px Inter, sans-serif";
			ctx.fillText(data.slogan, w / 2, h / 2 + 14);
			ctx.globalAlpha = 1;
		}

		if (data.contactInfo) {
			ctx.fillStyle = textColor;
			ctx.globalAlpha = 0.35;
			ctx.font = "10px Inter, sans-serif";
			ctx.fillText(data.contactInfo, w / 2, h - 16);
			ctx.globalAlpha = 1;
		}

		ctx.textAlign = "left";

		if (data.logoPreview) {
			renderLogo(ctx, data.logoPreview, w - 56, h - 56, 40, 40);
		}
	},

	negrito(ctx, data, w, h) {
		const bandW = Math.floor(w * 0.28);
		ctx.fillStyle = data.primaryColor;
		ctx.fillRect(0, 0, bandW, h);

		const textColor = getContrastColor(getBgBaseColor(data.background));
		const textX = bandW + 16;

		ctx.fillStyle = textColor;
		ctx.font = "bold 22px Inter, sans-serif";
		ctx.textAlign = "left";
		ctx.fillText(data.businessName || "Nome", textX, 68, w - textX - 12);

		if (data.slogan) {
			ctx.fillStyle = textColor;
			ctx.globalAlpha = 0.65;
			ctx.font = "12px Inter, sans-serif";
			ctx.fillText(data.slogan, textX, 90, w - textX - 12);
			ctx.globalAlpha = 1;
		}

		if (data.contactInfo) {
			ctx.fillStyle = textColor;
			ctx.globalAlpha = 0.45;
			ctx.font = "10px Inter, sans-serif";
			ctx.fillText(data.contactInfo, textX, h - 14, w - textX - 12);
			ctx.globalAlpha = 1;
		}

		if (data.logoPreview) {
			renderLogo(ctx, data.logoPreview, bandW / 2, h / 2, 44, 60, true);
		} else {
			const bandTextColor = getContrastColor(data.primaryColor);
			ctx.fillStyle = bandTextColor;
			ctx.globalAlpha = 0.3;
			ctx.font = "bold 10px Inter, sans-serif";
			ctx.textAlign = "center";
			ctx.save();
			ctx.translate(bandW / 2, h / 2);
			ctx.rotate(-Math.PI / 2);
			ctx.fillText("LOGO", 0, 4);
			ctx.restore();
			ctx.globalAlpha = 1;
			ctx.textAlign = "left";
		}
	},

	grade(ctx, data, w, h) {
		const textColor = getContrastColor(getBgBaseColor(data.background));

		ctx.fillStyle = data.primaryColor;
		ctx.font = "bold 20px Inter, sans-serif";
		ctx.textAlign = "center";
		ctx.fillText(data.businessName || "Nome do Negócio", w / 2, 44);

		if (data.slogan) {
			ctx.fillStyle = textColor;
			ctx.globalAlpha = 0.7;
			ctx.font = "12px Inter, sans-serif";
			ctx.fillText(data.slogan, w / 2, 66);
			ctx.globalAlpha = 1;
		}

		if (data.contactInfo) {
			ctx.fillStyle = textColor;
			ctx.globalAlpha = 0.45;
			ctx.font = "10px Inter, sans-serif";
			ctx.fillText(data.contactInfo, w / 2, h - 14);
			ctx.globalAlpha = 1;
		}

		ctx.textAlign = "left";

		if (data.logoPreview) {
			renderLogo(ctx, data.logoPreview, w / 2, 120, 52, 52, true);
		} else {
			ctx.strokeStyle = data.primaryColor;
			ctx.globalAlpha = 0.2;
			ctx.lineWidth = 1.5;
			ctx.beginPath();
			ctx.arc(w / 2, 120, 22, 0, Math.PI * 2);
			ctx.stroke();
			ctx.globalAlpha = 1;
		}
	},
};
