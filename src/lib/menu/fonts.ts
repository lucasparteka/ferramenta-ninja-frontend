export type MenuFontOption = {
	id: string;
	label: string;
	canvasFamily: string;
};

export const MENU_FONT_OPTIONS: MenuFontOption[] = [
	{
		id: "--font-inter",
		label: "Inter",
		canvasFamily: "Inter, Arial, sans-serif",
	},
	{
		id: "--font-playfair",
		label: "Playfair Display",
		canvasFamily: "Playfair Display, Georgia, serif",
	},
	{
		id: "--font-lora",
		label: "Lora",
		canvasFamily: "Lora, Georgia, serif",
	},
	{
		id: "--font-roboto",
		label: "Roboto",
		canvasFamily: "Roboto, Arial, sans-serif",
	},
];

export function getCanvasFamily(fontId: string): string {
	return (
		MENU_FONT_OPTIONS.find((f) => f.id === fontId)?.canvasFamily ??
		"Inter, Arial, sans-serif"
	);
}
