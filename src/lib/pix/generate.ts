export type PixKeyType = "cpf" | "cnpj" | "phone" | "email" | "evp";

export type PixOptions = {
	keyType: PixKeyType;
	key: string;
	name: string;
	city: string;
	amount?: number;
	description?: string;
};

function emv(id: string, value: string): string {
	return `${id}${value.length.toString().padStart(2, "0")}${value}`;
}

function crc16ccitt(str: string): string {
	let crc = 0xffff;
	for (let i = 0; i < str.length; i++) {
		crc ^= str.charCodeAt(i) << 8;
		for (let j = 0; j < 8; j++) {
			crc = crc & 0x8000 ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff;
		}
	}
	return crc.toString(16).toUpperCase().padStart(4, "0");
}

function normalizeAscii(text: string, maxLen: number): string {
	return text
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.replace(/[^a-zA-Z0-9 ]/g, " ")
		.replace(/\s+/g, " ")
		.trim()
		.substring(0, maxLen);
}

function formatKey(keyType: PixKeyType, key: string): string {
	switch (keyType) {
		case "cpf":
			return key.replace(/\D/g, "").substring(0, 11);
		case "cnpj":
			return key.replace(/\D/g, "").substring(0, 14);
		case "phone": {
			const digits = key.replace(/\D/g, "");
			if (digits.startsWith("55")) return `+${digits}`;
			return `+55${digits}`;
		}
		default:
			return key.trim();
	}
}

export function generatePixPayload(options: PixOptions): string {
	const { keyType, key, name, city, amount, description } = options;

	const formattedKey = formatKey(keyType, key);
	const merchantName = normalizeAscii(name, 25);
	const merchantCity = normalizeAscii(city, 15);

	const pixGui = emv("00", "BR.GOV.BCB.PIX");
	const pixKey = emv("01", formattedKey);
	const pixDesc = description ? emv("02", description.substring(0, 72)) : "";
	const merchantAccount = emv("26", pixGui + pixKey + pixDesc);

	const amountField = amount && amount > 0 ? emv("54", amount.toFixed(2)) : "";

	const additionalData = emv("62", emv("05", "***"));

	const payload =
		emv("00", "01") +
		emv("01", "12") +
		merchantAccount +
		emv("52", "0000") +
		emv("53", "986") +
		amountField +
		emv("58", "BR") +
		emv("59", merchantName) +
		emv("60", merchantCity) +
		additionalData +
		"6304";

	return payload + crc16ccitt(payload);
}
