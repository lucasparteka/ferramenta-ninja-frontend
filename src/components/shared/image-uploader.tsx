"use client";

import { Upload, X } from "lucide-react";
import Image from "next/image";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import Cropper from "react-easy-crop";
import { Slider } from "@/components/shared/slider";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogOverlay,
	DialogTitle,
} from "@/components/ui/dialog";
import { getCroppedImg } from "@/utils/image";

type Props = {
	label?: string;
	initialUrl?: string | null;
	initialRecordId?: string | null;
	onChange: (file: File | "") => void;
	maxFileSizeBytes?: number;
	acceptedTypes?: string[];
};

interface CroppedAreaPixels {
	x: number;
	y: number;
	width: number;
	height: number;
}

export default function ImageUploader({
	label = "Logo",
	initialUrl = null,
	onChange,
	maxFileSizeBytes = 2 * 1024 * 1024,
	acceptedTypes = ["image/png", "image/jpeg"],
}: Props) {
	const inputRef = useRef<HTMLInputElement | null>(null);
	const [preview, setPreview] = useState<string | null>(initialUrl);
	const [src, setSrc] = useState<string | null>(null);
	const [crop, setCrop] = useState({ x: 0, y: 0 });
	const [zoom, setZoom] = useState(1);
	const [croppedAreaPixels, setCroppedAreaPixels] =
		useState<CroppedAreaPixels | null>(null);
	const [openCrop, setOpenCrop] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [selectedFileType, setSelectedFileType] = useState<
		"image/png" | "image/jpeg" | null
	>(null);

	useEffect(() => {
		setPreview(initialUrl);
	}, [initialUrl]);

	const onSelectFile = (file?: File) => {
		setError(null);
		if (!file) return;
		if (!acceptedTypes.includes(file.type)) {
			setError("Formato inválido. Aceitamos apenas PNG ou JPG.");
			return;
		}
		if (file.size > maxFileSizeBytes) {
			setError(
				`Arquivo muito grande. Máximo ${maxFileSizeBytes / (1024 * 1024)}MB.`,
			);
			return;
		}
		const objectUrl = URL.createObjectURL(file);
		setSrc(objectUrl);
		setSelectedFileType(file.type as "image/png" | "image/jpeg");
		setOpenCrop(true);
	};

	const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		e.target.value = "";
		onSelectFile(file);
	};

	const onCropComplete = useCallback(
		(_: unknown, croppedAreaPx: CroppedAreaPixels) => {
			setCroppedAreaPixels(croppedAreaPx);
		},
		[],
	);

	const applyCrop = useCallback(async () => {
		if (!src || !croppedAreaPixels || !selectedFileType) return;
		try {
			const blob = await getCroppedImg(
				src,
				croppedAreaPixels,
				selectedFileType,
			);
			const extension = selectedFileType === "image/jpeg" ? "jpg" : "png";
			const file = new File([blob], `logo-${Date.now()}.${extension}`, {
				type: selectedFileType,
			});
			setPreview(URL.createObjectURL(file));
			onChange(file);
		} catch (err) {
			console.error(err);
			setError("Error processing image.");
		} finally {
			setOpenCrop(false);
			if (src) {
				URL.revokeObjectURL(src);
			}
			setSrc(null);
			setSelectedFileType(null);
			setZoom(1);
			setCrop({ x: 0, y: 0 });
		}
	}, [src, croppedAreaPixels, selectedFileType, onChange]);

	const removeLogo = () => {
		setPreview(null);
		onChange("");
	};

	return (
		<div>
			<span className="block text-sm font-medium mb-2">{label}</span>
			<div className="flex items-center gap-4">
				<div className="relative w-24 h-24 shrink-0 border rounded-md overflow-hidden flex items-center justify-center">
					{preview ? (
						<>
							<Image
								width={100}
								height={100}
								src={preview}
								className="w-full h-full object-cover"
								alt="logo preview"
							/>
							<button
								type="button"
								onClick={removeLogo}
								className="absolute top-0.5 right-0.5 bg-red-600 text-white rounded-full p-0.5"
								aria-label="Remove logo"
							>
								<X size={12} />
							</button>
						</>
					) : (
						<span className="text-xs text-muted-foreground text-center px-1 border-dashed">
							Sem imagem
						</span>
					)}
				</div>

				<div className="flex flex-col gap-2">
					<input
						ref={inputRef}
						type="file"
						accept={acceptedTypes.join(",")}
						onChange={handleFileInput}
						className="hidden"
					/>
					<div className="flex gap-2">
						<Button
							type="button"
							size="sm"
							onClick={() => inputRef.current?.click()}
							variant="outline"
							className="rounded-sm bg-white"
						>
							<Upload size={14} className="mr-2" /> Selecionar
						</Button>
					</div>
				</div>
			</div>
			<div className="mt-3">
				{error && <p className="text-sm text-destructive">{error}</p>}
				<p className="text-xs text-muted-foreground">
					Tamanho máximo {maxFileSizeBytes / (1024 * 1024)}MB. Extensões
					aceitas: PNG, JPG.
				</p>
			</div>
			<Dialog open={openCrop} onOpenChange={setOpenCrop}>
				<DialogOverlay className="z-100" />
				<DialogContent
					aria-describedby={undefined}
					className="max-w-2xl w-full z-100"
				>
					<DialogTitle>Ajustar Imagem</DialogTitle>
					<div className="relative w-full h-[60vh] bg-black">
						{src && (
							<Cropper
								image={src}
								crop={crop}
								zoom={zoom}
								aspect={1}
								showGrid={false}
								onZoomChange={setZoom}
								onCropChange={setCrop}
								onCropComplete={onCropComplete}
							/>
						)}
					</div>
					<div className="mt-4">
						<label className="block text-sm mb-2">Zoom</label>
						<Slider
							value={[zoom]}
							min={1}
							max={3}
							step={0.05}
							onValueChange={(v) => setZoom(v[0])}
						/>
					</div>
					<div className="mt-4 flex gap-4 ml-auto">
						<Button
							type="button"
							variant="outline"
							onClick={() => {
								setOpenCrop(false);
								if (src) {
									URL.revokeObjectURL(src);
									setSrc(null);
								}
								setSelectedFileType(null);
							}}
						>
							Cancelar
						</Button>
						<Button type="button" onClick={applyCrop}>
							Confirmar
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
}
