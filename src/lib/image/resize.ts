export type ResizeMode = "fit" | "cover" | "stretch";

export type ResizeResult = {
	blob: Blob;
	dataUrl: string;
	originalWidth: number;
	originalHeight: number;
	newWidth: number;
	newHeight: number;
};

export async function resizeImage(
	file: File,
	targetWidth: number,
	targetHeight: number,
	outputFormat?: string,
	quality = 0.92,
	mode: ResizeMode = "fit",
	backgroundColor = "#ffffff",
): Promise<ResizeResult> {
	const bitmap = await createImageBitmap(file);

	const canvas = document.createElement("canvas");
	canvas.width = targetWidth;
	canvas.height = targetHeight;

	const ctx = canvas.getContext("2d");
	if (!ctx) {
		bitmap.close();
		throw new Error("Não foi possível processar a imagem.");
	}

	if (mode === "stretch") {
		ctx.drawImage(bitmap, 0, 0, targetWidth, targetHeight);
	} else if (mode === "fit") {
		const { drawWidth, drawHeight, offsetX, offsetY } = fitDimensions(
			bitmap.width,
			bitmap.height,
			targetWidth,
			targetHeight,
		);
		ctx.fillStyle = backgroundColor;
		ctx.fillRect(0, 0, targetWidth, targetHeight);
		ctx.drawImage(bitmap, offsetX, offsetY, drawWidth, drawHeight);
	} else {
		const { drawWidth, drawHeight, offsetX, offsetY } = coverDimensions(
			bitmap.width,
			bitmap.height,
			targetWidth,
			targetHeight,
		);
		ctx.drawImage(bitmap, offsetX, offsetY, drawWidth, drawHeight);
	}

	bitmap.close();

	const mimeType =
		outputFormat && outputFormat !== "original" ? outputFormat : file.type;

	const blob = await new Promise<Blob>((resolve, reject) => {
		canvas.toBlob(
			(b) => {
				if (b) resolve(b);
				else reject(new Error("Falha ao gerar imagem redimensionada."));
			},
			mimeType,
			quality,
		);
	});

	const dataUrl = URL.createObjectURL(blob);

	return {
		blob,
		dataUrl,
		originalWidth: bitmap.width,
		originalHeight: bitmap.height,
		newWidth: targetWidth,
		newHeight: targetHeight,
	};
}

function fitDimensions(srcW: number, srcH: number, dstW: number, dstH: number) {
	const scale = Math.min(dstW / srcW, dstH / srcH);
	const drawWidth = Math.round(srcW * scale);
	const drawHeight = Math.round(srcH * scale);
	const offsetX = Math.round((dstW - drawWidth) / 2);
	const offsetY = Math.round((dstH - drawHeight) / 2);
	return { drawWidth, drawHeight, offsetX, offsetY };
}

function coverDimensions(
	srcW: number,
	srcH: number,
	dstW: number,
	dstH: number,
) {
	const scale = Math.max(dstW / srcW, dstH / srcH);
	const drawWidth = Math.round(srcW * scale);
	const drawHeight = Math.round(srcH * scale);
	const offsetX = Math.round((dstW - drawWidth) / 2);
	const offsetY = Math.round((dstH - drawHeight) / 2);
	return { drawWidth, drawHeight, offsetX, offsetY };
}

export type AspectRatioResult = {
	width: number;
	height: number;
};

export function calculateAspectRatio(
	originalWidth: number,
	originalHeight: number,
	value: number,
	lock: "width" | "height",
): AspectRatioResult {
	if (lock === "width") {
		return {
			width: value,
			height: Math.round((value / originalWidth) * originalHeight),
		};
	}
	return {
		width: Math.round((value / originalHeight) * originalWidth),
		height: value,
	};
}
