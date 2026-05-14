import { getModelos, type TipoVeiculo } from "@/lib/fipe/fipe-server";

export async function GET(
	_req: Request,
	{ params }: { params: Promise<{ tipo: string; codMarca: string }> },
) {
	const { tipo, codMarca } = await params;
	try {
		const data = await getModelos(tipo as TipoVeiculo, codMarca);
		return Response.json(data);
	} catch {
		return Response.json({ error: "Falha ao buscar modelos" }, { status: 500 });
	}
}
