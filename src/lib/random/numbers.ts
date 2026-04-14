type Order = "random" | "asc" | "desc";

type NumberOptions = {
	count: number;
	min: number;
	max: number;
	order: Order;
	unique: boolean;
};

function randomInt(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateNumbers(options: NumberOptions): number[] {
	const lo = Math.min(options.min, options.max);
	const hi = Math.max(options.min, options.max);
	const count = Math.max(1, options.count);

	let numbers: number[];

	if (options.unique) {
		const available = hi - lo + 1;
		const actualCount = Math.min(count, available);
		const pool = Array.from({ length: available }, (_, i) => lo + i);

		for (let i = pool.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[pool[i], pool[j]] = [pool[j], pool[i]];
		}
		numbers = pool.slice(0, actualCount);
	} else {
		numbers = Array.from({ length: count }, () => randomInt(lo, hi));
	}

	if (options.order === "asc") numbers.sort((a, b) => a - b);
	else if (options.order === "desc") numbers.sort((a, b) => b - a);

	return numbers;
}
