export async function exportMenuPdf(dataUrls: string[]): Promise<void> {
	const { PDFDocument } = await import("pdf-lib");

	const doc = await PDFDocument.create();

	for (const dataUrl of dataUrls) {
		const page = doc.addPage([595.28, 841.89]);
		const base64 = dataUrl.split(",")[1];
		const pngBytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
		const pngImage = await doc.embedPng(pngBytes);
		page.drawImage(pngImage, { x: 0, y: 0, width: 595.28, height: 841.89 });
	}

	const bytes = await doc.save();
	const blob = new Blob([new Uint8Array(bytes)], { type: "application/pdf" });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = "cardapio.pdf";
	a.click();
	URL.revokeObjectURL(url);
}

export async function exportMenuPng(dataUrls: string[]): Promise<void> {
	for (let i = 0; i < dataUrls.length; i++) {
		const a = document.createElement("a");
		a.href = dataUrls[i];
		a.download = dataUrls.length > 1 ? `cardapio-pagina-${i + 1}.png` : "cardapio.png";
		a.click();
		if (i < dataUrls.length - 1) {
			await new Promise<void>((resolve) => setTimeout(resolve, 200));
		}
	}
}
