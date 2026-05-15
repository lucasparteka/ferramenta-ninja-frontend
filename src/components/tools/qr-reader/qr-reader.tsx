"use client";

import jsQR from "jsqr";
import { AlertTriangle, FileImage, Loader2, Trash2 } from "lucide-react";
import { useRef, useState } from "react";
import { CopyButton } from "@/components/shared/copy-button";
import { LayoutC } from "@/components/shared/layout-c";
import { PaneHeader } from "@/components/shared/pane-header";
import { StatusBar } from "@/components/shared/status-bar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ReaderState = "idle" | "loading" | "success" | "error";

async function decodeQRFromFile(file: File): Promise<string> {
	const bitmap = await createImageBitmap(file);
	const canvas = document.createElement("canvas");
	canvas.width = bitmap.width;
	canvas.height = bitmap.height;
	const ctx = canvas.getContext("2d");
	if (!ctx) throw new Error("Não foi possível criar o contexto de canvas.");
	ctx.drawImage(bitmap, 0, 0);
	const imageData = ctx.getImageData(0, 0, bitmap.width, bitmap.height);
	const code = jsQR(imageData.data, imageData.width, imageData.height);
	if (!code) throw new Error("Nenhum QR Code encontrado na imagem.");
	return code.data;
}

export function QRReader() {
	const [state, setState] = useState<ReaderState>("idle");
	const [result, setResult] = useState("");
	const [preview, setPreview] = useState("");
	const [errorMsg, setErrorMsg] = useState("");
	const [isDragging, setIsDragging] = useState(false);
	const [processingTime, setProcessingTime] = useState(0);
	const [fileType, setFileType] = useState("");
	const inputRef = useRef<HTMLInputElement>(null);

	async function processFile(file: File) {
		if (!file.type.startsWith("image/")) {
			setState("error");
			setErrorMsg("O arquivo selecionado não é uma imagem válida.");
			return;
		}
		setState("loading");
		setResult("");
		setErrorMsg("");
		setFileType(file.type.split("/")[1]?.toUpperCase() || "—");
		setPreview(URL.createObjectURL(file));
		try {
			const start = performance.now();
			const data = await decodeQRFromFile(file);
			setProcessingTime(performance.now() - start);
			setResult(data);
			setState("success");
		} catch (e) {
			setState("error");
			setErrorMsg(
				e instanceof Error ? e.message : "Erro ao processar a imagem.",
			);
		}
	}

	function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];
		if (file) processFile(file);
	}

	function handleDrop(e: React.DragEvent<HTMLButtonElement>) {
		e.preventDefault();
		setIsDragging(false);
		const file = e.dataTransfer.files?.[0];
		if (file) processFile(file);
	}

	function handleClear() {
		if (preview) URL.revokeObjectURL(preview);
		setPreview("");
		setResult("");
		setState("idle");
		setErrorMsg("");
		setProcessingTime(0);
		setFileType("");
		if (inputRef.current) inputRef.current.value = "";
	}

	return (
		<LayoutC
			left={
				<>
					<PaneHeader
						title="Imagem"
						actions={
							<Button
								variant="ghost"
								size="icon-sm"
								onClick={handleClear}
								aria-label="Limpar imagem"
								disabled={!preview}
							>
								<Trash2 className="h-3.5 w-3.5" />
							</Button>
						}
					/>
					<div className="flex flex-1 items-center p-3">
						<button
							type="button"
							onClick={() => inputRef.current?.click()}
							onDragOver={(e) => {
								e.preventDefault();
								setIsDragging(true);
							}}
							onDragLeave={() => setIsDragging(false)}
							onDrop={handleDrop}
							onKeyDown={(e) => {
								if (e.key === "Enter" || e.key === " ") {
									e.preventDefault();
									inputRef.current?.click();
								}
							}}
							aria-label={
								preview ? "Trocar imagem" : "Enviar imagem com QR Code"
							}
							className={cn(
								"flex min-h-[280px] w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed transition-colors focus:outline-none focus:ring-2 focus:ring-ring/30",
								isDragging
									? "border-foreground/30 bg-muted/40"
									: "border-border bg-muted/40 hover:border-foreground/30 hover:bg-muted/60",
							)}
						>
							{preview ? (
								<img
									src={preview}
									alt="Preview da imagem carregada"
									className="max-h-40 max-w-full rounded object-contain"
								/>
							) : (
								<>
									<FileImage
										className="h-5 w-5 text-muted-foreground"
										strokeWidth={1.75}
									/>
									<p className="text-sm font-medium text-foreground">
										Arraste uma imagem ou clique para selecionar
									</p>
									<p className="text-xs text-muted-foreground">
										PNG, JPG, WebP, GIF, BMP
									</p>
								</>
							)}
						</button>
						<input
							ref={inputRef}
							type="file"
							accept="image/*"
							onChange={handleFileChange}
							className="hidden"
						/>
					</div>
				</>
			}
			right={
				<>
					<PaneHeader
						title={
							<>
								Conteúdo
								{state === "success" && (
									<span className="rounded border border-success/40 bg-success/10 px-1.5 py-px font-mono text-[10px] text-success">
										Pronto
									</span>
								)}
							</>
						}
						actions={
							<CopyButton
								text={result}
								disabled={!result}
								variant="ghost"
								size="icon-sm"
								iconOnly
							/>
						}
					/>
					<div className="flex-1 min-h-[280px] bg-muted/20 p-3">
						{state === "idle" && (
							<p className="text-sm text-muted-foreground">
								O conteúdo do QR Code aparecerá aqui após o carregamento da
								imagem.
							</p>
						)}
						{state === "loading" && (
							<div className="flex items-center gap-2 text-sm text-muted-foreground">
								<Loader2 className="h-3.5 w-3.5 animate-spin" />
								Processando imagem...
							</div>
						)}
						{state === "success" && (
							<p className="break-all text-sm text-foreground select-all">
								{result}
							</p>
						)}
						{state === "error" && (
							<div className="rounded-md border border-destructive/30 bg-destructive/5 p-3">
								<div className="flex items-start gap-2">
									<AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-destructive" />
									<p className="text-xs text-destructive">{errorMsg}</p>
								</div>
							</div>
						)}
					</div>
				</>
			}
			footer={
				<StatusBar
					items={[
						{
							label: "",
							value:
								state === "idle"
									? "Aguardando imagem"
									: state === "loading"
										? "Processando..."
										: state === "success"
											? `Decodificado em ${processingTime.toFixed(0)}ms`
											: "Erro na decodificação",
							mono: true,
							variant:
								state === "success"
									? "success"
									: state === "error"
										? "danger"
										: "default",
						},
						{
							label: "Formato",
							value: fileType || "—",
							mono: true,
						},
					]}
					right={
						<span className="font-mono text-caption text-muted-foreground">
							jsQR
						</span>
					}
				/>
			}
		/>
	);
}
