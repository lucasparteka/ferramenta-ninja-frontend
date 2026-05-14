import { getMarcas, type TipoVeiculo } from "@/lib/fipe/fipe-server";

export async function GET(
	_req: Request,
	{ params }: { params: Promise<{ tipo: string }> },
) {
	const { tipo } = await params;
	try {
		const data = await getMarcas(tipo as TipoVeiculo);
		return Response.json(data);
	} catch {
		return Response.json({ error: "Falha ao buscar marcas" }, { status: 500 });
	}
}
