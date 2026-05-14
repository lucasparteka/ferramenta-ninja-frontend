const FIPE_API = "https://veiculos.fipe.org.br/api/veiculos";

const HEADERS = {
	"Content-Type": "application/json",
	Referer: "https://veiculos.fipe.org.br",
	Origin: "https://veiculos.fipe.org.br",
};

export type TipoVeiculo = "carros" | "motos" | "caminhoes";

const TIPO_CODE: Record<TipoVeiculo, number> = {
	carros: 1,
	motos: 2,
	caminhoes: 3,
};

export async function getRefCode(): Promise<number> {
	const res = await fetch(`${FIPE_API}/ConsultarTabelaDeReferencia`, {
		method: "POST",
		headers: HEADERS,
		body: JSON.stringify({}),
	});
	const data = (await res.json()) as { Codigo: number; Mes: string }[];
	return data[0].Codigo;
}

export async function getMarcas(
	tipo: TipoVeiculo,
): Promise<{ nome: string; codigo: string }[]> {
	const ref = await getRefCode();
	const res = await fetch(`${FIPE_API}/ConsultarMarcas`, {
		method: "POST",
		headers: HEADERS,
		body: JSON.stringify({
			codigoTabelaReferencia: ref,
			codigoTipoVeiculo: TIPO_CODE[tipo],
		}),
	});
	const data = (await res.json()) as { Label: string; Value: string }[];
	return data.map((d) => ({ nome: d.Label, codigo: d.Value }));
}

export async function getModelos(
	tipo: TipoVeiculo,
	codMarca: string,
): Promise<{ nome: string; codigo: number }[]> {
	const ref = await getRefCode();
	const res = await fetch(`${FIPE_API}/ConsultarModelos`, {
		method: "POST",
		headers: HEADERS,
		body: JSON.stringify({
			codigoTabelaReferencia: ref,
			codigoTipoVeiculo: TIPO_CODE[tipo],
			codigoMarca: Number(codMarca),
		}),
	});
	const data = (await res.json()) as {
		Modelos: { Label: string; Value: number }[];
	};
	return data.Modelos.map((m) => ({ nome: m.Label, codigo: m.Value }));
}

export async function getAnos(
	tipo: TipoVeiculo,
	codMarca: string,
	codModelo: string,
): Promise<{ nome: string; codigo: string }[]> {
	const ref = await getRefCode();
	const res = await fetch(`${FIPE_API}/ConsultarAnoModelo`, {
		method: "POST",
		headers: HEADERS,
		body: JSON.stringify({
			codigoTabelaReferencia: ref,
			codigoTipoVeiculo: TIPO_CODE[tipo],
			codigoMarca: Number(codMarca),
			codigoModelo: Number(codModelo),
		}),
	});
	const data = (await res.json()) as { Label: string; Value: string }[];
	return data.map((d) => ({ nome: d.Label, codigo: d.Value }));
}

export async function getPreco(
	tipo: TipoVeiculo,
	codMarca: string,
	codModelo: string,
	ano: string,
): Promise<{
	valor: string;
	marca: string;
	modelo: string;
	anoModelo: number;
	combustivel: string;
	codigoFipe: string;
	mesReferencia: string;
	tipoVeiculo: number;
	siglaCombustivel: string;
}> {
	const ref = await getRefCode();
	const [anoStr, combustivelStr] = ano.split("-");
	const res = await fetch(`${FIPE_API}/ConsultarValorComTodosParametros`, {
		method: "POST",
		headers: HEADERS,
		body: JSON.stringify({
			codigoTabelaReferencia: ref,
			codigoTipoVeiculo: TIPO_CODE[tipo],
			codigoMarca: Number(codMarca),
			codigoModelo: Number(codModelo),
			codigoAnoDiesel: 0,
			ano,
			codigoTipoCombustivel: Number(combustivelStr),
			anoModelo: Number(anoStr),
			modeloCodigoExterno: "",
			tipoConsulta: "tradicional",
		}),
	});
	const d = (await res.json()) as {
		Valor: string;
		Marca: string;
		Modelo: string;
		AnoModelo: number;
		Combustivel: string;
		CodigoFipe: string;
		MesReferencia: string;
		TipoVeiculo: number;
		SiglaCombustivel: string;
		erro?: string;
	};
	if (d.erro) throw new Error(d.erro);
	return {
		valor: d.Valor,
		marca: d.Marca,
		modelo: d.Modelo,
		anoModelo: d.AnoModelo,
		combustivel: d.Combustivel,
		codigoFipe: d.CodigoFipe,
		mesReferencia: d.MesReferencia.trim(),
		tipoVeiculo: d.TipoVeiculo,
		siglaCombustivel: d.SiglaCombustivel,
	};
}
