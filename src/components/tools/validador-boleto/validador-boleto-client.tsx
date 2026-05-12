"use client";

import { CreditCard, ScanLine } from "lucide-react";
import { useState } from "react";
import { LayoutE } from "@/components/shared/layout-e";
import { ResultSheet } from "@/components/shared/result-sheet";
import type { Section } from "@/components/shared/result-sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	type BoletoResult,
	parseBoleto,
	sanitizeBoleto,
} from "@/lib/boleto/parse";

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
							{lenInfo}
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
				<div className="flex min-h-[200px] flex-col items-center justify-center gap-2 rounded-md border border-dashed border-border bg-muted/30 p-8 text-center">
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
			result={result && <BoletoResultCard result={result} />}
		/>
	);
}

function BoletoResultCard({ result }: { result: BoletoResult }) {
	if (result.kind === "unknown") {
		return (
			<div className="rounded-md border border-warning/30 bg-warning/5 p-4">
				<p className="text-xs text-warning">{result.reason}</p>
			</div>
		);
	}

	const tone = result.valid ? "success" : "destructive";

	return (
		<div className="space-y-4">
			<div
				className={`rounded-md border p-4 ${
					tone === "success"
						? "border-success/30 bg-success/10"
						: "border-destructive/30 bg-destructive/10"
				}`}
			>
				<p className="text-xs text-muted-foreground">
					{result.kind === "banking"
						? "Boleto bancário"
						: "Boleto de arrecadação"}
				</p>
				<p
					className={`mt-1 text-sm font-semibold ${
						tone === "success" ? "text-success" : "text-destructive"
					}`}
				>
					{result.valid ? "Linha digitável válida" : "Linha digitável inválida"}
				</p>
			</div>

			{result.kind === "banking" && <BankingDetails result={result} />}
			{result.kind === "collection" && <CollectionDetails result={result} />}
		</div>
	);
}

function BankingDetails({
	result,
}: {
	result: Extract<BoletoResult, { kind: "banking" }>;
}) {
	const sections: Section[] = [
		{
			title: "Dados do Boleto",
			rows: [
				{ label: "Banco emissor", value: result.bankCode, mono: true },
				{
					label: "Moeda",
					value:
						result.currencyCode === "9" ? "Real (BRL)" : result.currencyCode,
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
				{ label: "Código de barras", value: result.barcode, mono: true },
			],
		},
	];

	return (
		<>
			<ResultSheet sections={sections} />

			<div className="rounded-md border border-border bg-card">
				<div className="border-b border-border px-4 py-2">
					<h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
						Verificação de dígitos
					</h3>
				</div>
				<div className="divide-y divide-border">
					<CheckRow label="Campo 1 (módulo 10)" ok={result.checks.field1} />
					<CheckRow label="Campo 2 (módulo 10)" ok={result.checks.field2} />
					<CheckRow label="Campo 3 (módulo 10)" ok={result.checks.field3} />
					<CheckRow
						label="DV geral do código de barras (módulo 11)"
						ok={result.checks.generalDigit}
					/>
				</div>
			</div>
		</>
	);
}

function CollectionDetails({
	result,
}: {
	result: Extract<BoletoResult, { kind: "collection" }>;
}) {
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

	const sections: Section[] = [
		{
			title: "Dados do Boleto",
			rows: [
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
				{ label: "Código de barras", value: result.barcode, mono: true },
			],
		},
	];

	return (
		<>
			<ResultSheet sections={sections} />

			<div className="rounded-md border border-border bg-card">
				<div className="border-b border-border px-4 py-2">
					<h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
						Verificação de dígitos
					</h3>
				</div>
				<div className="divide-y divide-border">
					{result.checks.fields.map((ok, i) => {
						const label = `Bloco ${i + 1}`;
						return <CheckRow key={label} label={label} ok={ok} />;
					})}
				</div>
			</div>
		</>
	);
}

function CheckRow({ label, ok }: { label: string; ok: boolean }) {
	return (
		<div className="flex items-center justify-between px-4 py-2.5">
			<span className="text-xs text-muted-foreground">{label}</span>
			<span
				className={`text-xs font-semibold ${
					ok ? "text-success" : "text-destructive"
				}`}
			>
				{ok ? "OK" : "INVÁLIDO"}
			</span>
		</div>
	);
}
