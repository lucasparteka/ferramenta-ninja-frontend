import { A4_PX, BLEED_PX, CARD } from "./dimensions"
import { generateA4GridPx, type LayoutMode } from "./layout"

function loadImage(src: string): Promise<HTMLImageElement> {
	return new Promise((resolve, reject) => {
		const img = new Image()
		img.onload = () => resolve(img)
		img.onerror = reject
		img.src = src
	})
}

export async function exportPng(
	cardDataUrl: string,
	filename: string,
	mode: LayoutMode,
): Promise<void> {
	const positions = generateA4GridPx(mode)
	const sheet = document.createElement("canvas")
	sheet.width = A4_PX.width
	sheet.height = A4_PX.height
	const ctx = sheet.getContext("2d")
	if (!ctx) throw new Error("Could not get canvas context")

	ctx.fillStyle = "#ffffff"
	ctx.fillRect(0, 0, A4_PX.width, A4_PX.height)

	const img = await loadImage(cardDataUrl)

	for (const { x, y } of positions) {
		ctx.drawImage(img, x + BLEED_PX, y + BLEED_PX, CARD.width, CARD.height)
		ctx.strokeStyle = "#aaaaaa"
		ctx.lineWidth = 2
		ctx.setLineDash([8, 5])
		ctx.strokeRect(x + BLEED_PX, y + BLEED_PX, CARD.width, CARD.height)
		ctx.setLineDash([])
	}

	const link = document.createElement("a")
	link.href = sheet.toDataURL("image/png")
	link.download = filename
	link.click()
}
