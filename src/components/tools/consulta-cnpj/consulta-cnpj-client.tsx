"use client";

import { useState } from "react";
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

	return (
		<div className="space-y-6">
			<form onSubmit={handleSubmit} className="space-y-4">
				<div className="space-y-2 max-w-sm">
					<label
						htmlFor="cnpj-input"
						className="block text-sm font-medium text-foreground"
					>
						CNPJ
					</label>
					<Input
						id="cnpj-input"
						type="text"
						inputMode="numeric"
						value={value}
						onChange={(e) => handleChange(e.target.value)}
						placeholder="00.000.000/0000-00"
						maxLength={18}
					/>
				</div>
				<Button
					type="submit"
					disabled={state.kind === "loading" || sanitizeCnpj(value).length !== 14}
				>
					{state.kind === "loading" ? "Consultando..." : "Consultar CNPJ"}
				</Button>
			</form>

			{state.kind === "error" && (
				<div className="rounded-lg border border-warning/30 bg-warning/10 p-4 text-sm text-foreground">
					{state.message}
				</div>
			)}

			{state.kind === "success" && <CnpjResult data={state.data} />}
		</div>
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
		data.address.zip,
	]
		.filter(Boolean)
		.join(", ");

	const rows: { label: string; value?: string | number }[] = [
		{ label: "CNPJ", value: data.cnpj },
		{ label: "Razão Social", value: data.corporateName },
		{ label: "Nome Fantasia", value: data.tradeName },
		{ label: "Situação", value: data.status },
		{ label: "Data de Abertura", value: data.openingDate },
		{ label: "Atividade Principal", value: data.mainActivity },
		{ label: "Natureza Jurídica", value: data.legalNature },
		{ label: "Porte", value: data.size },
		{
			label: "Capital Social",
			value:
				typeof data.shareCapital === "number"
					? data.shareCapital.toLocaleString("pt-BR", {
							style: "currency",
							currency: "BRL",
						})
					: undefined,
		},
		{ label: "Telefone", value: data.phone },
		{ label: "E-mail", value: data.email },
	];

	return (
		<div className="space-y-4 rounded-lg border border-primary/30 bg-primary/5 p-4">
			<dl className="grid gap-3 sm:grid-cols-2">
				{rows
					.filter((r) => r.value)
					.map((r) => (
						<div
							key={r.label}
							className="rounded-md border border-border bg-background/60 p-3"
						>
							<dt className="text-xs font-medium text-muted-foreground">
								{r.label}
							</dt>
							<dd className="mt-1 text-sm text-foreground">{r.value}</dd>
						</div>
					))}
			</dl>

			{fullAddress && (
				<div className="rounded-md border border-border bg-background/60 p-3">
					<p className="text-xs font-medium text-muted-foreground">Endereço</p>
					<p className="mt-1 text-sm text-foreground">{fullAddress}</p>
				</div>
			)}

			{(data.simples?.optant || data.mei?.optant) && (
				<div className="flex flex-wrap gap-2">
					{data.simples?.optant && (
						<span className="rounded-md border border-primary/30 bg-primary/10 px-2 py-1 text-xs font-medium text-foreground">
							Optante Simples Nacional
						</span>
					)}
					{data.mei?.optant && (
						<span className="rounded-md border border-primary/30 bg-primary/10 px-2 py-1 text-xs font-medium text-foreground">
							MEI
						</span>
					)}
				</div>
			)}

			{data.partners.length > 0 && (
				<div>
					<h3 className="mb-2 text-sm font-semibold text-foreground">
						Quadro de Sócios e Administradores
					</h3>
					<ul className="space-y-2">
						{data.partners.map((p) => (
							<li
								key={`${p.name}-${p.role ?? ""}`}
								className="rounded-md border border-border bg-background/60 p-3 text-sm"
							>
								<p className="font-medium text-foreground">{p.name}</p>
								{p.role && (
									<p className="text-xs text-muted-foreground">{p.role}</p>
								)}
							</li>
						))}
					</ul>
				</div>
			)}

			<div className="flex flex-wrap gap-3 pt-2">
				<Button
					variant="outline"
					onClick={() => {
						navigator.clipboard.writeText(
							`${data.corporateName}\n${data.cnpj}\n${fullAddress}`.trim(),
						);
					}}
				>
					Copiar dados
				</Button>
			</div>
		</div>
	);
}
