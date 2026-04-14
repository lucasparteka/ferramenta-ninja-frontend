"use client";

import {
	Circle,
	Download,
	Eraser,
	Grid3X3,
	ImageOff,
	Pencil,
	Square,
	Trash2,
} from "lucide-react";

type Tool = "pencil" | "eraser" | "rectangle" | "circle";

type CanvasToolbarProps = {
	currentTool: Tool;
	brushSize: number;
	color: string;
	isGridEnabled: boolean;
	isTransparentExport: boolean;
	onToolChange: (tool: Tool) => void;
	onBrushSizeChange: (size: number) => void;
	onColorChange: (color: string) => void;
	onClear: () => void;
	onExport: () => void;
	onToggleGrid: () => void;
	onToggleTransparent: () => void;
};

const tools = [
	{ id: "pencil" as Tool, label: "Lápis", icon: Pencil },
	{ id: "eraser" as Tool, label: "Borracha", icon: Eraser },
	{ id: "rectangle" as Tool, label: "Retângulo", icon: Square },
	{ id: "circle" as Tool, label: "Círculo", icon: Circle },
];

export function CanvasToolbar({
	currentTool,
	brushSize,
	color,
	isGridEnabled,
	isTransparentExport,
	onToolChange,
	onBrushSizeChange,
	onColorChange,
	onClear,
	onExport,
	onToggleGrid,
	onToggleTransparent,
}: CanvasToolbarProps) {
	const activeClass = "border-primary bg-primary text-primary-foreground";
	const inactiveClass =
		"border-border bg-background text-foreground hover:border-primary";
	const baseButtonClass =
		"flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

	return (
		<div className="flex flex-row flex-wrap gap-4 rounded-lg border border-border bg-card p-3 lg:w-52 lg:shrink-0 lg:flex-col">
			<div className="flex flex-row flex-wrap gap-2 lg:flex-col">
				<p className="hidden w-full text-xs font-medium text-muted-foreground lg:block">
					Ferramentas
				</p>
				{tools.map((tool) => (
					<button
						key={tool.id}
						type="button"
						aria-label={tool.label}
						aria-pressed={currentTool === tool.id}
						onClick={() => onToolChange(tool.id)}
						className={`${baseButtonClass} ${currentTool === tool.id ? activeClass : inactiveClass}`}
					>
						<tool.icon className="h-4 w-4 shrink-0" aria-hidden="true" />
						<span>{tool.label}</span>
					</button>
				))}
			</div>

			<div className="flex flex-col gap-1 max-md:min-w-full">
				<label
					htmlFor="color-picker"
					className="text-xs font-medium text-muted-foreground"
				>
					Cor
				</label>
				<input
					id="color-picker"
					type="color"
					value={color}
					onChange={(e) => onColorChange(e.target.value)}
					className="h-9 w-full cursor-pointer rounded-md border border-border bg-background p-1"
					aria-label="Selecionar cor"
				/>
			</div>

			<div className="flex flex-col gap-1 max-md:min-w-full">
				<label
					htmlFor="brush-size"
					className="text-xs font-medium text-muted-foreground"
				>
					Tamanho: {brushSize}px
				</label>
				<input
					id="brush-size"
					type="range"
					min={1}
					max={50}
					value={brushSize}
					onChange={(e) => onBrushSizeChange(Number(e.target.value))}
					className="w-full accent-primary"
					aria-label={`Tamanho do pincel: ${brushSize} pixels`}
				/>
			</div>

			<div className="flex flex-row flex-wrap gap-2 lg:flex-col">
				<p className="hidden w-full text-xs font-medium text-muted-foreground lg:block">
					Opções
				</p>
				<button
					type="button"
					aria-label="Alternar grade"
					aria-pressed={isGridEnabled}
					onClick={onToggleGrid}
					className={`${baseButtonClass} ${isGridEnabled ? activeClass : inactiveClass}`}
				>
					<Grid3X3 className="h-4 w-4 shrink-0" aria-hidden="true" />
					Grade
				</button>
				<button
					type="button"
					aria-label="Alternar fundo transparente ao exportar"
					aria-pressed={isTransparentExport}
					onClick={onToggleTransparent}
					className={`${baseButtonClass} ${isTransparentExport ? activeClass : inactiveClass}`}
				>
					<ImageOff className="h-4 w-4 shrink-0" aria-hidden="true" />
					Fundo transparente
				</button>
			</div>

			<div className="flex flex-row flex-wrap gap-2 lg:flex-col">
				<p className="hidden w-full text-xs font-medium text-muted-foreground lg:block">
					Ações
				</p>
				<button
					type="button"
					aria-label="Limpar canvas"
					onClick={onClear}
					className={`${baseButtonClass} border-border bg-background text-destructive hover:border-destructive`}
				>
					<Trash2 className="h-4 w-4 shrink-0" aria-hidden="true" />
					Limpar
				</button>
				<button
					type="button"
					aria-label="Salvar imagem como PNG"
					onClick={onExport}
					className="flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
				>
					<Download className="h-4 w-4 shrink-0" aria-hidden="true" />
					Salvar imagem
				</button>
			</div>
		</div>
	);
}
