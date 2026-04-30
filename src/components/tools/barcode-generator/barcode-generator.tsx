"use client";

import JsBarcode from "jsbarcode";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/select-native";

type BarcodeFormat = "EAN13" | "UPC" | "EAN8" | "CODE128" | "CODE39" | "ITF14";

const FORMATS: { value: BarcodeFormat; label: string; hint: string }[] = [
	{
		value: "EAN13",
		label: "EAN-13 — produtos (13 dígitos)",
		hint: "Digite 12 dígitos. O 13º (verificador) é calculado automaticamente.",
	},
	{
		value: "UPC",
		label: "UPC-A — produtos EUA (12 dígitos)",
		hint: "Digite 11 dígitos. O 12º (verificador) é calculado automaticamente.",
	},
	{
		value: "EAN8",
		label: "EAN-8 — embalagens pequenas (8 dígitos)",
		hint: "Digite 7 dígitos. O 8º (verificador) é calculado automaticamente.",
	},
	{
		value: "CODE128",
		label: "CODE 128 — alfanumérico universal",
		hint: "Digite qualquer combinação de letras, números e símbolos ASCII.",
	},
	{
		value: "CODE39",
		label: "CODE 39 — letras maiúsculas e números",
		hint: "Use letras maiúsculas (A–Z), dígitos (0–9) e os símbolos: - . $ / + % e espaço.",
	},
	{
		value: "ITF14",
		label: "ITF-14 — logística e caixas (14 dígitos)",
		hint: "Digite 13 dígitos. O 14º (verificador) é calculado automaticamente.",
	},
];

export function BarcodeGenerator() {
	const [format, setFormat] = useState<BarcodeFormat>("EAN13");
	const [value, setValue] = useState("");
	const [displayValue, setDisplayValue] = useState(true);
	const [generated, setGenerated] = useState(false);
	const [error, setError] = useState("");
	const svgRef = useRef<SVGSVGElement>(null);

	const currentFormat = FORMATS.find((f) => f.value === format);

	function handleGenerate() {
		setError("");
		if (!value.trim()) {
			setError("Digite o valor a ser codificado.");
			return;
		}
		try {
			JsBarcode(svgRef.current, value.trim(), {
				format,
				height: 80,
				displayValue,
				margin: 12,
				lineColor: "#000000",
				background: "#ffffff",
			});
			setGenerated(true);
		} catch (e) {
			setGenerated(false);
			setError(
				e instanceof Error
					? e.message
					: "Valor inválido para o formato selecionado.",
			);
		}
	}

	function handleDownload() {
		const el = svgRef.current;
		if (!el) return;
		const xml = new XMLSerializer().serializeToString(el);
		const blob = new Blob([xml], { type: "image/svg+xml;charset=utf-8" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `barcode-${value}.svg`;
		a.click();
		URL.revokeObjectURL(url);
	}

	return (
		<div className="flex flex-col gap-6 sm:flex-row">
			<div className="space-y-4 sm:w-[30%] sm:shrink-0">
				<div className="space-y-1">
					<label
						htmlFor="bc-format"
						className="flex w-full text-sm font-medium text-foreground"
					>
						Formato
					</label>
					<NativeSelect
						id="bc-format"
						value={format}
						onChange={(e) => {
							setFormat(e.target.value as BarcodeFormat);
							setGenerated(false);
							setError("");
						}}
						className="text-foreground"
					>
						{FORMATS.map((f) => (
							<option key={f.value} value={f.value}>
								{f.label}
							</option>
						))}
					</NativeSelect>
					<p className="text-xs text-muted-foreground">
						{currentFormat?.hint || ""}
					</p>
				</div>

				<div className="space-y-1">
					<label
						htmlFor="bc-value"
						className="flex w-full text-sm font-medium text-foreground"
					>
						Valor
					</label>
					<Input
						id="bc-value"
						type="text"
						placeholder="Digite o valor..."
						value={value}
						onChange={(e) => {
							setValue(e.target.value);
							setGenerated(false);
							setError("");
						}}
					/>
				</div>

				<div className="space-y-2">
					<span className="text-sm font-medium text-foreground">
						Exibir texto
					</span>
					<label className="flex cursor-pointer items-center gap-2">
						<input
							type="checkbox"
							checked={displayValue}
							onChange={(e) => {
								setDisplayValue(e.target.checked);
								setGenerated(false);
							}}
							className="accent-primary"
						/>
						<span className="text-sm text-foreground">Ativar</span>
					</label>
				</div>

				{error && <p className="text-sm text-destructive">{error}</p>}

				<Button onClick={handleGenerate}>Gerar código de barras</Button>
			</div>

			<div className="flex flex-1 flex-col items-center justify-start gap-4">
				<svg ref={svgRef} className={generated ? "" : "hidden"} />
				{!generated && (
					<div className="flex h-36 w-full items-center justify-center rounded-lg border border-dashed border-border bg-secondary text-sm text-muted-foreground">
						O código de barras aparecerá aqui
					</div>
				)}
				{generated && (
					<Button variant="outline" onClick={handleDownload}>
						Baixar SVG
					</Button>
				)}
			</div>
		</div>
	);
}
