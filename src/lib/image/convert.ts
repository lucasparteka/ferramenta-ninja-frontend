export type ConvertResult = {
	blob: Blob;
	dataUrl: string;
	originalSize: number;
	convertedSize: number;
	originalFormat: string;
	targetFormat: string;
};

const FORMAT_LABELS: Record<string, string> = {
	"image/png": "PNG",
	"image/jpeg": "JPEG",
	"image/webp": "WebP",
};

export function getFormatLabel(mimeType: string): string {
	return FORMAT_LABELS[mimeType] || mimeType;
}

export async function convertImage(
	file: File,
	targetFormat: string,
	quality = 0.92,
): Promise<ConvertResult> {
	const bitmap = await createImageBitmap(file);

	const canvas = document.createElement("canvas");
	canvas.width = bitmap.width;
	canvas.height = bitmap.height;

	const ctx = canvas.getContext("2d");
	if (!ctx) {
		bitmap.close();
		throw new Error("Não foi possível processar a imagem.");
	}

	ctx.drawImage(bitmap, 0, 0);
	bitmap.close();

	const mimeType = targetFormat;

	const blob = await new Promise<Blob>((resolve, reject) => {
		canvas.toBlob(
			(b) => {
				if (b) resolve(b);
				else reject(new Error("Falha ao converter a imagem."));
			},
			mimeType,
			quality,
		);
	});

	const dataUrl = URL.createObjectURL(blob);

	return {
		blob,
		dataUrl,
		originalSize: file.size,
		convertedSize: blob.size,
		originalFormat: getFormatLabel(file.type),
		targetFormat: getFormatLabel(mimeType),
	};
}
