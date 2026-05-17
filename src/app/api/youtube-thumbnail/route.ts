import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
	const url = req.nextUrl.searchParams.get("url");

	if (!url || !url.startsWith("https://img.youtube.com/vi/")) {
		return NextResponse.json({ error: "URL inválida" }, { status: 400 });
	}

	const res = await fetch(url, { next: { revalidate: 3600 } });

	if (!res.ok) {
		return NextResponse.json({ error: "Thumbnail não encontrada" }, { status: 404 });
	}

	const blob = await res.blob();
	const filename = url.split("/").pop() ?? "thumbnail.jpg";

	return new NextResponse(blob, {
		headers: {
			"Content-Type": "image/jpeg",
			"Content-Disposition": `attachment; filename="${filename}"`,
			"Cache-Control": "public, max-age=3600",
		},
	});
}
