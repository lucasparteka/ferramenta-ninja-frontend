export type Lap = {
	id: number;
	elapsedMs: number;
	splitMs: number;
};

export function formatStopwatch(ms: number): string {
	const totalSeconds = Math.floor(ms / 1000);
	const minutes = Math.floor(totalSeconds / 60);
	const seconds = totalSeconds % 60;
	const centis = Math.floor((ms % 1000) / 10);
	const mm = String(minutes).padStart(2, "0");
	const ss = String(seconds).padStart(2, "0");
	const cc = String(centis).padStart(2, "0");
	return `${mm}:${ss}.${cc}`;
}
