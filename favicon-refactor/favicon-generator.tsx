"use client";

/* ------------------------------------------------------------------ */
/*  FaviconGenerator — orquestrador.                                   */
/*  Mantém o estado de modo + canvas gerado e mostra o ResultPanel     */
/*  (preview-grid + export-panel) inline abaixo do shell, em vez de    */
/*  trocar de "step". O usuário pode ajustar e re-gerar à vontade.     */
/* ------------------------------------------------------------------ */

import { useCallback, useState } from "react";
import type { FaviconMode, GeneratedFaviconFile } from "@/lib/image/favicon";
import { EmojiEditor } from "./emoji-editor";
import { ImageEditor } from "./image-editor";
import { PreviewGrid } from "./preview-grid";
import { ExportPanel } from "./export-panel";
import { SvgEditor } from "./svg-editor";
import { TextEditor } from "./text-editor";

type RenderFn = (size: number) => HTMLCanvasElement | Promise<HTMLCanvasElement>;

export function FaviconGenerator() {
	const [mode, setMode] = useState<FaviconMode>("image");
	const [sourceCanvas, setSourceCanvas] = useState<HTMLCanvasElement | null>(
		null,
	);
	const [renderAtSize, setRenderAtSize] = useState<RenderFn | null>(null);
	const [generatedPackage, setGeneratedPackage] = useState<{
		files: GeneratedFaviconFile[];
		icoBlob: Blob;
	} | null>(null);
	const [version, setVersion] = useState(0);

	const handleGenerate = useCallback(
		(canvas: HTMLCanvasElement, renderFn?: RenderFn) => {
			setSourceCanvas(canvas);
			setRenderAtSize(() => renderFn ?? null);
			setGeneratedPackage(null);
			setVersion((v) => v + 1);
			// scroll para o painel de resultado
			requestAnimationFrame(() => {
				document
					.getElementById("favicon-result")
					?.scrollIntoView({ behavior: "smooth", block: "start" });
			});
		},
		[],
	);

	const handleGenerated = useCallback(
		(files: GeneratedFaviconFile[], icoBlob: Blob) => {
			setGeneratedPackage({ files, icoBlob });
		},
		[],
	);

	/* O resultado aparece como footer compartilhado para todos os editores */
	const resultFooter =
		sourceCanvas != null ? (
			<section
				id="favicon-result"
				className="space-y-6 rounded-xl border-2 border-primary/20 bg-card p-6"
			>
				<header className="flex items-center justify-between">
					<div>
						<h2 className="text-base font-semibold text-foreground">
							Pacote gerado
						</h2>
						<p className="text-xs text-muted-foreground">
							Continue ajustando à esquerda — clique em "Gerar Favicon" para
							atualizar.
						</p>
					</div>
				</header>
				<PreviewGrid
					key={version}
					sourceCanvas={sourceCanvas}
					renderAtSize={renderAtSize ?? undefined}
					onGenerated={handleGenerated}
				/>
				{generatedPackage && (
					<ExportPanel
						files={generatedPackage.files}
						icoBlob={generatedPackage.icoBlob}
					/>
				)}
			</section>
		) : null;

	const editorProps = {
		mode,
		onChangeMode: setMode,
		onGenerate: handleGenerate,
		footer: resultFooter,
	};

	if (mode === "image") return <ImageEditor {...editorProps} />;
	if (mode === "svg") return <SvgEditor {...editorProps} />;
	if (mode === "text") return <TextEditor {...editorProps} />;
	return <EmojiEditor {...editorProps} />;
}
