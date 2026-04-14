type DrawOptions = {
	winnersCount: number;
	allowRepeat: boolean;
};

function cryptoRandomInt(max: number): number {
	const arr = new Uint32Array(1);
	crypto.getRandomValues(arr);
	return arr[0] % max;
}

export function drawRandomItems(
	items: string[],
	options: DrawOptions,
): string[] {
	if (items.length === 0) return [];

	const count = options.allowRepeat
		? options.winnersCount
		: Math.min(options.winnersCount, items.length);

	if (options.allowRepeat) {
		return Array.from(
			{ length: count },
			() => items[cryptoRandomInt(items.length)],
		);
	}

	const shuffled = [...items];
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = cryptoRandomInt(i + 1);
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}
	return shuffled.slice(0, count);
}
