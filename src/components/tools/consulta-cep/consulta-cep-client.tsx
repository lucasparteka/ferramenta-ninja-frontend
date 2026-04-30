"use client";

import { useState } from "react";
import { CopyButton } from "@/components/shared/copy-button";
import { ResultBox } from "@/components/shared/result-box";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	type CepAddress,
	formatCep,
	lookupCep,
	sanitizeCep,
} from "@/lib/cep/lookup";

type State =
	| { kind: "idle" }
	| { kind: "loading" }
	| { kind: "success"; data: CepAddress }
	| { kind: "error"; message: string };

export function ConsultaCepClient() {
	const [value, setValue] = useState("");
	const [state, setState] = useState<State>({ kind: "idle" });

	async function handleSubmit(event?: React.FormEvent) {
		event?.preventDefault();
		if (sanitizeCep(value).length !== 8) {
			setState({ kind: "error", message: "Informe um CEP com 8 dígitos" });
			return;
		}
		setState({ kind: "loading" });
		const result = await lookupCep(value);
		if (result.status === "ok") {
			setState({ kind: "success", data: result.data });
		} else {
			setState({ kind: "error", message: result.message });
		}
	}

	function handleChange(raw: string) {
		setValue(formatCep(raw));
	}

	return (
		<div className="space-y-6">
			<form onSubmit={handleSubmit} className="space-y-4">
				<div className="space-y-2 max-w-xs">
					<label
						htmlFor="cep-input"
						className="block text-sm font-medium text-foreground"
					>
						CEP
					</label>
					<Input
						id="cep-input"
						type="text"
						inputMode="numeric"
						value={value}
						onChange={(e) => handleChange(e.target.value)}
						placeholder="00000-000"
						maxLength={9}
					/>
				</div>
				<Button
					type="submit"
					disabled={state.kind === "loading" || sanitizeCep(value).length !== 8}
				>
					{state.kind === "loading" ? "Consultando..." : "Consultar CEP"}
				</Button>
			</form>

			{state.kind === "error" && (
				<ResultBox tone="warning">
					<p className="text-sm text-foreground">{state.message}</p>
				</ResultBox>
			)}

			{state.kind === "success" && <CepResult data={state.data} />}
		</div>
	);
}

function CepResult({ data }: { data: CepAddress }) {
	const fullAddress = [
		data.street,
		data.neighborhood,
		data.city && data.state ? `${data.city} - ${data.state}` : data.city,
	]
		.filter(Boolean)
		.join(", ");

	const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
		`${fullAddress} ${data.cep}`.trim(),
	)}`;

	const rows: { label: string; value?: string }[] = [
		{ label: "CEP", value: data.cep },
		{ label: "Logradouro", value: data.street },
		{ label: "Complemento", value: data.complement },
		{ label: "Bairro", value: data.neighborhood },
		{ label: "Cidade", value: data.city },
		{ label: "Estado", value: data.state },
		{ label: "DDD", value: data.ddd },
		{ label: "IBGE", value: data.ibge },
	];

	return (
		<ResultBox className="space-y-4">
			<dl className="grid gap-3 sm:grid-cols-2">
				{rows
					.filter((r) => r.value)
					.map((r) => (
						<div
							key={r.label}
							className="rounded-lg border border-border bg-card p-3"
						>
							<dt className="text-xs font-medium text-muted-foreground">
								{r.label}
							</dt>
							<dd className="mt-1 text-sm text-foreground">{r.value}</dd>
						</div>
					))}
			</dl>
			<div className="flex flex-wrap gap-3">
				<CopyButton text={fullAddress} label="Copiar endereço" />
				<a
					href={mapsUrl}
					target="_blank"
					rel="noopener noreferrer"
					className="inline-flex h-8 items-center rounded-sm border border-border bg-background px-2.5 text-sm font-medium text-foreground hover:bg-muted"
				>
					Ver no Google Maps
				</a>
			</div>
		</ResultBox>
	);
}
