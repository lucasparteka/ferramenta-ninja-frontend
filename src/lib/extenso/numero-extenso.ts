const UNITS = [
	"zero",
	"um",
	"dois",
	"três",
	"quatro",
	"cinco",
	"seis",
	"sete",
	"oito",
	"nove",
	"dez",
	"onze",
	"doze",
	"treze",
	"quatorze",
	"quinze",
	"dezesseis",
	"dezessete",
	"dezoito",
	"dezenove",
];

const TENS = [
	"",
	"",
	"vinte",
	"trinta",
	"quarenta",
	"cinquenta",
	"sessenta",
	"setenta",
	"oitenta",
	"noventa",
];

const HUNDREDS = [
	"",
	"cento",
	"duzentos",
	"trezentos",
	"quatrocentos",
	"quinhentos",
	"seiscentos",
	"setecentos",
	"oitocentos",
	"novecentos",
];

const CLASS_NAMES: [string, string][] = [
	["", ""],
	["mil", "mil"],
	["milhão", "milhões"],
	["bilhão", "bilhões"],
	["trilhão", "trilhões"],
];

type ClassPart = { words: string; group: number };

function groupToWords(n: number): string {
	if (n === 0) return "";
	if (n === 100) return "cem";
	const hundreds = Math.floor(n / 100);
	const remainder = n % 100;
	const parts: string[] = [];
	if (hundreds > 0) parts.push(HUNDREDS[hundreds]);
	if (remainder < 20) {
		if (remainder > 0) parts.push(UNITS[remainder]);
	} else {
		const tens = Math.floor(remainder / 10);
		const units = remainder % 10;
		if (units === 0) parts.push(TENS[tens]);
		else parts.push(`${TENS[tens]} e ${UNITS[units]}`);
	}
	return parts.join(" e ");
}

function integerToWords(value: number): string {
	if (value === 0) return "zero";
	const groups: number[] = [];
	let n = value;
	while (n > 0) {
		groups.push(n % 1000);
		n = Math.floor(n / 1000);
	}
	const parts: ClassPart[] = [];
	for (let i = groups.length - 1; i >= 0; i--) {
		const g = groups[i];
		if (g === 0) continue;
		const groupWords = groupToWords(g);
		let words: string;
		if (i === 0) words = groupWords;
		else if (i === 1) words = g === 1 ? "mil" : `${groupWords} mil`;
		else {
			const name = g === 1 ? CLASS_NAMES[i][0] : CLASS_NAMES[i][1];
			words = `${groupWords} ${name}`;
		}
		parts.push({ words, group: g });
	}
	return joinClasses(parts);
}

function joinClasses(parts: ClassPart[]): string {
	if (parts.length === 0) return "";
	if (parts.length === 1) return parts[0].words;
	const result: string[] = [parts[0].words];
	for (let i = 1; i < parts.length; i++) {
		const group = parts[i].group;
		const useE = group < 100 || group % 100 === 0;
		result.push(useE ? " e " : ", ");
		result.push(parts[i].words);
	}
	return result.join("");
}

export type NumberToWordsOptions = {
	currency?: boolean;
};

export function numberToWords(
	value: number,
	options: NumberToWordsOptions = {},
): string {
	if (!Number.isFinite(value)) return "";
	const currency = options.currency ?? true;
	const negative = value < 0;
	const absolute = Math.abs(value);
	const cents = Math.round((absolute - Math.trunc(absolute)) * 100);
	const integer = Math.trunc(absolute);

	if (!currency) {
		const words = integerToWords(integer);
		return negative ? `menos ${words}` : words;
	}

	const parts: string[] = [];

	if (integer > 0) {
		// "de" é obrigatório quando o número termina numa classe nominal (milhão,
		// bilhões…) sem nenhuma subunidade abaixo, e sem centavos fazendo a ligação.
		const useDeReais =
			cents === 0 && integer >= 1_000_000 && integer % 1_000_000 === 0;
		const unit = integer === 1 ? "real" : "reais";
		parts.push(`${integerToWords(integer)} ${useDeReais ? "de " : ""}${unit}`);
	}

	if (cents > 0) {
		const unit = cents === 1 ? "centavo" : "centavos";
		parts.push(`${integerToWords(cents)} ${unit}`);
	}

	if (parts.length === 0) return "zero reais";
	const text = parts.join(" e ");
	return negative ? `menos ${text}` : text;
}

export function parsePtBrNumber(raw: string): number | null {
	if (!raw) return null;
	const cleaned = raw
		.trim()
		.replace(/^R\$\s*/i, "")
		.replace(/\s/g, "")
		.replace(/\.(?=\d{3}(\D|$))/g, "")
		.replace(",", ".");
	if (!/^-?\d+(\.\d+)?$/.test(cleaned)) return null;
	const value = Number.parseFloat(cleaned);
	return Number.isFinite(value) ? value : null;
}
