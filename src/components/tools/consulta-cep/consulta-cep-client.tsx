"use client";

import { Loader2, MapPin, Search } from "lucide-react";
import { useState } from "react";
import { CopyButton } from "@/components/shared/copy-button";
import { LayoutE } from "@/components/shared/layout-e";
import { ResultSheet } from "@/components/shared/result-sheet";
import type { Section } from "@/components/shared/result-sheet";
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

	function handleKeyDown(e: React.KeyboardEvent) {
		if (e.key === "Enter") {
			handleSubmit();
		}
	}

	const layoutState =
		state.kind === "idle"
			? "empty"
			: state.kind === "success"
				? "result"
				: state.kind;
	const errorMessage = state.kind === "error" ? state.message : undefined;

	return (
		<LayoutE
			state={layoutState}
			errorState={
				errorMessage ? (
					<div className="rounded-md border border-destructive/30 bg-destructive/5 p-4">
						<p className="text-xs text-destructive">{errorMessage}</p>
					</div>
				) : undefined
			}
			searchBar={
				<form onSubmit={handleSubmit} className="flex gap-2">
					<Input
						id="cep-input"
						type="text"
						inputMode="numeric"
						value={value}
						onChange={(e) => handleChange(e.target.value)}
						onKeyDown={handleKeyDown}
						placeholder="00000-000"
						maxLength={9}
						className="font-mono max-w-[200px]"
					/>
					<Button
						type="submit"
						disabled={
							state.kind === "loading" || sanitizeCep(value).length !== 8
						}
					>
						{state.kind === "loading" ? (
							<Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
						) : (
							<Search className="mr-2 h-3.5 w-3.5" />
						)}
						{state.kind === "loading" ? "Consultando..." : "Consultar"}
					</Button>
				</form>
			}
			emptyState={
				<div className="flex min-h-[200px] flex-col items-center justify-center gap-2 rounded-md border border-dashed border-border bg-muted/30 p-8 text-center">
					<MapPin
						className="h-5 w-5 text-muted-foreground"
						strokeWidth={1.75}
					/>
					<p className="text-sm text-foreground">
						Digite um CEP para consultar
					</p>
					<p className="text-xs text-muted-foreground">
						Dados do ViaCEP · atualização diária
					</p>
				</div>
			}
			result={state.kind === "success" && <CepResult data={state.data} />}
		/>
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

	const sections: Section[] = [
		{
			title: "Endereço",
			rows: [
				{ label: "CEP", value: data.cep, mono: true },
				{ label: "Logradouro", value: data.street },
				{ label: "Complemento", value: data.complement },
				{ label: "Bairro", value: data.neighborhood },
			],
		},
		{
			title: "Localização",
			rows: [
				{
					label: "Cidade",
					value: data.city,
				},
				{ label: "Estado", value: data.state },
				{ label: "DDD", value: data.ddd, mono: true },
				{ label: "IBGE", value: data.ibge, mono: true },
			],
		},
	];

	return (
		<div className="space-y-4">
			<ResultSheet sections={sections} />

			<div className="flex flex-wrap gap-3">
				<CopyButton
					text={fullAddress}
					label="Copiar endereço"
					variant="outline"
				/>
				<a
					href={mapsUrl}
					target="_blank"
					rel="noopener noreferrer"
					className="inline-flex h-9 items-center rounded-md border border-border bg-background px-4 text-sm font-medium text-foreground hover:bg-muted"
				>
					Ver no Google Maps
				</a>
			</div>
		</div>
	);
}
