function detectDelimiter(text: string) {
	const firstLine = text.split("\n")[0];

	const candidates = [",", ";", "\t"];

	let best = ",";
	let maxCount = 0;

	for (const delimiter of candidates) {
		const count = firstLine.split(delimiter).length;
		if (count > maxCount) {
			maxCount = count;
			best = delimiter;
		}
	}

	return best;
}

export function parseCsv(text: string) {
	const delimiter = detectDelimiter(text);
	const rows: string[][] = [];

	let current = "";
	let row: string[] = [];
	let insideQuotes = false;

	for (let i = 0; i < text.length; i++) {
		const char = text[i];
		const nextChar = text[i + 1];

		if (char === '"') {
			if (insideQuotes && nextChar === '"') {
				current += '"';
				i++;
			} else {
				insideQuotes = !insideQuotes;
			}
			continue;
		}

		if (char === delimiter && !insideQuotes) {
			row.push(current);
			current = "";
			continue;
		}

		if ((char === "\n" || char === "\r") && !insideQuotes) {
			if (current || row.length) {
				row.push(current);
				rows.push(row);
				row = [];
				current = "";
			}
			continue;
		}

		current += char;
	}

	if (current || row.length) {
		row.push(current);
		rows.push(row);
	}

	const headers = rows[0] || [];

	return rows.slice(1).map((r) => {
		const obj: Record<string, string> = {};

		headers.forEach((h, i) => {
			obj[h] = r[i] ?? "";
		});

		return obj;
	});
}
