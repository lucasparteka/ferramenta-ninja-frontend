export async function fileToBase64(file: File): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => resolve(reader.result as string);
		reader.onerror = () => reject(new Error("Erro ao ler arquivo"));
		reader.readAsDataURL(file);
	});
}

export async function urlToBase64(url: string): Promise<string> {
	const response = await fetch(url, { mode: "cors" });
	if (!response.ok) {
		throw new Error(`Erro HTTP ${response.status}`);
	}
	const blob = await response.blob();
	return fileToBase64(new File([blob], "imagem-remota", { type: blob.type }));
}

export function getImageSize(
	dataUrl: string,
): Promise<{ width: number; height: number }> {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.onload = () => resolve({ width: img.width, height: img.height });
		img.onerror = () => reject(new Error("Erro ao carregar imagem"));
		img.src = dataUrl;
	});
}

export function getBase64Size(base64: string): number {
	const pure = base64.split(",")[1] || base64;
	// Base64 string length * 3/4 gives approximate original bytes
	let size = Math.ceil((pure.length * 3) / 4);
	// Subtract padding
	if (pure.endsWith("==")) size -= 2;
	else if (pure.endsWith("=")) size -= 1;
	return size;
}

export function getPureBase64(dataUrl: string): string {
	return dataUrl.split(",")[1] || dataUrl;
}
