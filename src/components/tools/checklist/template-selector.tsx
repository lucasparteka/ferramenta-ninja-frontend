"use client";

import { useEffect, useRef } from "react";
import type { ChecklistTemplate } from "@/lib/checklist/types";

const THUMB_W = 80;
const THUMB_H = 113;

type TemplateSelectorProps = {
	templates: ChecklistTemplate[];
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
						className={`flex w-24 shrink-0 flex-col items-center gap-2 rounded-lg border-2 p-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
							isSelected
								? "border-primary bg-primary/5"
								: "border-border bg-card hover:border-primary/40 hover:bg-muted"
						}`}
					>
						<TemplateThumb template={template} />
						<span className="w-full text-center text-xs font-medium leading-tight text-foreground">
							{template.name}
						</span>
					</button>
				);
			})}
		</div>
	);
}

type TemplateThumbProps = {
	template: ChecklistTemplate;
};

function TemplateThumb({ template }: TemplateThumbProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		ctx.clearRect(0, 0, THUMB_W, THUMB_H);

		ctx.fillStyle = template.style.backgroundColor;
		ctx.fillRect(0, 0, THUMB_W, THUMB_H);

		ctx.fillStyle = "#111827";
		ctx.fillRect(6, 6, THUMB_W - 12, 14);

		const itemH = template.layout.spacing === "compact" ? 10 : 14;
		const cols = template.layout.columns;
		const colW = cols === 2 ? (THUMB_W - 18) / 2 : THUMB_W - 12;
		const colX = [6, 6 + colW + 6];
		const colY = [28, 28];
		const itemCount = Math.min(
			template.content.items.length,
			cols === 2 ? 10 : 6,
		);

		for (let i = 0; i < itemCount; i++) {
			const col = cols === 2 ? i % 2 : 0;
			const x = colX[col];
			const y = colY[col];

			if (y + itemH > THUMB_H - 6) break;

			if (template.layout.showCheckbox) {
				ctx.strokeStyle = "#9ca3af";
				ctx.lineWidth = 1;
				ctx.strokeRect(x, y + 1, 6, 6);
				ctx.fillStyle = "#d1d5db";
				ctx.fillRect(x + 8, y + 3, colW - 10, 3);
			} else {
				ctx.fillStyle = "#d1d5db";
				ctx.fillRect(x, y + 3, colW, 3);
			}

			if (template.layout.showDividers) {
				ctx.strokeStyle = "#e5e7eb";
				ctx.lineWidth = 0.5;
				ctx.beginPath();
				ctx.moveTo(x, y + itemH);
				ctx.lineTo(x + colW, y + itemH);
				ctx.stroke();
			}

			colY[col] += itemH;
		}
	}, [template]);

	return (
		<canvas
			ref={canvasRef}
			width={THUMB_W}
			height={THUMB_H}
			role="img"
			aria-label={template.name}
			style={{ display: "block", borderRadius: 4, border: "1px solid #e5e7eb" }}
		/>
	);
}
