export async function exportInventarioPdf(
	dataUrl: string,
	orientation: "portrait" | "landscape",
): Promise<void> {
	const { PDFDocument } = await import("pdf-lib");

	const doc = await PDFDocument.create();

	const A4_W = 595.28;
	const A4_H = 841.89;

	const page =
		orientation === "landscape"
			? doc.addPage([A4_H, A4_W])
			: doc.addPage([A4_W, A4_H]);

	const { width: pw, height: ph } = page.getSize();

	const base64 = dataUrl.split(",")[1];
	const pngBytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
	const pngImage = await doc.embedPng(pngBytes);

	page.drawImage(pngImage, { x: 0, y: 0, width: pw, height: ph });

	const bytes = await doc.save();
	const blob = new Blob([new Uint8Array(bytes)], { type: "application/pdf" });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = "controle-de-estoque.pdf";
	a.click();
	URL.revokeObjectURL(url);
}

export function exportInventarioPng(dataUrl: string): void {
	const a = document.createElement("a");
	a.href = dataUrl;
	a.download = "controle-de-estoque.png";
	a.click();
}
