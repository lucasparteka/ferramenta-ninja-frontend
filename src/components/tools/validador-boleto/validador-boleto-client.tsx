"use client";

import { CreditCard, ScanLine } from "lucide-react";
import { useState } from "react";
import { LayoutE } from "@/components/shared/layout-e";
import { ResultSheet } from "@/components/shared/result-sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	type BoletoResult,
	parseBoleto,
	sanitizeBoleto,
} from "@/lib/boleto/parse";

const segmentLabels: Record<string, string> = {
	"1": "Prefeituras",
	"2": "Saneamento",
	"3": "Energia / Gás",
	"4": "Telecomunicações",
	"5": "Órgãos governamentais",
	"6": "Carnês / outros",
	"7": "Multas de trânsito",
	"9": "Uso exclusivo do banco",
};

export function ValidadorBoletoClient() {
	const [value, setValue] = useState("");
	const [result, setResult] = useState<BoletoResult | null>(null);

	function handleSubmit(event?: React.FormEvent) {
		event?.preventDefault();
		setResult(parseBoleto(value));
	}

	const digits = sanitizeBoleto(value);
	const lenInfo = digits.length === 0 ? "" : `${digits.length} dígitos`;
	const state = result ? "result" : "empty";

	return (
		<LayoutE
			state={state}
			searchBar={
				<form onSubmit={handleSubmit} className="space-y-3">
					<div className="space-y-1.5">
						<Label
							htmlFor="boleto-input"
							className="text-xs text-muted-foreground"
						>
							Linha digitável
						</Label>
						<Input
							id="boleto-input"
							type="text"
							inputMode="numeric"
							value={value}
							onChange={(e) => {
								setValue(e.target.value);
								setResult(null);
							}}
							placeholder="00000.00000 00000.000000 00000.000000 0 00000000000000"
							className="font-mono"
						/>
						<p className="text-xs text-muted-foreground">
							Cole os 47 dígitos (boleto bancário) ou 48 (arrecadação).{" "}
							{lenInfo && <span className="font-mono">{lenInfo}</span>}
						</p>
					</div>
					<Button
						type="submit"
						disabled={digits.length !== 47 && digits.length !== 48}
					>
						<ScanLine className="mr-2 h-3.5 w-3.5" />
						Validar boleto
					</Button>
				</form>
			}
			emptyState={
				<div className="flex min-h-50 flex-col items-center justify-center gap-2 bg-card p-8 text-center">
					<CreditCard
						className="h-5 w-5 text-muted-foreground"
						strokeWidth={1.75}
					/>
					<p className="text-sm text-foreground">
						Cole a linha digitável do boleto
					</p>
					<p className="text-xs text-muted-foreground">
						Suporta boletos bancários e de arrecadação
					</p>
				</div>
			}
			result={result && <BoletoResultContent result={result} />}
		/>
	);
}

function BoletoResultContent({ result }: { result: BoletoResult }) {
	if (result.kind === "unknown") {
		return (
			<div className="rounded-md border border-warning-bd bg-warning/5 p-4">
				<p className="text-xs text-warning">{result.reason}</p>
			</div>
		);
	}

	const dataRows: { label: string; value: React.ReactNode; mono?: boolean }[] =
		[];
	const checkRows: { label: string; ok: boolean }[] = [];

	if (result.kind === "banking") {
		dataRows.push(
			{ label: "Banco emissor", value: result.bankCode, mono: true },
			{
				label: "Moeda",
				value: result.currencyCode === "9" ? "Real (BRL)" : result.currencyCode,
			},
			{
				label: "Valor",
				value: result.amount.toLocaleString("pt-BR", {
					style: "currency",
					currency: "BRL",
				}),
				mono: true,
			},
			{
				label: "Vencimento",
				value: result.dueDate
					? result.dueDate.toLocaleDateString("pt-BR", { timeZone: "UTC" })
					: "Não informado",
			},
			{
				label: "Fator de vencimento",
				value: String(result.dueFactor),
				mono: true,
			},
		);
		checkRows.push(
			{ label: "Campo 1 (módulo 10)", ok: result.checks.field1 },
			{ label: "Campo 2 (módulo 10)", ok: result.checks.field2 },
			{ label: "Campo 3 (módulo 10)", ok: result.checks.field3 },
			{
				label: "DV geral do código de barras (módulo 11)",
				ok: result.checks.generalDigit,
			},
		);
	} else {
		dataRows.push(
			{
				label: "Segmento",
				value: `${result.segment} — ${segmentLabels[result.segment] ?? "Desconhecido"}`,
			},
			{
				label: "Valor",
				value: result.amount.toLocaleString("pt-BR", {
					style: "currency",
					currency: "BRL",
				}),
				mono: true,
			},
		);
		result.checks.fields.forEach((ok, i) => {
			checkRows.push({ label: `Bloco ${i + 1}`, ok });
		});
	}

	const tone = result.valid ? "success" : "destructive";
	const badgeLabel =
		result.kind === "banking" ? "Boleto bancário" : "Arrecadação";

	return (
		<div>
			<div className="flex items-center gap-3 border-b border-border bg-muted/30 px-4 py-2.5">
				<div>
					<p className="text-caption text-muted-foreground">Tipo de boleto</p>
					<p
						className={`text-sm font-semibold ${tone === "success" ? "text-success" : "text-destructive"}`}
					>
						{result.valid
							? "Linha digitável válida"
							: "Linha digitável inválida"}
					</p>
				</div>
				<span
					className={`rounded-md border px-2 py-0.5 text-xs font-semibold ${tone === "success" ? "border-success-bd bg-success/10 text-success" : "border-destructive/30 bg-destructive/10 text-destructive"}`}
				>
					{badgeLabel}
				</span>
			</div>

			<ResultSheet
				variant="grid"
				sections={[
					{
						title: "Dados do Boleto",
						rows: dataRows,
					},
					{
						title: "Verificação de dígitos",
						rows: checkRows.map((r) => ({
							label: r.label,
							value: (
								<span
									className={`text-xs font-semibold ${r.ok ? "text-success" : "text-destructive"}`}
								>
									{r.ok ? "OK" : "INVÁLIDO"}
								</span>
							),
						})),
					},
				]}
			/>

			<div className="border-t border-border">
				<div className="border-b border-border bg-muted/55 px-4 py-[7px]">
					<h3 className="text-caption font-semibold uppercase tracking-wider text-muted-foreground">
						Código de barras
					</h3>
				</div>
				<div className="px-4 py-2.5">
					<span className="font-mono text-caption text-muted-foreground break-all">
						{result.barcode}
					</span>
				</div>
			</div>
		</div>
	);
}
