"use client";

import { useEffect, useState } from "react";
import { ResultBox, ResultRow } from "@/components/shared/result-box";
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
		try {
			const data = await fetchPrice(modelCode);
			setPrices(data);
		} catch {
			setError("Falha ao consultar preço. Tente novamente.");
		} finally {
			setLoading(null);
		}
	}

	return (
		<div className="space-y-6">
			<div className="grid gap-4 sm:grid-cols-2 max-w-2xl">
				<div className="space-y-2">
					<label
						htmlFor="fipe-type"
						className="block text-sm font-medium text-foreground"
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

				<div className="space-y-2">
					<label
						htmlFor="fipe-brand"
						className="block text-sm font-medium text-foreground"
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

				<div className="space-y-2 sm:col-span-2">
					<label
						htmlFor="fipe-model"
						className="block text-sm font-medium text-foreground"
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
				{loading === "price" ? "Consultando..." : "Consultar FIPE"}
			</Button>

			{error && (
				<ResultBox tone="warning">
					<p className="text-sm text-foreground">{error}</p>
				</ResultBox>
			)}

			{prices && prices.length > 0 && <PricesResult prices={prices} />}

			{prices && prices.length === 0 && (
				<ResultBox tone="warning">
					<p className="text-sm text-foreground">
						Nenhum preço encontrado para este modelo.
					</p>
				</ResultBox>
			)}
		</div>
	);
}

function PricesResult({ prices }: { prices: FipePrice[] }) {
	const first = prices[0];
	return (
		<div className="space-y-4">
			<ResultBox
				label={`${first.marca} · ${first.modelo}`}
				value={first.valor}
				hint={`Código FIPE ${first.codigoFipe} · Referência ${first.mesReferencia}`}
			/>

			{prices.length > 1 && (
				<div>
					<h3 className="mb-2 text-sm font-semibold text-foreground">
						Variações por ano e combustível
					</h3>
					<dl className="space-y-2 text-sm">
						{prices.map((p) => (
							<ResultRow
								key={`${p.anoModelo}-${p.siglaCombustivel}`}
								label={`${p.anoModelo} · ${p.combustivel}`}
								value={p.valor}
							/>
						))}
					</dl>
				</div>
			)}
		</div>
	);
}
