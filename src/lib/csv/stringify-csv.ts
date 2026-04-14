function escapeValue(value: string): string {
	if (value.includes(",") || value.includes('"') || value.includes("\n")) {
		return `"${value.replace(/"/g, '""')}"`;
	}
	return value;
}

export function stringifyCsv(data: Record<string, unknown>[]) {
	if (!data.length) return "";

	const headers = Object.keys(data[0]);

	const rows = data.map((row) =>
		headers.map((header) => escapeValue(String(row[header] ?? ""))).join(","),
	);

	return [headers.join(","), ...rows].join("\n");
}
