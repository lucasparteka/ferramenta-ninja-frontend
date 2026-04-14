"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { downloadPDF, mergePDFs } from "@/lib/pdf/merge";
import { renderPageThumbnail } from "@/lib/pdf/thumbnail";

type MergeState = "idle" | "processing" | "done" | "error";

function reorder<T>(arr: T[], from: number, to: number): T[] {
	const result = [...arr];
	const [item] = result.splice(from, 1);
	result.splice(to, 0, item);
	return result;
}

export function MergePDF() {
	const [files, setFiles] = useState<File[]>([]);
	const [thumbnails, setThumbnails] = useState<(string | null)[]>([]);
	const [state, setState] = useState<MergeState>("idle");
	const [result, setResult] = useState<Uint8Array | null>(null);
	const [errorMsg, setErrorMsg] = useState("");
	const [isDragging, setIsDragging] = useState(false);
	const [dragIndex, setDragIndex] = useState<number | null>(null);
	const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	async function processFiles(selected: FileList | File[]) {
		const valid = Array.from(selected).filter(
			(f) => f.type === "application/pdf",
		);
		if (valid.length === 0) return;

		const startIndex = files.length;

		setFiles((prev) => [...prev, ...valid]);
		setThumbnails((prev) => [
			...prev,
			...valid.map(() => null as string | null),
		]);
		setResult(null);
		setErrorMsg("");
		if (state === "done" || state === "error") setState("idle");

		await Promise.all(
			valid.map(async (file, i) => {
				try {
					const thumb = await renderPageThumbnail(file, 1, 500);
					setThumbnails((prev) => {
						const next = [...prev];
						next[startIndex + i] = thumb;
						return next;
					});
				} catch {
					// placeholder stays as null
				}
			}),
		);
	}

	function handleDropZone(e: React.DragEvent<HTMLDivElement>) {
		e.preventDefault();
		setIsDragging(false);
		if (e.dataTransfer.files.length > 0) processFiles(e.dataTransfer.files);
	}

	function handleRemove(index: number) {
		setFiles((prev) => prev.filter((_, i) => i !== index));
		setThumbnails((prev) => prev.filter((_, i) => i !== index));
		setResult(null);
		if (state === "done") setState("idle");
	}

	function handleClear() {
		setFiles([]);
		setThumbnails([]);
		setState("idle");
		setResult(null);
		setErrorMsg("");
		if (inputRef.current) inputRef.current.value = "";
	}

	function handleCardDragStart(index: number) {
		setDragIndex(index);
	}

	function handleCardDragOver(
		e: React.DragEvent<HTMLDivElement>,
		index: number,
	) {
		e.preventDefault();
		if (dragIndex !== null && dragIndex !== index) setDragOverIndex(index);
	}

	function handleCardDragLeave(e: React.DragEvent<HTMLDivElement>) {
		if (!e.currentTarget.contains(e.relatedTarget as Node))
			setDragOverIndex(null);
	}

	function handleCardDrop(e: React.DragEvent<HTMLDivElement>, toIndex: number) {
		e.preventDefault();
		if (dragIndex !== null && dragIndex !== toIndex) {
			setFiles((prev) => reorder(prev, dragIndex, toIndex));
			setThumbnails((prev) => reorder(prev, dragIndex, toIndex));
			setResult(null);
			if (state === "done") setState("idle");
		}
		setDragIndex(null);
		setDragOverIndex(null);
	}

	function handleCardDragEnd() {
		setDragIndex(null);
		setDragOverIndex(null);
	}

	async function handleMerge() {
		if (files.length < 2) return;
		setState("processing");
		setErrorMsg("");
		try {
			const bytes = await mergePDFs(files);
			setResult(bytes);
			setState("done");
		} catch {
			setState("error");
			setErrorMsg(
				"Erro ao juntar os PDFs. Verifique se todos os arquivos são PDFs válidos.",
			);
		}
	}

	function handleDownload() {
		if (!result) return;
		downloadPDF(result, "documento-unido.pdf");
	}

	const loadingCount = thumbnails.filter((t) => t === null).length;

	return (
		<div className="flex flex-col gap-6">
			<div className="space-y-1">
				<label className="block text-sm font-medium text-foreground">
					Adicionar PDFs
				</label>
				<div
					role="button"
					tabIndex={0}
					aria-label="Área de upload de PDFs. Clique ou arraste arquivos."
					onClick={() => inputRef.current?.click()}
					onKeyDown={(e) => {
						if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
					}}
					onDragOver={(e) => {
						e.preventDefault();
						setIsDragging(true);
					}}
					onDragLeave={() => setIsDragging(false)}
					onDrop={handleDropZone}
					className={`flex min-h-24 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
						isDragging
							? "border-primary bg-primary/5"
							: "border-border bg-secondary hover:border-primary hover:bg-primary/5"
					}`}
				>
					<p className="text-sm font-medium text-foreground">
						Arraste PDFs ou clique para adicionar
					</p>
					<p className="text-xs text-muted-foreground">
						Vários arquivos permitidos
					</p>
				</div>
				<input
					ref={inputRef}
					type="file"
					accept="application/pdf"
					multiple
					onChange={(e) => {
						if (e.target.files && e.target.files.length > 0)
							processFiles(e.target.files);
					}}
					className="hidden"
					aria-hidden="true"
				/>
			</div>

			{files.length > 0 && (
				<div className="space-y-3">
					<p className="text-xs text-muted-foreground">
						{files.length} arquivo(s)
						{loadingCount > 0
							? ` — carregando ${loadingCount} miniatura(s)…`
							: files.length > 1
								? " — arraste os cards para reordenar"
								: ""}
					</p>
					<div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
						{files.map((file, i) => (
							<div
								key={`${file.name}-${i}`}
								draggable
								onDragStart={() => handleCardDragStart(i)}
								onDragOver={(e) => handleCardDragOver(e, i)}
								onDragLeave={handleCardDragLeave}
								onDrop={(e) => handleCardDrop(e, i)}
								onDragEnd={handleCardDragEnd}
								className={`flex flex-col overflow-hidden rounded-lg border transition-all ${
									dragIndex === i
										? "opacity-40"
										: dragOverIndex === i
											? "border-primary bg-primary/5 shadow-md"
											: "border-border bg-card"
								} cursor-grab active:cursor-grabbing`}
							>
								<div className="flex aspect-3/4 items-center justify-center bg-secondary">
									{thumbnails[i] ? (
										<img
											src={thumbnails[i]!}
											alt={`Página 1 de ${file.name}`}
											className="h-full w-full"
										/>
									) : (
										<div className="h-6 w-6 animate-spin rounded-full border-2 border-border border-t-primary" />
									)}
								</div>
								<div className="flex items-center justify-between gap-1 px-2 py-1.5">
									<p
										className="truncate text-xs text-foreground"
										title={file.name}
									>
										{file.name}
									</p>
									<button
										type="button"
										onClick={(e) => {
											e.stopPropagation();
											handleRemove(i);
										}}
										className="shrink-0 rounded px-1 text-xs text-muted-foreground hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
										aria-label={`Remover ${file.name}`}
									>
										✕
									</button>
								</div>
							</div>
						))}
					</div>
				</div>
			)}

			<div className="flex flex-col gap-3 sm:flex-row">
				<Button
					className="sm:flex-1"
					disabled={files.length < 2 || state === "processing"}
					onClick={handleMerge}
				>
					{state === "processing"
						? "Processando..."
						: `Juntar ${files.length > 1 ? `${files.length} PDFs` : "PDFs"}`}
				</Button>
				{state === "done" && result && (
					<Button
						variant="outline"
						className="sm:flex-1"
						onClick={handleDownload}
					>
						Baixar PDF unido
					</Button>
				)}
				{files.length > 0 && (
					<Button variant="outline" onClick={handleClear}>
						Limpar tudo
					</Button>
				)}
			</div>

			{state === "error" && (
				<p aria-live="polite" className="text-sm text-destructive">
					{errorMsg}
				</p>
			)}
			{state === "done" && result && (
				<p aria-live="polite" className="text-sm text-foreground">
					PDFs unidos com sucesso.
				</p>
			)}
		</div>
	);
}
