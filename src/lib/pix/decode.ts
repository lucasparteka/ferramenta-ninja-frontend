export type PixKeyType =
	| "cpf"
	| "cnpj"
	| "email"
	| "phone"
	| "random"
	| "unknown";

export type EmvField = {
	id: string;
	name: string;
	length: number;
	value: string;
	rawValue: string;
	children?: EmvField[];
};

export type PixInfo = {
	type: "static" | "dynamic";
	oneTime: boolean;
	merchantCategoryCode?: string;
	transactionCurrency?: number;
	amount?: string;
	countryCode?: string;
	merchantName?: string;
	merchantCity?: string;
	key?: string;
	additionalInfo?: string;
	txid?: string;
	url?: string;
	crc?: string;
	isValid: boolean;
};

export type PixDecoded = {
	valid: boolean;
	isValid: boolean;
	errors: string[];
	fields: EmvField[];
	pixInfo: PixInfo;
	raw: string;
	// Legacy / convenience fields
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
};

const TOP_LEVEL_NAMES: Record<string, string> = {
	"00": "Payload Format Indicator",
	"01": "Point of Initiation Method",
	"02": "Merchant Account Information (Visa)",
	"03": "Merchant Account Information (Visa Electron)",
	"04": "Merchant Account Information (Mastercard)",
	"05": "Merchant Account Information (Mastercard)",
	"06": "Merchant Account Information (Cielo)",
	"07": "Merchant Account Information",
	"08": "Merchant Account Information",
	"09": "Merchant Account Information",
	"10": "Merchant Account Information",
	"11": "Merchant Account Information",
	"12": "Merchant Account Information",
	"13": "Merchant Account Information",
	"14": "Merchant Account Information",
	"15": "Merchant Account Information (EMVCo)",
	"16": "Merchant Account Information (EMVCo)",
	"17": "Merchant Account Information (EMVCo)",
	"18": "Merchant Account Information (EMVCo)",
	"19": "Merchant Account Information (EMVCo)",
	"20": "Merchant Account Information",
	"21": "Merchant Account Information",
	"22": "Merchant Account Information",
	"23": "Merchant Account Information",
	"24": "Merchant Account Information",
	"25": "Merchant Account Information",
	"26": "Merchant Account Information - PIX",
	"27": "Merchant Account Information - PIX",
	"28": "Merchant Account Information",
	"29": "Merchant Account Information",
	"30": "Merchant Account Information",
	"31": "Merchant Account Information",
	"32": "Merchant Account Information",
	"33": "Merchant Account Information",
	"34": "Merchant Account Information",
	"35": "Merchant Account Information",
	"36": "Merchant Account Information",
	"37": "Merchant Account Information",
	"38": "Merchant Account Information",
	"39": "Merchant Account Information",
	"40": "Merchant Account Information",
	"41": "Merchant Account Information",
	"42": "Merchant Account Information",
	"43": "Merchant Account Information",
	"44": "Merchant Account Information",
	"45": "Merchant Account Information",
	"46": "Merchant Account Information",
	"47": "Merchant Account Information",
	"48": "Merchant Account Information",
	"49": "Merchant Account Information",
	"50": "Merchant Account Information",
	"51": "Merchant Account Information",
	"52": "Merchant Category Code",
	"53": "Transaction Currency",
	"54": "Transaction Amount",
	"55": "Tip or Convenience Indicator",
	"56": "Value of Convenience Fee Fixed",
	"57": "Value of Convenience Fee Percentage",
	"58": "Country Code",
	"59": "Merchant Name",
	"60": "Merchant City",
	"61": "Postal Code",
	"62": "Additional Data Field Template",
	"63": "CRC",
	"64": "Merchant Information - Language Template",
	"65": "RFU for EMVCo",
	"80": "Unreserved Templates",
	"81": "Unreserved Templates",
	"82": "Unreserved Templates",
	"83": "Unreserved Templates",
	"84": "Unreserved Templates",
	"85": "Unreserved Templates",
	"86": "Unreserved Templates",
	"87": "Unreserved Templates",
	"88": "Unreserved Templates",
	"89": "Unreserved Templates",
	"90": "Unreserved Templates",
	"91": "Unreserved Templates",
	"92": "Unreserved Templates",
	"93": "Unreserved Templates",
	"94": "Unreserved Templates",
	"95": "Unreserved Templates",
	"96": "Unreserved Templates",
	"97": "Unreserved Templates",
	"98": "Unreserved Templates",
	"99": "Unreserved Templates",
};

const PIX_SUB_NAMES: Record<string, string> = {
	"00": "GUI (Globally Unique Identifier)",
	"01": "Chave PIX",
	"02": "Informacao Adicional",
	"03": "FSSRS (BACEN)",
	"21": "URL",
	"22": "URL",
	"23": "URL",
	"24": "URL",
	"25": "URL",
};

const ADDITIONAL_DATA_NAMES: Record<string, string> = {
	"00": "Payment System Specific Template",
	"01": "Bill Number",
	"02": "Mobile Number",
	"03": "Store Label",
	"04": "Loyalty Number",
	"05": "Reference Label (TXID)",
	"06": "Customer Label",
	"07": "Terminal Label",
	"08": "Purpose of Transaction",
	"09": "Additional Consumer Data Request",
	"10": "Merchant Tax ID",
	"11": "Source Account",
};

const LANGUAGE_TEMPLATE_NAMES: Record<string, string> = {
	"00": "Language Preference",
	"01": "Merchant Name - Alternate Language",
	"02": "Merchant City - Alternate Language",
};

const CURRENCY_NAMES: Record<string, string> = {
	"986": "BRL (Real Brasileiro)",
	"840": "USD (US Dollar)",
	"978": "EUR (Euro)",
};

const COUNTRY_NAMES: Record<string, string> = {
	BR: "Brasil",
	US: "United States",
};

const QR_TYPE_NAMES: Record<string, string> = {
	"11": "Static QR Code (can be reused)",
	"12": "Dynamic QR Code (single use)",
};

const CONTAINER_IDS = new Set([
	"26",
	"27",
	"28",
	"29",
	"30",
	"31",
	"32",
	"33",
	"34",
	"35",
	"36",
	"37",
	"38",
	"39",
	"40",
	"41",
	"42",
	"43",
	"44",
	"45",
	"46",
	"47",
	"48",
	"49",
	"50",
	"51",
	"62",
	"64",
	"80",
	"81",
	"82",
	"83",
	"84",
	"85",
	"86",
	"87",
	"88",
	"89",
	"90",
	"91",
	"92",
	"93",
	"94",
	"95",
	"96",
	"97",
	"98",
	"99",
]);

function getFieldName(id: string, parentId?: string): string {
	if (parentId) {
		const p = Number.parseInt(parentId, 10);
		if (p >= 26 && p <= 51) return PIX_SUB_NAMES[id] || `Unknown Field (${id})`;
		if (parentId === "62")
			return ADDITIONAL_DATA_NAMES[id] || `Unknown Field (${id})`;
		if (parentId === "64")
			return LANGUAGE_TEMPLATE_NAMES[id] || `Unknown Field (${id})`;
	}
	return TOP_LEVEL_NAMES[id] || `Unknown Field (${id})`;
}

export function crc16Ccitt(payload: string): string {
	let crc = 0xffff;
	for (let i = 0; i < payload.length; i++) {
		crc ^= payload.charCodeAt(i) << 8;
		for (let j = 0; j < 8; j++) {
			crc = crc & 0x8000 ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff;
		}
	}
	return crc.toString(16).toUpperCase().padStart(4, "0");
}

export function validateCrc(input: string): boolean {
	const code = input.trim().replace(/[\r\n\t\u00A0\u200B-\u200D\uFEFF]/g, "");
	const idx = code.lastIndexOf("6304");
	if (idx === -1) return false;
	const prefix = code.substring(0, idx + 4);
	const provided = code.substring(idx + 4, idx + 8).toUpperCase();
	return provided === crc16Ccitt(prefix);
}

export function fixCrc(input: string): string {
	let code = input.trim().replace(/[\r\n\t\u00A0\u200B-\u200D\uFEFF]/g, "");
	const idx = code.lastIndexOf("6304");
	if (idx !== -1) code = code.substring(0, idx);
	const withPrefix = `${code}6304`;
	return withPrefix + crc16Ccitt(withPrefix);
}

function parseTlvRecursive(
	input: string,
	parentId?: string,
): { fields: EmvField[]; errors: string[] } {
	const fields: EmvField[] = [];
	const errors: string[] = [];
	let i = 0;
	const code = input.trim().replace(/[\r\n\t\u00A0\u200B-\u200D\uFEFF]/g, "");

	while (
		i < code.length &&
		(!parentId || fields.length === 0 || fields[fields.length - 1].id !== "63")
	) {
		if (i + 2 > code.length) break;
		const id = code.substring(i, i + 2);
		if (!/^\d{2}$/.test(id)) {
			if (!parentId) break;
			errors.push(`Invalid field ID '${id}' at position ${i}`);
			break;
		}
		i += 2;
		if (i + 2 > code.length) {
			errors.push(
				`Incomplete field at position ${i - 2}: missing length for ID ${id}`,
			);
			break;
		}
		const lenStr = code.substring(i, i + 2);
		const len = Number.parseInt(lenStr, 10);
		i += 2;
		if (Number.isNaN(len)) {
			errors.push(`Invalid length '${lenStr}' for field ID ${id}`);
			break;
		}
		if (i + len > code.length) {
			errors.push(
				`Incomplete field: expected ${len} characters for ID ${id}, but only ${code.length - i} remaining`,
			);
			break;
		}
		const value = code.substring(i, i + len);
		const rawValue = `${id}${lenStr}${value}`;
		i += len;

		const field: EmvField = {
			id,
			name: getFieldName(id, parentId),
			length: len,
			value,
			rawValue,
		};

		if (CONTAINER_IDS.has(id) && value.length > 0) {
			const nested = parseTlvRecursive(value, id);
			if (nested.fields.length > 0) field.children = nested.fields;
			errors.push(...nested.errors);
		}

		fields.push(field);
	}

	return { fields, errors };
}

function extractPixInfo(fields: EmvField[]): PixInfo {
	const info: PixInfo = {
		type: "static",
		oneTime: false,
		isValid: false,
	};

	for (const f of fields) {
		switch (f.id) {
			case "01":
				info.type = f.value === "12" ? "dynamic" : "static";
				info.oneTime = f.value === "12";
				break;
			case "52":
				info.merchantCategoryCode = f.value;
				break;
			case "53":
				info.transactionCurrency = Number.parseInt(f.value, 10);
				break;
			case "54":
				info.amount = f.value;
				break;
			case "58":
				info.countryCode = f.value;
				break;
			case "59":
				info.merchantName = f.value;
				break;
			case "60":
				info.merchantCity = f.value;
				break;
			case "63":
				info.crc = f.value;
				break;
			case "26":
			case "27":
				if (f.children) {
					for (const c of f.children) {
						if (c.id === "01") info.key = c.value;
						if (c.id === "02") info.additionalInfo = c.value;
						if (["21", "22", "23", "24", "25"].includes(c.id)) {
							info.url = c.value;
						}
					}
				}
				break;
			case "62":
				if (f.children) {
					for (const c of f.children) {
						if (c.id === "05") info.txid = c.value;
					}
				}
				break;
		}
	}

	return info;
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
	const raw = input.trim().replace(/[\r\n\t\u00A0\u200B-\u200D\uFEFF]/g, "");
	const errors: string[] = [];

	if (!raw) {
		return {
			valid: false,
			isValid: false,
			errors: ["Código PIX vazio"],
			fields: [],
			pixInfo: { type: "static", oneTime: false, isValid: false },
			raw,
		};
	}

	const { fields, errors: parseErrors } = parseTlvRecursive(raw);
	errors.push(...parseErrors);

	const crcField = fields.find((f) => f.id === "63");
	let crcValid = false;
	let crcProvided: string | undefined;
	let crcCalculated: string | undefined;

	if (crcField) {
		crcProvided = crcField.value.toUpperCase();
		const prefix =
			fields
				.filter((f) => f.id !== "63")
				.map((f) => f.rawValue)
				.join("") + "6304";
		crcCalculated = crc16Ccitt(prefix);
		crcValid = crcProvided === crcCalculated;
	}

	if (!crcValid) {
		errors.push(`Invalid CRC: ${crcProvided || "not found"}`);
	}

	const has00 = fields.some((f) => f.id === "00" && f.value === "01");
	const hasMerchant = fields.some((f) =>
		["26", "27", "28", "29", "30", "31"].includes(f.id),
	);
	const has52 = fields.some((f) => f.id === "52");
	const has53 = fields.some((f) => f.id === "53");
	const has58 = fields.some((f) => f.id === "58");
	const has59 = fields.some((f) => f.id === "59");
	const has60 = fields.some((f) => f.id === "60");
	const has63 = fields.some((f) => f.id === "63");

	if (!has00)
		errors.push("Missing or invalid Payload Format Indicator (ID 00)");
	if (!hasMerchant)
		errors.push("Missing Merchant Account Information (ID 26-31)");
	if (!has52) errors.push("Missing Merchant Category Code (ID 52)");
	if (!has53) errors.push("Missing Transaction Currency (ID 53)");
	if (!has58) errors.push("Missing Country Code (ID 58)");
	if (!has59) errors.push("Missing Merchant Name (ID 59)");
	if (!has60) errors.push("Missing Merchant City (ID 60)");
	if (!has63) errors.push("Missing CRC (ID 63)");

	const hasAllMandatory =
		has00 && hasMerchant && has52 && has53 && has58 && has59 && has60 && has63;
	const isValid = crcValid && parseErrors.length === 0 && hasAllMandatory;

	const pixInfo = extractPixInfo(fields);
	pixInfo.isValid = isValid;

	// Legacy convenience extraction
	const merchantField = fields.find((f) => ["26", "27", "28"].includes(f.id));
	let key: string | undefined;
	let psp: string | undefined;
	let additionalInfo: string | undefined;
	if (merchantField?.children) {
		for (const c of merchantField.children) {
			if (c.id === "00") psp = c.value;
			if (c.id === "01") key = c.value;
			if (c.id === "02") additionalInfo = c.value;
		}
	}

	let txid: string | undefined;
	const additionalData = fields.find((f) => f.id === "62");
	if (additionalData?.children) {
		for (const c of additionalData.children) {
			if (c.id === "05") txid = c.value;
		}
	}

	const amountStr = fields.find((f) => f.id === "54")?.value;
	let amountNum: number | undefined;
	if (amountStr) {
		const parsed = Number.parseFloat(amountStr);
		if (!Number.isNaN(parsed)) amountNum = parsed;
	}

	return {
		valid: isValid,
		isValid,
		errors,
		fields,
		pixInfo,
		raw,
		key,
		keyType: key ? classifyKey(key) : undefined,
		psp,
		additionalInfo,
		amount: amountNum,
		currency: fields.find((f) => f.id === "53")?.value,
		country: fields.find((f) => f.id === "58")?.value,
		beneficiary: fields.find((f) => f.id === "59")?.value,
		city: fields.find((f) => f.id === "60")?.value,
		cep: fields.find((f) => f.id === "61")?.value,
		txid,
		crcProvided,
		crcCalculated,
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

export function currencyLabel(code: string): string {
	return CURRENCY_NAMES[code] || code;
}

export function countryLabel(code: string): string {
	return COUNTRY_NAMES[code] || code;
}

export function qrTypeLabel(code: string): string {
	return QR_TYPE_NAMES[code] || code;
}

export function formatFieldValue(
	id: string,
	value: string,
	parentId?: string,
): string {
	if (id === "53") return currencyLabel(value) || value;
	if (id === "58") return countryLabel(value) || value;
	if (id === "01" && !parentId) return qrTypeLabel(value) || value;
	if (id === "54") {
		const n = Number.parseFloat(value);
		return Number.isNaN(n) ? value : formatBRL(n);
	}
	return value;
}
