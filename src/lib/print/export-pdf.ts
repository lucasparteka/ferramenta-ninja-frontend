import { A4_PT, BLEED_PT, CARD_PT } from "./dimensions";
import { generateA4GridPt, type LayoutMode } from "./layout";

export async function exportPdf(
	cardDataUrl: string,
	filename: string,
	mode: LayoutMode,
): Promise<void> {
	const { PDFDocument, rgb } = await import("pdf-lib");

	const doc = await PDFDocument.create();
	const page = doc.addPage([A4_PT.width, A4_PT.height]);

	const base64 = cardDataUrl.split(",")[1];
	if (!base64) throw new Error("Invalid card data URL");

	const pngBytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
	const pngImage = await doc.embedPng(pngBytes);

	const positions = generateA4GridPt(mode);

	for (const { x, y } of positions) {
		page.drawImage(pngImage, {
			x: x + BLEED_PT,
			y: y + BLEED_PT,
			width: CARD_PT.bleedWidth - BLEED_PT * 2,
			height: CARD_PT.bleedHeight - BLEED_PT * 2,
		});

		page.drawRectangle({
			x: x + BLEED_PT,
			y: y + BLEED_PT,
			width: CARD_PT.bleedWidth - BLEED_PT * 2,
			height: CARD_PT.bleedHeight - BLEED_PT * 2,
			borderColor: rgb(0.7, 0.7, 0.7),
			borderWidth: 0.5,
			color: undefined,
			opacity: 0,
		});
	}

	const bytes = await doc.save();
	const blob = new Blob([new Uint8Array(bytes)], { type: "application/pdf" });
	const url = URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.href = url;
	link.download = filename;
	link.click();
	URL.revokeObjectURL(url);
}
