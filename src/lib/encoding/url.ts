export function encodeURL(text: string, mode: "component" | "full" = "component"): string {
	if (mode === "full") {
		return encodeURI(text);
	}
	return encodeURIComponent(text);
}

export function decodeURL(text: string): string {
	try {
		return decodeURIComponent(text);
	} catch {
		try {
			return decodeURI(text);
		} catch {
			throw new Error(
				"Texto malformado. Verifique se é uma string codificada válida.",
			);
		}
	}
}
