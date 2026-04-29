export type ImageInfo = {
	width: number;
	height: number;
	size: number;
	format: string;
	dataUrl: string;
};

export async function getImageInfo(file: File): Promise<ImageInfo> {
	const dataUrl = URL.createObjectURL(file);
	const format = getFileFormat(file);
	let bitmap: ImageBitmap;

	try {
		bitmap = await createImageBitmap(file);
	} catch {
		URL.revokeObjectURL(dataUrl);
		throw new Error(
			"Não foi possível carregar a imagem. Verifique se o arquivo é válido.",
		);
	}

	const info: ImageInfo = {
		width: bitmap.width,
		height: bitmap.height,
		size: file.size,
		format,
		dataUrl,
	};

	bitmap.close();
	return info;
}

export function getFileFormat(file: File): string {
	const type = file.type;
	if (type === "image/png") return "PNG";
	if (type === "image/jpeg") return "JPEG";
	if (type === "image/webp") return "WebP";
	if (type === "image/avif") return "AVIF";
	if (type === "image/bmp") return "BMP";
	if (type === "image/svg+xml") return "SVG";
	return type || "Desconhecido";
}

export function formatBytes(bytes: number): string {
	if (bytes < 1024) return `${bytes} B`;
	if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
	return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
