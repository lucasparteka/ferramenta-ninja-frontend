"use client";

import { motion } from "framer-motion";
import { AlertTriangle, Loader2, RotateCcw } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	FAVICON_SIZES,
	type GeneratedFaviconFile,
	generateFaviconPng,
	generateIco,
	ICO_SIZES,
} from "@/lib/image/favicon";

type Status = "loading" | "ready" | "error";

interface PreviewGridProps {
	sourceCanvas: HTMLCanvasElement;
	renderAtSize?: (
		size: number,
	) => HTMLCanvasElement | Promise<HTMLCanvasElement>;
	onGenerated: (files: GeneratedFaviconFile[], icoBlob: Blob) => void;
}

export function PreviewGrid({
	sourceCanvas,
	renderAtSize,
	onGenerated,
}: PreviewGridProps) {
	const [status, setStatus] = useState<Status>("loading");
	const [files, setFiles] = useState<GeneratedFaviconFile[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [generationKey, setGenerationKey] = useState(0);

	const onGeneratedRef = useRef(onGenerated);
	const urlsRef = useRef<string[]>([]);
	onGeneratedRef.current = onGenerated;

	useEffect(() => {
		void generationKey;
		let cancelled = false;
		const urls: string[] = [];

		(async () => {
			setStatus("loading");
			setError(null);
			try {
				const generatedFiles = await Promise.all(
					FAVICON_SIZES.map(async (size) => {
						let blob: Blob;
						if (renderAtSize) {
							const canvas = await renderAtSize(size.width);
							blob = await new Promise<Blob>((resolve, reject) => {
								canvas.toBlob((b) => {
									if (b) resolve(b);
									else reject(new Error(`Falha PNG ${size.width}`));
								}, "image/png");
							});
						} else {
							blob = await generateFaviconPng(sourceCanvas, size.width);
						}
						const dataUrl = URL.createObjectURL(blob);
						urls.push(dataUrl);
						return {
							name: size.filename,
							width: size.width,
							height: size.height,
							blob,
							dataUrl,
						};
					}),
				);

				const icoPngs = ICO_SIZES.map((s) => ({
					size: s,
					blob: generatedFiles.find((f) => f.width === s)!.blob,
				}));
				const ico = await generateIco(icoPngs);

				if (!cancelled) {
					setFiles(generatedFiles);
					setStatus("ready");
					urlsRef.current = urls;
					onGeneratedRef.current(generatedFiles, ico);
				}
			} catch (err) {
				if (!cancelled) {
					setError(err instanceof Error ? err.message : "Erro ao gerar");
					setStatus("error");
					for (const u of urls) URL.revokeObjectURL(u);
				}
			}
		})();

		return () => {
			cancelled = true;
			for (const u of urls) URL.revokeObjectURL(u);
		};
	}, [sourceCanvas, generationKey, renderAtSize]);

	useEffect(
		() => () => {
			for (const u of urlsRef.current) URL.revokeObjectURL(u);
			urlsRef.current = [];
		},
		[],
	);

	const handleRetry = useCallback(() => {
		for (const u of urlsRef.current) URL.revokeObjectURL(u);
		urlsRef.current = [];
		setFiles([]);
		setGenerationKey((k) => k + 1);
	}, []);

	if (status === "error" && error) {
		return (
			<div className="rounded-md border border-destructive/30 bg-destructive/5 p-6 text-center">
				<AlertTriangle className="mx-auto h-3.5 w-3.5 text-destructive" />
				<p className="mt-2 text-sm font-medium text-foreground">
					Erro na geração
				</p>
				<p className="mt-0.5 text-xs text-muted-foreground">{error}</p>
				<Button onClick={handleRetry} size="sm" className="mt-3">
					<RotateCcw className="mr-1.5 h-3.5 w-3.5" />
					Tentar novamente
				</Button>
			</div>
		);
	}

	return (
		<div className="space-y-3">
			<div className="flex items-center justify-between">
				<h3 className="text-caption font-semibold uppercase tracking-wider text-muted-foreground">
					Tamanhos exportados
				</h3>
				{status === "loading" && (
					<span className="inline-flex items-center gap-1.5 text-caption text-muted-foreground">
						<Loader2 className="h-3 w-3 animate-spin" />
						Gerando...
					</span>
				)}
			</div>

			{status === "loading" ? (
				<div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
					{FAVICON_SIZES.map((s) => (
						<div
							key={s.filename}
							className="animate-pulse rounded-lg border bg-muted/40 p-3"
						>
							<div className="mx-auto h-12 w-12 rounded bg-muted" />
							<div className="mx-auto mt-2 h-2.5 w-12 rounded bg-muted" />
						</div>
					))}
				</div>
			) : (
				<div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
					{files.map((file, i) => (
						<motion.div
							key={file.name}
							initial={{ opacity: 0, y: 8 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.25, delay: i * 0.04 }}
							className="rounded-lg border bg-background p-3 text-center"
						>
							<div className="flex h-14 items-center justify-center">
								{/* biome-ignore lint/performance/noImgElement: . */}
								<img
									src={file.dataUrl}
									alt=""
									className="max-h-full max-w-full object-contain"
									style={{
										imageRendering:
											file.width <= 32
												? "pixelated"
												: "-webkit-optimize-contrast",
									}}
								/>
							</div>
							<p className="mt-2 font-mono text-[10px] font-semibold text-foreground">
								{file.width}×{file.height}
							</p>
							<p className="mt-0.5 truncate text-[10px] text-muted-foreground">
								{file.name}
							</p>
						</motion.div>
					))}
				</div>
			)}
		</div>
	);
}
