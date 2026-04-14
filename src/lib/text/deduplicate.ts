type DeduplicateOptions = {
	ignoreCase: boolean;
	trimWhitespace: boolean;
	sortOrder: "none" | "asc" | "desc";
};

export function removeDuplicateLines(
	text: string,
	options: DeduplicateOptions,
): string {
	let lines = text.split("\n");

	if (options.trimWhitespace) {
		lines = lines.map((line) => line.trim()).filter((line) => line !== "");
	}

	const seen = new Set<string>();
	const unique = lines.filter((line) => {
		const key = options.ignoreCase ? line.toLowerCase() : line;
		if (seen.has(key)) return false;
		seen.add(key);
		return true;
	});

	if (options.sortOrder === "asc") {
		unique.sort((a, b) => a.localeCompare(b, "pt-BR"));
	} else if (options.sortOrder === "desc") {
		unique.sort((a, b) => b.localeCompare(a, "pt-BR"));
	}

	return unique.join("\n");
}
