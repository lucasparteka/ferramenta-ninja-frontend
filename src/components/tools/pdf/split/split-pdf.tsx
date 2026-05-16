"use client";

import JSZip from "jszip";
import {
	AlertTriangle,
	Check,
	CheckCircle2,
	Download,
	Scissors,
	Trash2,
} from "lucide-react";
import { useRef, useState } from "react";
import { SectionLabel } from "@/components/shared/layout-b/section-label";
import { OptionSwitch } from "@/components/shared/option-switch";
import { PdfDropZone } from "@/components/tools/pdf/shared/pdf-drop-zone";
import { Button } from "@/components/ui/button";
import {
	downloadPDF,
	extractPagesByIndex,
	splitAllPages,
} from "@/lib/pdf/split";
import { renderAllPageThumbnails } from "@/lib/pdf/thumbnail";

type SplitState = "idle" | "processing" | "done" | "error";
type SplitMode = "extract" | "all";

const SPLIT_MODE_OPTIONS = [
	{ label: "Extrair páginas", value: "extract" },
	{ label: "Dividir tudo", value: "all" },
];

export function SplitPDF() {
	const [file, setFile] = useState<File | null>(null);
	const [mode, setMode] = useState<SplitMode>("extract");
	const [state, setState] = useState<SplitState>("idle");
	const [thumbnails, setThumbnails] = useState<(string | null)[]>([]);
	const [totalPages, setTotalPages] = useState(0);
	const [generatingThumbs, setGeneratingThumbs] = useState(false);
	const [selectedPages, setSelectedPages] = useState<Set<number>>(new Set());
	const [singleResult, setSingleResult] = useState<Uint8Array | null>(null);
	const [multiResults, setMultiResults] = useState<Uint8Array[]>([]);
	const [errorMsg, setErrorMsg] = useState("");
	const [isDragging, setIsDragging] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);

	async function processFile(selected: File) {
		if (selected.type !== "application/pdf") {
			setState("error");
			setErrorMsg("O arquivo selecionado não é um PDF válido.");
			return;
		}

		setFile(selected);
		setState("idle");
		setSingleResult(null);
		setMultiResults([]);
		setErrorMsg("");
		setSelectedPages(new Set());
		setThumbnails([]);
		setTotalPages(0);
		setGeneratingThumbs(true);

		try {
			const total = await renderAllPageThumbnails(
				selected,
				220,
				(index, dataUrl) => {
					setThumbnails((prev) => {
						const next = [...prev];
						next[index] = dataUrl;
						return next;
					});
				},
			);
			setTotalPages(total);
		} catch {
			// thumbnails are optional — tool still works without them
		} finally {
			setGeneratingThumbs(false);
		}
	}

	function handleDrop(e: React.DragEvent<HTMLDivElement>) {
		e.preventDefault();
		setIsDragging(false);
		const dropped = e.dataTransfer.files?.[0];
		if (dropped) processFile(dropped);
	}

	function handleClear() {
		setFile(null);
		setState("idle");
		setSingleResult(null);
		setMultiResults([]);
		setErrorMsg("");
		setThumbnails([]);
		setTotalPages(0);
		setSelectedPages(new Set());
		setGeneratingThumbs(false);
		if (inputRef.current) inputRef.current.value = "";
	}

	function togglePage(index: number) {
		setSelectedPages((prev) => {
			const next = new Set(prev);
			if (next.has(index)) {
				next.delete(index);
			} else {
				next.add(index);
			}
			return next;
		});
	}

	function selectAll() {
		setSelectedPages(new Set(Array.from({ length: totalPages }, (_, i) => i)));
	}

	function clearSelection() {
		setSelectedPages(new Set());
	}

	function handleModeChange(newMode: string) {
		setMode(newMode as SplitMode);
		setSelectedPages(new Set());
		setSingleResult(null);
		setMultiResults([]);
		if (state === "done") setState("idle");
	}

	async function handleSplit() {
		if (!file) return;
		setState("processing");
		setErrorMsg("");
		setSingleResult(null);
		setMultiResults([]);

		try {
			if (mode === "extract") {
				if (selectedPages.size === 0) {
					setState("error");
					setErrorMsg("Selecione ao menos uma página para extrair.");
					return;
				}
				const bytes = await extractPagesByIndex(
					file,
					Array.from(selectedPages),
				);
				setSingleResult(bytes);
			} else {
				const results = await splitAllPages(file);
				setMultiResults(results);
			}
			setState("done");
		} catch (e) {
			setState("error");
			setErrorMsg(e instanceof Error ? e.message : "Erro ao dividir o PDF.");
		}
	}

	async function handleDownloadZip() {
		if (!file || multiResults.length === 0) return;
		const baseName = file.name.replace(/\.pdf$/i, "");
		const zip = new JSZip();
		multiResults.forEach((bytes, i) => {
			zip.file(`${baseName}-pagina-${i + 1}.pdf`, bytes);
		});
		const blob = await zip.generateAsync({ type: "blob" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `${baseName}-dividido.zip`;
		a.click();
		URL.revokeObjectURL(url);
	}

	const thumbCount = thumbnails.filter(Boolean).length;
	const displayPages = totalPages || thumbnails.length;

	return (
		<div className="flex flex-col overflow-hidden rounded-md border border-border divide-y divide-border bg-card">
			<div className="p-4">
				<SectionLabel>Arquivo</SectionLabel>
				<PdfDropZone
					file={file}
					isDragging={isDragging}
					onDragOver={(e) => {
						e.preventDefault();
						setIsDragging(true);
					}}
					onDragLeave={() => setIsDragging(false)}
					onDrop={handleDrop}
					onClick={() => inputRef.current?.click()}
				/>
				<input
					ref={inputRef}
					type="file"
					accept="application/pdf"
					onChange={(e) => {
						const f = e.target.files?.[0];
						if (f) processFile(f);
					}}
					className="hidden"
				/>
			</div>

			<div className="p-4">
				<SectionLabel>Modo de divisão</SectionLabel>
				<OptionSwitch
					options={SPLIT_MODE_OPTIONS}
					value={mode}
					onChange={handleModeChange}
				/>
			</div>

			{file && (displayPages > 0 || generatingThumbs) && (
				<div className="p-4">
					<SectionLabel
						hint={
							generatingThumbs
								? `gerando ${thumbCount}/${totalPages || "?"}`
								: mode === "extract" && selectedPages.size > 0
									? `${selectedPages.size} selecionada(s)`
									: undefined
						}
					>
						Páginas ({totalPages > 0 ? totalPages : "…"})
					</SectionLabel>

					{mode === "extract" && totalPages > 0 && (
						<div className="mb-3 flex gap-2">
							<Button
								type="button"
								variant="ghost"
								size="sm"
								onClick={selectAll}
							>
								Selecionar tudo
							</Button>
							{selectedPages.size > 0 && (
								<Button
									type="button"
									variant="ghost"
									size="sm"
									onClick={clearSelection}
								>
									Limpar seleção
								</Button>
							)}
						</div>
					)}

					<div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
						{Array.from({ length: displayPages }, (_, i) => {
							const thumb = thumbnails[i];
							const selected = selectedPages.has(i);

							return (
								<button
									key={thumb}
									type="button"
									disabled={mode === "all"}
									onClick={() => mode === "extract" && togglePage(i)}
									className={`group relative flex flex-col overflow-hidden rounded-md border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
										mode === "extract"
											? selected
												? "border-primary"
												: "border-border hover:border-primary/50"
											: "cursor-default border-border"
									}`}
									aria-label={`Página ${i + 1}${selected ? " — selecionada" : ""}`}
									aria-pressed={mode === "extract" ? selected : undefined}
								>
									<div
										className={`flex aspect-3/4 items-center justify-center transition-colors ${
											mode === "extract" && selected
												? "bg-primary/10"
												: "bg-muted/40"
										}`}
									>
										{thumb ? (
											// biome-ignore lint/performance/noImgElement: .
											<img
												src={thumb}
												alt={`Página ${i + 1}`}
												className="h-full w-full object-contain"
											/>
										) : (
											<div className="h-5 w-5 animate-spin rounded-full border-2 border-border border-t-primary" />
										)}
									</div>
									<span className="block py-1 text-center font-mono text-xs text-muted-foreground">
										{i + 1}
									</span>
									{mode === "extract" && selected && (
										<div className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
											<Check size={11} />
										</div>
									)}
								</button>
							);
						})}
					</div>
				</div>
			)}

			<div className="flex flex-wrap items-center gap-2 bg-muted/40 px-4 py-3">
				<Button
					size="sm"
					disabled={!file || state === "processing"}
					onClick={handleSplit}
				>
					<Scissors size={14} />
					{state === "processing" ? "Processando..." : "Dividir PDF"}
				</Button>
				{state === "done" && mode === "extract" && singleResult && (
					<Button
						size="sm"
						onClick={() => {
							const baseName = file
								? file.name.replace(/\.pdf$/i, "")
								: "paginas";
							downloadPDF(singleResult, `${baseName}-extraido.pdf`);
						}}
					>
						<Download size={14} />
						Baixar PDF
					</Button>
				)}
				{state === "done" && mode === "all" && multiResults.length > 0 && (
					<Button size="sm" onClick={handleDownloadZip}>
						<Download size={14} />
						Baixar ZIP ({multiResults.length} arquivos)
					</Button>
				)}
				{file && (
					<Button variant="outline" size="sm" onClick={handleClear}>
						<Trash2 size={14} />
						Limpar
					</Button>
				)}
			</div>

			{state === "done" && mode === "extract" && (
				<div
					aria-live="polite"
					className="flex items-center gap-2 bg-muted/40 px-4 py-3"
				>
					<CheckCircle2 size={14} className="shrink-0 text-success" />
					<p className="text-sm text-foreground">
						Páginas extraídas. Clique em "Baixar PDF" para salvar.
					</p>
				</div>
			)}
			{state === "done" && mode === "all" && (
				<div
					aria-live="polite"
					className="flex items-center gap-2 bg-muted/40 px-4 py-3"
				>
					<CheckCircle2 size={14} className="shrink-0 text-success" />
					<p className="text-sm text-foreground">
						PDF dividido em {multiResults.length} arquivo(s).
					</p>
				</div>
			)}

			{state === "error" && (
				<div
					aria-live="polite"
					className="flex items-start gap-2 border-t border-destructive/30 bg-destructive/5 px-4 py-3"
				>
					<AlertTriangle
						size={14}
						className="mt-px shrink-0 text-destructive"
					/>
					<p className="text-sm text-destructive">{errorMsg}</p>
				</div>
			)}
		</div>
	);
}
