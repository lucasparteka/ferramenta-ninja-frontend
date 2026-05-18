"use client";

import {
	Download,
	Image as ImageIcon,
	Loader2,
	ScanFace,
	Trash,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { ImageDropzone } from "@/components/shared/image-dropzone";
import { LayoutA } from "@/components/shared/layout-a";
import { OptionSwitch } from "@/components/shared/option-switch";
import { Slider } from "@/components/shared/slider";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
	applyFaceBlur,
	type BlurStyle,
	buildCanvasFromImage,
	type FaceRegion,
	formatBytes,
} from "@/lib/image";

type State = "idle" | "detecting" | "detected" | "error";

const WASM_URL =
	"https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/wasm";
const MODEL_URL =
	"https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite";

// Singleton: o detector é criado uma única vez por sessão, mesmo com StrictMode
// biome-ignore lint/suspicious/noExplicitAny: MediaPipe FaceDetector type
let _detector: any = null;
let _detectorPromise: Promise<void> | null = null;

async function ensureDetector() {
	if (_detector) return _detector;
	if (!_detectorPromise) {
		_detectorPromise = (async () => {
			const { FaceDetector, FilesetResolver } = await import(
				"@mediapipe/tasks-vision"
			);
			const vision = await FilesetResolver.forVisionTasks(WASM_URL);
			_detector = await FaceDetector.createFromOptions(vision, {
				baseOptions: { modelAssetPath: MODEL_URL },
				runningMode: "IMAGE",
				minDetectionConfidence: 0.4,
			});
		})().catch(() => {
			_detectorPromise = null; // permite retry se falhar
		});
	}
	await _detectorPromise;
	return _detector;
}

export function FaceBlurTool() {
	const [state, setState] = useState<State>("idle");
	const [isDragging, setIsDragging] = useState(false);
	const [imageFile, setImageFile] = useState<File | null>(null);
	const [imageDimensions, setImageDimensions] = useState({
		width: 0,
		height: 0,
	});
	const [faceRegions, setFaceRegions] = useState<FaceRegion[]>([]);
	const [blurStyle, setBlurStyle] = useState<BlurStyle>("blur");
	const [intensity, setIntensity] = useState(10);
	const [padding, setPadding] = useState(15);
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const sourceCanvasRef = useRef<HTMLCanvasElement | null>(null);
	// Contador de versão para descartar resultados de toBlob desatualizados (race condition)
	const renderVersionRef = useRef(0);

	useEffect(() => {
		ensureDetector();
	}, []);

	const renderPreview = useCallback(
		(regions: FaceRegion[]) => {
			if (!sourceCanvasRef.current) return;
			const version = ++renderVersionRef.current;
			const blurred = applyFaceBlur(
				sourceCanvasRef.current,
				regions,
				blurStyle,
				intensity,
				padding / 100,
			);
			blurred.toBlob((blob) => {
				if (!blob || version !== renderVersionRef.current) return;
				setPreviewUrl((prev) => {
					if (prev) URL.revokeObjectURL(prev);
					return URL.createObjectURL(blob);
				});
			}, "image/png");
		},
		[blurStyle, intensity, padding],
	);

	useEffect(() => {
		if (state === "detected") renderPreview(faceRegions);
	}, [state, faceRegions, renderPreview]);

	function handleFile(file: File) {
		setErrorMessage(null);
		const url = URL.createObjectURL(file);
		const img = new Image();
		img.onload = () => {
			try {
				URL.revokeObjectURL(url);
				sourceCanvasRef.current = buildCanvasFromImage(img);
				setImageFile(file);
				setImageDimensions({
					width: img.naturalWidth,
					height: img.naturalHeight,
				});
				detectFaces(img);
			} catch (err) {
				setErrorMessage(
					err instanceof Error ? err.message : "Erro ao processar a imagem.",
				);
				setState("error");
			}
		};
		img.onerror = () => {
			URL.revokeObjectURL(url);
			setErrorMessage("Não foi possível carregar a imagem.");
			setState("error");
		};
		img.src = url;
	}

	async function detectFaces(img: HTMLImageElement) {
		setState("detecting");
		try {
			const detector = await ensureDetector();
			if (!detector) {
				throw new Error(
					"Modelo de detecção não carregou. Verifique sua conexão e tente novamente.",
				);
			}
			// Suppress noisy MediaPipe WASM logs (info-level messages routed to console.error)
			const origError = console.error;
			const origWarn = console.warn;
			const suppressPatterns = [
				"vision_wasm",
				"TensorFlow Lite",
				"inference_feedback_manager",
				"OpenGL error checking",
			];
			const shouldSuppress = (msg: string) =>
				suppressPatterns.some((p) => msg.includes(p));
			console.error = (...args: unknown[]) => {
				if (shouldSuppress(String(args[0] ?? ""))) return;
				origError.apply(console, args);
			};
			console.warn = (...args: unknown[]) => {
				if (shouldSuppress(String(args[0] ?? ""))) return;
				origWarn.apply(console, args);
			};
			try {
				const result = detector.detect(img);
				const regions: FaceRegion[] = (result.detections ?? []).map(
					// biome-ignore lint/suspicious/noExplicitAny: MediaPipe Detection type
					(d: any) => ({
						x: d.boundingBox.originX,
						y: d.boundingBox.originY,
						width: d.boundingBox.width,
						height: d.boundingBox.height,
					}),
				);
				setFaceRegions(regions);
				setState("detected");
				renderPreview(regions);
			} finally {
				console.error = origError;
				console.warn = origWarn;
			}
		} catch (err) {
			setErrorMessage(
				err instanceof Error ? err.message : "Erro ao detectar rostos.",
			);
			setState("error");
		}
	}

	function handleClear() {
		if (previewUrl) URL.revokeObjectURL(previewUrl);
		renderVersionRef.current++;
		sourceCanvasRef.current = null;
		setImageFile(null);
		setFaceRegions([]);
		setPreviewUrl(null);
		setErrorMessage(null);
		setState("idle");
	}

	function handleDownload() {
		if (!previewUrl || !imageFile) return;
		const a = document.createElement("a");
		a.href = previewUrl;
		const ext = imageFile.name.match(/\.[^.]+$/)?.[0] ?? ".png";
		a.download = imageFile.name.replace(/\.[^.]+$/, `_borrado${ext}`);
		a.click();
	}

	function handleDragOver(e: React.DragEvent<HTMLButtonElement>) {
		e.preventDefault();
		setIsDragging(true);
	}

	const faceCount = faceRegions.length;

	return (
		<LayoutA
			header={
				<>
					<span className="text-sm font-semibold tracking-tight">
						Borrador de Rosto
					</span>
					<div className="flex items-center gap-2">
						<Button
							variant="outline"
							size="sm"
							onClick={handleClear}
							disabled={state === "idle"}
						>
							<Trash className="h-3.5 w-3.5" />
							Limpar
						</Button>
						<Button
							size="sm"
							onClick={handleDownload}
							disabled={state !== "detected" || !previewUrl}
						>
							<Download className="h-3.5 w-3.5" />
							Baixar
						</Button>
					</div>
				</>
			}
			leftPanel={
				<div className="divide-y divide-border">
					<div className="p-4 space-y-3">
						<h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
							Estilo
						</h3>
						<OptionSwitch
							options={[
								{ label: "Desfoque", value: "blur" },
								{ label: "Pixelizar", value: "pixelate" },
							]}
							value={blurStyle}
							onChange={(v) => setBlurStyle(v as BlurStyle)}
							size="sm"
							fullWidth
						/>
					</div>

					<div className="p-4 space-y-3">
						<div className="flex items-center justify-between">
							<Label className="text-xs font-medium">Intensidade</Label>
							<span className="font-mono text-xs text-muted-foreground">
								{intensity}
							</span>
						</div>
						<Slider
							value={[intensity]}
							onValueChange={([v]) => setIntensity(v)}
							min={blurStyle === "blur" ? 2 : 4}
							max={blurStyle === "blur" ? 20 : 30}
							step={1}
						/>
					</div>

					<div className="p-4 space-y-3">
						<div className="flex items-center justify-between">
							<Label className="text-xs font-medium">Margem extra</Label>
							<span className="font-mono text-xs text-muted-foreground">
								{padding}%
							</span>
						</div>
						<Slider
							value={[padding]}
							onValueChange={([v]) => setPadding(v)}
							min={0}
							max={50}
							step={5}
						/>
						<p className="text-[10px] text-muted-foreground leading-tight">
							Expande a área borrada ao redor do rosto detectado.
						</p>
					</div>
				</div>
			}
			centerPanel={
				<div className="flex h-full min-h-110 flex-col items-center justify-center p-4">
					{state === "idle" ? (
						<ImageDropzone
							preview={null}
							isDragging={isDragging}
							onFile={handleFile}
							onClear={handleClear}
							onDragOver={handleDragOver}
							onDragLeave={() => setIsDragging(false)}
							onDrop={(e) => {
								e.preventDefault();
								setIsDragging(false);
								const f = e.dataTransfer.files?.[0];
								if (f) handleFile(f);
							}}
							accept="image/png,image/jpeg,image/webp"
							label="Selecione uma imagem"
							hint="PNG, JPG, WebP"
							className="w-full"
						/>
					) : state === "detecting" ? (
						<div className="flex flex-col items-center gap-3 text-muted-foreground">
							<Loader2 className="h-8 w-8 animate-spin" />
							<p className="text-sm">Detectando rostos…</p>
						</div>
					) : state === "error" ? (
						<p className="text-sm text-destructive text-center max-w-xs">
							{errorMessage}
						</p>
					) : (
						previewUrl && (
							// biome-ignore lint/performance/noImgElement: blob URL preview
							<img
								src={previewUrl}
								alt="Imagem com rostos borrados"
								className="max-h-full max-w-full object-contain rounded border border-border"
							/>
						)
					)}
				</div>
			}
			rightPanel={
				<div className="divide-y divide-border h-full">
					{state === "idle" ? (
						<div className="flex h-full min-h-30 flex-col items-center justify-center gap-3 px-4 text-muted-foreground">
							<ImageIcon className="h-8 w-8 opacity-20" />
							<p className="text-xs text-center">
								Envie uma imagem para detectar e borrar rostos automaticamente.
							</p>
						</div>
					) : (
						<>
							{imageFile && (
								<div className="p-4 space-y-2">
									<h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
										Arquivo
									</h3>
									<p className="truncate font-mono text-xs text-foreground">
										{imageFile.name}
									</p>
									<div className="flex items-center justify-between">
										<span className="text-xs text-muted-foreground">
											Tamanho
										</span>
										<span className="font-mono text-xs text-muted-foreground">
											{formatBytes(imageFile.size)}
										</span>
									</div>
									<div className="flex items-center justify-between">
										<span className="text-xs text-muted-foreground">
											Dimensões
										</span>
										<span className="font-mono text-xs text-muted-foreground">
											{imageDimensions.width} × {imageDimensions.height}
										</span>
									</div>
								</div>
							)}

							{state !== "detecting" && (
								<div className="p-4 space-y-2">
									<h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
										Detecção
									</h3>
									<div className="flex items-center gap-2">
										<ScanFace className="h-4 w-4 text-muted-foreground" />
										<span className="text-xs">
											{state === "error" ? (
												<span className="text-destructive">Falha</span>
											) : faceCount === 0 ? (
												"Nenhum rosto encontrado"
											) : faceCount === 1 ? (
												"1 rosto detectado"
											) : (
												`${faceCount} rostos detectados`
											)}
										</span>
									</div>
									{faceCount === 0 && state === "detected" && (
										<p className="text-[10px] text-muted-foreground leading-tight">
											Tente uma imagem com rostos mais visíveis e bem
											iluminados.
										</p>
									)}
								</div>
							)}

							{state === "detected" && faceCount > 0 && (
								<div className="p-4">
									<Button
										className="w-full"
										onClick={handleDownload}
										disabled={!previewUrl}
									>
										<Download className="h-4 w-4" />
										Baixar imagem
									</Button>
								</div>
							)}
						</>
					)}
				</div>
			}
		/>
	);
}
