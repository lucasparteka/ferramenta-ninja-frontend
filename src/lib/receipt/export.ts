import type { Color, PDFFont, PDFPage } from "pdf-lib";
import type { ReceiptFormValues } from "@/components/tools/receipt/receipt-client";
import { A4_PT } from "@/lib/print/dimensions";
import { formatLocationLine, formatReceiptBody, formatValor } from "./format";

const MARGIN_X = 72;

function drawWrappedText(
	page: PDFPage,
	text: string,
	opts: {
		x: number;
		y: number;
		font: PDFFont;
		size: number;
		maxWidth: number;
		lineHeight: number;
		color: Color;
	},
): number {
	const { x, font, size, maxWidth, lineHeight, color } = opts;
	let currentY = opts.y;
	const words = text.split(" ");
	let line = "";

	for (const word of words) {
		const testLine = line ? `${line} ${word}` : word;
		const testWidth = font.widthOfTextAtSize(testLine, size);

		if (testWidth > maxWidth && line) {
			page.drawText(line, { x, y: currentY, font, size, color });
			currentY -= lineHeight;
			line = word;
		} else {
			line = testLine;
		}
	}

	if (line) {
		page.drawText(line, { x, y: currentY, font, size, color });
		currentY -= lineHeight;
	}

	return currentY;
}

export async function exportReceiptPdf(
	values: ReceiptFormValues,
): Promise<void> {
	const { PDFDocument, StandardFonts, rgb } = await import("pdf-lib");

	const doc = await PDFDocument.create();
	const page = doc.addPage([A4_PT.width, A4_PT.height]);

	const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);
	const fontReg = await doc.embedFont(StandardFonts.Helvetica);

	const pageWidth = A4_PT.width;
	const maxWidth = pageWidth - MARGIN_X * 2;
	const black = rgb(0, 0, 0);
	const grayColor = rgb(0.4, 0.4, 0.4);

	const title = "RECIBO";
	const titleSize = 24;
	const titleWidth = fontBold.widthOfTextAtSize(title, titleSize);
	const titleX = (pageWidth - titleWidth) / 2;
	const titleY = 756;

	page.drawText(title, {
		x: titleX,
		y: titleY,
		font: fontBold,
		size: titleSize,
		color: black,
	});

	page.drawLine({
		start: { x: MARGIN_X, y: titleY - 18 },
		end: { x: pageWidth - MARGIN_X, y: titleY - 18 },
		thickness: 0.5,
		color: grayColor,
	});

	const bodyText = formatReceiptBody(values);
	let currentY = drawWrappedText(page, bodyText, {
		x: MARGIN_X,
		y: titleY - 50,
		font: fontReg,
		size: 12,
		maxWidth,
		lineHeight: 20,
		color: black,
	});

	currentY -= 20;

	if (values.formaPagamento) {
		page.drawText(`Forma de pagamento: ${values.formaPagamento}`, {
			x: MARGIN_X,
			y: currentY,
			font: fontReg,
			size: 11,
			color: grayColor,
		});
		currentY -= 40;
	}

	page.drawText(formatLocationLine(values), {
		x: MARGIN_X,
		y: currentY,
		font: fontReg,
		size: 12,
		color: black,
	});

	currentY -= 50;

	page.drawLine({
		start: { x: MARGIN_X, y: currentY },
		end: { x: MARGIN_X + 220, y: currentY },
		thickness: 0.5,
		color: black,
	});

	page.drawText(values.nomeRecebedor, {
		x: MARGIN_X,
		y: currentY - 16,
		font: fontReg,
		size: 11,
		color: black,
	});

	const valorLabel = `R$ ${formatValor(values.valor)}`;
	const valorLabelWidth = fontReg.widthOfTextAtSize(valorLabel, 10);
	page.drawText(valorLabel, {
		x: pageWidth - MARGIN_X - valorLabelWidth,
		y: currentY - 16,
		font: fontReg,
		size: 10,
		color: grayColor,
	});

	const bytes = await doc.save();
	const blob = new Blob([new Uint8Array(bytes)], { type: "application/pdf" });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = "recibo.pdf";
	a.click();
	URL.revokeObjectURL(url);
}
