import type { ReceiptFormValues } from "@/components/tools/receipt/receipt-client";

export function formatValor(valor: number): string {
	if (Number.isNaN(valor)) return "R$ 0,00";

	return new Intl.NumberFormat("pt-BR", {
		style: "currency",
		currency: "BRL",
	}).format(valor);
}

export function formatReceiptDate(isoDate: string): string {
	return new Date(`${isoDate}T12:00:00`).toLocaleDateString("pt-BR", {
		day: "numeric",
		month: "long",
		year: "numeric",
	});
}

export function formatReceiptBody(values: ReceiptFormValues): string {
	const pagador = values.nomePagador.toUpperCase();
	const valor = formatValor(values.valor);
	const base = `Recebi de ${pagador} a importância de ${valor}`;

	if (values.descricao?.trim()) {
		return `${base} referente a ${values.descricao.trim()}.`;
	}

	return `${base}.`;
}

export function formatLocationLine(values: ReceiptFormValues): string {
	const date = formatReceiptDate(values.data);

	if (values.cidade?.trim()) {
		return `${values.cidade.trim()}, ${date}`;
	}

	return date;
}
