export type ThumbnailQuality = {
	key: string;
	label: string;
	width: number;
	height: number;
	url: string;
};

export function extractVideoId(input: string): string | null {
	const trimmed = input.trim();
	const match = trimmed.match(
		/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
	);
	return match ? match[1] : null;
}

export function getThumbnailQualities(videoId: string): ThumbnailQuality[] {
	const base = `https://img.youtube.com/vi/${videoId}`;
	return [
		{ key: "maxresdefault", label: "HD (1280×720)", width: 1280, height: 720, url: `${base}/maxresdefault.jpg` },
		{ key: "sddefault", label: "SD (640×480)", width: 640, height: 480, url: `${base}/sddefault.jpg` },
		{ key: "hqdefault", label: "HQ (480×360)", width: 480, height: 360, url: `${base}/hqdefault.jpg` },
		{ key: "mqdefault", label: "MQ (320×180)", width: 320, height: 180, url: `${base}/mqdefault.jpg` },
	];
}
