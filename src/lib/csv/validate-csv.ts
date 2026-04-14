import { parseCsv } from "./parse-csv";

export function validateCsv(text: string) {
	const errors: string[] = [];

	try {
		const rows = parseCsv(text);

		if (!rows.length) {
			errors.push("CSV vazio");
			return { errors };
		}

		const keys = Object.keys(rows[0]);

		rows.forEach((row, index) => {
			const currentKeys = Object.keys(row);

			if (currentKeys.length !== keys.length) {
				errors.push(`Linha ${index + 2}: número de colunas inconsistente`);
			}
		});
	} catch {
		errors.push("Erro ao processar CSV");
	}

	return { errors };
}
