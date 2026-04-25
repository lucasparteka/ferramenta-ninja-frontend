export type PixKeyType =
	| "cpf"
	| "cnpj"
	| "email"
	| "phone"
	| "random"
	| "unknown";

export type PixDecoded = {
	valid: boolean;
	errors: string[];
	key?: string;
	keyType?: PixKeyType;
	psp?: string;
	additionalInfo?: string;
	amount?: number;
	currency?: string;
	country?: string;
	beneficiary?: string;
	city?: string;
	cep?: string;
	txid?: string;
	crcProvided?: string;
	crcCalculated?: string;
	raw: Record<string, string>;
};

function parseTlv(input: string): Record<string, string> {
	const result: Record<string, string> = {};
	let i = 0;
	while (i < input.length) {
		if (i + 4 > input.length) {
			throw new Error("Estrutura TLV incompleta");
		}
		const id = input.substring(i, i + 2);
		const len = Number.parseInt(input.substring(i + 2, i + 4), 10);
		if (Number.isNaN(len)) {
			throw new Error(`Tamanho inválido no campo ${id}`);
		}
		const value = input.substring(i + 4, i + 4 + len);
		if (value.length !== len) {
			throw new Error(`Campo ${id} truncado`);
		}
		result[id] = value;
		i += 4 + len;
	}
	return result;
}

function crc16Ccitt(payload: string): string {
	let crc = 0xffff;
	for (let i = 0; i < payload.length; i++) {
		crc ^= payload.charCodeAt(i) << 8;
		for (let j = 0; j < 8; j++) {
			crc = crc & 0x8000 ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff;
		}
	}
	return crc.toString(16).toUpperCase().padStart(4, "0");
}

function classifyKey(key: string): PixKeyType {
	if (!key) return "unknown";
	const digits = key.replace(/\D/g, "");
	if (/^\+?55\d{10,11}$/.test(key.replace(/\s|-/g, ""))) return "phone";
	if (/^[\w.+-]+@[\w-]+\.[\w.-]+$/.test(key)) return "email";
	if (
		/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(key)
	) {
		return "random";
	}
	if (digits.length === 11 && digits === key) return "cpf";
	if (digits.length === 14 && digits === key) return "cnpj";
	return "unknown";
}

export function decodePixBrCode(input: string): PixDecoded {
	const errors: string[] = [];
	const code = input.trim().replace(/\s+/g, "");
	const raw: Record<string, string> = {};
	if (!code) {
		return { valid: false, errors: ["Código PIX vazio"], raw };
	}

	let top: Record<string, string>;
	try {
		top = parseTlv(code);
	} catch (err) {
		return {
			valid: false,
			errors: [
				err instanceof Error ? err.message : "Falha ao ler estrutura do código",
			],
			raw,
		};
	}
	Object.assign(raw, top);

	const crcProvided = top["63"];
	const crcIndex = code.lastIndexOf("6304");
	let crcCalculated: string | undefined;
	if (crcIndex >= 0) {
		crcCalculated = crc16Ccitt(code.substring(0, crcIndex + 4));
		if (crcProvided && crcCalculated !== crcProvided.toUpperCase()) {
			errors.push("CRC inválido — código pode estar corrompido");
		}
	} else {
		errors.push("Campo CRC (63) não encontrado");
	}

	if (top["00"] !== "01") {
		errors.push("Payload Format Indicator ausente ou inválido");
	}
	if (top["58"] && top["58"] !== "BR") {
		errors.push(`País inesperado: ${top["58"]}`);
	}

	let key: string | undefined;
	let additionalInfo: string | undefined;
	let psp: string | undefined;
	const merchant = top["26"] ?? top["27"] ?? top["28"];
	if (merchant) {
		try {
			const sub = parseTlv(merchant);
			psp = sub["00"];
			key = sub["01"];
			additionalInfo = sub["02"];
		} catch {
			errors.push("Dados do beneficiário (26) ilegíveis");
		}
	}

	let txid: string | undefined;
	if (top["62"]) {
		try {
			const sub = parseTlv(top["62"]);
			txid = sub["05"];
		} catch {
			errors.push("Campo de informações adicionais (62) ilegível");
		}
	}

	const amountStr = top["54"];
	let amount: number | undefined;
	if (amountStr) {
		const parsed = Number.parseFloat(amountStr);
		if (!Number.isNaN(parsed)) amount = parsed;
	}

	return {
		valid: errors.length === 0,
		errors,
		key,
		keyType: key ? classifyKey(key) : undefined,
		psp,
		additionalInfo,
		amount,
		currency: top["53"],
		country: top["58"],
		beneficiary: top["59"],
		city: top["60"],
		cep: top["61"],
		txid,
		crcProvided,
		crcCalculated,
		raw,
	};
}

export function formatBRL(value: number): string {
	return value.toLocaleString("pt-BR", {
		style: "currency",
		currency: "BRL",
	});
}

export function keyTypeLabel(type: PixKeyType): string {
	switch (type) {
		case "cpf":
			return "CPF";
		case "cnpj":
			return "CNPJ";
		case "email":
			return "E-mail";
		case "phone":
			return "Telefone";
		case "random":
			return "Chave aleatória";
		default:
			return "Não identificada";
	}
}
