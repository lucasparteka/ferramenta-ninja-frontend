"use client";

import { FileDown, Image, Plus, Trash2 } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { exportChecklistPdf, exportChecklistPng } from "@/lib/checklist/export";
import { CHECKLIST_TEMPLATES } from "@/lib/checklist/templates";
import type {
	CanvasHandle,
	ChecklistLayout,
	ChecklistState,
	ChecklistStyle,
} from "@/lib/checklist/types";
import { ChecklistCanvas } from "./checklist-canvas";
import { TemplateSelector } from "./template-selector";

function buildInitialState(): ChecklistState {
	const template = CHECKLIST_TEMPLATES[0];
	return {
		title: template.content.title,
		items: [...template.content.items],
		layout: { ...template.layout },
		style: { ...template.style },
	};
}

type ToggleGroupProps<T extends string> = {
	options: { value: T; label: string }[];
	value: T;
	onChange: (value: T) => void;
};

function ToggleGroup<T extends string>({
	options,
	value,
	onChange,
}: ToggleGroupProps<T>) {
	return (
		<div className="flex gap-1">
			{options.map((opt) => (
				<button
					key={opt.value}
					type="button"
					onClick={() => onChange(opt.value)}
					className={`rounded-md border px-3 py-1 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
						value === opt.value
							? "border-primary bg-primary text-primary-foreground"
							: "border-border bg-card text-foreground hover:bg-muted"
					}`}
				>
					{opt.label}
				</button>
			))}
		</div>
	);
}

export function ChecklistEditor() {
	const [state, setState] = useState<ChecklistState>(buildInitialState);
	const [selectedTemplateId, setSelectedTemplateId] = useState(
		CHECKLIST_TEMPLATES[0].id,
	);
	const canvasRef = useRef<CanvasHandle>(null);

	function handleSelectTemplate(id: string) {
		const template = CHECKLIST_TEMPLATES.find((t) => t.id === id);
		if (!template) return;
		setSelectedTemplateId(id);
		setState({
			title: template.content.title,
			items: [...template.content.items],
			layout: { ...template.layout },
			style: { ...template.style },
		});
	}

	function updateLayout(patch: Partial<ChecklistLayout>) {
		setState((prev) => ({ ...prev, layout: { ...prev.layout, ...patch } }));
	}

	function updateStyle(patch: Partial<ChecklistStyle>) {
		setState((prev) => ({ ...prev, style: { ...prev.style, ...patch } }));
	}

	function updateItem(index: number, value: string) {
		setState((prev) => {
			const items = [...prev.items];
			items[index] = value;
			return { ...prev, items };
		});
	}

	function addItem() {
		setState((prev) => ({ ...prev, items: [...prev.items, ""] }));
	}

	function removeItem(index: number) {
		setState((prev) => ({
			...prev,
			items: prev.items.filter((_, i) => i !== index),
		}));
	}

	function clearItems() {
		setState((prev) => ({ ...prev, items: [""] }));
	}

	async function handleExportPdf() {
		const dataUrl = canvasRef.current?.getDataURL() ?? "";
		if (dataUrl) await exportChecklistPdf(dataUrl);
	}

	function handleExportPng() {
		const dataUrl = canvasRef.current?.getDataURL() ?? "";
		if (dataUrl) exportChecklistPng(dataUrl);
	}

	return (
		<div className="grid gap-6 lg:grid-cols-2">
			<div className="space-y-5">
				<div className="space-y-2 max-md:max-w-[90vw]">
					<Label className="text-sm font-medium">Template</Label>
					<TemplateSelector
						templates={CHECKLIST_TEMPLATES}
						selectedId={selectedTemplateId}
						onSelect={handleSelectTemplate}
					/>
				</div>
				<div className="space-y-2">
					<Label htmlFor="checklist-title" className="text-sm font-medium">
						Título
					</Label>
					<Input
						id="checklist-title"
						value={state.title}
						onChange={(e) =>
							setState((prev) => ({ ...prev, title: e.target.value }))
						}
						maxLength={80}
						placeholder="Título do checklist"
					/>
				</div>
				<div className="grid md:grid-cols-2 gap-4">
					<div className="space-y-2">
						<Label className="text-sm font-medium">Colunas</Label>
						<ToggleGroup
							options={[
								{ value: "1" as const, label: "1 coluna" },
								{ value: "2" as const, label: "2 colunas" },
							]}
							value={String(state.layout.columns) as "1" | "2"}
							onChange={(v) => updateLayout({ columns: Number(v) as 1 | 2 })}
						/>
					</div>
					<div className="space-y-2">
						<Label className="text-sm font-medium">Espaçamento</Label>
						<ToggleGroup
							options={[
								{ value: "compact" as const, label: "Compacto" },
								{ value: "comfortable" as const, label: "Confortável" },
							]}
							value={state.layout.spacing}
							onChange={(v) => updateLayout({ spacing: v })}
						/>
					</div>
				</div>
				<div className="grid grid-cols-2 gap-4">
					<div className="space-y-2">
						<Label className="text-sm font-medium">Tamanho da fonte</Label>
						<ToggleGroup
							options={[
								{ value: "sm" as const, label: "P" },
								{ value: "md" as const, label: "M" },
								{ value: "lg" as const, label: "G" },
							]}
							value={state.style.fontSize}
							onChange={(v) => updateStyle({ fontSize: v })}
						/>
					</div>
					<div className="space-y-2">
						<Label className="text-sm font-medium">Alinhamento do título</Label>
						<ToggleGroup
							options={[
								{ value: "left" as const, label: "Esquerda" },
								{ value: "center" as const, label: "Centro" },
							]}
							value={state.style.titleAlign}
							onChange={(v) => updateStyle({ titleAlign: v })}
						/>
					</div>
				</div>
				<div className="flex flex-wrap gap-4">
					<label className="flex cursor-pointer items-center gap-2 text-sm">
						<input
							type="checkbox"
							checked={state.layout.showCheckbox}
							onChange={(e) => updateLayout({ showCheckbox: e.target.checked })}
							className="rounded"
						/>
						Mostrar caixas de seleção
					</label>
					<label className="flex cursor-pointer items-center gap-2 text-sm">
						<input
							type="checkbox"
							checked={state.layout.showDividers}
							onChange={(e) => updateLayout({ showDividers: e.target.checked })}
							className="rounded"
						/>
						Mostrar divisores
					</label>
				</div>
				<div className="space-y-2">
					<Label className="text-sm font-medium">Cor de fundo</Label>
					<div className="flex items-center gap-3">
						<input
							type="color"
							value={state.style.backgroundColor}
							onChange={(e) => updateStyle({ backgroundColor: e.target.value })}
							className="h-9 w-12 cursor-pointer rounded-md border border-border bg-card p-1"
						/>
						<Input
							value={state.style.backgroundColor}
							onChange={(e) => updateStyle({ backgroundColor: e.target.value })}
							maxLength={7}
							className="w-28 font-mono text-sm"
						/>
					</div>
				</div>
				<div className="space-y-2">
					<div className="flex items-center justify-between">
						<Label className="text-sm font-medium">Itens</Label>
						<button
							type="button"
							onClick={clearItems}
							className="text-sm text-muted-foreground underline-offset-4 hover:underline"
						>
							Limpar
						</button>
					</div>
					<ul className="space-y-2">
						{state.items.map((item, index) => (
							<li
								key={`item-${
									// biome-ignore lint/suspicious/noArrayIndexKey: ordered list
									index
								}`}
								className="flex items-center gap-2"
							>
								<Input
									value={item}
									onChange={(e) => updateItem(index, e.target.value)}
									placeholder={`Item ${index + 1}`}
								/>
								<Button
									type="button"
									variant="ghost"
									size="icon"
									onClick={() => removeItem(index)}
									aria-label="Remover item"
									disabled={state.items.length <= 1}
								>
									<Trash2 className="size-4" />
								</Button>
							</li>
						))}
					</ul>
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={addItem}
						className="w-full"
					>
						<Plus className="size-4" />
						Adicionar item
					</Button>
				</div>
			</div>
			<div className="space-y-4">
				<div className="overflow-hidden rounded-lg border border-border bg-white shadow-sm">
					<ChecklistCanvas ref={canvasRef} state={state} />
				</div>
				<div className="flex gap-3">
					<Button onClick={handleExportPdf} className="flex-1">
						<FileDown className="size-4" />
						Baixar PDF
					</Button>
					<Button
						onClick={handleExportPng}
						variant="outline"
						className="flex-1"
					>
						<Image className="size-4" />
						Baixar PNG
					</Button>
				</div>
			</div>
		</div>
	);
}
