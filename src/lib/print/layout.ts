import type { LayoutMode } from "@/components/tools/loyalty-card/types";
import { A4_PT, A4_PX, CARD, CARD_PT } from "./dimensions";

export type { LayoutMode };

export type CardPosition = { x: number; y: number };

const COLS = 2;

export function generateA4GridPx(mode: LayoutMode): CardPosition[] {
	const rows = mode === "8" ? 4 : 5;
	const marginX = (A4_PX.width - COLS * CARD.bleedWidth) / 2;
	const gapY = (A4_PX.height - rows * CARD.bleedHeight) / (rows + 1);
	const positions: CardPosition[] = [];
	for (let row = 0; row < rows; row++) {
		for (let col = 0; col < COLS; col++) {
			positions.push({
				x: marginX + col * CARD.bleedWidth,
				y: gapY + row * (CARD.bleedHeight + gapY),
			});
		}
	}
	return positions;
}

export function generateA4GridPt(mode: LayoutMode): CardPosition[] {
	const rows = mode === "8" ? 4 : 5;
	const marginX = (A4_PT.width - COLS * CARD_PT.bleedWidth) / 2;
	const gapY = (A4_PT.height - rows * CARD_PT.bleedHeight) / (rows + 1);
	const positions: CardPosition[] = [];
	for (let row = 0; row < rows; row++) {
		for (let col = 0; col < COLS; col++) {
			const yFromTop = gapY + row * (CARD_PT.bleedHeight + gapY);
			positions.push({
				x: marginX + col * CARD_PT.bleedWidth,
				y: A4_PT.height - yFromTop - CARD_PT.bleedHeight,
			});
		}
	}
	return positions;
}
