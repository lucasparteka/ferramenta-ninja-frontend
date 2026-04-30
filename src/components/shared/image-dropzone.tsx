"use client";

import { Trash } from "lucide-react";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ImageDropzoneProps = {
	preview: string | null;
	isDragging: boolean;
	accept?: string;
	label?: string;
	hint?: string;
	onFile: (file: File) => void;
	onClear: () => void;
	onDragOver: (e: React.DragEvent<HTMLButtonElement>) => void;
	onDragLeave: () => void;
	onDrop: (e: React.DragEvent<HTMLButtonElement>) => void;
	className?: string;
};

export function ImageDropzone({
	preview,
	isDragging,
	accept = "image/png,image/jpeg,image/webp",
	label = "Selecione uma imagem",
	hint = "PNG, JPG, WebP",
	onFile,
	onClear,
	onDragOver,
	onDragLeave,
	onDrop,
	className,
}: ImageDropzoneProps) {
	const inputRef = useRef<HTMLInputElement>(null);
	const inputId = "image-dropzone-input";

	function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];
		if (file) onFile(file);
	}

	return (
		<div className={cn("space-y-1", className)}>
			<label
				htmlFor={inputId}
				className="block text-sm font-medium text-foreground"
			>
				{label}
			</label>
			<button
				type="button"
				aria-label="Área de upload de imagem. Clique ou arraste uma imagem."
				onClick={() => inputRef.current?.click()}
				onDragOver={onDragOver}
				onDragLeave={onDragLeave}
				onDrop={onDrop}
				className={cn(
					"flex min-h-48 w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
					isDragging
						? "border-primary bg-primary/5"
						: "border-border bg-secondary hover:border-primary hover:bg-primary/5",
				)}
			>
				{preview ? (
					// biome-ignore lint/performance/noImgElement: blob URLs requerem img nativo
					<img
						src={preview}
						alt="Pré-visualização da imagem selecionada"
						className="max-h-48 max-w-full rounded object-contain"
					/>
				) : (
					<>
						<p className="text-sm font-medium text-foreground">
							Arraste uma imagem ou clique para selecionar
						</p>
						<p className="text-xs text-muted-foreground">{hint}</p>
					</>
				)}
			</button>
			<input
				ref={inputRef}
				id={inputId}
				type="file"
				accept={accept}
				onChange={handleFileChange}
				className="hidden"
			/>
			{preview && (
				<Button variant="secondary" className="mt-3 w-full" onClick={onClear}>
					<Trash />
					Limpar
				</Button>
			)}
		</div>
	);
}
