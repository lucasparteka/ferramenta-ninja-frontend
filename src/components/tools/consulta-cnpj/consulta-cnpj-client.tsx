"use client";

import { Search, Loader2 } from "lucide-react";
import { useState } from "react";
import { CopyButton } from "@/components/shared/copy-button";
import { LayoutE } from "@/components/shared/layout-e";
import { ResultSheet } from "@/components/shared/result-sheet";
import type { Section } from "@/components/shared/result-sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	type CnpjCompany,
	formatCnpjMask,
	lookupCnpj,
	sanitizeCnpj,
} from "@/lib/cnpj/lookup";

type State =
	| { kind: "idle" }
	| { kind: "loading" }
	| { kind: "success"; data: CnpjCompany }
	| { kind: "error"; message: string };

export function ConsultaCnpjClient() {
	const [value, setValue] = useState("");
	const [state, setState] = useState<State>({ kind: "idle" });

	async function handleSubmit(event?: React.FormEvent) {
		event?.preventDefault();
		if (sanitizeCnpj(value).length !== 14) {
			setState({ kind: "error", message: "Informe um CNPJ com 14 dígitos" });
			return;
		}
		setState({ kind: "loading" });
		const result = await lookupCnpj(value);
		if (result.status === "ok") {
			setState({ kind: "success", data: result.data });
		} else {
			setState({ kind: "error", message: result.message });
		}
	}

	function handleChange(raw: string) {
		setValue(formatCnpjMask(raw));
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
						id="cnpj-input"
						type="text"
						inputMode="numeric"
						value={value}
						onChange={(e) => handleChange(e.target.value)}
						onKeyDown={handleKeyDown}
						placeholder="00.000.000/0000-00"
						maxLength={18}
						className="font-mono"
					/>
					<Button
						type="submit"
						disabled={
							state.kind === "loading" || sanitizeCnpj(value).length !== 14
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
					<Search
						className="h-5 w-5 text-muted-foreground"
						strokeWidth={1.75}
					/>
					<p className="text-sm text-foreground">
						Digite um CNPJ para consultar
					</p>
					<p className="text-xs text-muted-foreground">
						Dados fornecidos pela Receita Federal
					</p>
				</div>
			}
			result={state.kind === "success" && <CnpjResult data={state.data} />}
		/>
	);
}

function CnpjResult({ data }: { data: CnpjCompany }) {
	const fullAddress = [
		data.address.street && data.address.number
			? `${data.address.street}, ${data.address.number}`
			: data.address.street,
		data.address.complement,
		data.address.neighborhood,
		data.address.city && data.address.state
			? `${data.address.city} - ${data.address.state}`
			: data.address.city,
	]
		.filter(Boolean)
		.join(", ");

	const sections: Section[] = [
		{
			title: "Identificação",
			rows: [
				{ label: "CNPJ", value: data.cnpj, mono: true },
				{ label: "Razão Social", value: data.corporateName },
				{ label: "Nome Fantasia", value: data.tradeName },
				{ label: "Situação", value: data.status },
				{ label: "Data de Abertura", value: data.openingDate },
			],
		},
		{
			title: "Localização",
			rows: [
				{
					label: "Logradouro",
					value: `${data.address.street ?? ""}, ${data.address.number ?? ""}`,
				},
				{ label: "Complemento", value: data.address.complement },
				{ label: "Bairro", value: data.address.neighborhood },
				{
					label: "Cidade/UF",
					value:
						data.address.city && data.address.state
							? `${data.address.city} - ${data.address.state}`
							: data.address.city,
				},
				{ label: "CEP", value: data.address.zip, mono: true },
			],
		},
		{
			title: "Atividade",
			rows: [
				{ label: "Principal", value: data.mainActivity },
				{ label: "Natureza Jurídica", value: data.legalNature },
				{ label: "Porte", value: data.size },
			],
		},
		{
			title: "Capital e Contato",
			rows: [
				{
					label: "Capital Social",
					value:
						typeof data.shareCapital === "number"
							? data.shareCapital.toLocaleString("pt-BR", {
									style: "currency",
									currency: "BRL",
								})
							: undefined,
					mono: true,
				},
				{ label: "Telefone", value: data.phone, mono: true },
				{ label: "E-mail", value: data.email },
			],
		},
	];

	return (
		<div className="space-y-4">
			<ResultSheet sections={sections} />

			{(data.simples?.optant || data.mei?.optant) && (
				<div className="flex flex-wrap gap-2">
					{data.simples?.optant && (
						<span className="rounded-md border border-success/30 bg-success/10 px-2 py-1 text-xs font-medium text-success">
							Optante Simples Nacional
						</span>
					)}
					{data.mei?.optant && (
						<span className="rounded-md border border-success/30 bg-success/10 px-2 py-1 text-xs font-medium text-success">
							MEI
						</span>
					)}
				</div>
			)}

			{data.partners.length > 0 && (
				<div className="rounded-md border border-border bg-card">
					<div className="border-b border-border px-4 py-2">
						<h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
							Sócios e Administradores
						</h3>
					</div>
					<div className="divide-y divide-border">
						{data.partners.map((p) => (
							<div
								key={`${p.name}-${p.role ?? ""}`}
								className="flex items-center justify-between px-4 py-2.5"
							>
								<span className="text-xs text-muted-foreground">{p.name}</span>
								{p.role && (
									<span className="text-xs text-muted-foreground">
										{p.role}
									</span>
								)}
							</div>
						))}
					</div>
				</div>
			)}

			<CopyButton
				text={`${data.corporateName}\n${data.cnpj}\n${fullAddress}`.trim()}
				label="Copiar dados"
				variant="outline"
			/>
		</div>
	);
}
