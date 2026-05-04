"use client";

import { FileDown, Image, Plus, Trash } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/select-native";
import { buildInitialState, LS_KEY } from "@/lib/inventario/defaults";
import {
	exportInventarioPdf,
	exportInventarioPng,
} from "@/lib/inventario/export";
import type {
	CanvasHandle,
	InventarioColumn,
	InventarioHeaderField,
	InventarioState,
} from "@/lib/inventario/types";
import { InventarioCanvas } from "./inventario-canvas";

type Tab = "geral" | "cabecalho" | "colunas";

const TABS: { id: Tab; label: string }[] = [
	{ id: "geral", label: "Geral" },
	{ id: "cabecalho", label: "Cabeçalho" },
	{ id: "colunas", label: "Colunas" },
];

const WIDTH_OPTIONS = [
	{ value: 1, label: "Estreita" },
	{ value: 2, label: "Normal" },
	{ value: 3, label: "Larga" },
	{ value: 4, label: "Extra larga" },
];

export function InventarioEditor() {
	const [state, setState] = useState<InventarioState>(buildInitialState);
	const [activeTab, setActiveTab] = useState<Tab>("geral");
	const canvasRef = useRef<CanvasHandle>(null);

	useEffect(() => {
		try {
			localStorage.setItem(LS_KEY, JSON.stringify(state));
		} catch {
			// ignore
		}
	}, [state]);

	function updateHeaderField(
		id: string,
		patch: Partial<InventarioHeaderField>,
	) {
		setState((prev) => ({
			...prev,
			headerFields: prev.headerFields.map((f) =>
				f.id === id ? { ...f, ...patch } : f,
			),
		}));
	}

	function addHeaderField() {
		setState((prev) => ({
			...prev,
			headerFields: [
				...prev.headerFields,
				{ id: crypto.randomUUID(), label: "Campo", value: "" },
			],
		}));
	}

	function removeHeaderField(id: string) {
		setState((prev) => ({
			...prev,
			headerFields: prev.headerFields.filter((f) => f.id !== id),
		}));
	}

	function updateColumn(id: string, patch: Partial<InventarioColumn>) {
		setState((prev) => ({
			...prev,
			columns: prev.columns.map((c) => (c.id === id ? { ...c, ...patch } : c)),
		}));
	}

	function addColumn() {
		setState((prev) => ({
			...prev,
			columns: [
				...prev.columns,
				{ id: crypto.randomUUID(), label: "Nova Coluna", width: 2 },
			],
		}));
	}

	function removeColumn(id: string) {
		setState((prev) => ({
			...prev,
			columns: prev.columns.filter((c) => c.id !== id),
		}));
	}

	async function handleExportPdf() {
		const dataUrl = canvasRef.current?.getDataURL() ?? "";
		if (dataUrl) await exportInventarioPdf(dataUrl, state.orientation);
	}

	function handleExportPng() {
		const dataUrl = canvasRef.current?.getDataURL() ?? "";
		if (dataUrl) exportInventarioPng(dataUrl);
	}

	return (
		<div className="grid gap-6 lg:grid-cols-[5fr_6fr]">
			<div>
				<div className="flex border-b border-border mb-5">
					{TABS.map((tab) => (
						<button
							key={tab.id}
							type="button"
							onClick={() => setActiveTab(tab.id)}
							className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
								activeTab === tab.id
									? "border-foreground text-foreground"
									: "border-transparent text-muted-foreground hover:text-foreground"
							}`}
						>
							{tab.label}
						</button>
					))}
				</div>

				<div className="space-y-4">
					{activeTab === "geral" && (
						<>
							<div className="space-y-2">
								<Label htmlFor="titulo">Título do documento</Label>
								<Input
									id="titulo"
									value={state.title}
									onChange={(e) =>
										setState((prev) => ({ ...prev, title: e.target.value }))
									}
									placeholder="Controle de Estoque"
								/>
							</div>

							<div className="space-y-2">
								<Label>Orientação</Label>
								<div className="flex gap-2">
									{(
										[
											{ value: "portrait", label: "Retrato" },
											{ value: "landscape", label: "Paisagem" },
										] as const
									).map((opt) => (
										<button
											key={opt.value}
											type="button"
											onClick={() =>
												setState((prev) => ({
													...prev,
													orientation: opt.value,
												}))
											}
											className={`flex-1 rounded-md border px-4 py-2 text-sm font-medium transition-colors ${
												state.orientation === opt.value
													? "border-foreground bg-foreground text-background"
													: "border-border text-foreground hover:bg-muted"
											}`}
										>
											{opt.label}
										</button>
									))}
								</div>
							</div>

							<div className="space-y-2">
								<Label>Linhas zebradas</Label>
								<div className="flex gap-2">
									{(
										[
											{ value: true, label: "Ativado" },
											{ value: false, label: "Desativado" },
										] as const
									).map((opt) => (
										<button
											key={String(opt.value)}
											type="button"
											onClick={() =>
												setState((prev) => ({
													...prev,
													zebraStripes: opt.value,
												}))
											}
											className={`flex-1 rounded-md border px-4 py-2 text-sm font-medium transition-colors ${
												state.zebraStripes === opt.value
													? "border-foreground bg-foreground text-background"
													: "border-border text-foreground hover:bg-muted"
											}`}
										>
											{opt.label}
										</button>
									))}
								</div>
							</div>

							<div className="space-y-2">
								<Label htmlFor="headerColor">Cor do cabeçalho da tabela</Label>
								<div className="flex items-center gap-3">
									<input
										id="headerColor"
										type="color"
										value={state.tableHeaderColor}
										onChange={(e) =>
											setState((prev) => ({
												...prev,
												tableHeaderColor: e.target.value,
											}))
										}
										className="h-10 w-14 cursor-pointer bg-transparent p-0.5"
									/>
									<span className="text-sm text-muted-foreground font-mono">
										{state.tableHeaderColor}
									</span>
								</div>
							</div>
						</>
					)}

					{activeTab === "cabecalho" && (
						<>
							<p className="text-sm text-muted-foreground">
								Campos exibidos no topo do documento, antes da tabela.
							</p>
							<div className="space-y-3">
								{state.headerFields.map((field) => (
									<div key={field.id} className="flex gap-2 items-end">
										<div className="flex-1 space-y-1">
											<Label className="text-xs text-muted-foreground">
												Label
											</Label>
											<Input
												value={field.label}
												onChange={(e) =>
													updateHeaderField(field.id, {
														label: e.target.value,
													})
												}
												placeholder="Ex: Setor"
											/>
										</div>
										<div className="flex-1 space-y-1">
											<Label className="text-xs text-muted-foreground">
												Valor
											</Label>
											<Input
												value={field.value}
												onChange={(e) =>
													updateHeaderField(field.id, {
														value: e.target.value,
													})
												}
												placeholder="Preencher"
											/>
										</div>
										<Button
											type="button"
											variant="secondary"
											onClick={() => removeHeaderField(field.id)}
											aria-label="Remover campo"
											className="shrink-0"
										>
											<Trash className="size-4" />
											Remover
										</Button>
									</div>
								))}
							</div>
						<Button
							type="button"
							variant="outline"
							onClick={addHeaderField}
							className="gap-1.5"
						>
							<Plus className="size-4" />
							Adicionar campo
						</Button>
						</>
					)}

					{activeTab === "colunas" && (
						<>
							<p className="text-sm text-muted-foreground">
								Configure as colunas da tabela de estoque.
							</p>
							<div className="space-y-3">
								{state.columns.map((col) => (
									<div key={col.id} className="flex gap-2 items-end">
										<div className="flex-1 space-y-1">
											<Label className="text-xs text-muted-foreground">
												Nome da coluna
											</Label>
											<Input
												value={col.label}
												onChange={(e) =>
													updateColumn(col.id, { label: e.target.value })
												}
												placeholder="Nome da coluna"
											/>
										</div>
										<div className="w-36 space-y-1">
											<Label
												htmlFor={`width-${col.id}`}
												className="text-xs text-muted-foreground"
											>
												Largura
											</Label>
											<NativeSelect
												id={`width-${col.id}`}
												value={col.width}
												onChange={(e) =>
													updateColumn(col.id, {
														width: Number(e.target.value),
													})
												}
											>
												{WIDTH_OPTIONS.map((opt) => (
													<option key={opt.value} value={opt.value}>
														{opt.label}
													</option>
												))}
											</NativeSelect>
										</div>
										<Button
											type="button"
											variant="secondary"
											onClick={() => removeColumn(col.id)}
											aria-label="Remover coluna"
											className="shrink-0"
										>
											<Trash className="size-4" />
											Remover
										</Button>
									</div>
								))}
							</div>
						<Button
							type="button"
							variant="outline"
							onClick={addColumn}
							className="gap-1.5"
						>
							<Plus className="size-4" />
							Adicionar coluna
						</Button>
						</>
					)}
				</div>

				<div className="mt-6 flex gap-3 flex-wrap">
					<Button type="button" onClick={handleExportPdf} className="gap-2">
						<FileDown className="size-4" />
						Baixar PDF
					</Button>
					<Button
						type="button"
						variant="outline"
						onClick={handleExportPng}
						className="gap-2"
					>
						<Image className="size-4" />
						Baixar PNG
					</Button>
				</div>
			</div>

			<div className="rounded-lg border border-border bg-muted/30 p-3">
				<p className="mb-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
					Pré-visualização
				</p>
				<InventarioCanvas ref={canvasRef} state={state} />
			</div>
		</div>
	);
}
