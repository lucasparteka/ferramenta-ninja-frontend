import { NextResponse } from "next/server";
import { withPage } from "@/lib/curriculo/browser-pool";
import type { RenderPayload } from "@/lib/curriculo/temp-store";
import { setTempData } from "@/lib/curriculo/temp-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
	let payload: RenderPayload;

	try {
		payload = await request.json();
	} catch {
		return NextResponse.json({ error: "Payload inválido" }, { status: 400 });
	}

	const { formData, layout, photoDataUrl } = payload;

	if (!formData || !layout) {
		return NextResponse.json(
			{ error: "Dados do currículo ausentes" },
			{ status: 400 },
		);
	}

	const token = crypto.randomUUID();
	setTempData(token, { formData, layout, photoDataUrl });

	const baseUrl =
		process.env.INTERNAL_URL ??
		process.env.NEXT_PUBLIC_SITE_URL ??
		"http://localhost:3000";
	const renderUrl = `${baseUrl}/curriculo-render/${token}`;

	try {
		const pdfBuffer = await withPage(async (page) => {
			await page.goto(renderUrl, {
				waitUntil: "networkidle0",
				timeout: 30_000,
			});
			await page.evaluateHandle("document.fonts.ready");

			return page.pdf({
				format: "A4",
				printBackground: true,
				margin: { top: "0", right: "0", bottom: "0", left: "0" },
			});
		});

		const name = formData.name
			? `curriculo-${formData.name.toLowerCase().replace(/\s+/g, "-")}.pdf`
			: "curriculo.pdf";

		return new Response(Buffer.from(pdfBuffer), {
			status: 200,
			headers: {
				"Content-Type": "application/pdf",
				"Content-Disposition": `attachment; filename="${name}"`,
				"Cache-Control": "no-store",
			},
		});
	} catch (err) {
		console.error("[gerar-pdf] Puppeteer error:", err);
		return NextResponse.json(
			{ error: "Falha ao gerar o PDF. Tente novamente." },
			{ status: 500 },
		);
	}
}
