"use client";

import { motion } from "framer-motion";
import {
	AlertTriangle,
	ArrowLeft,
	Image,
	Loader2,
	RotateCcw,
} from "lucide-react";
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
	onBackToEditor: () => void;
	onReset: () => void;
	onGenerated: (files: GeneratedFaviconFile[], icoBlob: Blob) => void;
}

export function PreviewGrid({
	sourceCanvas,
	renderAtSize,
	onBackToEditor,
	onReset,
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
		// generationKey is intentionally in deps to allow retry
		void generationKey;

		let cancelled = false;
		const urls: string[] = [];

		async function run() {
			setStatus("loading");
			setError(null);

			try {
				const pngPromises = FAVICON_SIZES.map(async (size) => {
					let blob: Blob;
					let dataUrl: string;

					if (renderAtSize) {
						const canvas = await renderAtSize(size.width);
						blob = await new Promise<Blob>((resolve, reject) => {
							canvas.toBlob((b) => {
								if (b) resolve(b);
								else
									reject(
										new Error(
											`Falha ao gerar PNG ${size.width}x${size.height}`,
										),
									);
							}, "image/png");
						});
					} else {
						blob = await generateFaviconPng(sourceCanvas, size.width);
					}
					dataUrl = URL.createObjectURL(blob);
					urls.push(dataUrl);
					return {
						name: size.filename,
						width: size.width,
						height: size.height,
						blob,
						dataUrl,
					};
				});

				const generatedFiles = await Promise.all(pngPromises);

				const icoPngs = ICO_SIZES.map((icoSize) => {
					const file = generatedFiles.find((f) => f.width === icoSize)!;
					return { size: icoSize, blob: file.blob };
				});

				const ico = await generateIco(icoPngs);

				if (!cancelled) {
					setFiles(generatedFiles);
					setStatus("ready");
					urlsRef.current = urls;
					onGeneratedRef.current(generatedFiles, ico);
				}
			} catch (err) {
				if (!cancelled) {
					const message =
						err instanceof Error ? err.message : "Erro ao gerar favicons";
					setError(message);
					setStatus("error");
					for (const url of urls) {
						URL.revokeObjectURL(url);
					}
				}
			}
		}

		run();

		return () => {
			cancelled = true;
			for (const url of urls) {
				URL.revokeObjectURL(url);
			}
		};
	}, [sourceCanvas, generationKey, renderAtSize]);

	/* cleanup on unmount */
	useEffect(() => {
		return () => {
			for (const url of urlsRef.current) {
				URL.revokeObjectURL(url);
			}
			urlsRef.current = [];
		};
	}, []);

	const handleRetry = useCallback(() => {
		for (const url of urlsRef.current) {
			URL.revokeObjectURL(url);
		}
		urlsRef.current = [];
		setFiles([]);
		setGenerationKey((k) => k + 1);
	}, []);

	/* ------------------------------------------------------------------ */
	/*  Error state                                                        */
	/* ------------------------------------------------------------------ */
	if (status === "error" && error) {
		return (
			<div className="space-y-6">
				<div className="rounded-xl border border-destructive/20 bg-destructive/5 p-8 text-center">
					<AlertTriangle className="mx-auto h-10 w-10 text-destructive" />
					<h3 className="mt-3 text-lg font-semibold text-foreground">
						Erro na geração
					</h3>
					<p className="mt-1 text-sm text-muted-foreground">{error}</p>
					<div className="mt-4 flex flex-wrap justify-center gap-2">
						<Button variant="outline" onClick={onBackToEditor}>
							<ArrowLeft className="mr-2 h-4 w-4" />
							Voltar ao editor
						</Button>
						<Button onClick={handleRetry}>
							<RotateCcw className="mr-2 h-4 w-4" />
							Tentar novamente
						</Button>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center gap-3">
				<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
					<Image className="h-5 w-5" />
				</div>
				<div>
					<h2 className="text-lg font-semibold text-foreground">
						Pré-visualização dos tamanhos
					</h2>
					<p className="text-sm text-muted-foreground">
						Verifique como seu favicon ficará em cada resolução
					</p>
				</div>
			</div>

			{/* Grid */}
			{status === "loading" ? (
				<div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
					{["s1", "s2", "s3", "s4", "s5", "s6"].map((sk) => (
						<div
							key={sk}
							className="animate-pulse rounded-xl border bg-card p-4"
						>
							<div className="mx-auto flex h-20 w-20 items-center justify-center rounded-lg bg-muted" />
							<div className="mx-auto mt-3 h-4 w-16 rounded bg-muted" />
							<div className="mx-auto mt-1 h-3 w-24 rounded bg-muted" />
						</div>
					))}
				</div>
			) : (
				<div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
					{files.map((file, index) => (
						<motion.div
							key={file.name}
							initial={{ opacity: 0, y: 12 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{
								duration: 0.3,
								delay: index * 0.05,
							}}
							className="rounded-xl border bg-card p-4 text-center"
						>
							<div className="flex justify-center">
								<div
									className="relative flex items-center justify-center"
									style={{ width: 80, height: 80 }}
								>
									<img
										src={file.dataUrl}
										alt={`Preview ${file.width}×${file.height}`}
										className="max-h-full max-w-full object-contain"
										style={{
											imageRendering:
												file.width <= 32
													? "pixelated"
													: "-webkit-optimize-contrast",
										}}
									/>
								</div>
							</div>
							<div className="mt-3 space-y-0.5">
								<p className="text-sm font-semibold text-foreground">
									{file.width}×{file.height}
								</p>
								<p className="truncate px-1 text-xs text-muted-foreground">
									{file.name}
								</p>
							</div>
						</motion.div>
					))}
				</div>
			)}

			{/* Info bar */}
			<div className="rounded-lg bg-muted/50 px-4 py-3 text-center text-sm text-muted-foreground">
				{status === "loading" ? (
					<span className="inline-flex items-center gap-2">
						<Loader2 className="h-4 w-4 animate-spin" />
						Gerando todos os tamanhos...
					</span>
				) : (
					"6 arquivos PNG + 1 arquivo .ico gerados com sucesso"
				)}
			</div>

			{/* Actions */}
			<div className="flex gap-2">
				<Button variant="outline" onClick={onBackToEditor} className="flex-1">
					<ArrowLeft className="mr-2 h-4 w-4" />
					Voltar ao editor
				</Button>
				<Button variant="outline" onClick={onReset} className="flex-1">
					<RotateCcw className="mr-2 h-4 w-4" />
					Começar do zero
				</Button>
			</div>
		</div>
	);
}
