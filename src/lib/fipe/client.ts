export type VehicleType = "carros" | "motos" | "caminhoes";

export type FipeBrand = {
	nome: string;
	valor: string;
};

export type FipeModel = {
	modelo: string;
	codigo: string;
};

export type FipePrice = {
	valor: string;
	marca: string;
	modelo: string;
	anoModelo: number;
	combustivel: string;
	codigoFipe: string;
	mesReferencia: string;
	tipoVeiculo: number;
	siglaCombustivel: string;
};

const BASE = "https://brasilapi.com.br/api/fipe";

export async function fetchBrands(type: VehicleType): Promise<FipeBrand[]> {
	const response = await fetch(`${BASE}/marcas/v1/${type}`);
	if (!response.ok) throw new Error("Falha ao buscar marcas");
	return (await response.json()) as FipeBrand[];
}

export async function fetchModels(
	type: VehicleType,
	brandCode: string,
): Promise<FipeModel[]> {
	const response = await fetch(`${BASE}/veiculos/v1/${type}/${brandCode}`);
	if (!response.ok) throw new Error("Falha ao buscar modelos");
	return (await response.json()) as FipeModel[];
}

export async function fetchPrice(fipeCode: string): Promise<FipePrice[]> {
	const response = await fetch(`${BASE}/preco/v1/${fipeCode}`);
	if (!response.ok) throw new Error("Falha ao consultar preço");
	return (await response.json()) as FipePrice[];
}
