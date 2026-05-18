export type PlaceholderPattern = "none" | "grid" | "dots" | "stripes";

export type PlaceholderOptions = {
	width: number;
	height: number;
	bgColor: string;
	textColor: string;
	text: string;
	pattern: PlaceholderPattern;
};

export type PlaceholderResult = {
	dataUrl: string;
	blob: Blob;
	width: number;
	height: number;
};

function drawPattern(
	ctx: CanvasRenderingContext2D,
	pattern: PlaceholderPattern,
	width: number,
	height: number,
	textColor: string,
): void {
	ctx.save();
	ctx.globalAlpha = 0.15;
	ctx.strokeStyle = textColor;
	ctx.fillStyle = textColor;
	ctx.lineWidth = 1;

	if (pattern === "grid") {
		const step = 20;
		ctx.beginPath();
		for (let x = 0; x <= width; x += step) {
			ctx.moveTo(x, 0);
			ctx.lineTo(x, height);
		}
		for (let y = 0; y <= height; y += step) {
			ctx.moveTo(0, y);
			ctx.lineTo(width, y);
		}
		ctx.stroke();
	} else if (pattern === "dots") {
		const step = 20;
		const r = 1.5;
		ctx.beginPath();
		for (let x = step; x < width; x += step) {
			for (let y = step; y < height; y += step) {
				ctx.moveTo(x + r, y);
				ctx.arc(x, y, r, 0, Math.PI * 2);
			}
		}
		ctx.fill();
	} else if (pattern === "stripes") {
		const step = 20;
		ctx.beginPath();
		for (let i = -height; i < width + height; i += step) {
			ctx.moveTo(i, 0);
			ctx.lineTo(i + height, height);
		}
		ctx.stroke();
	}

	ctx.restore();
}

export async function generatePlaceholder(
	opts: PlaceholderOptions,
): Promise<PlaceholderResult> {
	const { width, height, bgColor, textColor, text, pattern } = opts;

	const canvas = document.createElement("canvas");
	canvas.width = width;
	canvas.height = height;

	const ctx = canvas.getContext("2d");
	if (!ctx) throw new Error("Canvas 2D não disponível.");

	ctx.fillStyle = bgColor;
	ctx.fillRect(0, 0, width, height);

	if (pattern !== "none") {
		drawPattern(ctx, pattern, width, height, textColor);
	}

	const label = text.trim() || `${width} × ${height}`;
	const fontSize = Math.max(12, Math.min(Math.min(width, height) * 0.1, 96));
	ctx.fillStyle = textColor;
	ctx.font = `bold ${fontSize}px Inter, system-ui, sans-serif`;
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.fillText(label, width / 2, height / 2);

	const dataUrl = canvas.toDataURL("image/png");

	const blob = await new Promise<Blob>((resolve, reject) => {
		canvas.toBlob((b) => {
			if (b) resolve(b);
			else reject(new Error("Falha ao gerar imagem."));
		}, "image/png");
	});

	return { dataUrl, blob, width, height };
}
