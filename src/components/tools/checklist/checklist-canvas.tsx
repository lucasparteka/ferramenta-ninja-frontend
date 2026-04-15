"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import {
	CANVAS_HEIGHT,
	CANVAS_WIDTH,
	renderChecklist,
} from "@/lib/checklist/renderer";
import type { CanvasHandle, ChecklistState } from "@/lib/checklist/types";

type ChecklistCanvasProps = {
	state: ChecklistState;
};

export const ChecklistCanvas = forwardRef<CanvasHandle, ChecklistCanvasProps>(
	function ChecklistCanvas({ state }, ref) {
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
			renderChecklist(ctx, state);
		}, [state]);

		return (
			<canvas
				ref={canvasRef}
				width={CANVAS_WIDTH}
				height={CANVAS_HEIGHT}
				style={{ display: "block", width: "100%", height: "auto" }}
				aria-label="Pré-visualização do checklist"
			/>
		);
	},
);
