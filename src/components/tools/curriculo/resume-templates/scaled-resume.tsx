"use client";

import { useEffect, useRef, useState } from "react";
import type { TemplateId } from "./config";
import { ResumeRenderer } from "./renderer";
import type { ResumeTemplateData } from "./types";

export const A4_WIDTH = 794;
export const A4_HEIGHT = Math.round(A4_WIDTH * (297 / 210));

const PAGE_BOTTOM_PADDING = 48;
const PAGE_TOP_LEAD = 20;

export function calculatePageOffsets(inner: HTMLElement): number[] {
	const totalHeight = inner.scrollHeight;
	if (totalHeight <= A4_HEIGHT) return [0];

	const elements = [
		...inner.querySelectorAll<HTMLElement>("section, .pdf-item"),
	];
	const elementBottoms = elements
		.map((el) => el.offsetTop + el.offsetHeight)
		.sort((a, b) => a - b);
	const elementTops = elements.map((el) => el.offsetTop).sort((a, b) => a - b);

	const offsets: number[] = [0];
	let pageStart = 0;

	while (true) {
		const maxEnd = pageStart + A4_HEIGHT - PAGE_BOTTOM_PADDING;
		if (totalHeight - pageStart <= A4_HEIGHT) break;

		let breakBottom = maxEnd;
		for (const bottom of elementBottoms) {
			if (bottom > pageStart + 80 && bottom <= maxEnd) breakBottom = bottom;
		}

		const nextTop = elementTops.find((top) => top >= breakBottom);
		if (nextTop === undefined) break;

		const nextPageStart = Math.max(
			pageStart + A4_HEIGHT * 0.5,
			nextTop - PAGE_TOP_LEAD,
		);
		offsets.push(nextPageStart);
		pageStart = nextPageStart;
		if (offsets.length > 20) break;
	}

	return offsets;
}

type ScaledResumeProps = {
	templateId: TemplateId;
	data: ResumeTemplateData;
	color: string;
	fontVar?: string;
	fontZoom?: number;
	className?: string;
};

export function ScaledResume({
	templateId,
	data,
	color,
	fontVar,
	fontZoom,
	className,
}: ScaledResumeProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const innerRef = useRef<HTMLDivElement>(null);
	const [scale, setScale] = useState(1);
	const [pageOffsets, setPageOffsets] = useState<number[]>([0]);

	useEffect(() => {
		const el = containerRef.current;
		if (!el) return;
		const ro = new ResizeObserver(([entry]) => {
			setScale(entry.contentRect.width / A4_WIDTH);
		});
		ro.observe(el);
		return () => ro.disconnect();
	}, []);

	// biome-ignore lint/correctness/useExhaustiveDependencies: .
	useEffect(() => {
		const inner = innerRef.current;
		if (!inner) return;
		const raf = requestAnimationFrame(() => {
			setPageOffsets(calculatePageOffsets(inner));
		});
		return () => cancelAnimationFrame(raf);
	}, [templateId, data, color, fontVar, fontZoom]);

	const pages = pageOffsets.length;

	return (
		<div className={`relative ${className ?? ""}`}>
			<div
				className="relative w-full bg-white"
				style={{ aspectRatio: "210 / 297" }}
			>
				<div
					ref={containerRef}
					className="absolute inset-0 overflow-x-hidden overflow-y-scroll"
					style={{ scrollbarWidth: "none" }}
				>
					<div
						style={{
							position: "absolute",
							top: 0,
							left: 0,
							width: A4_WIDTH,
							transformOrigin: "top left",
							transform: `scale(${scale})`,
						}}
					>
						<div ref={innerRef}>
							<ResumeRenderer
								templateId={templateId}
								data={data}
								color={color}
								fontVar={fontVar}
								fontZoom={fontZoom}
							/>
						</div>
					</div>
				</div>
			</div>
			{pages > 1 && (
				<div className="py-1.5 text-center text-xs text-muted-foreground">
					{pages} páginas
				</div>
			)}
		</div>
	);
}
