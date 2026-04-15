export function highlightText(text: string, keyword: string) {
	if (!keyword) return text;

	const regex = new RegExp(`(${keyword})`, "gi");

	return text.replace(regex, "<strong>$1</strong>");
}
