"use client";

import { DragDropProvider } from "@dnd-kit/react";
import { isSortableOperation, useSortable } from "@dnd-kit/react/sortable";
import {
	Copy,
	FileDown,
	GripVertical,
	Hash,
	Image,
	Plus,
	Trash,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { exportChecklistPdf, exportChecklistPng } from "@/lib/checklist/export";
import { CHECKLIST_TEMPLATES } from "@/lib/checklist/templates";
import type {
	CanvasHandle,
	ChecklistHeader,
	ChecklistItem,
	ChecklistItemKind,
	ChecklistLayout,
	ChecklistState,
	ChecklistStyle,
} from "@/lib/checklist/types";
import { ChecklistCanvas } from "./checklist-canvas";
import { TemplateSelector } from "./template-selector";

const DEFAULT_HEADER: ChecklistHeader = {
	enabled: false,
	subtitle: "",
	date: "",
	name: "",
	backgroundColor: "#1e3a5f",
};

function buildInitialState(): ChecklistState {
	const template = CHECKLIST_TEMPLATES[0];
	return {
		title: template.content.title,
		items: [...template.content.items],
		layout: { ...template.layout },
		style: { ...template.style },
		header: { ...DEFAULT_HEADER },
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

type SortableItemProps = {
	id: string;
	index: number;
	item: string;
	kind: ChecklistItemKind;
	inputRef: (el: HTMLInputElement | null) => void;
	onUpdate: (index: number, value: string) => void;
	onDuplicate: (index: number) => void;
	onRemove: (index: number) => void;
	onAddAfter: (index: number) => void;
	disableRemove: boolean;
};

function SortableItem({
	id,
	index,
	item,
	kind,
	inputRef,
	onUpdate,
	onDuplicate,
	onRemove,
	onAddAfter,
	disableRemove,
}: SortableItemProps) {
	const { ref, handleRef, isDragSource } = useSortable({ id, index });
	const isGroup = kind === "group";
	return (
		<li
			ref={ref}
			className={`flex items-center gap-2${isDragSource ? " opacity-50" : ""}${isGroup ? " mt-5" : ""}`}
		>
			<button
				ref={handleRef}
				type="button"
				aria-label="Reordenar item"
				className="cursor-grab touch-none text-muted-foreground"
			>
				<GripVertical className="size-4" />
			</button>
			{isGroup && <Hash className="size-4 shrink-0 text-muted-foreground" />}
			<Input
				ref={inputRef}
				value={item}
				onChange={(e) => onUpdate(index, e.target.value)}
				onKeyDown={(e) => e.key === "Enter" && onAddAfter(index)}
				placeholder={isGroup ? "Nome do grupo..." : "Digite uma tarefa..."}
				className={isGroup ? "font-semibold" : ""}
			/>
			<Button
				type="button"
				variant="ghost"
				size="icon"
				onClick={() => onDuplicate(index)}
				aria-label="Duplicar item"
			>
				<Copy className="size-4" />
			</Button>
			<Button
				type="button"
				variant="secondary"
				onClick={() => onRemove(index)}
				aria-label="Remover item"
				disabled={disableRemove}
			>
				<Trash className="size-4" />
			</Button>
		</li>
	);
}

export function ChecklistEditor() {
	const [state, setState] = useState<ChecklistState>(buildInitialState);
	const [selectedTemplateId, setSelectedTemplateId] = useState(
		CHECKLIST_TEMPLATES[0].id,
	);
	const canvasRef = useRef<CanvasHandle>(null);
	const idCounter = useRef(0);
	const [itemIds, setItemIds] = useState<string[]>(() =>
		buildInitialState().items.map(() => String(idCounter.current++)),
	);
	const focusIndexRef = useRef<number | null>(null);
	const inputRefs = useRef<Map<number, HTMLInputElement>>(new Map());
	const [activeTab, setActiveTab] = useState<"aparencia" | "itens">(
		"aparencia",
	);

	useEffect(() => {
		if (focusIndexRef.current !== null) {
			inputRefs.current.get(focusIndexRef.current)?.focus();
			focusIndexRef.current = null;
		}
	});

	function handleSelectTemplate(id: string) {
		const template = CHECKLIST_TEMPLATES.find((t) => t.id === id);
		if (!template) return;
		setSelectedTemplateId(id);
		setState((prev) => ({
			title: template.content.title,
			items: [...template.content.items],
			layout: { ...template.layout },
			style: { ...template.style },
			header: { ...prev.header },
		}));
		setItemIds(template.content.items.map(() => String(idCounter.current++)));
	}

	function updateHeader(patch: Partial<ChecklistHeader>) {
		setState((prev) => ({ ...prev, header: { ...prev.header, ...patch } }));
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
			items[index] = { ...items[index], text: value };
			return { ...prev, items };
		});
	}

	function insertItem(afterIndex: number, newItem: ChecklistItem) {
		setState((prev) => {
			const items = [...prev.items];
			items.splice(afterIndex, 0, newItem);
			return { ...prev, items };
		});
		setItemIds((prev) => {
			const ids = [...prev];
			ids.splice(afterIndex, 0, String(idCounter.current++));
			return ids;
		});
	}

	function addItem() {
		insertItem(state.items.length, { text: "", kind: "item" });
		focusIndexRef.current = state.items.length;
	}

	function addGroup() {
		insertItem(state.items.length, { text: "", kind: "group" });
		focusIndexRef.current = state.items.length;
	}

	const setInputRef = useCallback(
		(index: number, el: HTMLInputElement | null) => {
			if (el) inputRefs.current.set(index, el);
			else inputRefs.current.delete(index);
		},
		[],
	);

	function addItemAfter(index: number) {
		insertItem(index + 1, { text: "", kind: "item" });
		focusIndexRef.current = index + 1;
	}

	function removeItem(index: number) {
		setState((prev) => ({
			...prev,
			items: prev.items.filter((_, i) => i !== index),
		}));
		setItemIds((prev) => prev.filter((_, i) => i !== index));
	}

	function clearItems() {
		setState((prev) => ({ ...prev, items: [{ text: "", kind: "item" }] }));
		setItemIds([String(idCounter.current++)]);
	}

	function duplicateItem(index: number) {
		setState((prev) => {
			const items = [...prev.items];
			items.splice(index + 1, 0, { ...prev.items[index] });
			return { ...prev, items };
		});
		setItemIds((prev) => {
			const ids = [...prev];
			ids.splice(index + 1, 0, String(idCounter.current++));
			return ids;
		});
	}

	function reorderItems(from: number, to: number) {
		setState((prev) => {
			const items = [...prev.items];
			const [moved] = items.splice(from, 1);
			items.splice(to, 0, moved);
			return { ...prev, items };
		});
		setItemIds((prev) => {
			const ids = [...prev];
			const [moved] = ids.splice(from, 1);
			ids.splice(to, 0, moved);
			return ids;
		});
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
			<div>
				<div className="flex border-b border-border mb-5">
					{(
						[
							{ id: "aparencia", label: "Aparência" },
							{
								id: "itens",
								label: `Itens${state.items.length > 0 ? ` (${state.items.length})` : ""}`,
							},
						] as const
					).map((tab) => (
						<button
							key={tab.id}
							type="button"
							onClick={() => setActiveTab(tab.id)}
							className={`-mb-px border-b-2 px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none ${
								activeTab === tab.id
									? "border-primary text-foreground"
									: "border-transparent text-muted-foreground hover:text-foreground"
							}`}
						>
							{tab.label}
						</button>
					))}
				</div>

				{activeTab === "aparencia" && (
					<div className="space-y-5">
						<div className="space-y-2">
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
						<div className="space-y-3">
							<div className="flex items-center gap-2">
								<Checkbox
									id="header-enabled"
									checked={state.header.enabled}
									onCheckedChange={(checked) =>
										updateHeader({ enabled: checked === true })
									}
								/>
								<label
									htmlFor="header-enabled"
									className="cursor-pointer text-sm font-medium"
								>
									Cabeçalho personalizado
								</label>
							</div>
							{state.header.enabled && (
								<div className="space-y-3 rounded-md border border-border p-3">
									<div className="space-y-2">
										<Label className="text-sm font-medium">Cor de fundo</Label>
										<div className="flex items-center gap-3">
											<input
												type="color"
												value={state.header.backgroundColor}
												onChange={(e) =>
													updateHeader({
														backgroundColor: e.target.value,
													})
												}
												className="h-9 w-12 cursor-pointer rounded-md border border-border bg-card p-1"
											/>
											<Input
												value={state.header.backgroundColor}
												onChange={(e) =>
													updateHeader({
														backgroundColor: e.target.value,
													})
												}
												maxLength={7}
												className="w-28 font-mono text-sm"
											/>
										</div>
									</div>
									<div className="space-y-2">
										<Label className="text-sm font-medium">
											Subtítulo
											<span className="ml-1 font-normal text-muted-foreground">
												(opcional)
											</span>
										</Label>
										<Input
											value={state.header.subtitle}
											onChange={(e) =>
												updateHeader({ subtitle: e.target.value })
											}
											maxLength={120}
											placeholder="Ex: Semana 42 · Projeto X"
										/>
									</div>
									<div className="grid grid-cols-2 gap-3">
										<div className="space-y-2">
											<Label className="text-sm font-medium">
												Data
												<span className="ml-1 font-normal text-muted-foreground">
													(opcional)
												</span>
											</Label>
											<Input
												value={state.header.date}
												onChange={(e) => updateHeader({ date: e.target.value })}
												maxLength={40}
												placeholder="Ex: 15/04/2026"
											/>
										</div>
										<div className="space-y-2">
											<Label className="text-sm font-medium">
												Nome
												<span className="ml-1 font-normal text-muted-foreground">
													(opcional)
												</span>
											</Label>
											<Input
												value={state.header.name}
												onChange={(e) => updateHeader({ name: e.target.value })}
												maxLength={60}
												placeholder="Ex: Lucas"
											/>
										</div>
									</div>
								</div>
							)}
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
									onChange={(v) =>
										updateLayout({ columns: Number(v) as 1 | 2 })
									}
								/>
							</div>
							<div className="space-y-2">
								<Label className="text-sm font-medium">Espaçamento</Label>
								<ToggleGroup
									options={[
										{ value: "compact" as const, label: "Compacto" },
										{
											value: "comfortable" as const,
											label: "Confortável",
										},
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
								<Label className="text-sm font-medium">
									Alinhamento do título
								</Label>
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
						<div className="space-y-2">
							<Label className="text-sm font-medium">
								Linhas para escrita manual
							</Label>
							<div className="flex items-center gap-2">
								<Button
									type="button"
									variant="outline"
									size="icon"
									className="h-8 w-8 shrink-0 bg-white"
									onClick={() =>
										updateLayout({
											writingLines: Math.max(0, state.layout.writingLines - 1),
										})
									}
									disabled={state.layout.writingLines <= 0}
								>
									−
								</Button>
								<span className="w-6 text-center text-sm tabular-nums">
									{state.layout.writingLines}
								</span>
								<Button
									type="button"
									variant="outline"
									size="icon"
									className="h-8 w-8 shrink-0 bg-white"
									onClick={() =>
										updateLayout({
											writingLines: Math.min(20, state.layout.writingLines + 1),
										})
									}
									disabled={state.layout.writingLines >= 20}
								>
									+
								</Button>
							</div>
						</div>
						<div className="flex flex-wrap gap-4">
							<div className="flex items-center gap-2">
								<Checkbox
									id="show-checkbox"
									checked={state.layout.showCheckbox}
									onCheckedChange={(checked) =>
										updateLayout({ showCheckbox: checked === true })
									}
								/>
								<label
									htmlFor="show-checkbox"
									className="cursor-pointer text-sm"
								>
									Mostrar caixas de seleção
								</label>
							</div>
							<div className="flex items-center gap-2">
								<Checkbox
									id="show-dividers"
									checked={state.layout.showDividers}
									onCheckedChange={(checked) =>
										updateLayout({ showDividers: checked === true })
									}
								/>
								<label
									htmlFor="show-dividers"
									className="cursor-pointer text-sm"
								>
									Mostrar divisores
								</label>
							</div>
						</div>
						<div className="space-y-2">
							<Label className="text-sm font-medium">Cor de fundo</Label>
							<div className="flex items-center gap-3">
								<input
									type="color"
									value={state.style.backgroundColor}
									onChange={(e) =>
										updateStyle({ backgroundColor: e.target.value })
									}
									className="h-9 w-12 cursor-pointer rounded-md border border-border bg-card p-1"
								/>
								<Input
									value={state.style.backgroundColor}
									onChange={(e) =>
										updateStyle({ backgroundColor: e.target.value })
									}
									maxLength={7}
									className="w-28 font-mono text-sm"
								/>
							</div>
						</div>
					</div>
				)}

				{activeTab === "itens" && (
					<div className="space-y-2">
						<Label className="text-sm font-medium block mb-1">Itens</Label>
						<DragDropProvider
							onDragEnd={({ operation, canceled }) => {
								if (canceled || !isSortableOperation(operation)) return;
								if (operation.source == null) return;
								if (operation.source.initialIndex !== operation.source.index) {
									reorderItems(
										operation.source.initialIndex,
										operation.source.index,
									);
								}
							}}
						>
							<ul className="space-y-2">
								{state.items.map((item, index) => (
									<SortableItem
										key={itemIds[index]}
										id={itemIds[index]}
										index={index}
										item={item.text}
										kind={item.kind}
										inputRef={(el) => setInputRef(index, el)}
										onUpdate={updateItem}
										onDuplicate={duplicateItem}
										onRemove={removeItem}
										onAddAfter={addItemAfter}
										disableRemove={state.items.length <= 1}
									/>
								))}
							</ul>
						</DragDropProvider>
						<div className="flex gap-2 pt-1">
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={addItem}
								className="flex-1"
							>
								<Plus className="size-4" />
								Adicionar item
							</Button>
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={addGroup}
								className="flex-1"
							>
								<Hash className="size-4" />
								Adicionar grupo
							</Button>
						</div>
						<AlertDialog>
							<AlertDialogTrigger
								render={
									<Button type="button" variant="secondary" className="mt-4" />
								}
							>
								<Trash className="size-4" />
								Limpar todos os itens
							</AlertDialogTrigger>
							<AlertDialogContent size="sm">
								<AlertDialogHeader>
									<AlertDialogTitle>Limpar itens</AlertDialogTitle>
									<AlertDialogDescription>
										Todos os itens serão removidos. Essa ação não pode ser
										desfeita.
									</AlertDialogDescription>
								</AlertDialogHeader>
								<AlertDialogFooter>
									<AlertDialogCancel>Cancelar</AlertDialogCancel>
									<AlertDialogAction variant="destructive" onClick={clearItems}>
										Limpar
									</AlertDialogAction>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>
					</div>
				)}
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
