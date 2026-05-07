export type FaviconMode = "image" | "svg" | "text" | "emoji";

export type FaviconSize = {
	name: string;
	width: number;
	height: number;
	filename: string;
};

export const FAVICON_SIZES: FaviconSize[] = [
	{ name: "16×16", width: 16, height: 16, filename: "favicon-16x16.png" },
	{ name: "32×32", width: 32, height: 32, filename: "favicon-32x32.png" },
	{ name: "48×48", width: 48, height: 48, filename: "favicon-48x48.png" },
	{
		name: "180×180",
		width: 180,
		height: 180,
		filename: "apple-touch-icon.png",
	},
	{
		name: "192×192",
		width: 192,
		height: 192,
		filename: "android-chrome-192x192.png",
	},
	{
		name: "512×512",
		width: 512,
		height: 512,
		filename: "android-chrome-512x512.png",
	},
];

export const ICO_SIZES = [16, 32, 48];

export type GeneratedFaviconFile = {
	name: string;
	width: number;
	height: number;
	blob: Blob;
	dataUrl: string;
};

export type FaviconPackage = {
	pngs: GeneratedFaviconFile[];
	icoBlob: Blob;
	manifest: string;
	htmlTags: string;
};

/**
 * Desenha um canvas fonte em um canvas de tamanho específico usando cover (preenche todo o espaço).
 * Retorna o canvas resultante (não anexado ao DOM).
 */
export function renderToSize(
	sourceCanvas: HTMLCanvasElement,
	size: number,
): HTMLCanvasElement {
	const canvas = document.createElement("canvas");
	canvas.width = size;
	canvas.height = size;
	const ctx = canvas.getContext("2d");
	if (!ctx) throw new Error("Não foi possível obter contexto 2D");

	const srcW = sourceCanvas.width;
	const srcH = sourceCanvas.height;
	const scale = Math.max(size / srcW, size / srcH);
	const dw = srcW * scale;
	const dh = srcH * scale;
	const dx = (size - dw) / 2;
	const dy = (size - dh) / 2;

	ctx.drawImage(sourceCanvas, dx, dy, dw, dh);
	return canvas;
}

/**
 * Gera um Blob PNG a partir de um canvas fonte redimensionado.
 */
export async function generateFaviconPng(
	sourceCanvas: HTMLCanvasElement,
	size: number,
): Promise<Blob> {
	const canvas = renderToSize(sourceCanvas, size);
	return new Promise((resolve, reject) => {
		canvas.toBlob((blob) => {
			if (blob) resolve(blob);
			else reject(new Error(`Falha ao gerar PNG ${size}x${size}`));
		}, "image/png");
	});
}

/**
 * Gera um arquivo .ico multi-resolução usando PNGs embutidos.
 * Compatível com Windows Vista+ e todos os navegadores modernos.
 */
export async function generateIco(
	pngs: Array<{ size: number; blob: Blob }>,
): Promise<Blob> {
	const count = pngs.length;
	const headerSize = 6 + count * 16;
	const header = new Uint8Array(headerSize);
	const view = new DataView(header.buffer);

	// ICO header
	view.setUint16(0, 0, true); // Reserved
	view.setUint16(2, 1, true); // Type: ICO
	view.setUint16(4, count, true); // Count

	let offset = headerSize;
	const entries: Array<{ offset: number; size: number }> = [];

	for (let i = 0; i < count; i++) {
		const png = pngs[i];
		const entryOffset = 6 + i * 16;
		const width = png.size >= 256 ? 0 : png.size;
		const height = png.size >= 256 ? 0 : png.size;

		header[entryOffset] = width;
		header[entryOffset + 1] = height;
		header[entryOffset + 2] = 0; // Colors
		header[entryOffset + 3] = 0; // Reserved
		view.setUint16(entryOffset + 4, 1, true); // Color planes
		view.setUint16(entryOffset + 6, 32, true); // Bits per pixel
		view.setUint32(entryOffset + 8, png.blob.size, true); // Size in bytes
		view.setUint32(entryOffset + 12, offset, true); // Offset

		entries.push({ offset, size: png.blob.size });
		offset += png.blob.size;
	}

	const totalSize = offset;
	const result = new Uint8Array(totalSize);
	result.set(header, 0);

	let currentOffset = headerSize;
	for (let i = 0; i < count; i++) {
		const pngBlob = pngs[i].blob;
		const arrayBuffer = await pngBlob.arrayBuffer();
		result.set(new Uint8Array(arrayBuffer), currentOffset);
		currentOffset += arrayBuffer.byteLength;
	}

	return new Blob([result], { type: "image/x-icon" });
}

/**
 * Cria o conteúdo JSON do site.webmanifest.
 */
export function createWebManifest(): string {
	return JSON.stringify(
		{
			name: "My Site",
			short_name: "My Site",
			icons: [
				{
					src: "/android-chrome-192x192.png",
					sizes: "192x192",
					type: "image/png",
				},
				{
					src: "/android-chrome-512x512.png",
					sizes: "512x512",
					type: "image/png",
				},
			],
			theme_color: "#ffffff",
			background_color: "#ffffff",
			display: "standalone",
		},
		null,
		2,
	);
}

/**
 * Gera as tags HTML <link> recomendadas para favicon.
 */
export function generateHtmlTags(): string {
	return `<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="manifest" href="/site.webmanifest">`;
}

/**
 * Cria um pacote ZIP com todos os arquivos do favicon.
 */
export async function createZipPackage(
	files: Array<{ name: string; blob: Blob }>,
): Promise<Blob> {
	const JSZip = (await import("jszip")).default;
	const zip = new JSZip();

	for (const file of files) {
		zip.file(file.name, file.blob);
	}

	return zip.generateAsync({ type: "blob", compression: "DEFLATE" });
}
