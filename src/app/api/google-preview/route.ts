import * as cheerio from "cheerio";
import { NextResponse } from "next/server";

function normalizeUrl(url: string) {
	if (!url.startsWith("http://") && !url.startsWith("https://")) {
		return `https://${url}`;
	}
	return url;
}

export async function POST(req: Request) {
	try {
		const { url } = await req.json();

		if (!url) {
			return NextResponse.json({ error: "URL obrigatória" }, { status: 400 });
		}

		const normalizedUrl = normalizeUrl(url);

		const res = await fetch(normalizedUrl, {
			headers: {
				"User-Agent": "Mozilla/5.0",
			},
		});

		const html = await res.text();
		const $ = cheerio.load(html);

		const title = $("title").text() || "";
		const description = $('meta[name="description"]').attr("content") || "";

		return NextResponse.json({
			title,
			description,
			url,
		});
	} catch {
		return NextResponse.json(
			{ error: "Erro ao processar URL" },
			{ status: 500 },
		);
	}
}
