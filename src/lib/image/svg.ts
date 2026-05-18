export type SvgDimensions = {
	width: number;
	height: number;
};

export type SvgToPngOptions = {
	width?: number;
	height?: number;
	backgroundColor?: string;
};

export type SvgToPngResult = {
	blob: Blob;
	dataUrl: string;
	width: number;
	height: number;
};

export function parseSvgDimensions(svgString: string): SvgDimensions | null {
	const viewBoxMatch = svgString.match(/viewBox=["']([^"']+)["']/);
	if (viewBoxMatch) {
		const parts = viewBoxMatch[1].split(/\s+/).map(Number);
		if (parts.length === 4 && parts[2] > 0 && parts[3] > 0) {
			return { width: parts[2], height: parts[3] };
		}
	}

	const widthMatch = svgString.match(/<svg[^>]*\swidth=["']([^"']+)["']/);
	const heightMatch = svgString.match(/<svg[^>]*\sheight=["']([^"']+)["']/);
	if (widthMatch && heightMatch) {
		const w = parseFloat(widthMatch[1]);
		const h = parseFloat(heightMatch[1]);
		if (w > 0 && h > 0) {
			return { width: w, height: h };
		}
	}

	return null;
}

export function validateSvg(svgString: string): boolean {
	const trimmed = svgString.trim();
	if (!trimmed) return false;

	if (
		!trimmed.toLowerCase().startsWith("<svg") &&
		!trimmed.toLowerCase().includes("<svg")
	) {
		return false;
	}

	const closingTag = trimmed.indexOf("</svg>");
	if (closingTag === -1 && trimmed.lastIndexOf("/>") === -1) {
		return false;
	}

	return true;
}

export async function loadSvgFromFile(file: File): Promise<string> {
	if (
		file.type !== "image/svg+xml" &&
		!file.name.toLowerCase().endsWith(".svg")
	) {
		throw new Error("O arquivo selecionado não é um SVG válido.");
	}

	const text = await file.text();

	if (!validateSvg(text)) {
		throw new Error("O arquivo não contém um SVG válido.");
	}

	return text;
}

export async function svgStringToPng(
	svgString: string,
	options: SvgToPngOptions = {},
): Promise<SvgToPngResult> {
	const dimensions = parseSvgDimensions(svgString);
	const origWidth = dimensions?.width ?? 512;
	const origHeight = dimensions?.height ?? 512;

	const width = options.width ?? origWidth;
	const height = options.height ?? origHeight;
	const backgroundColor = options.backgroundColor ?? "transparent";

	const svgBlob = new Blob([svgString], {
		type: "image/svg+xml;charset=utf-8",
	});
	const svgUrl = URL.createObjectURL(svgBlob);

	try {
		const img = await new Promise<HTMLImageElement>((resolve, reject) => {
			const image = new Image();
			image.onload = () => resolve(image);
			image.onerror = () =>
				reject(
					new Error(
						"Falha ao renderizar SVG. Verifique se o código SVG é válido.",
					),
				);
			image.src = svgUrl;
		});

		const canvas = document.createElement("canvas");
		canvas.width = width;
		canvas.height = height;

		const ctx = canvas.getContext("2d");
		if (!ctx) {
			throw new Error("Não foi possível processar a imagem.");
		}

		if (backgroundColor !== "transparent") {
			ctx.fillStyle = backgroundColor;
			ctx.fillRect(0, 0, width, height);
		}

		ctx.drawImage(img, 0, 0, width, height);

		const blob = await new Promise<Blob>((resolve, reject) => {
			canvas.toBlob((b) => {
				if (b) resolve(b);
				else reject(new Error("Falha ao gerar PNG."));
			}, "image/png");
		});

		const dataUrl = URL.createObjectURL(blob);

		return { blob, dataUrl, width, height };
	} finally {
		URL.revokeObjectURL(svgUrl);
	}
}
