export async function exportChecklistPdf(dataUrl: string): Promise<void> {
	const { PDFDocument } = await import("pdf-lib");

	const doc = await PDFDocument.create();
	const page = doc.addPage([595.28, 841.89]);

	const base64 = dataUrl.split(",")[1];
	const pngBytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
	const pngImage = await doc.embedPng(pngBytes);

	page.drawImage(pngImage, { x: 0, y: 0, width: 595.28, height: 841.89 });

	const bytes = await doc.save();
	const blob = new Blob([new Uint8Array(bytes)], { type: "application/pdf" });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = "checklist.pdf";
	a.click();
	URL.revokeObjectURL(url);
}

export function exportChecklistPng(dataUrl: string): void {
	const a = document.createElement("a");
	a.href = dataUrl;
	a.download = "checklist.png";
	a.click();
}
