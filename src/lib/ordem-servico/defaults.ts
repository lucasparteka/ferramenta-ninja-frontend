import type { OrdemServicoState } from "./types";

function generateNumero(): string {
	return Math.random().toString(16).slice(2, 10).toUpperCase();
}

export function buildInitialState(): OrdemServicoState {
	if (typeof window !== "undefined") {
		try {
			const saved = localStorage.getItem("ferramenta-ninja:ordem-servico");
			if (saved) return JSON.parse(saved) as OrdemServicoState;
		} catch {
			// ignore corrupt data
		}
	}
	return {
		numero: generateNumero(),
		prestador: { empresa: "", cnpjCpf: "", endereco: "", logo: "" },
		cliente: { nome: "", contato: "", email: "" },
		resumo: {
			titulo: "",
			descricao: "",
			dataAbertura: "",
			prazo: "",
			formaPagamento: "",
		},
		itens: [{ id: crypto.randomUUID(), descricao: "", qtd: 1, valorUnit: 0 }],
		observacoes: "",
	};
}
