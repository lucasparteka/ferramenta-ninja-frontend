export function encodeBase64(input: string): string {
	try {
		return btoa(unescape(encodeURIComponent(input)));
	} catch {
		throw new Error("Não foi possível codificar o texto para Base64.");
	}
}

export function decodeBase64(input: string): string {
	try {
		return decodeURIComponent(escape(atob(input)));
	} catch {
		throw new Error(
			"Texto Base64 inválido. Verifique se está corretamente codificado.",
		);
	}
}
