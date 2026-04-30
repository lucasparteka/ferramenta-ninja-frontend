"use client";

import { useState } from "react";
import { Trash } from "lucide-react";
import { ResultBox } from "@/components/shared/result-box";
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
	const [copied, setCopied] = useState<string | null>(null);

	function handleDecode() {
		setResult(decodePixBrCode(input));
		setCopied(null);
	}

	function handleClear() {
		setInput("");
		setResult(null);
	}

	function handleCopy(fieldKey: string, value: string) {
		navigator.clipboard.writeText(value);
		setCopied(fieldKey);
		setTimeout(() => setCopied(null), 1500);
	}

	return (
		<div className="space-y-6">
			<div className="space-y-2">
				<label
					htmlFor="pix-input"
					className="block text-sm font-medium text-foreground"
				>
					Insira o PIX Copia e Cola
				</label>
				<Textarea
					id="pix-input"
					value={input}
					onChange={(e) => setInput(e.target.value)}
					placeholder="00020126..."
					rows={6}
					className="font-mono"
				/>
			</div>

			<div className="flex flex-wrap gap-3">
				<Button onClick={handleDecode} disabled={!input.trim()}>
					Decodificar
				</Button>
			<Button variant="secondary" onClick={handleClear} disabled={!input}>
				<Trash />
				Limpar
			</Button>
			</div>

			{result && (
				<PixResult result={result} onCopy={handleCopy} copied={copied} />
			)}
		</div>
	);
}

type PixResultProps = {
	result: PixDecoded;
	onCopy: (fieldKey: string, value: string) => void;
	copied: string | null;
};

function PixResult({ result, onCopy, copied }: PixResultProps) {
	const tone = result.valid ? "primary" : "warning";

	const rows: { key: string; label: string; value?: string }[] = [
		{
			key: "beneficiary",
			label: "Beneficiário",
			value: result.beneficiary,
		},
		{
			key: "pix-key",
			label: result.keyType
				? `Chave PIX (${keyTypeLabel(result.keyType)})`
				: "Chave PIX",
			value: result.key,
		},
		{
			key: "amount",
			label: "Valor",
			value: result.amount !== undefined ? formatBRL(result.amount) : undefined,
		},
		{ key: "city", label: "Cidade", value: result.city },
		{ key: "psp", label: "PSP / Instituição", value: result.psp },
		{
			key: "additional-info",
			label: "Info adicional",
			value: result.additionalInfo,
		},
		{ key: "txid", label: "TxID", value: result.txid },
	];

	return (
		<ResultBox tone={tone} className="space-y-4">
			<div className="flex flex-wrap items-center gap-3">
				<span
					className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
						result.valid
							? "bg-primary/20 text-primary"
							: "bg-warning/20 text-warning-foreground"
					}`}
				>
					{result.valid ? "Código válido" : "Atenção"}
				</span>
				{result.crcCalculated && result.crcProvided && (
					<span className="text-xs text-muted-foreground">
						CRC {result.crcProvided} (calculado {result.crcCalculated})
					</span>
				)}
			</div>

			{result.errors.length > 0 && (
				<ul className="list-disc space-y-1 pl-5 text-sm text-warning-foreground">
					{result.errors.map((err) => (
						<li key={err}>{err}</li>
					))}
				</ul>
			)}

			<dl className="grid gap-3 sm:grid-cols-2">
				{rows
					.filter((r) => r.value)
					.map((row) => (
						<div
							key={row.key}
							className="rounded-lg border border-border bg-card p-3"
						>
							<dt className="text-xs font-medium text-muted-foreground">
								{row.label}
							</dt>
							<dd className="mt-1 flex items-start justify-between gap-2">
								<span className="break-all text-sm text-foreground">
									{row.value}
								</span>
								<button
									type="button"
									onClick={() => onCopy(row.key, row.value as string)}
									className="shrink-0 text-xs font-medium text-primary hover:underline"
								>
									{copied === row.key ? "copiado" : "copiar"}
								</button>
							</dd>
						</div>
					))}
			</dl>
		</ResultBox>
	);
}
