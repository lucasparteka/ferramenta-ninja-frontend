"use client";

import { Download, Info, RotateCcw } from "lucide-react";
import JsBarcode from "jsbarcode";
import { useEffect, useRef, useState } from "react";
import { LayoutB } from "@/components/shared/layout-b";
import { SectionLabel } from "@/components/shared/layout-b/section-label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/select-native";
import { Textarea } from "@/components/ui/textarea";

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

function BarcodeItem({ value, format, displayValue }: BarcodeEntry) {
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
				<svg ref={svgRef} className="max-w-full" />
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

	const lineCount = rawInput.split("\n").filter((l) => l.trim()).length;
	const truncated = lineCount > MAX_ITEMS;

	const form = (
		<div className="bg-card flex flex-col h-full">
			<div className="divide-y divide-border">
				<div className="p-4">
					<SectionLabel>Configuração</SectionLabel>
					<div className="space-y-3">
						<div className="space-y-1.5">
							<Label htmlFor="batch-format" className="text-xs font-medium">
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
								onCheckedChange={(checked) => setDisplayValue(checked === true)}
							/>
							<Label htmlFor="display-value" className="cursor-pointer text-sm">
								Exibir valor abaixo do código
							</Label>
						</div>
					</div>
				</div>

				<div className="p-4">
					<SectionLabel>Valores</SectionLabel>
					<div className="space-y-3">
						<div className="space-y-1.5">
							<Label htmlFor="batch-values" className="text-xs font-medium">
								Valores (um por linha)
							</Label>
							<Textarea
								id="batch-values"
								rows={10}
								placeholder="7891234560012\n7891234560029\n7891234560036"
								value={rawInput}
								onChange={(e) => setRawInput(e.target.value)}
								className="resize-none font-mono text-sm"
							/>
						</div>
						<p className="text-xs text-muted-foreground">
							{lineCount} {lineCount === 1 ? "item" : "itens"}
							{truncated && ` — apenas os primeiros ${MAX_ITEMS} serão gerados`}
						</p>
					</div>
				</div>
			</div>

			<div className="flex items-center justify-between border-t border-border bg-muted/40 px-4 py-3 mt-auto">
				<div className="flex items-center gap-1.5 text-caption text-muted-foreground">
					<Info size={12} />
					Gerado no navegador — nenhum dado é enviado
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
	);

	const resultPanel = (
		<>
			{entries.length === 0 ? (
				<div className="flex min-h-[200px] flex-col items-center justify-center gap-2 rounded-md border border-dashed border-border bg-muted/40 p-6 text-center">
					<p className="text-sm text-muted-foreground">
						Cole os valores e clique em Gerar todos
					</p>
					<p className="text-xs text-muted-foreground">
						Até {MAX_ITEMS} códigos por geração
					</p>
				</div>
			) : (
				<>
					<div className="flex items-center justify-between mb-3">
						<span className="text-xs text-muted-foreground">
							{entries.length}{" "}
							{entries.length === 1 ? "código gerado" : "códigos gerados"}
						</span>
						<span className="font-mono text-caption text-muted-foreground">
							{format}
						</span>
					</div>
					<div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
						{entries.map((entry) => (
							<BarcodeItem key={entry.id} {...entry} />
						))}
					</div>
				</>
			)}
		</>
	);

	return <LayoutB form={form} result={resultPanel} />;
}
