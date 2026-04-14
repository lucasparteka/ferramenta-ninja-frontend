export function textToBinary(text: string, separator: string): string {
	const bytes = new TextEncoder().encode(text);
	return Array.from(bytes)
		.map((byte) => byte.toString(2).padStart(8, "0"))
		.join(separator);
}

export function binaryToText(binary: string): string {
	const cleaned = binary.trim();
	const hasSpaces = /\s/.test(cleaned);

	let groups: string[];

	if (hasSpaces) {
		groups = cleaned.split(/\s+/).filter((g) => g.length > 0);
	} else {
		if (cleaned.length % 8 !== 0) {
			throw new Error(
				"O binário sem espaços deve ter múltiplos de 8 bits. Verifique se o texto está completo.",
			);
		}
		groups = [];
		for (let i = 0; i < cleaned.length; i += 8) {
			groups.push(cleaned.slice(i, i + 8));
		}
	}

	const bytes = groups.map((group) => {
		if (!/^[01]{8}$/.test(group)) {
			throw new Error(
				`"${group}" não é um byte válido. Cada grupo deve ter exatamente 8 bits (0s e 1s).`,
			);
		}
		return parseInt(group, 2);
	});

	return new TextDecoder().decode(new Uint8Array(bytes));
}
