"use client";

import { ArrowRightLeft, Info } from "lucide-react";
import { useCallback, useState } from "react";
import { CopyButton } from "@/components/shared/copy-button";
import { ImageDropzone } from "@/components/shared/image-dropzone";
import { OptionSwitch } from "@/components/shared/option-switch";
import { ResultBox } from "@/components/shared/result-box";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
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
			setError(
				"Erro ao carregar imagem da URL. Verifique se é uma imagem válida e acessível.",
			);
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

	return (
		<div className="space-y-6">
			<OptionSwitch
				options={[
					{ label: "Upload de Imagem", value: "upload" },
					{ label: "URL Remota", value: "url" },
				]}
				value={activeTab}
				onChange={(v) => {
					setActiveTab(v as "upload" | "url");
					handleClear();
				}}
			/>
			{activeTab === "upload" && (
				<ImageDropzone
					preview={preview}
					isDragging={isDragging}
					accept="image/png,image/jpeg,image/gif,image/svg+xml,image/webp"
					label="Upload de Imagem"
					hint="PNG, JPG, GIF, SVG, WebP"
					onFile={handleFile}
					onClear={handleClear}
					onDragOver={onDragOver}
					onDragLeave={onDragLeave}
					onDrop={onDrop}
					clearButtonClassName="mt-3 flex w-30 ml-auto"
				/>
			)}
			{activeTab === "url" && (
				<div className="space-y-4">
					<div className="flex gap-2">
						<Input
							placeholder="https://exemplo.com/imagem.png"
							value={urlInput}
							onChange={(e) => setUrlInput(e.target.value)}
							onKeyDown={(e) => e.key === "Enter" && !isLoading && handleUrl()}
						/>
						<Button
							onClick={handleUrl}
							disabled={!urlInput.trim() || isLoading}
						>
							Carregar
						</Button>
					</div>
				</div>
			)}
			{isLoading && (
				<div className="py-8 text-center text-muted-foreground">
					Processando imagem...
				</div>
			)}
			{error && (
				<div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
					{error}
				</div>
			)}
			{base64 && fileInfo && (
				<div className="space-y-6">
					<div className="grid gap-4 sm:grid-cols-2">
						<div className="space-y-2">
							<p className="text-sm font-medium text-foreground">Preview</p>
							<div className="flex min-h-50 items-center justify-center rounded-lg border bg-card p-4">
								{/* biome-ignore lint/performance/noImgElement: data URI requires native img */}
								<img
									src={preview || ""}
									alt="Preview da imagem"
									className="max-h-75 max-w-full rounded object-contain"
								/>
							</div>
						</div>
						<div className="space-y-2">
							<p className="text-sm font-medium text-foreground">Informações</p>
							<div className="space-y-2 rounded-lg border bg-card p-4 text-sm lg:h-83.5">
								<div className="flex justify-between">
									<span className="text-muted-foreground">Nome:</span>
									<span className="font-medium line-clamp-1 ml-3">
										{fileInfo.name}
									</span>
								</div>
								<div className="flex justify-between">
									<span className="text-muted-foreground">Tipo:</span>
									<span className="font-medium">{fileInfo.type}</span>
								</div>
								<div className="flex justify-between">
									<span className="text-muted-foreground">Dimensões:</span>
									<span className="font-medium">
										{fileInfo.width} × {fileInfo.height} px
									</span>
								</div>
								<div className="flex justify-between">
									<span className="text-muted-foreground">
										Tamanho original:
									</span>
									<span className="font-medium">
										{formatBytes(fileInfo.size)}
									</span>
								</div>
								<div className="flex justify-between">
									<span className="text-muted-foreground">Tamanho Base64:</span>
									<span className="font-medium">
										{formatBytes(base64.length)}
									</span>
								</div>
								<div className="flex justify-between">
									<span className="flex items-center gap-1 text-muted-foreground">
										Overhead:
										<Popover>
											<PopoverTrigger className="inline-flex text-muted-foreground">
												<Info className="h-3 w-3" />
											</PopoverTrigger>
											<PopoverContent className="w-60 text-sm">
												Base64 aumenta os dados em ~33%. Overhead é o acréscimo
												percentual em relação ao tamanho original da imagem.
											</PopoverContent>
										</Popover>
									</span>
									<span className="font-medium">
										{fileInfo.size > 0
											? `${(
													((base64.length - fileInfo.size) / fileInfo.size) *
														100
												).toFixed(1)}%`
											: "N/A"}
									</span>
								</div>
							</div>
						</div>
					</div>
					<div className="space-y-2">
						<div className="flex items-center justify-between">
							<p className="text-sm font-medium text-foreground">
								Resultado Base64
							</p>
							<Button
								variant="ghost"
								size="sm"
								onClick={() => setShowPure(!showPure)}
								className="flex items-center gap-1"
							>
								<ArrowRightLeft className="h-3 w-3" />
								{showPure ? "Mostrar Data URI" : "Mostrar Base64 Puro"}
							</Button>
						</div>
						<ResultBox>
							<code className="max-h-50 block w-full overflow-y-auto break-all rounded bg-muted text-xs font-mono">
								{displayBase64}
							</code>
						</ResultBox>
						<div className="flex justify-end">
							<CopyButton
								text={displayBase64 || ""}
								label="Copiar"
								variant="outline"
							/>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
