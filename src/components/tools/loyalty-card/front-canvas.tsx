"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { siFacebook, siInstagram, siTiktok, siWhatsapp } from "simple-icons";
import type {
	Background,
	CanvasHandle,
	FrontData,
	FrontLayout,
	SocialIconStyle,
	SocialNetwork,
	Template,
} from "./types";

type BrandIcon = { path: string; hex: string };

const SOCIAL_ICONS: Record<SocialNetwork, BrandIcon | null> = {
	facebook: siFacebook,
	instagram: siInstagram,
	whatsapp: siWhatsapp,
	tiktok: siTiktok,
	website: null,
};

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
			const cx = w / 2;
			const cy = h / 2;
			const d = (w + h) / 2 / Math.SQRT2;
			grad = ctx.createLinearGradient(cx - d, cy - d, cx + d, cy + d);
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
	ctx.globalAlpha = 0.04;
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

function getSocialPlaceholder(network: SocialNetwork): string {
	const map: Record<SocialNetwork, string> = {
		facebook: "/sua-página",
		instagram: "@sua-conta",
		whatsapp: "(11) 99999-9999",
		tiktok: "@sua-conta",
		website: "www.seusite.com",
	};
	return map[network];
}

export function drawSocialIcon(
	ctx: CanvasRenderingContext2D,
	network: SocialNetwork,
	x: number,
	y: number,
	size: number,
	color: string,
	style: SocialIconStyle | "badge" = "badge",
) {
	const s = size;
	ctx.save();
	ctx.translate(x, y);

	const brandIcon = SOCIAL_ICONS[network];

	if (style === "badge") {
		ctx.fillStyle = color;
		ctx.beginPath();
		ctx.roundRect(0, 0, s, s, Math.round(s * 0.22));
		ctx.fill();

		const contrast = getContrastColor(color);

		if (brandIcon) {
			const padding = s * 0.15;
			const iconArea = s - padding * 2;
			const scale = iconArea / 24;
			ctx.translate(padding, padding);
			ctx.scale(scale, scale);
			ctx.fillStyle = contrast;
			ctx.fill(new Path2D(brandIcon.path));
		} else {
			ctx.strokeStyle = contrast;
			ctx.lineWidth = Math.max(1, s * 0.09);
			ctx.beginPath();
			ctx.arc(s / 2, s / 2, s * 0.34, 0, Math.PI * 2);
			ctx.stroke();
			ctx.beginPath();
			ctx.moveTo(s * 0.16, s / 2);
			ctx.lineTo(s * 0.84, s / 2);
			ctx.stroke();
			ctx.beginPath();
			ctx.ellipse(s / 2, s / 2, s * 0.16, s * 0.34, 0, 0, Math.PI * 2);
			ctx.stroke();
		}
	} else {
		const iconColor =
			style === "colorido" && brandIcon ? `#${brandIcon.hex}` : color;

		if (brandIcon) {
			const padding = s * 0.1;
			const iconArea = s - padding * 2;
			const scale = iconArea / 24;
			ctx.translate(padding, padding);
			ctx.scale(scale, scale);
			ctx.fillStyle = iconColor;
			ctx.fill(new Path2D(brandIcon.path));
		} else {
			ctx.strokeStyle = color;
			ctx.lineWidth = Math.max(1, s * 0.09);
			ctx.beginPath();
			ctx.arc(s / 2, s / 2, s * 0.34, 0, Math.PI * 2);
			ctx.stroke();
			ctx.beginPath();
			ctx.moveTo(s * 0.16, s / 2);
			ctx.lineTo(s * 0.84, s / 2);
			ctx.stroke();
			ctx.beginPath();
			ctx.ellipse(s / 2, s / 2, s * 0.16, s * 0.34, 0, 0, Math.PI * 2);
			ctx.stroke();
		}
	}

	ctx.restore();
}

const FRONT_LAYOUTS: Record<FrontLayout, LayoutFn> = {
	classico(ctx, data, w, h) {
		const bandH = 28;
		const bandY = Math.round(h * 0.52);
		const textColor = getContrastColor(getBgBaseColor(data.background));
		const bandTextColor = getContrastColor(data.primaryColor);

		ctx.fillStyle = data.primaryColor;
		ctx.fillRect(0, bandY, w, bandH);

		ctx.fillStyle = bandTextColor;
		ctx.font = "bold 11px Inter, sans-serif";
		ctx.letterSpacing = "2px";
		ctx.textAlign = "center";
		ctx.fillText("CARTÃO FIDELIDADE", w / 2, bandY + bandH / 2 + 4);
		ctx.letterSpacing = "0px";

		if (data.logoPreview) {
			renderLogo(ctx, data.logoPreview, w / 2, bandY / 2, 120, 120, true);
		} else {
			ctx.fillStyle = textColor;
			ctx.font = "bold 28px Inter, sans-serif";
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";
			ctx.fillText(data.businessName || "Sua Marca", w / 2, bandY / 2, w - 40);
			ctx.textBaseline = "alphabetic";
		}

		const footerY = bandY + bandH;
		const footerH = h - footerY;
		const entries = (data.socialEntries ?? []).slice(0, 2);
		const iconSize = 14;
		const iconTextGap = 5;

		console.log("entries", entries);

		ctx.font = "10px Inter, sans-serif";
		ctx.textBaseline = "middle";

		const positions = entries.length <= 1 ? [w / 2] : [w / 4, (3 * w) / 4];

		for (let i = 0; i < entries.length && i < 2; i++) {
			const entry = entries[i];
			const handle = entry.handle || getSocialPlaceholder(entry.network);
			const textWidth = ctx.measureText(handle).width;
			const entryWidth = iconSize + iconTextGap + textWidth;
			const ex = positions[i] - entryWidth / 2;
			const cy = footerY + footerH / 2;

			if (entry.handle) {
				drawSocialIcon(
					ctx,
					entry.network,
					ex,
					cy - iconSize / 2,
					iconSize,
					textColor,
					data.socialIconStyle ?? "flat",
				);

				ctx.fillStyle = entry.handle ? textColor : `${textColor}`;
				ctx.textAlign = "left";
				ctx.fillText(handle, ex + iconSize + iconTextGap, cy);
			}
		}

		ctx.textBaseline = "alphabetic";
		ctx.textAlign = "left";
	},

	moderno(ctx, data, w, h) {
		const textColor = getContrastColor(getBgBaseColor(data.background));

		if (data.businessName) {
			ctx.fillStyle = data.primaryColor;
			ctx.font = "bold 26px Inter, sans-serif";
			ctx.textAlign = "left";
			ctx.fillText(data.businessName || "Nome do Negócio", 20, 90);

			const nameWidth = ctx.measureText(
				data.businessName || "Nome do Negócio",
			).width;
			ctx.fillStyle = data.primaryColor;
			ctx.fillRect(20, 98, Math.min(nameWidth, w - 130), 2);
		}

		if (data.slogan) {
			ctx.fillStyle = textColor;
			ctx.font = "12px Inter, sans-serif";
			ctx.fillText(data.slogan, 20, 118);
		}

		if (data.contactInfo) {
			ctx.fillStyle = textColor;
			ctx.font = "11px Inter, sans-serif";
			ctx.textAlign = "right";
			ctx.fillText(data.contactInfo, w - 16, h - 14);
			ctx.globalAlpha = 1;
			ctx.textAlign = "left";
		}

		renderLogo(ctx, data.logoPreview, w - 120, 16, 100, 100);
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
		const margin = 20;
		const rectX = margin;
		const rectY = margin;
		const rectW = w - margin * 2;
		const rectH = h - margin * 2;

		ctx.strokeStyle = data.primaryColor;
		ctx.lineWidth = 1.2;
		ctx.strokeRect(rectX, rectY, rectW, rectH);

		const hasLogo = !!data.logoPreview;
		const entry = data.socialEntries?.[0];
		const hasSocial = !!entry?.handle;
		const hasContact = !!data.contactInfo;
		const hasExtra = hasSocial || hasContact;

		if (hasLogo) {
			renderLogo(ctx, data.logoPreview, w / 2, 70, 120, 120, true);
		}

		const nameY = hasLogo ? 118 : hasExtra ? 80 : 96;
		if (data.businessName) {
			ctx.fillStyle = data.primaryColor;
			ctx.font = `bold ${hasLogo ? 16 : 20}px Inter, sans-serif`;
			ctx.textAlign = "center";
			ctx.fillText(data.businessName, w / 2, nameY, rectW - 20);
		}

		const logoBottom = 104;
		const sepY = data.businessName
			? nameY + 12
			: hasLogo
				? logoBottom + 6
				: nameY + 12;
		const sepHalfW = rectW * 0.3;
		ctx.strokeStyle = data.primaryColor;
		ctx.beginPath();
		ctx.moveTo(w / 2 - sepHalfW, sepY);
		ctx.lineTo(w / 2 + sepHalfW, sepY);
		ctx.stroke();

		if (hasExtra) {
			const bottomTop = sepY + 10;
			const bottomH = rectY + rectH - bottomTop - 8;

			if (hasSocial && hasContact) {
				const socialCY = bottomTop + bottomH * 0.35;
				const contactY = bottomTop + bottomH * 0.72;
				const iconSize = 14;
				const iconTextGap = 5;
				ctx.font = "500 12px Inter, sans-serif";
				ctx.textBaseline = "middle";
				const textWidth = ctx.measureText(entry.handle).width;
				const entryWidth = iconSize + iconTextGap + textWidth;
				const ex = w / 2 - entryWidth / 2;
				drawSocialIcon(
					ctx,
					entry.network,
					ex,
					socialCY - iconSize / 2,
					iconSize,
					data.primaryColor,
					data.socialIconStyle ?? "flat",
				);
				ctx.fillStyle = data.primaryColor;
				ctx.textAlign = "left";
				ctx.fillText(entry.handle, ex + iconSize + iconTextGap, socialCY);
				ctx.textBaseline = "alphabetic";
				ctx.font = "500 12px Inter, sans-serif";
				ctx.textAlign = "center";
				ctx.fillText(data.contactInfo, w / 2, contactY, rectW - 40);
			} else if (hasSocial) {
				const cy = bottomTop + bottomH / 2;
				const iconSize = 14;
				const iconTextGap = 5;
				ctx.font = "500 12px Inter, sans-serif";
				ctx.textBaseline = "middle";
				const textWidth = ctx.measureText(entry.handle).width;
				const entryWidth = iconSize + iconTextGap + textWidth;
				const ex = w / 2 - entryWidth / 2;
				drawSocialIcon(
					ctx,
					entry.network,
					ex,
					cy - iconSize / 2,
					iconSize,
					data.primaryColor,
					data.socialIconStyle ?? "flat",
				);
				ctx.fillStyle = data.primaryColor;
				ctx.textAlign = "left";
				ctx.fillText(entry.handle, ex + iconSize + iconTextGap, cy);
				ctx.textBaseline = "alphabetic";
			} else {
				const cy = bottomTop + bottomH / 2;
				ctx.fillStyle = data.primaryColor;
				ctx.font = "500 12px Inter, sans-serif";
				ctx.textAlign = "center";
				ctx.fillText(data.contactInfo, w / 2, cy, rectW - 40);
			}
		}

		ctx.textAlign = "left";
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
		const hasLogo = !!data.logoPreview;

		const nameY = hasLogo ? 106 : 90;

		if (hasLogo) {
			renderLogo(ctx, data.logoPreview, w / 2, 52, 62, 62, true);
		}

		if (data.businessName) {
			ctx.fillStyle = textColor;
			ctx.font = `bold ${hasLogo ? 18 : 22}px Inter, sans-serif`;
			ctx.textAlign = "center";
			ctx.fillText(data.businessName, w / 2, nameY, w - 40);
		}

		if (data.slogan) {
			ctx.fillStyle = textColor;
			ctx.globalAlpha = 0.6;
			ctx.font = "11px Inter, sans-serif";
			ctx.fillText(data.slogan, w / 2, nameY + 18, w - 60);
			ctx.globalAlpha = 1;
		}

		const entry = data.socialEntries?.[0];
		if (entry) {
			const iconSize = 17;
			const iconTextGap = 5;
			const handle = entry.handle || getSocialPlaceholder(entry.network);
			ctx.font = "10px Inter, sans-serif";
			ctx.textBaseline = "middle";
			const textWidth = ctx.measureText(handle).width;
			const entryWidth = iconSize + iconTextGap + textWidth;
			const ex = w / 2 - entryWidth / 2;
			const cy = h - 22;

			drawSocialIcon(
				ctx,
				entry.network,
				ex,
				cy - iconSize / 2,
				iconSize,
				textColor,
				data.socialIconStyle ?? "flat",
			);

			ctx.fillStyle = entry.handle ? textColor : `${textColor}66`;
			ctx.textAlign = "left";
			ctx.fillText(handle, ex + iconSize + iconTextGap, cy);
			ctx.textBaseline = "alphabetic";
		}

		ctx.textAlign = "left";
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
