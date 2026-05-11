"use client";

import { Car, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { LayoutE } from "@/components/shared/layout-e";
import { Button } from "@/components/ui/button";
import { NativeSelect } from "@/components/ui/select-native";
import {
	type FipeBrand,
	type FipeModel,
	type FipePrice,
	fetchBrands,
	fetchModels,
	fetchPrice,
	type VehicleType,
} from "@/lib/fipe/client";

const TYPES: { value: VehicleType; label: string }[] = [
	{ value: "carros", label: "Carros" },
	{ value: "motos", label: "Motos" },
	{ value: "caminhoes", label: "Caminhões" },
];

type QueryState =
	| { kind: "idle" }
	| { kind: "loading" }
	| { kind: "result"; data: FipePrice[] }
	| { kind: "error"; message: string };

export function TabelaFipeClient() {
	const [type, setType] = useState<VehicleType>("carros");
	const [brands, setBrands] = useState<FipeBrand[]>([]);
	const [brandCode, setBrandCode] = useState("");
	const [models, setModels] = useState<FipeModel[]>([]);
	const [modelCode, setModelCode] = useState("");
	const [prices, setPrices] = useState<FipePrice[] | null>(null);
	const [loading, setLoading] = useState<"brands" | "models" | "price" | null>(
		null,
	);
	const [error, setError] = useState<string | null>(null);
	const [state, setState] = useState<QueryState>({ kind: "idle" });

	useEffect(() => {
		setError(null);
		setBrandCode("");
		setModels([]);
		setModelCode("");
		setPrices(null);
		setLoading("brands");
		fetchBrands(type)
			.then((data) => setBrands(data))
			.catch(() => setError("Falha ao buscar marcas. Tente novamente."))
			.finally(() => setLoading(null));
	}, [type]);

	useEffect(() => {
		if (!brandCode) {
			setModels([]);
			setModelCode("");
			setPrices(null);
			return;
		}
		setError(null);
		setModelCode("");
		setPrices(null);
		setLoading("models");
		fetchModels(type, brandCode)
			.then((data) => setModels(data))
			.catch(() => setError("Falha ao buscar modelos. Tente novamente."))
			.finally(() => setLoading(null));
	}, [type, brandCode]);

	async function handleSearch() {
		if (!modelCode) return;
		setError(null);
		setPrices(null);
		setLoading("price");
		setState({ kind: "loading" });
		try {
			const data = await fetchPrice(modelCode);
			setPrices(data);
			setState({ kind: "result", data });
		} catch {
			setError("Falha ao consultar preço. Tente novamente.");
			setState({ kind: "idle" });
		} finally {
			setLoading(null);
		}
	}

	const layoutState =
		state.kind === "result" ? "result" : error ? "error" : "empty";

	return (
		<LayoutE
			state={layoutState}
			errorState={
				error ? (
					<div className="rounded-md border border-destructive/30 bg-destructive/5 p-4">
						<p className="text-xs text-destructive">{error}</p>
					</div>
				) : undefined
			}
			searchBar={
				<div className="space-y-4">
					<div className="grid gap-4 sm:grid-cols-3">
						<div className="space-y-1.5">
							<label
								htmlFor="fipe-type"
								className="text-xs font-medium text-muted-foreground"
							>
								Tipo de veículo
							</label>
							<NativeSelect
								id="fipe-type"
								value={type}
								onChange={(e) => setType(e.target.value as VehicleType)}
							>
								{TYPES.map((t) => (
									<option key={t.value} value={t.value}>
										{t.label}
									</option>
								))}
							</NativeSelect>
						</div>
						<div className="space-y-1.5">
							<label
								htmlFor="fipe-brand"
								className="text-xs font-medium text-muted-foreground"
							>
								Marca
							</label>
							<NativeSelect
								id="fipe-brand"
								value={brandCode}
								onChange={(e) => setBrandCode(e.target.value)}
								disabled={loading === "brands" || brands.length === 0}
							>
								<option value="">
									{loading === "brands" ? "Carregando..." : "Selecione"}
								</option>
								{brands.map((b) => (
									<option key={b.valor} value={b.valor}>
										{b.nome}
									</option>
								))}
							</NativeSelect>
						</div>
						<div className="space-y-1.5">
							<label
								htmlFor="fipe-model"
								className="text-xs font-medium text-muted-foreground"
							>
								Modelo
							</label>
							<NativeSelect
								id="fipe-model"
								value={modelCode}
								onChange={(e) => setModelCode(e.target.value)}
								disabled={loading === "models" || models.length === 0}
							>
								<option value="">
									{loading === "models"
										? "Carregando..."
										: brandCode
											? "Selecione"
											: "Escolha a marca primeiro"}
								</option>
								{models.map((m) => (
									<option key={m.codigo} value={m.codigo}>
										{m.modelo}
									</option>
								))}
							</NativeSelect>
						</div>
					</div>
					<Button
						type="button"
						onClick={handleSearch}
						disabled={!modelCode || loading === "price"}
					>
						{loading === "price" ? (
							<Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
						) : (
							<Car className="mr-2 h-3.5 w-3.5" />
						)}
						{loading === "price" ? "Consultando..." : "Consultar FIPE"}
					</Button>
				</div>
			}
			emptyState={
				<div className="flex min-h-[200px] flex-col items-center justify-center gap-2 rounded-md border border-dashed border-border bg-muted/30 p-8 text-center">
					<Car className="h-5 w-5 text-muted-foreground" strokeWidth={1.75} />
					<p className="text-sm text-foreground">
						Selecione tipo, marca e modelo para consultar
					</p>
					<p className="text-xs text-muted-foreground">
						Dados da Tabela FIPE · atualização mensal
					</p>
				</div>
			}
			result={
				prices && prices.length > 0 ? (
					<PricesResult prices={prices} />
				) : prices && prices.length === 0 ? (
					<div className="rounded-md border border-warning/30 bg-warning/5 p-4">
						<p className="text-xs text-warning">
							Nenhum preço encontrado para este modelo.
						</p>
					</div>
				) : null
			}
		/>
	);
}

function PricesResult({ prices }: { prices: FipePrice[] }) {
	const first = prices[0];
	return (
		<div className="space-y-4">
			<div className="rounded-md border border-border bg-card">
				<div className="border-b border-border px-4 py-2">
					<h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
						{first.marca} · {first.modelo}
					</h3>
				</div>
				<div className="divide-y divide-border">
					<div className="flex items-start justify-between px-4 py-2.5">
						<span className="min-w-[100px] text-xs text-muted-foreground">
							Preço
						</span>
						<span className="text-right text-xs font-mono font-semibold text-foreground">
							{first.valor}
						</span>
					</div>
					<div className="flex items-start justify-between px-4 py-2.5">
						<span className="min-w-[100px] text-xs text-muted-foreground">
							Ano
						</span>
						<span className="text-right text-xs font-mono">
							{first.anoModelo}
						</span>
					</div>
					<div className="flex items-start justify-between px-4 py-2.5">
						<span className="min-w-[100px] text-xs text-muted-foreground">
							Combustível
						</span>
						<span className="text-right text-xs">{first.combustivel}</span>
					</div>
					<div className="flex items-start justify-between px-4 py-2.5">
						<span className="min-w-[100px] text-xs text-muted-foreground">
							Código FIPE
						</span>
						<span className="text-right text-xs font-mono">
							{first.codigoFipe}
						</span>
					</div>
					<div className="flex items-start justify-between px-4 py-2.5">
						<span className="min-w-[100px] text-xs text-muted-foreground">
							Referência
						</span>
						<span className="text-right text-xs">{first.mesReferencia}</span>
					</div>
				</div>
			</div>

			{prices.length > 1 && (
				<div className="rounded-md border border-border bg-card">
					<div className="border-b border-border px-4 py-2">
						<h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
							Variações por ano e combustível
						</h3>
					</div>
					<div className="divide-y divide-border">
						{prices.map((p) => (
							<div
								key={`${p.anoModelo}-${p.siglaCombustivel}`}
								className="flex items-start justify-between px-4 py-2.5"
							>
								<span className="min-w-[100px] text-xs text-muted-foreground">
									{p.anoModelo} · {p.combustivel}
								</span>
								<span className="text-right text-xs font-mono">{p.valor}</span>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
