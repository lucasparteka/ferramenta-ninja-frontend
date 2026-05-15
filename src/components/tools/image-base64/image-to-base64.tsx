"use client";

import { ArrowRightLeft, Trash2 } from "lucide-react";
import { useCallback, useState } from "react";
import { CopyButton } from "@/components/shared/copy-button";
import { ImageDropzone } from "@/components/shared/image-dropzone";
import { LayoutC } from "@/components/shared/layout-c";
import { OptionSwitch } from "@/components/shared/option-switch";
import { PaneHeader } from "@/components/shared/pane-header";
import { StatusBar } from "@/components/shared/status-bar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	fileToBase64,
	getBase64Size,
	getImageSize,
	getPureBase64,
	urlToBase64,
} from "@/lib/encoding/image";

export function ImageToBase64() {
	const [activeTab, setActiveTab] = useState<"upload" | "url">("upload");
	const [preview, setPreview] = useState<string | null>(null);
	const [base64, setBase64] = useState<string | null>(null);
	const [fileInfo, setFileInfo] = useState<{
		name: string;
		type: string;
		size: number;
		width: number;
		height: number;
	} | null>(null);
	const [urlInput, setUrlInput] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [isDragging, setIsDragging] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [showPure, setShowPure] = useState(false);

	const handleFile = useCallback(async (file: File) => {
		setError(null);
		setIsLoading(true);
		try {
			const dataUrl = await fileToBase64(file);
			const { width, height } = await getImageSize(dataUrl);
			setPreview(dataUrl);
			setBase64(dataUrl);
			setFileInfo({
				name: file.name,
				type: file.type,
				size: file.size,
				width,
				height,
			});
		} catch {
			setError("Erro ao processar a imagem. Tente outro arquivo.");
		} finally {
			setIsLoading(false);
		}
	}, []);

	const handleUrl = useCallback(async () => {
		if (!urlInput.trim()) return;
		setError(null);
		setIsLoading(true);
		try {
			const dataUrl = await urlToBase64(urlInput.trim());
			const { width, height } = await getImageSize(dataUrl);
			const pureSize = getBase64Size(dataUrl);
			setPreview(dataUrl);
			setBase64(dataUrl);
			setFileInfo({
				name: "imagem-remota",
				type: dataUrl.split(";")[0].split(":")[1] || "image/unknown",
				size: pureSize,
				width,
				height,
			});
		} catch {
			setError("Erro ao carregar imagem da URL.");
		} finally {
			setIsLoading(false);
		}
	}, [urlInput]);

	const handleClear = useCallback(() => {
		setPreview(null);
		setBase64(null);
		setFileInfo(null);
		setError(null);
		setUrlInput("");
	}, []);

	const onDragOver = useCallback((e: React.DragEvent<HTMLButtonElement>) => {
		e.preventDefault();
		setIsDragging(true);
	}, []);

	const onDragLeave = useCallback(() => {
		setIsDragging(false);
	}, []);

	const onDrop = useCallback(
		(e: React.DragEvent<HTMLButtonElement>) => {
			e.preventDefault();
			setIsDragging(false);
			const file = e.dataTransfer.files[0];
			if (file?.type.startsWith("image/")) {
				handleFile(file);
			} else {
				setError("Por favor, arraste apenas arquivos de imagem.");
			}
		},
		[handleFile],
	);

	const formatBytes = (bytes: number) => {
		if (bytes === 0) return "0 B";
		const k = 1024;
		const sizes = ["B", "KB", "MB", "GB"];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return `${parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
	};

	const displayBase64 = showPure && base64 ? getPureBase64(base64) : base64;
	const overhead =
		fileInfo && fileInfo.size > 0 && base64
			? (((base64.length - fileInfo.size) / fileInfo.size) * 100).toFixed(1)
			: null;

	return (
		<LayoutC
			toolbar={
				<OptionSwitch
					options={[
						{ label: "Upload", value: "upload" },
						{ label: "URL Remota", value: "url" },
					]}
					value={activeTab}
					onChange={(v) => {
						setActiveTab(v as "upload" | "url");
						handleClear();
					}}
					size="sm"
				/>
			}
			left={
				<>
					<PaneHeader
						title="Entrada"
						actions={
							<button
								type="button"
								onClick={handleClear}
								className="rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
								aria-label="Limpar"
							>
								<Trash2 className="h-3.5 w-3.5" />
							</button>
						}
					/>
					<div className="flex flex-1 flex-col">
						{activeTab === "upload" ? (
							<div className="p-3">
								<ImageDropzone
									preview={null}
									isDragging={isDragging}
									accept="image/png,image/jpeg,image/gif,image/svg+xml,image/webp"
									label="Upload de Imagem"
									hint="PNG, JPG, GIF, SVG, WebP"
									onFile={handleFile}
									onClear={handleClear}
									onDragOver={onDragOver}
									onDragLeave={onDragLeave}
									onDrop={onDrop}
								/>
							</div>
						) : (
							<div className="flex flex-1 flex-col p-3 space-y-3">
								<div className="flex gap-2">
									<Input
										placeholder="https://exemplo.com/imagem.png"
										value={urlInput}
										onChange={(e) => setUrlInput(e.target.value)}
										onKeyDown={(e) =>
											e.key === "Enter" && !isLoading && handleUrl()
										}
										className="font-mono text-xs"
									/>
									<Button
										onClick={handleUrl}
										disabled={!urlInput.trim() || isLoading}
										size="sm"
									>
										Carregar
									</Button>
								</div>
								{isLoading && (
									<p className="text-xs text-muted-foreground">
										Processando imagem...
									</p>
								)}
							</div>
						)}
						{error && (
							<div className="px-3 pb-3">
								<p className="text-xs text-destructive bg-destructive/10 rounded px-2 py-1.5">
									{error}
								</p>
							</div>
						)}
					</div>
				</>
			}
			right={
				<>
					<PaneHeader
						title="Resultado"
						actions={
							<>
								{base64 && (
									<button
										type="button"
										onClick={() => setShowPure(!showPure)}
										className="flex items-center gap-1 rounded px-1.5 py-0.5 text-caption text-muted-foreground hover:text-foreground transition-colors"
									>
										<ArrowRightLeft className="h-3 w-3" />
										{showPure ? "Data URI" : "Puro"}
									</button>
								)}
								<CopyButton
									text={displayBase64 || ""}
									disabled={!displayBase64}
									variant="ghost"
									size="icon-sm"
									iconOnly
								/>
							</>
						}
					/>
					<div className="flex-1 min-h-[280px] bg-muted/20 p-3 space-y-3 overflow-auto">
						{base64 && fileInfo ? (
							<>
								<div className="flex items-center justify-center min-h-[120px] rounded-md border border-border bg-card p-2">
									{/* biome-ignore lint/performance/noImgElement: data URI */}
									<img
										src={preview || ""}
										alt="Preview"
										className="max-h-48 max-w-full rounded object-contain"
									/>
								</div>
								<div className="space-y-1">
									<p className="text-caption font-semibold uppercase tracking-wider text-muted-foreground">
										Informações
									</p>
									<div className="space-y-1">
										{[
											{ label: "Formato", value: fileInfo.type },
											{
												label: "Dimensões",
												value: `${fileInfo.width} × ${fileInfo.height} px`,
											},
											{ label: "Original", value: formatBytes(fileInfo.size) },
											{ label: "Base64", value: formatBytes(base64.length) },
											...(overhead
												? [{ label: "Overhead", value: `${overhead}%` }]
												: []),
										].map((item) => (
											<div
												key={item.label}
												className="flex items-center justify-between py-0.5"
											>
												<span className="text-xs text-muted-foreground">
													{item.label}
												</span>
												<span className="font-mono text-xs tabular-nums text-foreground">
													{item.value}
												</span>
											</div>
										))}
									</div>
								</div>
								<div className="space-y-1">
									<p className="text-caption font-semibold uppercase tracking-wider text-muted-foreground">
										Base64
									</p>
									<pre className="max-h-36 overflow-y-auto rounded border border-border bg-card p-2 font-mono text-[10px] text-foreground break-all select-all whitespace-pre-wrap">
										{displayBase64}
									</pre>
								</div>
							</>
						) : isLoading ? null : (
							<p className="text-sm text-muted-foreground">
								{activeTab === "upload"
									? "Arraste uma imagem ou clique para selecionar..."
									: "Insira uma URL de imagem..."}
							</p>
						)}
					</div>
				</>
			}
			footer={
				<StatusBar
					items={[
						{
							label: "",
							value: base64
								? "Convertido"
								: isLoading
									? "Processando..."
									: "Aguardando",
							mono: false,
							variant: base64 ? "success" : isLoading ? "warning" : "default",
						},
						...(fileInfo
							? [
									{
										label: "Original",
										value: formatBytes(fileInfo.size),
										mono: true,
									},
								]
							: []),
						...(base64
							? [
									{
										label: "Base64",
										value: formatBytes(base64.length),
										mono: true,
									},
								]
							: []),
						...(overhead
							? [{ label: "+", value: `${overhead}%`, mono: true }]
							: []),
					]}
				/>
			}
		/>
	);
}
