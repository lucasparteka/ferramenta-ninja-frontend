export type Tool = {
	name: string;
	href: string;
	description: string;

	tags?: string[];
	intent?: "generate" | "convert" | "analyze" | "format" | "validate";
	weight?: number;
};

export type ToolCategory = {
	id: string;
	name: string;
	description?: string;
	tools: Tool[];
};

export const categories: ToolCategory[] = [
	{
		id: "texto",
		name: "Texto",
		description: "Manipulação, limpeza e formatação de texto",
		tools: [
			{
				name: "Contador de Caracteres",
				href: "/ferramentas/contador-de-caracteres",
				description: "Conte caracteres, palavras e linhas em tempo real",
				tags: ["texto", "contagem"],
				intent: "analyze",
			},
			{
				name: "Conversor de Texto",
				href: "/ferramentas/conversor-de-texto",
				description: "Maiúsculas, minúsculas, capitalização e mais",
				tags: ["texto", "formatacao"],
				intent: "format",
			},
			{
				name: "Limpador de Texto",
				href: "/ferramentas/limpar-texto",
				description: "Remova espaços, quebras e caracteres invisíveis",
				tags: ["texto", "limpeza"],
				intent: "format",
			},
			{
				name: "Remover Duplicados",
				href: "/ferramentas/remover-duplicados",
				description: "Elimine linhas duplicadas rapidamente",
				tags: ["texto", "dados"],
				intent: "analyze",
			},
			{
				name: "Formatar Texto Para WhatsApp",
				href: "/ferramentas/formatador-de-texto-whatsapp",
				description: "Formate com negrito, itálico e código",
				tags: ["texto", "whatsapp", "formatacao"],
				intent: "format",
				weight: 1,
			},
			{
				name: "Comparador de Textos",
				href: "/ferramentas/comparar-textos",
				description: "Compare textos e veja diferenças",
				tags: ["texto", "diff"],
				intent: "analyze",
			},
		],
	},

	{
		id: "geradores-texto",
		name: "Geradores de Texto",
		tools: [
			{
				name: "Gerador de Texto",
				href: "/ferramentas/gerador-de-texto",
				description: "Gere Lorem Ipsum e textos aleatórios",
				tags: ["texto", "conteudo"],
				intent: "generate",
			},
		],
	},

	{
		id: "dados",
		name: "Dados e Conversões",
		tools: [
			{
				name: "Converter CSV para JSON",
				href: "/ferramentas/conversor-csv-json",
				description: "Converta CSV para JSON e vice-versa",
				tags: ["csv", "json", "dados"],
				intent: "convert",
			},
			{
				name: "Converter CSV para SQL",
				href: "/ferramentas/converter-csv-para-sql",
				description: "Gere comandos SQL a partir de CSV",
				tags: ["csv", "sql", "dados"],
				intent: "convert",
			},
		],
	},

	{
		id: "csv",
		name: "CSV e Tabelas",
		tools: [
			{
				name: "Visualizador de CSV",
				href: "/ferramentas/visualizador-de-csv",
				description: "Veja CSV como tabela interativa",
				tags: ["csv", "tabela", "dados"],
				intent: "analyze",
			},
			{
				name: "Converter CSV para PDF",
				href: "/ferramentas/converter-csv-para-pdf",
				description: "Transforme CSV em PDF formatado",
				tags: ["csv", "pdf", "exportacao"],
				intent: "convert",
			},
		],
	},

	{
		id: "documentos",
		name: "Documentos",
		tools: [
			{
				name: "Criador de Cardápio",
				href: "/ferramentas/cardapio-online",
				description:
					"Crie cardápios personalizados prontos para impressão em PDF",
				tags: ["pdf", "impressao", "restaurante", "design"],
				intent: "generate",
				weight: 2,
			},
			{
				name: "Criador de Cartão fidelidade",
				href: "/ferramentas/cartao-fidelidade",
				description:
					"Crie cartões de fidelidade personalizados prontos para impressão em PDF",
				tags: ["pdf", "impressao", "fidelidade", "design"],
				intent: "generate",
				weight: 2,
			},
			{
				name: "Checklist Personalizado",
				href: "/ferramentas/checklist-personalizado",
				description: "Crie e imprima checklists personalizados",
				tags: ["pdf", "impressao", "organizacao"],
				intent: "generate",
			},
			{
				name: "Gerador de Recibo",
				href: "/ferramentas/recibo-simples",
				description: "Recibos prontos para impressão",
				tags: ["pdf", "financeiro", "documento"],
				intent: "generate",
			},
			{
				name: "Gerador de CPF",
				href: "/ferramentas/gerador-de-cpf",
				description: "Gere e valide CPFs",
				tags: ["cpf", "documento"],
				intent: "generate",
			},
			{
				name: "Gerador de CNPJ",
				href: "/ferramentas/gerador-de-cnpj",
				description: "Gere e valide CNPJs",
				tags: ["cnpj", "documento"],
				intent: "generate",
			},
			{
				name: "Gerador de Cartão de Crédito",
				href: "/ferramentas/gerador-de-cartao-de-credito",
				description: "Números válidos para testes",
				tags: ["cartao", "teste"],
				intent: "generate",
			},
			{
				name: "Validador de Cartão de Crédito",
				href: "/ferramentas/validador-de-cartao-de-credito",
				description: "Valide cartões com Luhn",
				tags: ["cartao", "validacao"],
				intent: "validate",
			},
		],
	},

	{
		id: "calculadoras",
		name: "Calculadoras",
		tools: [
			{
				name: "Calculadora de Porcentagem",
				href: "/ferramentas/calculadora-de-porcentagem",
				description: "Cálculos de porcentagem rápidos",
				tags: ["calculo", "porcentagem"],
				intent: "analyze",
			},
			{
				name: "Calculadora de Salário Líquido",
				href: "/ferramentas/calculadora-salario-liquido",
				description: "INSS, IRRF e descontos",
				tags: ["calculo", "financeiro"],
				intent: "analyze",
			},
		],
	},

	{
		id: "sorteios",
		name: "Sorteios",
		tools: [
			{
				name: "Sorteio Online",
				href: "/ferramentas/sorteio-online",
				description: "Sorteie listas rapidamente",
				tags: ["aleatorio", "lista"],
				intent: "generate",
			},
			{
				name: "Gerador de Números",
				href: "/ferramentas/gerador-de-numeros",
				description: "Números aleatórios",
				tags: ["aleatorio"],
				intent: "generate",
			},
		],
	},

	{
		id: "seguranca",
		name: "Segurança",
		tools: [
			{
				name: "Gerador de Senha",
				href: "/ferramentas/gerador-de-senha",
				description: "Senhas seguras",
				tags: ["seguranca", "senha"],
				intent: "generate",
				weight: 1,
			},
			{
				name: "Criptografia de Texto",
				href: "/ferramentas/criptografia-de-texto",
				description: "AES, Base64 e ROT13",
				tags: ["seguranca", "texto"],
				intent: "convert",
			},
			{
				name: "Gerador de UUID",
				href: "/ferramentas/gerador-de-uuid",
				description: "UUIDs únicos",
				tags: ["dev", "id"],
				intent: "generate",
			},
		],
	},

	{
		id: "imagens",
		name: "Imagens",
		tools: [
			{
				name: "Gerador de QR Code",
				href: "/ferramentas/gerador-de-qr-code",
				description: "QR codes personalizados",
				tags: ["qr", "compartilhamento"],
				intent: "generate",
			},
			{
				name: "Leitor de QR Code",
				href: "/ferramentas/leitor-de-qr-code",
				description: "Leia QR por imagem",
				tags: ["qr"],
				intent: "analyze",
			},
			{
				name: "Converter Imagem em Texto",
				href: "/ferramentas/converter-imagem-em-texto",
				description: "OCR no navegador",
				tags: ["imagem", "ocr"],
				intent: "convert",
			},
		],
	},

	{
		id: "pdf",
		name: "PDF",
		tools: [
			{
				name: "Juntar PDF",
				href: "/ferramentas/juntar-pdf",
				description: "Una PDFs",
				tags: ["pdf"],
				intent: "convert",
			},
			{
				name: "Dividir PDF",
				href: "/ferramentas/dividir-pdf",
				description: "Separe páginas",
				tags: ["pdf"],
				intent: "convert",
			},
			{
				name: "Comprimir PDF",
				href: "/ferramentas/comprimir-pdf",
				description: "Reduza tamanho",
				tags: ["pdf"],
				intent: "convert",
			},
		],
	},
];
