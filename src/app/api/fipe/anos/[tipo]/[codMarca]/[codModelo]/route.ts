import { getAnos, type TipoVeiculo } from "@/lib/fipe/fipe-server";

export async function GET(
	_req: Request,
	{
		params,
	}: { params: Promise<{ tipo: string; codMarca: string; codModelo: string }> },
) {
	const { tipo, codMarca, codModelo } = await params;
	try {
		const data = await getAnos(tipo as TipoVeiculo, codMarca, codModelo);
		return Response.json(data);
	} catch {
		return Response.json({ error: "Falha ao buscar anos" }, { status: 500 });
	}
}
