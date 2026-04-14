"use client";

import { useEffect, useRef } from "react";
import { drawBackground } from "./front-canvas";
import type { Template } from "./types";

const THUMB_W = 90;
const THUMB_H = 50;

type TemplateSelectorProps = {
	templates: Template[];
	selectedId: string;
	onSelect: (id: string) => void;
};

export function TemplateSelector({
	templates,
	selectedId,
	onSelect,
}: TemplateSelectorProps) {
	return (
		<div className="flex gap-3 overflow-x-auto pb-2">
			{templates.map((template) => {
				const isSelected = template.id === selectedId;
				return (
					<button
						key={template.id}
						type="button"
						onClick={() => onSelect(template.id)}
						aria-pressed={isSelected}
						className={`flex flex-col items-center gap-2 rounded-lg border-2 p-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
							isSelected
								? "border-primary bg-primary/5"
								: "border-border bg-card hover:border-primary/40 hover:bg-muted"
						}`}
					>
						<TemplateThumb template={template} />
						<span className="whitespace-nowrap text-xs font-medium text-foreground">
							{template.name}
						</span>
					</button>
				);
			})}
		</div>
	);
}

type TemplateThumbProps = {
	template: Template;
};

function TemplateThumb({ template }: TemplateThumbProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		ctx.clearRect(0, 0, THUMB_W, THUMB_H);
		drawBackground(ctx, template.defaultFront.background, THUMB_W, THUMB_H);

		const primary = template.defaultFront.primaryColor;
		ctx.fillStyle = primary;
		ctx.strokeStyle = primary;

		switch (template.frontLayout) {
			case "classico": {
				ctx.fillRect(0, 0, THUMB_W, 5);
				ctx.fillRect(0, 5, 3, THUMB_H - 5);
				ctx.globalAlpha = 0.7;
				ctx.fillRect(8, 14, 38, 5);
				ctx.fillRect(8, 22, 26, 4);
				ctx.globalAlpha = 0.3;
				ctx.fillRect(8, 38, 20, 3);
				ctx.globalAlpha = 1;
				ctx.globalAlpha = 0.5;
				ctx.fillRect(THUMB_W - 24, 10, 16, 16);
				ctx.globalAlpha = 1;
				break;
			}
			case "moderno": {
				ctx.globalAlpha = 0.8;
				ctx.fillRect(8, 18, 44, 6);
				ctx.fillRect(8, 26, 44, 2);
				ctx.globalAlpha = 0.4;
				ctx.fillRect(8, 31, 30, 4);
				ctx.globalAlpha = 0.3;
				ctx.fillRect(THUMB_W - 28, 40, 20, 3);
				ctx.globalAlpha = 1;
				ctx.globalAlpha = 0.5;
				ctx.fillRect(THUMB_W - 22, 8, 14, 14);
				ctx.globalAlpha = 1;
				break;
			}
			case "dividido": {
				const divX = Math.floor(THUMB_W * 0.4);
				ctx.fillRect(0, 0, divX, THUMB_H);
				ctx.globalAlpha = 0.5;
				ctx.beginPath();
				ctx.arc(divX / 2, THUMB_H / 2, 10, 0, Math.PI * 2);
				ctx.stroke();
				ctx.globalAlpha = 0.8;
				ctx.fillRect(divX + 6, 14, 30, 5);
				ctx.globalAlpha = 0.4;
				ctx.fillRect(divX + 6, 22, 22, 4);
				ctx.globalAlpha = 0.3;
				ctx.fillRect(divX + 6, 29, 18, 3);
				ctx.globalAlpha = 1;
				break;
			}
			case "elegante": {
				const bandH = Math.floor(THUMB_H * 0.35);
				ctx.fillRect(0, THUMB_H - bandH, THUMB_W, bandH);
				ctx.globalAlpha = 0.8;
				ctx.fillRect(8, 10, 38, 5);
				ctx.globalAlpha = 0.4;
				ctx.fillRect(8, 18, 26, 4);
				ctx.globalAlpha = 0.5;
				ctx.fillRect(THUMB_W - 22, 8, 14, 14);
				ctx.globalAlpha = 1;
				break;
			}
			case "compacto": {
				ctx.globalAlpha = 0.5;
				ctx.strokeRect(6, 8, 18, 18);
				ctx.globalAlpha = 0.8;
				ctx.fillRect(28, 12, 30, 5);
				ctx.fillRect(28, 19, 22, 4);
				ctx.globalAlpha = 0.3;
				ctx.fillRect(6, 32, THUMB_W - 12, 1.5);
				ctx.fillRect(THUMB_W - 24, 40, 18, 3);
				ctx.globalAlpha = 1;
				break;
			}
			case "minimalista": {
				ctx.globalAlpha = 0.8;
				ctx.fillRect(THUMB_W / 2 - 22, 18, 44, 6);
				ctx.globalAlpha = 0.4;
				ctx.fillRect(THUMB_W / 2 - 14, 27, 28, 4);
				ctx.globalAlpha = 0.3;
				ctx.fillRect(THUMB_W / 2 - 10, 40, 20, 3);
				ctx.globalAlpha = 0.4;
				ctx.fillRect(THUMB_W - 20, THUMB_H - 20, 14, 14);
				ctx.globalAlpha = 1;
				break;
			}
			case "negrito": {
				const bandW = Math.floor(THUMB_W * 0.28);
				ctx.fillRect(0, 0, bandW, THUMB_H);
				ctx.globalAlpha = 0.8;
				ctx.fillRect(bandW + 6, 16, 40, 7);
				ctx.globalAlpha = 0.4;
				ctx.fillRect(bandW + 6, 26, 28, 4);
				ctx.globalAlpha = 0.3;
				ctx.fillRect(bandW + 6, 40, 22, 3);
				ctx.globalAlpha = 1;
				break;
			}
			case "grade": {
				ctx.globalAlpha = 0.8;
				ctx.fillRect(THUMB_W / 2 - 20, 8, 40, 6);
				ctx.globalAlpha = 0.4;
				ctx.fillRect(THUMB_W / 2 - 14, 17, 28, 4);
				ctx.globalAlpha = 0.25;
				ctx.beginPath();
				ctx.arc(THUMB_W / 2, 36, 9, 0, Math.PI * 2);
				ctx.stroke();
				ctx.globalAlpha = 1;
				break;
			}
		}
	}, [template]);

	return (
		<canvas
			ref={canvasRef}
			width={THUMB_W}
			height={THUMB_H}
			aria-hidden="true"
			style={{ display: "block", borderRadius: 4 }}
		/>
	);
}
