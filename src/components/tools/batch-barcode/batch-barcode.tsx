"use client";

import JsBarcode from "jsbarcode";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
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
		<div className="flex flex-col items-center gap-2 rounded-lg border border-border bg-card p-3">
			{error ? (
				<div className="flex h-20 w-full items-center justify-center">
					<p className="text-center text-xs text-destructive">{error}</p>
				</div>
			) : (
				<svg ref={svgRef} className="max-w-full" />
			)}
			<p
				className="max-w-full truncate text-center text-xs text-muted-foreground"
				title={value}
			>
				{value}
			</p>
			{!error && (
				<Button variant="outline" size="sm" onClick={handleDownload}>
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

		setEntries(lines.map((value) => ({ value, format, displayValue })));
	}

	const lineCount = rawInput.split("\n").filter((l) => l.trim()).length;
	const truncated = lineCount > MAX_ITEMS;

	return (
		<div className="flex flex-col gap-6 sm:flex-row">
			<div className="space-y-4 sm:w-[30%] sm:shrink-0">
				<div className="space-y-1">
					<label
						htmlFor="batch-format"
						className="flex w-full text-sm font-medium text-foreground"
					>
						Formato
					</label>
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

				<div className="space-y-2">
					<span className="text-sm font-medium text-foreground">
						Exibir texto
					</span>
					<label className="flex cursor-pointer items-center gap-2">
						<input
							type="checkbox"
							checked={displayValue}
							onChange={(e) => setDisplayValue(e.target.checked)}
							className="accent-primary"
						/>
						<span className="text-sm text-foreground">Ativar</span>
					</label>
				</div>

				<div className="space-y-1">
					<label
						htmlFor="batch-values"
						className="flex w-full text-sm font-medium text-foreground"
					>
						Valores (um por linha)
					</label>
					<Textarea
						id="batch-values"
						rows={12}
						placeholder={"7891234560012\n7891234560029\n7891234560036"}
						value={rawInput}
						onChange={(e) => setRawInput(e.target.value)}
						className="resize-none"
					/>
					<p className="text-xs text-muted-foreground">
						{lineCount} {lineCount === 1 ? "item" : "itens"}
						{truncated && ` — apenas os primeiros ${MAX_ITEMS} serão gerados`}
					</p>
				</div>

				<Button onClick={handleGenerate} disabled={!rawInput.trim()}>
					Gerar todos
				</Button>
			</div>

			<div className="flex-1">
				{entries.length > 0 ? (
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
						{entries.map((entry, i) => (
							<BarcodeItem key={`${entry.value}`} {...entry} />
						))}
					</div>
				) : (
					<div className="flex h-48 w-full items-center justify-center rounded-lg border border-dashed border-border bg-secondary text-sm text-muted-foreground">
						Os códigos de barras aparecerão aqui
					</div>
				)}
			</div>
		</div>
	);
}
