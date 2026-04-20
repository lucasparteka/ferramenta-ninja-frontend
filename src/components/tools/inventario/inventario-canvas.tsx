"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import {
	LANDSCAPE_H,
	LANDSCAPE_W,
	PORTRAIT_H,
	PORTRAIT_W,
	renderInventario,
} from "@/lib/inventario/renderer";
import type { CanvasHandle, InventarioState } from "@/lib/inventario/types";

type InventarioCanvasProps = {
	state: InventarioState;
};

export const InventarioCanvas = forwardRef<
	CanvasHandle,
	InventarioCanvasProps
>(function InventarioCanvas({ state }, ref) {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	const isLandscape = state.orientation === "landscape";
	const canvasW = isLandscape ? LANDSCAPE_W : PORTRAIT_W;
	const canvasH = isLandscape ? LANDSCAPE_H : PORTRAIT_H;

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
		renderInventario(ctx, state);
	}, [state]);

	return (
		<canvas
			ref={canvasRef}
			width={canvasW}
			height={canvasH}
			style={{ display: "block", width: "100%", height: "auto" }}
			aria-label="Pré-visualização do controle de estoque"
		/>
	);
});
