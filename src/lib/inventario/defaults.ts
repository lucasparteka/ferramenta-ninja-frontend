import type { InventarioState } from "./types";

const LS_KEY = "ferramenta-ninja:controle-estoque";

function todayFormatted(): string {
	return new Date().toLocaleDateString("pt-BR");
}

function defaultState(): InventarioState {
	return {
		title: "Controle de Estoque",
		orientation: "landscape",
		tableHeaderColor: "#1e293b",
		zebraStripes: true,
		headerFields: [
			{ id: crypto.randomUUID(), label: "Data", value: todayFormatted() },
			{ id: crypto.randomUUID(), label: "Setor", value: "" },
			{ id: crypto.randomUUID(), label: "Responsável", value: "" },
		],
		columns: [
			{ id: crypto.randomUUID(), label: "Código", width: 1 },
			{ id: crypto.randomUUID(), label: "Item / Produto", width: 3 },
			{ id: crypto.randomUUID(), label: "Categoria", width: 2 },
			{ id: crypto.randomUUID(), label: "Unidade", width: 1 },
			{ id: crypto.randomUUID(), label: "Qtd. Atual", width: 1 },
			{ id: crypto.randomUUID(), label: "Qtd. Mínima", width: 1 },
			{ id: crypto.randomUUID(), label: "Valor Unit.", width: 2 },
			{ id: crypto.randomUUID(), label: "Localização", width: 2 },
			{ id: crypto.randomUUID(), label: "Observações", width: 2 },
		],
	};
}

export function buildInitialState(): InventarioState {
	if (typeof window !== "undefined") {
		try {
			const saved = localStorage.getItem(LS_KEY);
			if (saved) return JSON.parse(saved) as InventarioState;
		} catch {
			// ignore corrupt data
		}
	}
	return defaultState();
}

export { LS_KEY };
