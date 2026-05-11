"use client";

import { QrCode, Trash } from "lucide-react";
import { useState } from "react";
import { CopyButton } from "@/components/shared/copy-button";
import { LayoutE } from "@/components/shared/layout-e";
import { ResultSheet } from "@/components/shared/result-sheet";
import type { Section } from "@/components/shared/result-sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
	decodePixBrCode,
	formatBRL,
	keyTypeLabel,
	type PixDecoded,
} from "@/lib/pix/decode";

export function DecodificadorPixClient() {
	const [input, setInput] = useState("");
	const [result, setResult] = useState<PixDecoded | null>(null);

	function handleDecode() {
		setResult(decodePixBrCode(input));
	}

	function handleClear() {
		setInput("");
		setResult(null);
	}

	const state = result ? "result" : "empty";

	return (
		<LayoutE
			state={state}
			searchBar={
				<div className="space-y-3">
					<h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
						Código PIX
					</h3>
					<Textarea
						id="pix-input"
						value={input}
						onChange={(e) => {
							setInput(e.target.value);
							setResult(null);
						}}
						placeholder="00020126..."
						rows={6}
						className="min-h-[120px] font-mono"
					/>
					<div className="flex gap-2">
						<Button onClick={handleDecode} disabled={!input.trim()}>
							Decodificar
						</Button>
						<Button
							variant="ghost"
							onClick={handleClear}
							disabled={!input && !result}
						>
							<Trash className="mr-1.5 h-3.5 w-3.5" />
							Limpar
						</Button>
					</div>
				</div>
			}
			emptyState={
				<div className="flex min-h-[200px] flex-col items-center justify-center gap-2 rounded-md border border-dashed border-border bg-muted/30 p-8 text-center">
					<QrCode
						className="h-5 w-5 text-muted-foreground"
						strokeWidth={1.75}
					/>
					<p className="text-sm text-foreground">
						Cole um código PIX para decodificar
					</p>
					<p className="text-xs text-muted-foreground">
						Suporta todos os tipos de chave
					</p>
				</div>
			}
			result={result && <PixResult result={result} />}
		/>
	);
}

function PixResult({ result }: { result: PixDecoded }) {
	const rows: { label: string; value?: string }[] = [
		{
			label: "Beneficiário",
			value: result.beneficiary,
		},
		{
			label: result.keyType
				? `Chave PIX (${keyTypeLabel(result.keyType)})`
				: "Chave PIX",
			value: result.key,
		},
		{
			label: "Valor",
			value: result.amount !== undefined ? formatBRL(result.amount) : undefined,
		},
		{ label: "Cidade", value: result.city },
		{ label: "PSP / Instituição", value: result.psp },
		{
			label: "Info adicional",
			value: result.additionalInfo,
		},
	];

	const techRows: { label: string; value?: string }[] = [
		{ label: "TxID", value: result.txid },
		{ label: "CRC", value: result.crcProvided },
	];

	const sections: Section[] = [
		{
			title: "Dados da Transferência",
			rows: rows
				.filter((r) => r.value)
				.map((r) => ({
					label: r.label,
					value: r.value,
					mono:
						r.label === "TxID" ||
						r.label === "CRC" ||
						r.label.startsWith("Chave"),
				})),
		},
		{
			title: "Informações Técnicas",
			rows: techRows
				.filter((r) => r.value)
				.map((r) => ({
					label: r.label,
					value: r.value,
					mono: true,
				})),
		},
	];

	return (
		<div className="space-y-4">
			<div className="flex flex-wrap items-center gap-3">
				<span
					className={`inline-flex items-center rounded-md px-3 py-1 text-xs font-semibold ${
						result.valid
							? "bg-success/10 text-success"
							: "bg-warning/10 text-warning"
					}`}
				>
					{result.valid ? "Código válido" : "Atenção"}
				</span>
				{result.crcCalculated && result.crcProvided && (
					<span className="font-mono text-xs text-muted-foreground">
						CRC {result.crcProvided} (calculado {result.crcCalculated})
					</span>
				)}
			</div>

			{result.errors.length > 0 && (
				<div className="rounded-md border border-warning/30 bg-warning/5 p-3">
					<ul className="list-disc space-y-1 pl-5 text-xs text-warning">
						{result.errors.map((err) => (
							<li key={err}>{err}</li>
						))}
					</ul>
				</div>
			)}

			<ResultSheet sections={sections} />

			{result.key && (
				<CopyButton
					text={result.key}
					label="Copiar chave PIX"
					variant="outline"
				/>
			)}
		</div>
	);
}
