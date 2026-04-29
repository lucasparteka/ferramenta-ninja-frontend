interface PixelCrop {
	x: number;
	y: number;
	width: number;
	height: number;
}

export async function getCroppedImg(
	imageSrc: string,
	pixelCrop: PixelCrop,
	outputFormat: "image/png" | "image/jpeg" = "image/png",
): Promise<Blob> {
	const image = await createImage(imageSrc);
	const canvas = document.createElement("canvas");
	canvas.width = pixelCrop.width;
	canvas.height = pixelCrop.height;
	const ctx = canvas.getContext("2d");

	if (!ctx) throw new Error("Cannot get canvas context");

	ctx.drawImage(
		image,
		pixelCrop.x,
		pixelCrop.y,
		pixelCrop.width,
		pixelCrop.height,
		0,
		0,
		pixelCrop.width,
		pixelCrop.height,
	);

	return new Promise((resolve, reject) => {
		canvas.toBlob(
			(blob) => {
				if (!blob) {
					reject(new Error("Canvas is empty"));
					return;
				}
				resolve(blob);
			},
			outputFormat,
			1,
		);
	});
}

export async function getCroppedImgFromElement(
	image: HTMLImageElement,
	pixelCrop: PixelCrop,
	outputFormat: "image/png" | "image/jpeg" = "image/png",
): Promise<Blob> {
	const scaleX = image.naturalWidth / image.width;
	const scaleY = image.naturalHeight / image.height;

	const canvas = document.createElement("canvas");
	canvas.width = Math.floor(pixelCrop.width * scaleX);
	canvas.height = Math.floor(pixelCrop.height * scaleY);
	const ctx = canvas.getContext("2d");

	if (!ctx) throw new Error("Cannot get canvas context");

	ctx.drawImage(
		image,
		pixelCrop.x * scaleX,
		pixelCrop.y * scaleY,
		pixelCrop.width * scaleX,
		pixelCrop.height * scaleY,
		0,
		0,
		canvas.width,
		canvas.height,
	);

	return new Promise((resolve, reject) => {
		canvas.toBlob(
			(blob) => {
				if (!blob) {
					reject(new Error("Canvas is empty"));
					return;
				}
				resolve(blob);
			},
			outputFormat,
			1,
		);
	});
}

function createImage(url: string): Promise<HTMLImageElement> {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.addEventListener("load", () => resolve(img));
		img.addEventListener("error", (err) => reject(err));
		img.setAttribute("crossOrigin", "anonymous");
		img.src = url;
	});
}
