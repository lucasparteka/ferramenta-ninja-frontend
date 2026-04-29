export type MinifierType = "css" | "js" | "html";

export function minifyCSS(input: string): string {
	return input
		.replace(/\/\*[\s\S]*?\*\//g, "") // remove comentários /* */
		.replace(/\s+/g, " ") // múltiplos espaços → um
		.replace(/\s*([{}:;,>+~])\s*/g, "$1") // remove espaços ao redor de símbolos
		.replace(/;\s*}/g, "}") // remove ; antes de }
		.trim();
}

export function minifyJS(input: string): string {
	return input
		.replace(/\/\*[\s\S]*?\*\//g, "") // remove comentários /* */
		.replace(/\/\/.*$/gm, "") // remove comentários //
		.replace(/\s+/g, " ") // múltiplos espaços → um
		.replace(/\s*([{}[\]();,:.=!+\-*/<>?&|])\s*/g, "$1") // remove espaços ao redor de símbolos
		.trim();
}

export function minifyHTML(input: string): string {
	return input
		.replace(/<!--[\s\S]*?-->/g, "") // remove comentários
		.replace(/>\s+</g, "><") // remove espaços entre tags
		.replace(/\s+/g, " ") // múltiplos espaços → um
		.trim();
}

export function minify(input: string, type: MinifierType): string {
	switch (type) {
		case "css":
			return minifyCSS(input);
		case "js":
			return minifyJS(input);
		case "html":
			return minifyHTML(input);
		default:
			return input;
	}
}
