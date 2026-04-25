export function cmToPx(cm: number): number {
	return Math.round((cm / 2.54) * 300);
}

export function cmToPt(cm: number): number {
	return (cm / 2.54) * 72;
}

export const CARD = {
	width: 1063,
	height: 591,
	bleedWidth: 1134,
	bleedHeight: 661,
} as const;

export const BLEED_PX = 35;

export const A4_PX = { width: 2480, height: 3508 } as const;
export const A4_PT = { width: 595.28, height: 841.89 } as const;
export const CARD_PT = { bleedWidth: 272.13, bleedHeight: 158.74 } as const;
export const BLEED_PT = (0.3 / 2.54) * 72;
