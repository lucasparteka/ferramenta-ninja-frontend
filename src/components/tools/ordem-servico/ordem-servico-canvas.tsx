"use client";

import {
	forwardRef,
	useEffect,
	useImperativeHandle,
	useRef,
	useState,
} from "react";
import {
	CANVAS_HEIGHT,
	CANVAS_WIDTH,
	renderOrdemServico,
} from "@/lib/ordem-servico/renderer";
import type {
	CanvasHandle,
	OrdemServicoState,
} from "@/lib/ordem-servico/types";

type OrdemServicoCanvasProps = {
	state: OrdemServicoState;
};

export const OrdemServicoCanvas = forwardRef<
	CanvasHandle,
	OrdemServicoCanvasProps
>(function OrdemServicoCanvas({ state }, ref) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [logoImg, setLogoImg] = useState<HTMLImageElement | null>(null);

	useImperativeHandle(ref, () => ({
		getDataURL() {
			return canvasRef.current?.toDataURL("image/png") ?? "";
		},
	}));

	useEffect(() => {
		if (!state.prestador.logo) {
			setLogoImg(null);
			return;
		}
		const img = new window.Image();
		img.onload = () => setLogoImg(img);
		img.src = state.prestador.logo;
	}, [state.prestador.logo]);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;
		renderOrdemServico(ctx, state, logoImg ?? undefined);
	}, [state, logoImg]);

	return (
		<canvas
			ref={canvasRef}
			width={CANVAS_WIDTH}
			height={CANVAS_HEIGHT}
			style={{ display: "block", width: "100%", height: "auto" }}
			aria-label="Pré-visualização da ordem de serviço"
		/>
	);
});
