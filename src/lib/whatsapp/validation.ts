export interface PhoneValidationResult {
	valid: boolean;
	countryCode: string;
	areaCode: string;
	number: string;
	full: string;
	error?: string;
}

export function validateBrazilianPhone(raw: string): PhoneValidationResult {
	const cleaned = raw.replace(/\D/g, "");

	if (cleaned.length < 10 || cleaned.length > 13) {
		return {
			valid: false,
			countryCode: "55",
			areaCode: "",
			number: "",
			full: "",
			error: "Número deve ter entre 10 e 13 dígitos",
		};
	}

	let countryCode = "55";
	let body = cleaned;

	if (cleaned.length === 13) {
		countryCode = cleaned.slice(0, 2);
		body = cleaned.slice(2);
	} else if (cleaned.length === 12) {
		countryCode = cleaned.slice(0, 2);
		body = cleaned.slice(2);
	} else if (cleaned.length === 11) {
		if (cleaned.startsWith("55")) {
			countryCode = "55";
			body = cleaned.slice(2);
		} else {
			body = cleaned;
		}
	}

	const areaCode = body.slice(0, 2);
	const number = body.slice(2);

	if (!areaCode || !number) {
		return {
			valid: false,
			countryCode,
			areaCode: "",
			number: "",
			full: "",
			error: "DDD e número são obrigatórios",
		};
	}

	if (number.length < 8 || number.length > 9) {
		return {
			valid: false,
			countryCode,
			areaCode,
			number,
			full: `${countryCode}${areaCode}${number}`,
			error: "Número deve ter 8 ou 9 dígitos",
		};
	}

	return {
		valid: true,
		countryCode,
		areaCode,
		number,
		full: `${countryCode}${areaCode}${number}`,
	};
}

export function formatPhoneBR(areaCode: string, number: string): string {
	const nine = number.length === 9 ? `${number[0]} ` : "";
	const base = number.length === 9 ? number.slice(1) : number;
	const part1 = base.slice(0, 4);
	const part2 = base.slice(4);
	return `(${areaCode}) ${nine}${part1}-${part2}`;
}
