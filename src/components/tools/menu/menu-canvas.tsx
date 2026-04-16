"use client";

import {
	forwardRef,
	useEffect,
	useImperativeHandle,
	useMemo,
	useRef,
	useState,
} from "react";
import { paginateMenu, renderMenuPage } from "@/lib/menu/renderer";
import type { MenuData, MenuTemplate, MultiCanvasHandle } from "@/lib/menu/types";

type MenuCanvasProps = {
	data: MenuData;
	template: MenuTemplate;
};

export const MenuCanvas = forwardRef<MultiCanvasHandle, MenuCanvasProps>(
	function MenuCanvas({ data, template }, ref) {
		const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);
		const [logoImg, setLogoImg] = useState<HTMLImageElement | null>(null);

		useEffect(() => {
			if (!data.logo?.dataUrl) {
				setLogoImg(null);
				return;
			}
			const img = new Image();
			img.onload = () => setLogoImg(img);
			img.src = data.logo.dataUrl;
		}, [data.logo?.dataUrl]);

		const slices = useMemo(() => paginateMenu(data, template, logoImg), [data, template, logoImg]);

		useImperativeHandle(ref, () => ({
			getDataURLs() {
				return canvasRefs.current
					.filter(Boolean)
					.map((c) => c!.toDataURL("image/png"));
			},
		}));

		useEffect(() => {
			slices.forEach((slice, i) => {
				const canvas = canvasRefs.current[i];
				if (!canvas) return;
				const ctx = canvas.getContext("2d");
				if (!ctx) return;
				renderMenuPage(ctx, data, template, slice, i, logoImg);
			});
		}, [data, template, slices, logoImg]);

		return (
			<div className="flex flex-col gap-3">
				{slices.map((_, i) => (
					<div key={i}>
						<canvas
							ref={(el) => {
								canvasRefs.current[i] = el;
							}}
							width={1240}
							height={1754}
							className="block w-full h-auto"
						/>
						{slices.length > 1 && (
							<p className="mt-1.5 text-center text-xs text-muted-foreground">
								Página {i + 1} de {slices.length}
							</p>
						)}
					</div>
				))}
			</div>
		);
	},
);
