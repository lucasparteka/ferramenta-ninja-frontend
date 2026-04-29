export type GradientType = "linear" | "radial";

export type ColorStop = {
	id: string;
	color: string;
	position: number;
};

export function buildGradientCSS(
	type: GradientType,
	stops: ColorStop[],
	angle = 90,
): string {
	const sorted = [...stops].sort((a, b) => a.position - b.position);
	const stopsStr = sorted.map((s) => `${s.color} ${s.position}%`).join(", ");
	if (type === "radial") {
		return `radial-gradient(circle, ${stopsStr})`;
	}
	return `linear-gradient(${angle}deg, ${stopsStr})`;
}

export function getRandomColor(): string {
	const hex = Math.floor(Math.random() * 16777215)
		.toString(16)
		.padStart(6, "0");
	return `#${hex}`;
}

export function generateStopId(): string {
	return `stop-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
