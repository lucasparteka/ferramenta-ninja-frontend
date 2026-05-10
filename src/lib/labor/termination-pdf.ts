import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import type { TerminationResult } from "./termination";

type PdfMeta = {
	salary: number;
	admissionDate: string;
	terminationDate: string;
	terminationReason: string;
	noticeType: string;
};

const MUTED = rgb(0.45, 0.45, 0.45);
const INK = rgb(0.1, 0.1, 0.1);
const DIVIDER = rgb(0.88, 0.88, 0.88);
const HIGHLIGHT_BG = rgb(0.96, 0.98, 0.96);
const WARN_BG = rgb(0.99, 0.97, 0.93);

function formatBRL(value: number): string {
	return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

// WinAnsi (pdf-lib Helvetica) only encodes Latin-1. Replace chars outside that range.
function sanitizePdfText(s: string): string {
	let out = "";
	for (let i = 0; i < s.length; i++) {
		const code = s.charCodeAt(i);
		if (code === 0x202f || code === 0x00a0) {
			out += " "; // narrow/regular no-break space → space
		} else if (code === 0x2212 || code === 0x2014 || code === 0x2013) {
			out += "-"; // minus sign / em dash / en dash → hyphen
		} else if (code > 0xff) {
			out += "?"; // anything else outside Latin-1
		} else {
			out += s[i];
		}
	}
	return out;
}

function formatDate(iso: string): string {
	if (!iso) return "-";
	const [y, m, d] = iso.split("-");
	return `${d}/${m}/${y}`;
}

export async function generateTerminationPdf(
	result: TerminationResult,
	meta: PdfMeta,
): Promise<Uint8Array> {
	const doc = await PDFDocument.create();
	const regular = await doc.embedFont(StandardFonts.Helvetica);
	const bold = await doc.embedFont(StandardFonts.HelveticaBold);

	const pageWidth = 595; // A4
	const pageHeight = 842;
	const marginX = 50;
	const contentWidth = pageWidth - marginX * 2;

	let page = doc.addPage([pageWidth, pageHeight]);
	let y = pageHeight - 50;

	function ensureSpace(needed: number) {
		if (y - needed < 50) {
			page = doc.addPage([pageWidth, pageHeight]);
			y = pageHeight - 50;
		}
	}

	function drawText(
		text: string,
		x: number,
		yPos: number,
		size: number,
		font: typeof regular,
		color = INK,
	) {
		page.drawText(sanitizePdfText(text), { x, y: yPos, size, font, color });
	}

	function drawHRule(yPos: number, color = DIVIDER) {
		page.drawLine({
			start: { x: marginX, y: yPos },
			end: { x: pageWidth - marginX, y: yPos },
			thickness: 0.5,
			color,
		});
	}

	function drawRow(
		label: string,
		value: string,
		yPos: number,
		labelMuted = false,
		valueBold = false,
		valueColor = INK,
	) {
		const safeValue = sanitizePdfText(value);
		drawText(label, marginX, yPos, 9, labelMuted ? regular : regular, labelMuted ? MUTED : INK);
		const valueFont = valueBold ? bold : regular;
		const valueWidth = valueFont.widthOfTextAtSize(safeValue, 9);
		drawText(safeValue, pageWidth - marginX - valueWidth, yPos, 9, valueFont, valueColor);
	}

	// ── Header ────────────────────────────────────────────────────────────────
	drawText("Calculo de Rescisao Trabalhista", marginX, y, 18, bold, INK);
	y -= 18;
	drawText("Estimativa - Ferramenta Ninja", marginX, y, 9, regular, MUTED);

	const today = new Date().toLocaleDateString("pt-BR");
	const dateStr = `Gerado em ${today}`;
	const dateWidth = regular.widthOfTextAtSize(sanitizePdfText(dateStr), 8);
	drawText(dateStr, pageWidth - marginX - dateWidth, y, 8, regular, MUTED);

	y -= 18;
	drawHRule(y);
	y -= 16;

	// ── Dados do contrato ─────────────────────────────────────────────────────
	drawText("DADOS DO CONTRATO", marginX, y, 8, bold, MUTED);
	y -= 14;

	const contractRows: [string, string][] = [
		["Salario bruto mensal", formatBRL(meta.salary)],
		["Data de admissao", formatDate(meta.admissionDate)],
		["Data de rescisao", formatDate(meta.terminationDate)],
		["Motivo", meta.terminationReason],
		["Aviso previo", meta.noticeType],
	];

	for (const [label, value] of contractRows) {
		ensureSpace(14);
		drawRow(label, value, y);
		y -= 14;
	}

	y -= 6;
	drawHRule(y);
	y -= 16;

	// ── Detalhamento ──────────────────────────────────────────────────────────
	ensureSpace(24);
	drawText("DETALHAMENTO", marginX, y, 8, bold, MUTED);
	y -= 14;

	for (const line of result.lines) {
		ensureSpace(14);
		const isDeduction = line.amount < 0;
		drawRow(line.label, formatBRL(line.amount), y, isDeduction, false, isDeduction ? MUTED : INK);
		y -= 14;
	}

	y -= 4;
	drawHRule(y);
	y -= 14;

	// ── Deduções ──────────────────────────────────────────────────────────────
	ensureSpace(14);
	drawRow("(-) INSS", formatBRL(-result.inss), y, true, false, MUTED);
	y -= 14;
	ensureSpace(14);
	drawRow("(-) IRRF", formatBRL(-result.irrf), y, true, false, MUTED);
	y -= 8;
	drawHRule(y);
	y -= 8;

	// ── Total líquido ─────────────────────────────────────────────────────────
	ensureSpace(32);
	page.drawRectangle({
		x: marginX,
		y: y - 20,
		width: contentWidth,
		height: 28,
		color: HIGHLIGHT_BG,
	});
	drawText("Total liquido a receber", marginX + 8, y - 8, 10, bold, INK);
	const netStr = formatBRL(result.netTotal);
	const netWidth = bold.widthOfTextAtSize(sanitizePdfText(netStr), 10);
	drawText(netStr, pageWidth - marginX - netWidth - 8, y - 8, 10, bold, INK);
	y -= 36;

	// ── Meta ──────────────────────────────────────────────────────────────────
	ensureSpace(16);
	drawHRule(y + 8);
	y -= 8;
	drawText("INFORMACOES ADICIONAIS", marginX, y, 8, bold, MUTED);
	y -= 14;

	const months = result.monthsAtCompany % 12;
	const metaRows: [string, string][] = [
		["Tempo de empresa", `${result.yearsAtCompany} ano(s) e ${months} mes(es)`],
		["Aviso previo devido", `${result.noticeDays} dias`],
		...(result.fgtsWithdrawable > 0
			? ([["FGTS sacavel", formatBRL(result.fgtsWithdrawable)]] as [string, string][])
			: []),
		[
			"Seguro-desemprego",
			result.unemploymentInsuranceEligible ? "Com direito" : "Sem direito",
		],
	];

	for (const [label, value] of metaRows) {
		ensureSpace(14);
		drawRow(label, value, y, true);
		y -= 14;
	}

	// ── Disclaimer ────────────────────────────────────────────────────────────
	ensureSpace(52);
	y -= 10;
	page.drawRectangle({
		x: marginX,
		y: y - 34,
		width: contentWidth,
		height: 44,
		color: WARN_BG,
	});
	const disclaimer =
		"Estimativa orientativa baseada na CLT vigente. Para casos com insalubridade,";
	const disclaimer2 = "comissoes ou horas extras habituais, consulte um contador ou advogado.";
	drawText(disclaimer, marginX + 8, y - 8, 8, regular, MUTED);
	drawText(disclaimer2, marginX + 8, y - 20, 8, regular, MUTED);

	return doc.save();
}
