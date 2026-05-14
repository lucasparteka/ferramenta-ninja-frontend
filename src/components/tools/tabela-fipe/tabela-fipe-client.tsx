"use client";

import { Car, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { LayoutE } from "@/components/shared/layout-e";
import { ResultSheet } from "@/components/shared/result-sheet";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/select-native";
import {
	type FipeBrand,
	type FipeModel,
	type FipePrice,
	type FipeYear,
	fetchBrands,
	fetchModels,
	fetchPrice,
	fetchYears,
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
	| { kind: "result"; data: FipePrice }
	| { kind: "error"; message: string };

export function TabelaFipeClient() {
	const [type, setType] = useState<VehicleType>("carros");
	const [brands, setBrands] = useState<FipeBrand[]>([]);
	const [brandCode, setBrandCode] = useState("");
	const [models, setModels] = useState<FipeModel[]>([]);
	const [modelCode, setModelCode] = useState("");
	const [years, setYears] = useState<FipeYear[]>([]);
	const [yearCode, setYearCode] = useState("");
	const [price, setPrice] = useState<FipePrice | null>(null);
	const [loading, setLoading] = useState<
		"brands" | "models" | "years" | "price" | null
	>(null);
	const [error, setError] = useState<string | null>(null);
	const [state, setState] = useState<QueryState>({ kind: "idle" });

	useEffect(() => {
		setError(null);
		setBrandCode("");
		setModels([]);
		setModelCode("");
		setYears([]);
		setYearCode("");
		setPrice(null);
		setState({ kind: "idle" });
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
			setYears([]);
			setYearCode("");
			setPrice(null);
			setState({ kind: "idle" });
			return;
		}
		setError(null);
		setModelCode("");
		setYears([]);
		setYearCode("");
		setPrice(null);
		setState({ kind: "idle" });
		setLoading("models");
		fetchModels(type, brandCode)
			.then((data) => setModels(data))
			.catch(() => setError("Falha ao buscar modelos. Tente novamente."))
			.finally(() => setLoading(null));
	}, [type, brandCode]);

	useEffect(() => {
		if (!modelCode) {
			setYears([]);
			setYearCode("");
			setPrice(null);
			setState({ kind: "idle" });
			return;
		}
		setError(null);
		setYearCode("");
		setPrice(null);
		setState({ kind: "idle" });
		setLoading("years");
		fetchYears(type, brandCode, modelCode)
			.then((data) => setYears(data))
			.catch(() => setError("Falha ao buscar anos. Tente novamente."))
			.finally(() => setLoading(null));
	}, [type, brandCode, modelCode]);

	async function handleSearch() {
		if (!yearCode) return;
		setError(null);
		setPrice(null);
		setLoading("price");
		setState({ kind: "loading" });
		try {
			const data = await fetchPrice(type, brandCode, modelCode, yearCode);
			setPrice(data);
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
				<div className="grid grid-cols-2 gap-2 sm:grid-cols-[1fr_1fr_1fr_1fr_auto] items-end">
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
								<option key={b.codigo} value={b.codigo}>
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
								<option key={m.codigo} value={String(m.codigo)}>
									{m.nome}
								</option>
							))}
						</NativeSelect>
					</div>
					<div className="space-y-1.5">
						<Label
							htmlFor="fipe-year"
							className="text-xs text-muted-foreground"
						>
							Ano
						</Label>
						<NativeSelect
							id="fipe-year"
							value={yearCode}
							onChange={(e) => setYearCode(e.target.value)}
							disabled={loading === "years" || years.length === 0}
						>
							<option value="">
								{loading === "years"
									? "Carregando..."
									: modelCode
										? "Selecione"
										: "Escolha o modelo primeiro"}
							</option>
							{years.map((y) => (
								<option key={y.codigo} value={y.codigo}>
									{y.nome}
								</option>
							))}
						</NativeSelect>
					</div>
					<Button
						className="max-md:mt-3 max-md:col-span-2"
						type="button"
						onClick={handleSearch}
						disabled={!yearCode || loading === "price"}
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
				<div className="flex min-h-50 flex-col items-center justify-center gap-2 text-center">
					<Car className="h-5 w-5 text-muted-foreground" strokeWidth={1.75} />
					<p className="text-sm text-foreground">
						Selecione tipo, marca, modelo e ano para consultar
					</p>
					<p className="text-xs text-muted-foreground">
						Dados da Tabela FIPE · atualização mensal
					</p>
				</div>
			}
			result={price ? <PriceResult price={price} /> : null}
		/>
	);
}

function PriceResult({ price }: { price: FipePrice }) {
	return (
		<div>
			<div className="border-b border-border px-5 py-5 sm:px-6">
				<p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
					{price.marca}
				</p>
				<p className="mt-0.5 text-sm font-medium text-foreground leading-snug">
					{price.modelo}
				</p>
			</div>

			<div className="border-b border-border bg-muted/30 px-5 py-6 sm:px-6">
				<p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
					Preço FIPE
				</p>
				<p className="font-mono text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
					{price.valor}
				</p>
				<p className="mt-1.5 text-xs text-muted-foreground">
					Referência: {price.mesReferencia}
				</p>
			</div>

			<ResultSheet
				variant="grid"
				cols={2}
				sections={[
					{
						title: "Identificação",
						rows: [
							{ label: "Ano do modelo", value: price.anoModelo, mono: true },
							{ label: "Combustível", value: price.combustivel },
							{ label: "Sigla", value: price.siglaCombustivel, mono: true },
						],
					},
					{
						title: "Código FIPE",
						rows: [
							{ label: "Código", value: price.codigoFipe, mono: true },
							{
								label: "Tipo",
								value:
									price.tipoVeiculo === 1
										? "Carro"
										: price.tipoVeiculo === 2
											? "Moto"
											: "Caminhão",
							},
						],
					},
				]}
			/>
		</div>
	);
}
