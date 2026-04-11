import { type NextRequest, NextResponse } from "next/server";
import { PDFDocument, PDFName } from "pdf-lib";
import { withPage } from "@/lib/browser-pool";
import { getResumeById } from "@/services/resume";
import { pb } from "@/services/pocketbase";
import {
  TEMPLATE_IDS,
  TEMPLATE_DEFAULT_COLORS,
} from "@/components/resume-templates/config";
import type { TemplateId } from "@/components/resume-templates/config";

// Only run on Node.js runtime (Puppeteer is not compatible with the Edge runtime)
export const runtime = "nodejs";

// Never cache PDF responses
export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const sp = request.nextUrl.searchParams;

  // Auth check — require a valid PocketBase session token
  const authHeader = request.headers.get("authorization") ?? "";
  const token = authHeader.replace(/^Bearer\s+/i, "");
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Verify resume exists and belongs to the authenticated user
  pb.authStore.save(token, null);
  await pb
    .collection("users")
    .authRefresh()
    .catch(() => {
      pb.authStore.clear();
    });

  if (!pb.authStore.isValid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const resume = await getResumeById(id);
  if (!resume) {
    return NextResponse.json({ error: "Resume not found" }, { status: 404 });
  }

  if (resume.user !== pb.authStore.record?.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Template + color from query params
  const templateId: TemplateId = TEMPLATE_IDS.includes(
    sp.get("template") as TemplateId,
  )
    ? (sp.get("template") as TemplateId)
    : "classic";

  const color = sp.get("color") ?? TEMPLATE_DEFAULT_COLORS[templateId];

  // Build the internal render URL
  const secret = process.env.PDF_RENDER_SECRET!;
  const baseUrl = process.env.INTERNAL_URL!;
  const font = sp.get("font") ?? "";
  const zoom = sp.get("zoom") ?? "1";

  const renderUrl =
    `${baseUrl}/curriculo-pdf/${id}` +
    `?template=${templateId}` +
    `&color=${encodeURIComponent(color)}` +
    `&font=${encodeURIComponent(font)}` +
    `&zoom=${encodeURIComponent(zoom)}` +
    `&secret=${encodeURIComponent(secret)}`;

  // Generate PDF via the browser pool
  let pdfBuffer: Buffer;
  try {
    pdfBuffer = await withPage(async (page) => {
      await page.goto(renderUrl, {
        waitUntil: "networkidle0",
        timeout: 30_000,
      });

      // Wait for fonts to finish loading
      await page.evaluateHandle("document.fonts.ready");

      const buf = await page.pdf({
        format: "A4",
        printBackground: true,
        margin: { top: "15mm", bottom: "15mm", left: "0mm", right: "0mm" },
      });

      // Strip PDF metadata (Chromium embeds the render URL — including the
      // secret — into the generated file; remove it before serving).
      const pdfDoc = await PDFDocument.load(buf);
      pdfDoc.setTitle("");
      pdfDoc.setAuthor("");
      pdfDoc.setSubject("");
      pdfDoc.setKeywords([]);
      pdfDoc.setProducer("");
      pdfDoc.setCreator("");
      pdfDoc.catalog.delete(PDFName.of("Metadata")); // removes XMP metadata

      return Buffer.from(await pdfDoc.save());
    });
  } catch (err) {
    console.error("[PDF] generation failed:", err);
    return NextResponse.json(
      { error: "PDF generation failed" },
      { status: 500 },
    );
  }

  const candidateName = resume.name ?? "curriculo";
  const filename = `curriculo-${candidateName.toLowerCase().replace(/\s+/g, "-")}.pdf`;

  return new NextResponse(new Uint8Array(pdfBuffer), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Content-Length": String(pdfBuffer.length),
    },
  });
}
