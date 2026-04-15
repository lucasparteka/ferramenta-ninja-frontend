export function calculateCTRScore({
	title,
	description,
	keyword,
}: {
	title: string;
	description: string;
	keyword: string;
}) {
	let score = 0;

	// tamanho ideal título
	if (title.length >= 30 && title.length <= 60) score += 30;

	// tamanho ideal descrição
	if (description.length >= 120 && description.length <= 160) score += 30;

	// keyword no título
	if (keyword && title.toLowerCase().includes(keyword.toLowerCase()))
		score += 25;

	// keyword na descrição
	if (keyword && description.toLowerCase().includes(keyword.toLowerCase()))
		score += 15;

	return score; // max 100
}
