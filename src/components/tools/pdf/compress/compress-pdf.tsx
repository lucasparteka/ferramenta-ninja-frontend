"use client";

import { Trash } from "lucide-react";
import { useRef, useState } from "react";
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
		label: "Alto — recompressão de imagens no servidor (maior redução)",
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
		<div className="flex flex-col gap-6">
			<div className="space-y-1">
				<label className="block text-sm font-medium text-foreground">
					Selecione um PDF
				</label>
				<div
					role="button"
					tabIndex={0}
					aria-label="Área de upload de PDF. Clique ou arraste um arquivo."
					onClick={() => inputRef.current?.click()}
					onKeyDown={(e) => {
						if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
					}}
					onDragOver={(e) => {
						e.preventDefault();
						setIsDragging(true);
					}}
					onDragLeave={() => setIsDragging(false)}
					onDrop={handleDrop}
					className={`flex min-h-32 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
						isDragging
							? "border-primary bg-primary/5"
							: "border-border bg-secondary hover:border-primary hover:bg-primary/5"
					}`}
				>
					{file ? (
						<div className="space-y-1 px-4 text-center">
							<p className="text-sm font-medium text-foreground">{file.name}</p>
							<p className="text-xs text-muted-foreground">
								{formatBytes(originalSize)}
							</p>
						</div>
					) : (
						<>
							<p className="text-sm font-medium text-foreground">
								Arraste um PDF ou clique para selecionar
							</p>
							<p className="text-xs text-muted-foreground">
								Apenas arquivo PDF
							</p>
						</>
					)}
				</div>
				<input
					ref={inputRef}
					type="file"
					accept="application/pdf"
					onChange={(e) => {
						const f = e.target.files?.[0];
						if (f) processFile(f);
					}}
					className="hidden"
					aria-hidden="true"
				/>
				{file && (
					<Button
						variant="secondary"
						className="mt-3 w-full"
						onClick={handleClear}
					>
						<Trash />
						Limpar
					</Button>
				)}
			</div>

			<div className="space-y-1">
				<label
					htmlFor="compression-level"
					className="block text-sm font-medium text-foreground"
				>
					Nível de compressão
				</label>
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
					estrutura do arquivo. Para PDFs com muitas imagens, a redução pode ser
					limitada.
				</p>
			</div>

			<div className="flex flex-col gap-3 sm:flex-row">
				<Button
					className="sm:flex-1"
					disabled={!file || state === "processing"}
					onClick={handleCompress}
				>
					{state === "processing" ? "Processando..." : "Comprimir PDF"}
				</Button>
				{state === "done" && result && (
					<Button
						variant="outline"
						className="sm:flex-1"
						onClick={handleDownload}
					>
						Baixar PDF comprimido
					</Button>
				)}
			</div>

			{state === "done" && result && (
				<div
					aria-live="polite"
					className="grid grid-cols-3 gap-4 rounded-lg border border-border bg-secondary p-4 text-center"
				>
					<div>
						<p className="text-xs text-muted-foreground">Tamanho original</p>
						<p className="mt-1 font-semibold text-foreground">
							{formatBytes(originalSize)}
						</p>
					</div>
					<div>
						<p className="text-xs text-muted-foreground">Tamanho final</p>
						<p className="mt-1 font-semibold text-foreground">
							{formatBytes(compressedSize)}
						</p>
					</div>
					<div>
						<p className="text-xs text-muted-foreground">Redução</p>
						<p
							className={`mt-1 font-semibold ${reduction > 0 ? "text-success" : "text-muted-foreground"}`}
						>
							{reduction > 0 ? `-${reduction}%` : "Sem redução"}
						</p>
					</div>
				</div>
			)}

			{state === "error" && (
				<p aria-live="polite" className="text-sm text-destructive">
					{errorMsg}
				</p>
			)}
		</div>
	);
}
