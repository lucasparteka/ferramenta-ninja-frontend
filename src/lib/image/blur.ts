export type BlurStyle = "blur" | "pixelate";

export interface FaceRegion {
	x: number;
	y: number;
	width: number;
	height: number;
}

export function buildCanvasFromImage(img: HTMLImageElement): HTMLCanvasElement {
	const canvas = document.createElement("canvas");
	canvas.width = img.naturalWidth;
	canvas.height = img.naturalHeight;
	const ctx = canvas.getContext("2d");
	if (!ctx) throw new Error("Não foi possível processar a imagem.");
	ctx.drawImage(img, 0, 0);
	return canvas;
}

export function applyFaceBlur(
	sourceCanvas: HTMLCanvasElement,
	regions: FaceRegion[],
	style: BlurStyle,
	intensity: number,
	padding: number,
): HTMLCanvasElement {
	const result = document.createElement("canvas");
	result.width = sourceCanvas.width;
	result.height = sourceCanvas.height;
	const ctx = result.getContext("2d");
	if (!ctx) throw new Error("Não foi possível processar a imagem.");
	ctx.drawImage(sourceCanvas, 0, 0);

	for (const r of regions) {
		const padX = r.width * padding;
		const padY = r.height * padding;
		const x = Math.max(0, Math.round(r.x - padX));
		const y = Math.max(0, Math.round(r.y - padY));
		const w = Math.min(result.width - x, Math.round(r.width + padX * 2));
		const h = Math.min(result.height - y, Math.round(r.height + padY * 2));

		if (style === "blur") {
			blurRegion(ctx, x, y, w, h, Math.max(2, intensity * 0.4));
		} else {
			pixelateRegion(ctx, x, y, w, h, intensity);
		}
	}

	return result;
}

function blurRegion(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	w: number,
	h: number,
	blur: number,
): void {
	if (w <= 0 || h <= 0) return;

	// Captura área maior para que o kernel Gaussian tenha contexto nas bordas,
	// evitando que o blur "vaze" para fora da região do rosto.
	const pad = Math.ceil(blur * 2.5);
	const srcX = Math.max(0, x - pad);
	const srcY = Math.max(0, y - pad);
	const srcW = Math.min(ctx.canvas.width - srcX, w + pad * 2);
	const srcH = Math.min(ctx.canvas.height - srcY, h + pad * 2);

	const temp1 = document.createElement("canvas");
	temp1.width = srcW;
	temp1.height = srcH;
	const tc1 = temp1.getContext("2d");
	if (!tc1) return;
	tc1.drawImage(ctx.canvas, srcX, srcY, srcW, srcH, 0, 0, srcW, srcH);

	const temp2 = document.createElement("canvas");
	temp2.width = srcW;
	temp2.height = srcH;
	const tc2 = temp2.getContext("2d");
	if (!tc2) return;
	tc2.filter = `blur(${blur}px)`;
	tc2.drawImage(temp1, 0, 0);

	// Desenha de volta ao canvas principal com máscara elíptica (formato de rosto)
	ctx.save();
	ctx.beginPath();
	const cx = x + w / 2;
	const cy = y + h / 2;
	const rx = w / 2;
	const ry = h / 2;
	ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
	ctx.clip();
	ctx.drawImage(temp2, srcX, srcY);
	ctx.restore();
}

function pixelateRegion(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	w: number,
	h: number,
	blockSize: number,
): void {
	if (w <= 0 || h <= 0) return;
	const rw = Math.max(1, Math.round(w / blockSize));
	const rh = Math.max(1, Math.round(h / blockSize));
	const temp = document.createElement("canvas");
	temp.width = rw;
	temp.height = rh;
	const tc = temp.getContext("2d");
	if (!tc) return;
	tc.imageSmoothingEnabled = false;
	tc.drawImage(ctx.canvas, x, y, w, h, 0, 0, rw, rh);
	ctx.save();
	ctx.beginPath();
	const cx = x + w / 2;
	const cy = y + h / 2;
	const rx = w / 2;
	const ry = h / 2;
	ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
	ctx.clip();
	ctx.imageSmoothingEnabled = false;
	ctx.drawImage(temp, 0, 0, rw, rh, x, y, w, h);
	ctx.restore();
}
