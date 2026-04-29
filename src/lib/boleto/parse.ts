// Boleto bancário: linha digitável de 47 dígitos, código de barras de 44.
// Boleto de arrecadação (concessionária): linha de 48, código de barras de 44.
// Referências: FEBRABAN — Manual de Layout de Cobrança e Arrecadação.

export type BoletoKind = "banking" | "collection" | "unknown";

export type BoletoBankingResult = {
	kind: "banking";
	valid: boolean;
	digitableLine: string;
	barcode: string;
	bankCode: string;
	currencyCode: string;
	dueDate?: Date;
	dueFactor: number;
	amount: number;
	checks: {
		field1: boolean;
		field2: boolean;
		field3: boolean;
		generalDigit: boolean;
	};
};

export type BoletoCollectionResult = {
	kind: "collection";
	valid: boolean;
	digitableLine: string;
	barcode: string;
	segment: string;
	amount: number;
	checks: { fields: boolean[] };
};

export type BoletoInvalid = {
	kind: "unknown";
	valid: false;
	reason: string;
};

export type BoletoResult =
	| BoletoBankingResult
	| BoletoCollectionResult
	| BoletoInvalid;

const DUE_BASE = Date.UTC(1997, 9, 7);
const DAY_MS = 86_400_000;

export function sanitizeBoleto(raw: string): string {
	return raw.replace(/\D/g, "");
}

export function detectKind(digits: string): BoletoKind {
	if (digits.length === 47) return "banking";
	if (digits.length === 48) return "collection";
	return "unknown";
}

export function modulo10(value: string): number {
	let sum = 0;
	let weight = 2;
	for (let i = value.length - 1; i >= 0; i--) {
		const product = Number(value[i]) * weight;
		sum += product > 9 ? Math.floor(product / 10) + (product % 10) : product;
		weight = weight === 2 ? 1 : 2;
	}
	const remainder = sum % 10;
	return remainder === 0 ? 0 : 10 - remainder;
}

export function modulo11Banking(value: string): number {
	let sum = 0;
	let weight = 2;
	for (let i = value.length - 1; i >= 0; i--) {
		sum += Number(value[i]) * weight;
		weight = weight === 9 ? 2 : weight + 1;
	}
	const remainder = sum % 11;
	const dv = 11 - remainder;
	if (dv === 0 || dv === 10 || dv === 11) return 1;
	return dv;
}

export function modulo11Collection(value: string): number {
	let sum = 0;
	let weight = 2;
	for (let i = value.length - 1; i >= 0; i--) {
		sum += Number(value[i]) * weight;
		weight = weight === 9 ? 2 : weight + 1;
	}
	const remainder = sum % 11;
	const dv = 11 - remainder;
	if (dv === 0 || dv === 10 || dv === 11) return 0;
	return dv;
}

export function parseBoleto(raw: string): BoletoResult {
	const digits = sanitizeBoleto(raw);
	const kind = detectKind(digits);
	if (kind === "unknown") {
		return {
			kind: "unknown",
			valid: false,
			reason:
				"Linha digitável deve ter 47 (boleto bancário) ou 48 dígitos (arrecadação)",
		};
	}
	if (kind === "banking") return parseBanking(digits);
	return parseCollection(digits);
}

function parseBanking(line: string): BoletoBankingResult {
	const field1 = line.slice(0, 9);
	const dv1 = line[9];
	const field2 = line.slice(10, 20);
	const dv2 = line[20];
	const field3 = line.slice(21, 31);
	const dv3 = line[31];
	const generalDv = line[32];
	const dueFactorStr = line.slice(33, 37);
	const amountStr = line.slice(37, 47);

	const checks = {
		field1: modulo10(field1) === Number(dv1),
		field2: modulo10(field2) === Number(dv2),
		field3: modulo10(field3) === Number(dv3),
		generalDigit: false,
	};

	const barcode =
		line.slice(0, 4) +
		generalDv +
		dueFactorStr +
		amountStr +
		line.slice(4, 9) +
		line.slice(10, 20) +
		line.slice(21, 31);

	const generalBase = barcode.slice(0, 4) + barcode.slice(5);
	checks.generalDigit = modulo11Banking(generalBase) === Number(generalDv);

	const dueFactor = Number(dueFactorStr);
	const dueDate =
		dueFactor > 0 ? new Date(DUE_BASE + dueFactor * DAY_MS) : undefined;

	const amount = Number(amountStr) / 100;

	return {
		kind: "banking",
		valid:
			checks.field1 && checks.field2 && checks.field3 && checks.generalDigit,
		digitableLine: line,
		barcode,
		bankCode: line.slice(0, 3),
		currencyCode: line[3],
		dueDate,
		dueFactor,
		amount,
		checks,
	};
}

function parseCollection(line: string): BoletoCollectionResult {
	const segment = line[1];
	const idValue = line[2];
	const useMod10 = idValue === "6" || idValue === "7";
	const dvFn = useMod10 ? modulo10 : modulo11Collection;

	const blocks: { data: string; dv: string }[] = [];
	for (let i = 0; i < 4; i++) {
		const start = i * 12;
		blocks.push({
			data: line.slice(start, start + 11),
			dv: line[start + 11],
		});
	}

	const checks = blocks.map((b) => dvFn(b.data) === Number(b.dv));

	const barcode = blocks
		.map((b) => b.data)
		.join("")
		.slice(0, 44);

	const amountStr = barcode.slice(4, 15);
	const amount = Number(amountStr) / 100;

	return {
		kind: "collection",
		valid: checks.every(Boolean),
		digitableLine: line,
		barcode,
		segment,
		amount,
		checks: { fields: checks },
	};
}
