"use client";

import { Car, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { LayoutE } from "@/components/shared/layout-e";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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
				<div className="grid grid-cols-2 gap-2 sm:grid-cols-[1fr_1fr_1fr_auto] items-end">
					<div className="space-y-1.5">
						<Label
							htmlFor="fipe-type"
							className="text-xs text-muted-foreground"
						>
							Tipo
						</Label>
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
						<Label
							htmlFor="fipe-brand"
							className="text-xs text-muted-foreground"
						>
							Marca
						</Label>
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
						<Label
							htmlFor="fipe-model"
							className="text-xs text-muted-foreground"
						>
							Modelo
						</Label>
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
					<div className="rounded-md border border-warning-bd bg-warning/5 p-4">
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
	const tableCols = "grid grid-cols-[100px_1fr_130px]";
	return (
		<div>
			<div className="border-b border-border bg-muted/55 px-4 py-[7px]">
				<h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
					{first.marca} · {first.modelo}
				</h3>
			</div>
			<div
				className={`${tableCols} border-b border-border bg-muted/55 px-4 py-[7px]`}
			>
				<span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
					Ano / combustível
				</span>
				<span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
					Versão
				</span>
				<span className="text-right text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
					Preço FIPE
				</span>
			</div>
			{prices.map((p) => (
				<div
					key={`${p.anoModelo}-${p.siglaCombustivel}`}
					className={`${tableCols} border-b border-border px-4 py-[9px] last:border-b-0`}
				>
					<span className="font-mono text-xs text-foreground">
						{p.anoModelo} {p.combustivel}
					</span>
					<span className="text-xs text-foreground">{first.modelo}</span>
					<span className="text-right font-mono text-xs text-foreground">
						{p.valor}
					</span>
				</div>
			))}
		</div>
	);
}
