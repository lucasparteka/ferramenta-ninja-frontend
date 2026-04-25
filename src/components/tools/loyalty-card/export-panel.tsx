"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { LayoutMode } from "./types";

type ExportPanelProps = {
	layoutMode: LayoutMode;
	onLayoutChange: (mode: LayoutMode) => void;
	onExportFrontPdf: () => void;
	onExportFrontPng: () => void;
	onExportBackPdf: () => void;
	onExportBackPng: () => void;
};

export function ExportPanel({
	layoutMode,
	onLayoutChange,
	onExportFrontPdf,
	onExportFrontPng,
	onExportBackPdf,
	onExportBackPng,
}: ExportPanelProps) {
	return (
		<div className="space-y-4 rounded-lg border border-border bg-card p-4">
			<div>
				<h3 className="mb-1 font-semibold text-foreground">
					Exportar para impressão
				</h3>
				<p className="text-sm text-muted-foreground">
					Gera uma folha A4 com cartões prontos para gráfica, com sangria de 3mm
					e marcas de corte.
				</p>
			</div>

			<div className="space-y-2">
				<Label>Layout de impressão</Label>
				<div className="flex flex-wrap gap-2">
					{(["8", "10"] as LayoutMode[]).map((mode) => (
						<button
							key={mode}
							type="button"
							onClick={() => onLayoutChange(mode)}
							aria-pressed={layoutMode === mode}
							className={`rounded border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
								layoutMode === mode
									? "border-primary bg-primary text-primary-foreground"
									: "border-border bg-card text-foreground hover:bg-muted"
							}`}
						>
							{mode === "8"
								? "8 por página (recomendado)"
								: "10 por página (econômico)"}
						</button>
					))}
				</div>
			</div>

			<div className="grid gap-4 sm:grid-cols-2">
				<div className="space-y-2">
					<Label>Frente</Label>
					<div className="flex flex-wrap gap-2">
						<Button onClick={onExportFrontPdf} variant="default" size="sm">
							<Download className="size-4" />
							Exportar PDF
						</Button>
						<Button onClick={onExportFrontPng} variant="outline" size="sm">
							<Download className="size-4" />
							Exportar PNG
						</Button>
					</div>
				</div>

				<div className="space-y-2">
					<Label>Verso</Label>
					<div className="flex flex-wrap gap-2">
						<Button onClick={onExportBackPdf} variant="default" size="sm">
							<Download className="size-4" />
							Exportar PDF
						</Button>
						<Button onClick={onExportBackPng} variant="outline" size="sm">
							<Download className="size-4" />
							Exportar PNG
						</Button>
					</div>
				</div>
			</div>

			<p className="text-xs text-muted-foreground">
				As cores podem variar na impressão devido à diferença entre RGB e CMYK.
			</p>
		</div>
	);
}
