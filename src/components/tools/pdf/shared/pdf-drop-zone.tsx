import { Upload } from "lucide-react";

type PdfDropZoneProps = {
	file?: File | null;
	isDragging: boolean;
	onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
	onDragLeave: () => void;
	onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
	onClick: () => void;
	hint?: string;
	fileInfo?: string;
};

export function PdfDropZone({
	file,
	isDragging,
	onDragOver,
	onDragLeave,
	onDrop,
	onClick,
	hint = "Apenas arquivo PDF",
	fileInfo,
}: PdfDropZoneProps) {
	return (
		// biome-ignore lint/a11y/useSemanticElements: .
		<div
			role="button"
			tabIndex={0}
			aria-label="Área de upload de PDF. Clique ou arraste um arquivo."
			onClick={onClick}
			onKeyDown={(e) => {
				if (e.key === "Enter" || e.key === " ") onClick();
			}}
			onDragOver={onDragOver}
			onDragLeave={onDragLeave}
			onDrop={onDrop}
			className={`flex min-h-28 cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
				isDragging
					? "border-primary bg-primary/5"
					: "border-border bg-muted/40 hover:border-primary/50 hover:bg-primary/5"
			}`}
		>
			{file ? (
				<div className="space-y-0.5 px-4 text-center">
					<p className="text-sm font-medium text-foreground">{file.name}</p>
					{fileInfo && (
						<p className="font-mono text-xs text-muted-foreground">
							{fileInfo}
						</p>
					)}
				</div>
			) : (
				<>
					<Upload
						size={20}
						strokeWidth={1.75}
						className="text-muted-foreground"
					/>
					<div className="space-y-0.5 text-center">
						<p className="text-sm font-medium text-foreground">
							Arraste um PDF ou clique para selecionar
						</p>
						<p className="text-xs text-muted-foreground">{hint}</p>
					</div>
				</>
			)}
		</div>
	);
}
