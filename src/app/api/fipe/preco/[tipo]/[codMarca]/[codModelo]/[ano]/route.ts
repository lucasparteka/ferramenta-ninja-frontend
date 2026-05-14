import { getPreco, type TipoVeiculo } from "@/lib/fipe/fipe-server";

export async function GET(
	_req: Request,
	{
		params,
	}: {
		params: Promise<{
			tipo: string;
			codMarca: string;
			codModelo: string;
			ano: string;
		}>;
	},
) {
	const { tipo, codMarca, codModelo, ano } = await params;
	try {
		const data = await getPreco(
			tipo as TipoVeiculo,
			codMarca,
			codModelo,
			ano,
		);
		return Response.json(data);
	} catch {
		return Response.json({ error: "Falha ao consultar preço" }, { status: 500 });
	}
}
