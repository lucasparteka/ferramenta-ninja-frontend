"use client";

import { AlertTriangle, Download, FileDown, Trash2 } from "lucide-react";
import { useRef, useState } from "react";
import { SectionLabel } from "@/components/shared/layout-b/section-label";
import { PdfDropZone } from "@/components/tools/pdf/shared/pdf-drop-zone";
import { Button } from "@/components/ui/button";
import { NativeSelect } from "@/components/ui/select-native";
import {
	type CompressionLevel,
	compressPDF,
	downloadPDF,
	formatBytes,
} from "@/lib/pdf/compress";

type CompressState = "idle" | "processing" | "done" | "error";

const COMPRESSION_LEVELS: { value: CompressionLevel; label: string }[] = [
	{ value: "baixo", label: "Baixo — maior compatibilidade" },
	{
		value: "medio",
		label: "Médio — equilíbrio entre tamanho e compatibilidade",
	},
	{
		value: "alto",
		label: "Alto — remove metadados e otimiza estrutura",
	},
];

export function CompressPDF() {
	const [file, setFile] = useState<File | null>(null);
	const [level, setLevel] = useState<CompressionLevel>("medio");
	const [state, setState] = useState<CompressState>("idle");
	const [result, setResult] = useState<Uint8Array | null>(null);
	const [originalSize, setOriginalSize] = useState(0);
	const [compressedSize, setCompressedSize] = useState(0);
	const [errorMsg, setErrorMsg] = useState("");
	const [isDragging, setIsDragging] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);

	function processFile(selected: File) {
		if (selected.type !== "application/pdf") {
			setState("error");
			setErrorMsg("O arquivo selecionado não é um PDF válido.");
			return;
		}
		setFile(selected);
		setOriginalSize(selected.size);
		setState("idle");
		setResult(null);
		setCompressedSize(0);
		setErrorMsg("");
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
		setResult(null);
		setOriginalSize(0);
		setCompressedSize(0);
		setErrorMsg("");
		if (inputRef.current) inputRef.current.value = "";
	}

	async function handleCompress() {
		if (!file) return;
		setState("processing");
		setErrorMsg("");
		try {
			let bytes: Uint8Array;
			if (level === "alto") {
				const form = new FormData();
				form.append("file", file);
				const res = await fetch("/api/comprimir-pdf", {
					method: "POST",
					body: form,
				});
				if (!res.ok) throw new Error("server");
				bytes = new Uint8Array(await res.arrayBuffer());
			} else {
				bytes = await compressPDF(file, level);
			}
			setResult(bytes);
			setCompressedSize(bytes.byteLength);
			setState("done");
		} catch {
			setState("error");
			setErrorMsg(
				"Erro ao comprimir o PDF. Verifique se o arquivo é um PDF válido.",
			);
		}
	}

	function handleDownload() {
		if (!result || !file) return;
		const baseName = file.name.replace(/\.pdf$/i, "");
		downloadPDF(result, `${baseName}-comprimido.pdf`);
	}

	const reduction =
		originalSize > 0 && compressedSize > 0
			? Math.max(0, Math.round((1 - compressedSize / originalSize) * 100))
			: 0;

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
					fileInfo={file ? formatBytes(originalSize) : undefined}
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
				<SectionLabel>Nível de compressão</SectionLabel>
				<div className="space-y-1.5">
					<NativeSelect
						id="compression-level"
						value={level}
						onChange={(e) => setLevel(e.target.value as CompressionLevel)}
						disabled={state === "processing"}
						className="disabled:cursor-not-allowed disabled:opacity-50"
					>
						{COMPRESSION_LEVELS.map((option) => (
							<option key={option.value} value={option.value}>
								{option.label}
							</option>
						))}
					</NativeSelect>
					<p className="text-xs text-muted-foreground">
						A compressão no navegador remove objetos não utilizados e otimiza a
						estrutura do arquivo. Para PDFs com muitas imagens, a redução pode
						ser limitada.
					</p>
				</div>
			</div>

			<div className="flex flex-wrap items-center gap-2 bg-muted/40 px-4 py-3">
				{state !== "done" && (
					<Button
						size="sm"
						disabled={!file || state === "processing"}
						onClick={handleCompress}
					>
						<FileDown size={14} />
						{state === "processing" ? "Processando..." : "Comprimir PDF"}
					</Button>
				)}
				{state === "done" && result && (
					<Button size="sm" onClick={handleDownload}>
						<Download size={14} />
						Baixar PDF comprimido
					</Button>
				)}
				{file && (
					<Button variant="outline" size="sm" onClick={handleClear}>
						<Trash2 size={14} />
						Limpar
					</Button>
				)}
			</div>

			{state === "done" && result && (
				<div
					aria-live="polite"
					className="grid grid-cols-3 gap-4 bg-muted/40 p-4 text-center"
				>
					<div>
						<p className="text-xs text-muted-foreground">Tamanho original</p>
						<p className="mt-1 font-mono font-semibold tabular-nums text-foreground">
							{formatBytes(originalSize)}
						</p>
					</div>
					<div>
						<p className="text-xs text-muted-foreground">Tamanho final</p>
						<p className="mt-1 font-mono font-semibold tabular-nums text-foreground">
							{formatBytes(compressedSize)}
						</p>
					</div>
					<div>
						<p className="text-xs text-muted-foreground">Redução</p>
						<p
							className={`mt-1 font-mono font-semibold tabular-nums ${reduction > 0 ? "text-success" : "text-muted-foreground"}`}
						>
							{reduction > 0 ? `-${reduction}%` : "Sem redução"}
						</p>
					</div>
				</div>
			)}

			{state === "error" && (
				<div
					aria-live="polite"
					className="flex items-start gap-2 rounded-b-md border-t border-destructive/30 bg-destructive/5 px-4 py-3"
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
