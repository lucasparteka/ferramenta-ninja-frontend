export type VehicleType = "carros" | "motos" | "caminhoes";

export type FipeBrand = {
	nome: string;
	codigo: string;
};

export type FipeModel = {
	nome: string;
	codigo: number;
};

export type FipeYear = {
	nome: string;
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

export async function fetchBrands(type: VehicleType): Promise<FipeBrand[]> {
	const res = await fetch(`/api/fipe/marcas/${type}`);
	if (!res.ok) throw new Error("Falha ao buscar marcas");
	return res.json() as Promise<FipeBrand[]>;
}

export async function fetchModels(
	type: VehicleType,
	brandCode: string,
): Promise<FipeModel[]> {
	const res = await fetch(`/api/fipe/modelos/${type}/${brandCode}`);
	if (!res.ok) throw new Error("Falha ao buscar modelos");
	return res.json() as Promise<FipeModel[]>;
}

export async function fetchYears(
	type: VehicleType,
	brandCode: string,
	modelCode: string,
): Promise<FipeYear[]> {
	const res = await fetch(`/api/fipe/anos/${type}/${brandCode}/${modelCode}`);
	if (!res.ok) throw new Error("Falha ao buscar anos");
	return res.json() as Promise<FipeYear[]>;
}

export async function fetchPrice(
	type: VehicleType,
	brandCode: string,
	modelCode: string,
	year: string,
): Promise<FipePrice> {
	const res = await fetch(
		`/api/fipe/preco/${type}/${brandCode}/${modelCode}/${year}`,
	);
	if (!res.ok) throw new Error("Falha ao consultar preço");
	return res.json() as Promise<FipePrice>;
}
