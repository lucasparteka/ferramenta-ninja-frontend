import type { OrdemServicoState } from "./types";

export const CANVAS_WIDTH = 1240;
export const CANVAS_HEIGHT = 1754;

const MARGIN = 64;
const CONTENT_WIDTH = CANVAS_WIDTH - MARGIN * 2;
const FONT = "Inter, system-ui, Arial, sans-serif";

const COLOR_BG = "#ffffff";
const COLOR_HEADER_BG = "#1a1a1a";
const COLOR_SECTION_LABEL = "#555555";
const COLOR_CARD_BG = "#f7f7f7";
const COLOR_CARD_BORDER = "#e5e5e5";
const COLOR_LABEL = "#888888";
const COLOR_VALUE = "#1a1a1a";
const COLOR_DIVIDER = "#e5e5e5";
const COLOR_FOOTER = "#aaaaaa";
const COLOR_TABLE_HEADER = "#888888";

const LABEL_SIZE = 22;
const VALUE_SIZE = 26;
const VALUE_LINE_H = 36;
const ROW_TOP_PAD = 6;
const ROW_LABEL_TO_VALUE = 6;
const ROW_BOTTOM_PAD = 12;

function rowHeight(lineCount: number): number {
	return (
		ROW_TOP_PAD +
		LABEL_SIZE +
		ROW_LABEL_TO_VALUE +
		lineCount * VALUE_LINE_H +
		ROW_BOTTOM_PAD
	);
}

function drawRoundedRect(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	w: number,
	h: number,
	r: number,
): void {
	ctx.beginPath();
	ctx.moveTo(x + r, y);
	ctx.lineTo(x + w - r, y);
	ctx.arcTo(x + w, y, x + w, y + r, r);
	ctx.lineTo(x + w, y + h - r);
	ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
	ctx.lineTo(x + r, y + h);
	ctx.arcTo(x, y + h, x, y + h - r, r);
	ctx.lineTo(x, y + r);
	ctx.arcTo(x, y, x + r, y, r);
	ctx.closePath();
}

function drawCard(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	w: number,
	h: number,
): void {
	ctx.save();
	drawRoundedRect(ctx, x, y, w, h, 10);
	ctx.fillStyle = COLOR_CARD_BG;
	ctx.fill();
	ctx.strokeStyle = COLOR_CARD_BORDER;
	ctx.lineWidth = 1;
	ctx.stroke();
	ctx.restore();
}

function drawSectionLabel(
	ctx: CanvasRenderingContext2D,
	text: string,
	x: number,
	y: number,
): void {
	ctx.save();
	ctx.fillStyle = COLOR_SECTION_LABEL;
	ctx.font = `600 22px ${FONT}`;
	ctx.textBaseline = "middle";
	ctx.textAlign = "left";
	ctx.letterSpacing = "2px";
	ctx.fillText(text.toUpperCase(), x, y);
	ctx.letterSpacing = "0px";
	ctx.restore();
}

function getLines(
	ctx: CanvasRenderingContext2D,
	text: string,
	maxWidth: number,
): string[] {
	if (!text.trim()) return ["—"];
	const result: string[] = [];
	for (const paragraph of text.split("\n")) {
		const words = paragraph.split(" ");
		let line = "";
		for (const word of words) {
			const test = line ? `${line} ${word}` : word;
			if (ctx.measureText(test).width > maxWidth && line) {
				result.push(line);
				line = word;
			} else {
				line = test;
			}
		}
		result.push(line);
	}
	return result.length > 0 ? result : ["—"];
}

function formatCurrency(value: number): string {
	return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatDate(iso: string): string {
	if (!iso) return "";
	const [year, month, day] = iso.split("-");
	return `${day}/${month}/${year}`;
}

function formatDateLong(iso: string): string {
	if (!iso) return "";
	try {
		const date = new Date(`${iso}T12:00:00`);
		return date.toLocaleDateString("pt-BR", {
			day: "numeric",
			month: "long",
			year: "numeric",
		});
	} catch {
		return formatDate(iso);
	}
}

export function renderOrdemServico(
	ctx: CanvasRenderingContext2D,
	state: OrdemServicoState,
	logoImg?: HTMLImageElement,
): void {
	const { numero, prestador, cliente, resumo, itens, observacoes } = state;

	ctx.fillStyle = COLOR_BG;
	ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

	let y = MARGIN;

	const hPadH = 40;
	const hPadV = 36;
	const empresaFontSize = prestador.empresa.length > 30 ? 36 : 46;
	const hasLogo = !!logoImg;
	const logoAreaW = hasLogo ? 220 : 0;
	const textMaxW = CONTENT_WIDTH - hPadH * 2 - (hasLogo ? logoAreaW + 24 : 0);

	const osLabelH = 36;
	const empresaH = prestador.empresa ? empresaFontSize + 18 : 0;
	const metaLineH = 34;
	const metaCount = (prestador.cnpjCpf ? 1 : 0) + (prestador.endereco ? 1 : 0);
	const headerContentH = osLabelH + empresaH + metaCount * metaLineH;
	const logoMinH = hasLogo ? 180 : 0;
	const headerHeight = Math.max(logoMinH, hPadV * 2 + headerContentH);

	drawRoundedRect(ctx, MARGIN, y, CONTENT_WIDTH, headerHeight, 16);
	ctx.fillStyle = COLOR_HEADER_BG;
	ctx.fill();

	ctx.save();
	ctx.fillStyle = "#999999";
	ctx.font = `500 20px ${FONT}`;
	ctx.textBaseline = "middle";
	ctx.textAlign = "left";
	ctx.letterSpacing = "3px";
	ctx.fillText("ORDEM DE SERVIÇO", MARGIN + hPadH, y + hPadV + 14);
	ctx.letterSpacing = "0px";

	let hCurY = y + hPadV + osLabelH;

	if (prestador.empresa) {
		ctx.fillStyle = "#ffffff";
		ctx.font = `bold ${empresaFontSize}px ${FONT}`;
		ctx.textBaseline = "alphabetic";
		ctx.fillText(
			prestador.empresa,
			MARGIN + hPadH,
			hCurY + empresaFontSize,
			textMaxW,
		);
		hCurY += empresaFontSize + 18;
	}

	ctx.fillStyle = "#cccccc";
	ctx.font = `400 24px ${FONT}`;
	ctx.textBaseline = "alphabetic";

	if (prestador.cnpjCpf) {
		ctx.fillText(prestador.cnpjCpf, MARGIN + hPadH, hCurY + 24, textMaxW);
		hCurY += metaLineH;
	}

	if (prestador.endereco) {
		ctx.fillText(prestador.endereco, MARGIN + hPadH, hCurY + 24, textMaxW);
	}

	if (logoImg) {
		const logoMaxH = headerHeight - hPadV * 2;
		const logoMaxW = logoAreaW;
		const aspect = logoImg.naturalWidth / logoImg.naturalHeight;
		const lH = Math.min(logoMaxH, logoMaxW / aspect);
		const lW = lH * aspect;
		const lX = MARGIN + CONTENT_WIDTH - hPadH - lW;
		const lY = y + (headerHeight - lH) / 2;
		ctx.drawImage(logoImg, lX, lY, lW, lH);
	}

	ctx.restore();

	y += headerHeight + 48;

	drawSectionLabel(ctx, "Cliente", MARGIN, y + 14);
	y += 40;

	const cPadH = 32;
	const cPadV = 28;
	const cHalfW = CONTENT_WIDTH / 2 - cPadH - 16;
	const cRow1H = rowHeight(1);
	const cEmailH = cliente.email ? rowHeight(1) : 0;
	const cCardH = cPadV * 2 + cRow1H + cEmailH;

	drawCard(ctx, MARGIN, y, CONTENT_WIDTH, cCardH);

	const c1X = MARGIN + cPadH;
	const c2X = MARGIN + CONTENT_WIDTH / 2 + 16;

	ctx.save();
	ctx.textBaseline = "alphabetic";
	ctx.textAlign = "left";

	const cLabelY1 = y + cPadV + ROW_TOP_PAD + LABEL_SIZE;
	const cValueY1 =
		y + cPadV + ROW_TOP_PAD + LABEL_SIZE + ROW_LABEL_TO_VALUE + VALUE_SIZE;

	ctx.fillStyle = COLOR_LABEL;
	ctx.font = `500 ${LABEL_SIZE}px ${FONT}`;
	ctx.letterSpacing = "1.5px";
	ctx.fillText("NOME", c1X, cLabelY1);
	ctx.fillText("CONTATO", c2X, cLabelY1);
	ctx.letterSpacing = "0px";

	ctx.fillStyle = COLOR_VALUE;
	ctx.font = `400 ${VALUE_SIZE}px ${FONT}`;
	ctx.fillText(cliente.nome || "—", c1X, cValueY1, cHalfW);
	ctx.fillText(cliente.contato || "—", c2X, cValueY1, cHalfW);

	if (cliente.email) {
		const emailRowY = y + cPadV + cRow1H;
		ctx.fillStyle = COLOR_LABEL;
		ctx.font = `500 ${LABEL_SIZE}px ${FONT}`;
		ctx.letterSpacing = "1.5px";
		ctx.fillText("E-MAIL", c1X, emailRowY + ROW_TOP_PAD + LABEL_SIZE);
		ctx.letterSpacing = "0px";

		ctx.fillStyle = COLOR_VALUE;
		ctx.font = `400 ${VALUE_SIZE}px ${FONT}`;
		ctx.fillText(
			cliente.email,
			c1X,
			emailRowY + ROW_TOP_PAD + LABEL_SIZE + ROW_LABEL_TO_VALUE + VALUE_SIZE,
			CONTENT_WIDTH - cPadH * 2,
		);
	}

	ctx.restore();

	y += cCardH + 40;

	drawSectionLabel(ctx, "Resumo", MARGIN, y + 14);
	y += 40;

	const rPadH = 32;
	const rPadV = 28;
	const rMaxW = CONTENT_WIDTH - rPadH * 2;
	const rHalfW = CONTENT_WIDTH / 2 - rPadH - 16;

	type RRow = { label: string; value: string };
	const rRowsBefore: RRow[] = [
		{ label: "TÍTULO", value: resumo.titulo },
		{ label: "DESCRIÇÃO", value: resumo.descricao },
	];
	const rRowsAfter: RRow[] = [];
	if (resumo.formaPagamento)
		rRowsAfter.push({
			label: "FORMA DE PAGAMENTO",
			value: resumo.formaPagamento,
		});

	const hasDateRow = !!(resumo.dataAbertura || resumo.prazo);
	const dateRowH = hasDateRow ? rowHeight(1) : 0;

	ctx.font = `400 ${VALUE_SIZE}px ${FONT}`;
	const rBeforeLines = rRowsBefore.map(({ value }) =>
		getLines(ctx, value, rMaxW),
	);
	const rAfterLines = rRowsAfter.map(({ value }) =>
		getLines(ctx, value, rMaxW),
	);
	const rBeforeHeights = rBeforeLines.map((lines) => rowHeight(lines.length));
	const rAfterHeights = rAfterLines.map((lines) => rowHeight(lines.length));

	const rCardH =
		rPadV * 2 +
		rBeforeHeights.reduce((a, b) => a + b, 0) +
		dateRowH +
		rAfterHeights.reduce((a, b) => a + b, 0);

	drawCard(ctx, MARGIN, y, CONTENT_WIDTH, rCardH);

	ctx.save();
	ctx.textBaseline = "alphabetic";
	ctx.textAlign = "left";

	let rCurY = y + rPadV;

	function drawRRow(label: string, lines: string[], x: number, maxW: number) {
		ctx.fillStyle = COLOR_LABEL;
		ctx.font = `500 ${LABEL_SIZE}px ${FONT}`;
		ctx.letterSpacing = "1.5px";
		ctx.fillText(label, x, rCurY + ROW_TOP_PAD + LABEL_SIZE);
		ctx.letterSpacing = "0px";

		ctx.fillStyle = COLOR_VALUE;
		ctx.font = `400 ${VALUE_SIZE}px ${FONT}`;
		const base =
			rCurY + ROW_TOP_PAD + LABEL_SIZE + ROW_LABEL_TO_VALUE + VALUE_SIZE;
		for (let j = 0; j < lines.length; j++) {
			ctx.fillText(lines[j], x, base + j * VALUE_LINE_H, maxW);
		}
	}

	for (let i = 0; i < rRowsBefore.length; i++) {
		drawRRow(rRowsBefore[i].label, rBeforeLines[i], MARGIN + rPadH, rMaxW);
		rCurY += rBeforeHeights[i];
	}

	if (hasDateRow) {
		const col1X = MARGIN + rPadH;
		const col2X = MARGIN + CONTENT_WIDTH / 2 + 16;
		const dateLabelY = rCurY + ROW_TOP_PAD + LABEL_SIZE;
		const dateValueY =
			rCurY + ROW_TOP_PAD + LABEL_SIZE + ROW_LABEL_TO_VALUE + VALUE_SIZE;

		if (resumo.dataAbertura) {
			ctx.fillStyle = COLOR_LABEL;
			ctx.font = `500 ${LABEL_SIZE}px ${FONT}`;
			ctx.letterSpacing = "1.5px";
			ctx.fillText("DATA DE ABERTURA", col1X, dateLabelY);
			ctx.letterSpacing = "0px";
			ctx.fillStyle = COLOR_VALUE;
			ctx.font = `400 ${VALUE_SIZE}px ${FONT}`;
			ctx.fillText(formatDate(resumo.dataAbertura), col1X, dateValueY, rHalfW);
		}

		if (resumo.prazo) {
			ctx.fillStyle = COLOR_LABEL;
			ctx.font = `500 ${LABEL_SIZE}px ${FONT}`;
			ctx.letterSpacing = "1.5px";
			ctx.fillText("PRAZO", col2X, dateLabelY);
			ctx.letterSpacing = "0px";
			ctx.fillStyle = COLOR_VALUE;
			ctx.font = `400 ${VALUE_SIZE}px ${FONT}`;
			ctx.fillText(formatDate(resumo.prazo), col2X, dateValueY, rHalfW);
		}

		rCurY += dateRowH;
	}

	for (let i = 0; i < rRowsAfter.length; i++) {
		drawRRow(rRowsAfter[i].label, rAfterLines[i], MARGIN + rPadH, rMaxW);
		rCurY += rAfterHeights[i];
	}

	ctx.restore();

	y += rCardH + 40;

	drawSectionLabel(ctx, "Itens e Serviços", MARGIN, y + 14);
	y += 40;

	const iPadH = 32;
	const iPadV = 28;
	const iTableHeaderH = 48;
	const iTotalRowH = 60;

	const iDescLeft = MARGIN + iPadH;
	const iDescRight = MARGIN + CONTENT_WIDTH * 0.48;
	const iDescW = iDescRight - iDescLeft;
	const iQtdCX = MARGIN + CONTENT_WIDTH * 0.565;
	const iUnitRight = MARGIN + CONTENT_WIDTH * 0.755;
	const iTotalRight = MARGIN + CONTENT_WIDTH - iPadH;

	const iValFont = `400 24px ${FONT}`;
	const iLineH = 32;
	const iMinRowH = 56;

	ctx.font = iValFont;
	const iRowLinesList = itens.map((item) =>
		getLines(ctx, item.descricao, iDescW),
	);
	const iRowHeights = iRowLinesList.map((lines) =>
		Math.max(iMinRowH, lines.length * iLineH + 24),
	);

	const iTotalItemsH = iRowHeights.reduce((a, b) => a + b, 0);
	const iCardH = iPadV * 2 + iTableHeaderH + iTotalItemsH + 1 + iTotalRowH;

	drawCard(ctx, MARGIN, y, CONTENT_WIDTH, iCardH);

	ctx.save();
	ctx.textBaseline = "alphabetic";

	ctx.fillStyle = COLOR_TABLE_HEADER;
	ctx.font = `500 18px ${FONT}`;
	ctx.letterSpacing = "1.5px";
	ctx.textAlign = "left";
	ctx.fillText("DESCRIÇÃO", iDescLeft, y + iPadV + 20);
	ctx.textAlign = "center";
	ctx.fillText("QTD", iQtdCX, y + iPadV + 20);
	ctx.textAlign = "right";
	ctx.fillText("VALOR UNIT.", iUnitRight, y + iPadV + 20);
	ctx.fillText("TOTAL", iTotalRight, y + iPadV + 20);
	ctx.letterSpacing = "0px";

	const iDivY1 = y + iPadV + iTableHeaderH - 8;
	ctx.strokeStyle = COLOR_DIVIDER;
	ctx.lineWidth = 1;
	ctx.beginPath();
	ctx.moveTo(MARGIN + iPadH, iDivY1);
	ctx.lineTo(MARGIN + CONTENT_WIDTH - iPadH, iDivY1);
	ctx.stroke();

	let itemsTotal = 0;
	let iRowY = y + iPadV + iTableHeaderH;

	ctx.font = iValFont;

	for (let i = 0; i < itens.length; i++) {
		const item = itens[i];
		const rH = iRowHeights[i];
		const lines = iRowLinesList[i];
		const rowTotal = item.qtd * item.valorUnit;
		itemsTotal += rowTotal;

		ctx.fillStyle = COLOR_VALUE;
		ctx.textAlign = "left";
		const firstLineBaseline =
			iRowY + (rH - lines.length * iLineH) / 2 + iLineH - 4;
		for (let j = 0; j < lines.length; j++) {
			ctx.fillText(lines[j], iDescLeft, firstLineBaseline + j * iLineH);
		}

		const numBaseline = iRowY + rH / 2 + 9;
		ctx.textAlign = "center";
		ctx.fillText(String(item.qtd), iQtdCX, numBaseline);
		ctx.textAlign = "right";
		ctx.fillText(formatCurrency(item.valorUnit), iUnitRight, numBaseline);
		ctx.fillText(formatCurrency(rowTotal), iTotalRight, numBaseline);

		iRowY += rH;
	}

	ctx.strokeStyle = COLOR_DIVIDER;
	ctx.lineWidth = 1;
	ctx.beginPath();
	ctx.moveTo(MARGIN + iPadH, iRowY);
	ctx.lineTo(MARGIN + CONTENT_WIDTH - iPadH, iRowY);
	ctx.stroke();

	const iTotalBaseline = iRowY + iTotalRowH / 2 + 9;

	const totalText = formatCurrency(itemsTotal);

	// mede largura do valor
	ctx.font = `bold 28px ${FONT}`;
	const totalWidth = ctx.measureText(totalText).width;

	// espaço entre label e valor
	const gap = 16;

	// posições
	const valueX = iTotalRight;
	const labelX = valueX - totalWidth - gap;

	// LABEL
	ctx.fillStyle = COLOR_TABLE_HEADER;
	ctx.font = `500 20px ${FONT}`;
	ctx.textAlign = "right";
	ctx.fillText("TOTAL GERAL", labelX, iTotalBaseline);

	// VALUE
	ctx.fillStyle = COLOR_VALUE;
	ctx.font = `bold 28px ${FONT}`;
	ctx.textAlign = "right";
	ctx.fillText(totalText, valueX, iTotalBaseline);

	ctx.restore();

	y += iCardH + 40;

	if (observacoes.trim()) {
		drawSectionLabel(ctx, "Observações", MARGIN, y + 14);
		y += 40;

		const oPadH = 32;
		const oPadV = 28;
		const oLineH = 34;

		ctx.font = `400 ${VALUE_SIZE}px ${FONT}`;
		const oLines = getLines(ctx, observacoes, CONTENT_WIDTH - oPadH * 2);
		const oCardH = oPadV * 2 + oLines.length * oLineH;

		drawCard(ctx, MARGIN, y, CONTENT_WIDTH, oCardH);

		ctx.save();
		ctx.textBaseline = "alphabetic";
		ctx.textAlign = "left";
		ctx.fillStyle = COLOR_VALUE;
		ctx.font = `400 ${VALUE_SIZE}px ${FONT}`;

		for (let i = 0; i < oLines.length; i++) {
			ctx.fillText(
				oLines[i],
				MARGIN + oPadH,
				y + oPadV + VALUE_SIZE + i * oLineH,
			);
		}
		ctx.restore();

		y += oCardH + 40;
	}

	const footerY = CANVAS_HEIGHT - MARGIN - 20;
	ctx.save();
	ctx.fillStyle = COLOR_FOOTER;
	ctx.font = `400 20px ${FONT}`;
	ctx.textBaseline = "middle";
	ctx.textAlign = "center";
	ctx.fillText(
		`OS #${numero}${resumo.dataAbertura ? ` · gerada em ${formatDateLong(resumo.dataAbertura)}` : ""}`,
		CANVAS_WIDTH / 2,
		footerY,
	);
	ctx.fillStyle = "#cccccc";
	ctx.font = `400 18px ${FONT}`;
	ctx.fillText(
		"Documento gerado via Ferramenta Ninja",
		CANVAS_WIDTH / 2,
		footerY + 30,
	);
	ctx.restore();
}
