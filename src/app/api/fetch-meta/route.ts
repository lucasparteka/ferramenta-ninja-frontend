import { NextResponse } from "next/server";

function extractMeta(html: string, name: string) {
	const regex = new RegExp(
		`<meta[^>]*name=["']${name}["'][^>]*content=["']([^"']*)["']`,
		"i",
	);
	return html.match(regex)?.[1] || "";
}

function extractOg(html: string, property: string) {
	const regex = new RegExp(
		`<meta[^>]*property=["']${property}["'][^>]*content=["']([^"']*)["']`,
		"i",
	);
	return html.match(regex)?.[1] || "";
}

function extractTitle(html: string) {
	return html.match(/<title[^>]*>(.*?)<\/title>/i)?.[1] || "";
}

export async function GET(req: Request) {
	const { searchParams } = new URL(req.url);
	const url = searchParams.get("url");

	if (!url) {
		return NextResponse.json({ error: "URL não informada" }, { status: 400 });
	}

	try {
		const res = await fetch(url, {
			headers: {
				"User-Agent": "Mozilla/5.0",
			},
		});

		const html = await res.text();

		const title = extractOg(html, "og:title") || extractTitle(html) || "";
		const description =
			extractOg(html, "og:description") ||
			extractMeta(html, "description") ||
			"";

		return NextResponse.json({
			title,
			description,
			url,
		});
	} catch {
		return NextResponse.json(
			{ error: "Não foi possível acessar a URL" },
			{ status: 500 },
		);
	}
}
