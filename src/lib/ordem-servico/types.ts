export type OrdemServicoItem = {
	id: string;
	descricao: string;
	qtd: number;
	valorUnit: number;
};

export type OrdemServicoState = {
	numero: string;
	prestador: {
		empresa: string;
		cnpjCpf: string;
		endereco: string;
		logo: string;
	};
	cliente: {
		nome: string;
		contato: string;
		email: string;
	};
	resumo: {
		titulo: string;
		descricao: string;
		dataAbertura: string;
		prazo: string;
		formaPagamento: string;
	};
	itens: OrdemServicoItem[];
	observacoes: string;
};

export type CanvasHandle = {
	getDataURL(): string;
};
