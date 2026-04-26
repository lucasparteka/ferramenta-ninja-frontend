"use client";

import { useState } from "react";
import { ResultBox } from "@/components/shared/result-box";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

	return (
		<div className="space-y-6">
			<form onSubmit={handleSubmit} className="space-y-4">
				<div className="space-y-2">
					<label
						htmlFor="boleto-input"
						className="block text-sm font-medium text-foreground"
					>
						Linha digitável
					</label>
					<Input
						id="boleto-input"
						type="text"
						inputMode="numeric"
						value={value}
						onChange={(e) => setValue(e.target.value)}
						placeholder="00000.00000 00000.000000 00000.000000 0 00000000000000"
					/>
					<p className="text-xs text-muted-foreground">
						Cole os 47 dígitos (boleto bancário) ou 48 (arrecadação). {lenInfo}
					</p>
				</div>
				<Button
					type="submit"
					disabled={digits.length !== 47 && digits.length !== 48}
				>
					Validar boleto
				</Button>
			</form>

			{result && <ResultCard result={result} />}
		</div>
	);
}

function ResultCard({ result }: { result: BoletoResult }) {
	if (result.kind === "unknown") {
		return (
			<ResultBox tone="warning">
				<p className="text-sm text-foreground">{result.reason}</p>
			</ResultBox>
		);
	}

	const tone = result.valid ? "primary" : "destructive";

	return (
		<div className="space-y-4">
			<ResultBox
				tone={tone}
				label={
					result.kind === "banking"
						? "Boleto bancário"
						: "Boleto de arrecadação"
				}
			>
				<p className="text-xl font-bold text-foreground">
					{result.valid ? "Linha digitável válida" : "Linha digitável inválida"}
				</p>
			</ResultBox>

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
	const rows: { label: string; value: string }[] = [
		{ label: "Banco emissor", value: result.bankCode },
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
		},
		{
			label: "Vencimento",
			value: result.dueDate
				? result.dueDate.toLocaleDateString("pt-BR", { timeZone: "UTC" })
				: "Não informado",
		},
		{ label: "Fator de vencimento", value: String(result.dueFactor) },
		{ label: "Código de barras", value: result.barcode },
	];

	return (
		<>
			<dl className="grid gap-3 sm:grid-cols-2">
				{rows.map((r) => (
					<div
						key={r.label}
						className="rounded-lg border border-border bg-card p-3"
					>
						<dt className="text-xs font-medium text-muted-foreground">
							{r.label}
						</dt>
						<dd className="mt-1 break-all text-sm text-foreground">
							{r.value}
						</dd>
					</div>
				))}
			</dl>

			<div>
				<h3 className="mb-2 text-sm font-semibold text-foreground">
					Verificação de dígitos
				</h3>
				<ul className="space-y-1 text-sm">
					<CheckRow label="Campo 1 (módulo 10)" ok={result.checks.field1} />
					<CheckRow label="Campo 2 (módulo 10)" ok={result.checks.field2} />
					<CheckRow label="Campo 3 (módulo 10)" ok={result.checks.field3} />
					<CheckRow
						label="DV geral do código de barras (módulo 11)"
						ok={result.checks.generalDigit}
					/>
				</ul>
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

	const rows: { label: string; value: string }[] = [
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
		},
		{ label: "Código de barras", value: result.barcode },
	];

	return (
		<>
			<dl className="grid gap-3 sm:grid-cols-2">
				{rows.map((r) => (
					<div
						key={r.label}
						className="rounded-lg border border-border bg-card p-3"
					>
						<dt className="text-xs font-medium text-muted-foreground">
							{r.label}
						</dt>
						<dd className="mt-1 break-all text-sm text-foreground">
							{r.value}
						</dd>
					</div>
				))}
			</dl>

			<div>
				<h3 className="mb-2 text-sm font-semibold text-foreground">
					Verificação de dígitos
				</h3>
				<ul className="space-y-1 text-sm">
					{result.checks.fields.map((ok, i) => (
						<CheckRow key={`field-${i + 1}`} label={`Bloco ${i + 1}`} ok={ok} />
					))}
				</ul>
			</div>
		</>
	);
}

function CheckRow({ label, ok }: { label: string; ok: boolean }) {
	return (
		<li className="flex items-center justify-between rounded-lg border border-border bg-card px-3 py-2">
			<span className="text-foreground">{label}</span>
			<span
				className={
					ok
						? "text-xs font-semibold text-emerald-600"
						: "text-xs font-semibold text-destructive"
				}
			>
				{ok ? "OK" : "INVÁLIDO"}
			</span>
		</li>
	);
}
