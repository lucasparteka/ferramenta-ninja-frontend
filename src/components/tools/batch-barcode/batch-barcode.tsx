"use client";

import { Download, Info, RotateCcw } from "lucide-react";
import JsBarcode from "jsbarcode";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/select-native";
import { Textarea } from "@/components/ui/textarea";
import { SectionLabel } from "@/components/shared/layout-b/section-label";

type BarcodeFormat = "EAN13" | "UPC" | "EAN8" | "CODE128" | "CODE39" | "ITF14";

const FORMATS: { value: BarcodeFormat; label: string }[] = [
	{ value: "EAN13", label: "EAN-13" },
	{ value: "UPC", label: "UPC-A" },
	{ value: "EAN8", label: "EAN-8" },
	{ value: "CODE128", label: "CODE 128" },
	{ value: "CODE39", label: "CODE 39" },
	{ value: "ITF14", label: "ITF-14" },
];

const MAX_ITEMS = 100;

type BarcodeEntry = {
	id: string;
	value: string;
	format: BarcodeFormat;
	displayValue: boolean;
};

function BarcodeItem({ id, value, format, displayValue }: BarcodeEntry) {
	const svgRef = useRef<SVGSVGElement>(null);
	const [error, setError] = useState("");

	useEffect(() => {
		const el = svgRef.current;
		if (!el || !value.trim()) return;
		try {
			JsBarcode(el, value.trim(), {
				format,
				height: 60,
				displayValue,
				margin: 8,
				lineColor: "#000000",
				background: "#ffffff",
				fontSize: 11,
			});
			setError("");
		} catch {
			setError("Valor inválido para o formato selecionado.");
		}
	}, [value, format, displayValue]);

	function handleDownload() {
		const el = svgRef.current;
		if (!el || error) return;
		const xml = new XMLSerializer().serializeToString(el);
		const blob = new Blob([xml], { type: "image/svg+xml;charset=utf-8" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `barcode-${value.trim()}.svg`;
		a.click();
		URL.revokeObjectURL(url);
	}

	return (
		<div className="flex flex-col items-center gap-2 rounded-md border border-border bg-card p-3">
			{error ? (
				<div className="flex h-20 w-full items-center justify-center">
					<p className="text-center text-xs text-destructive">{error}</p>
				</div>
			) : (
				<svg ref={svgRef} data-barcode-id={id} className="max-w-full" />
			)}
			<p
				className="max-w-full truncate text-center text-xs text-muted-foreground font-mono"
				title={value}
			>
				{value}
			</p>
			{!error && (
				<Button
					variant="outline"
					size="sm"
					onClick={handleDownload}
					aria-label={`Baixar código de barras ${value}`}
				>
					<Download className="mr-1.5 h-3 w-3" />
					Baixar SVG
				</Button>
			)}
		</div>
	);
}

export function BatchBarcode() {
	const [format, setFormat] = useState<BarcodeFormat>("CODE128");
	const [displayValue, setDisplayValue] = useState(true);
	const [rawInput, setRawInput] = useState("");
	const [entries, setEntries] = useState<BarcodeEntry[]>([]);

	function handleGenerate() {
		const lines = rawInput
			.split("\n")
			.map((l) => l.trim())
			.filter((l) => l.length > 0)
			.slice(0, MAX_ITEMS);

		setEntries(
			lines.map((value) => ({
				id: crypto.randomUUID(),
				value,
				format,
				displayValue,
			})),
		);
	}

	function handleReset() {
		setRawInput("");
		setEntries([]);
	}

	async function handleDownloadZip() {
		const { default: JSZip } = await import("jszip");
		const zip = new JSZip();

		entries.forEach((entry) => {
			const el = document.querySelector<SVGSVGElement>(
				`[data-barcode-id="${entry.id}"]`,
			);
			if (!el) return;
			const xml = new XMLSerializer().serializeToString(el);
			zip.file(`barcode-${entry.value.trim()}.svg`, xml);
		});

		const blob = await zip.generateAsync({ type: "blob" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "codigos-de-barras.zip";
		a.click();
		URL.revokeObjectURL(url);
	}

	const lineCount = rawInput.split("\n").filter((l) => l.trim()).length;
	const truncated = lineCount > MAX_ITEMS;

	return (
		<div className="grid grid-cols-1 items-start lg:grid-cols-[1fr_360px] border rounded-md overflow-hidden">
			<div className="bg-card flex flex-col h-full">
				<div className="divide-y divide-border">
					<div className="p-5">
						<SectionLabel>Configuração</SectionLabel>
						<div className="space-y-3.5">
							<div>
								<Label
									htmlFor="batch-format"
									className="mb-1.5 block text-xs text-foreground"
								>
									Formato
								</Label>
								<NativeSelect
									id="batch-format"
									value={format}
									onChange={(e) => setFormat(e.target.value as BarcodeFormat)}
								>
									{FORMATS.map((f) => (
										<option key={f.value} value={f.value}>
											{f.label}
										</option>
									))}
								</NativeSelect>
							</div>
							<div className="flex items-center gap-2">
								<Checkbox
									id="display-value"
									checked={displayValue}
									onCheckedChange={(checked) =>
										setDisplayValue(checked === true)
									}
								/>
								<Label
									htmlFor="display-value"
									className="cursor-pointer text-xs font-medium text-foreground"
								>
									Exibir valor abaixo do código
								</Label>
							</div>
						</div>
					</div>
					<div className="p-5">
						<SectionLabel hint="um por linha">Valores</SectionLabel>
						<div className="space-y-3.5">
							<div>
								<Label
									htmlFor="batch-values"
									className="mb-1.5 block text-xs text-foreground"
								>
									Valores
								</Label>
								<Textarea
									id="batch-values"
									rows={10}
									placeholder="7891234560012&#10;7891234560029"
									value={rawInput}
									onChange={(e) => setRawInput(e.target.value)}
									className="resize-none font-mono text-sm"
								/>
							</div>
							<p className="text-xs text-muted-foreground">
								{lineCount} {lineCount === 1 ? "item" : "itens"}
								{truncated &&
									` — apenas os primeiros ${MAX_ITEMS} serão gerados`}
							</p>
						</div>
					</div>
				</div>
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 border-t border-border bg-muted px-5 py-3 mt-auto">
					<div className="flex items-center gap-1.5 text-[11.5px] text-muted-foreground">
						<Info size={12} />
						Até {MAX_ITEMS} códigos por geração
					</div>
					<div className="flex items-center gap-2">
						<Button
							type="button"
							variant="ghost"
							size="sm"
							onClick={handleReset}
							disabled={!rawInput && entries.length === 0}
						>
							<RotateCcw className="mr-1.5 h-3 w-3" />
							Limpar
						</Button>
						<Button onClick={handleGenerate} disabled={!rawInput.trim()}>
							Gerar todos
						</Button>
					</div>
				</div>
			</div>
			<aside className="flex flex-col h-full lg:border-l max-lg:border-t">
				{entries.length === 0 ? (
					<div className="flex flex-col items-center justify-center gap-2 p-6 text-center h-full">
						<p className="text-sm text-muted-foreground">
							Cole os valores e clique em Gerar todos
						</p>
						<p className="text-xs text-muted-foreground">
							Até {MAX_ITEMS} códigos por geração
						</p>
					</div>
				) : (
					<>
						<div className="p-4 border-b border-border shrink-0">
							<div className="flex items-center justify-between mb-1">
								<span className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
									Códigos gerados
								</span>
								<span className="font-mono text-caption text-muted-foreground">
									{entries.length}x
								</span>
							</div>
							<p className="text-xs text-muted-foreground">{format}</p>
						</div>
						<div className="p-4 space-y-3 overflow-y-auto max-h-[540px]">
							{entries.map((entry) => (
								<BarcodeItem key={entry.id} {...entry} />
							))}
						</div>
						{entries.length > 1 && (
							<div className="p-4 border-t border-border mt-auto shrink-0">
								<Button
									variant="outline"
									className="w-full"
									onClick={handleDownloadZip}
								>
									<Download className="mr-2 h-3.5 w-3.5" />
									Baixar todos em .zip
								</Button>
							</div>
						)}
					</>
				)}
			</aside>
		</div>
	);
}
