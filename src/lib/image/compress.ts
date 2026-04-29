import imageCompression from "browser-image-compression";

export type CompressionResult = {
	blob: Blob;
	dataUrl: string;
	originalSize: number;
	compressedSize: number;
};

export async function compressImage(
	file: File,
	quality: number,
	maxWidth?: number,
	maxHeight?: number,
	outputFormat?: string,
): Promise<CompressionResult> {
	const options: {
		maxSizeMB: number;
		initialQuality: number;
		maxWidthOrHeight?: number;
		fileType?: string;
		useWebWorker: boolean;
	} = {
		maxSizeMB: 50,
		initialQuality: quality / 100,
		useWebWorker: true,
	};

	if (maxWidth && maxHeight) {
		options.maxWidthOrHeight = Math.max(maxWidth, maxHeight);
	} else if (maxWidth) {
		options.maxWidthOrHeight = maxWidth;
	} else if (maxHeight) {
		options.maxWidthOrHeight = maxHeight;
	}

	if (outputFormat && outputFormat !== "original") {
		const mimeMap: Record<string, string> = {
			jpeg: "image/jpeg",
			png: "image/png",
			webp: "image/webp",
		};
		options.fileType = mimeMap[outputFormat] || file.type;
	}

	const compressedFile = await imageCompression(file, options);

	const blob = new Blob([compressedFile], { type: compressedFile.type });
	const dataUrl = URL.createObjectURL(blob);

	return {
		blob,
		dataUrl,
		originalSize: file.size,
		compressedSize: compressedFile.size,
	};
}
