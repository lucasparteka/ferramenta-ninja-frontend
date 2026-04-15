import type { Metadata } from "next";
import { ToolSearch } from "@/components/home/tool-search";

export const metadata: Metadata = {
	title: "Ferramentas Online Gratuitas",
	description:
		"Acesse dezenas de ferramentas online gratuitas para desenvolvedores, designers e profissionais. Sem cadastro, sem instalação.",
};

type Tool = {
	name: string;
	href: string;
	description: string;
};

type ToolCategory = {
	id: string;
	name: string;
	description: string;
	tools: Tool[];
};

const categories: ToolCategory[] = [
	{
		id: "texto",
		name: "Texto",
		description: "Manipulação, limpeza e formatação de texto",
		tools: [
			{
				name: "Contador de Caracteres",
				href: "/ferramentas/contador-de-caracteres",
				description: "Conte caracteres, palavras e linhas em tempo real",
			},
			{
				name: "Conversor de Texto",
				href: "/ferramentas/conversor-de-texto",
				description: "Maiúsculas, minúsculas, capitalização e mais",
			},
			{
				name: "Limpador de Texto",
				href: "/ferramentas/limpar-texto",
				description: "Remova espaços, quebras e caracteres invisíveis",
			},
			{
				name: "Remover Duplicados",
				href: "/ferramentas/remover-duplicados",
				description: "Elimine linhas duplicadas rapidamente",
			},
			{
				name: "Formatar Texto Para WhatsApp",
				href: "/ferramentas/formatador-de-texto-whatsapp",
				description: "Formate com negrito, itálico e código",
			},
			{
				name: "Comparador de Textos",
				href: "/ferramentas/comparar-textos",
				description: "Compare textos e veja diferenças",
			},
		],
	},

	{
		id: "geradores-texto",
		name: "Geradores de Texto",
		description: "Geração de conteúdo e texto automático",
		tools: [
			{
				name: "Gerador de Texto",
				href: "/ferramentas/gerador-de-texto",
				description: "Gere Lorem Ipsum e textos aleatórios",
			},
		],
	},

	{
		id: "dados",
		name: "Dados e Conversões",
		description: "Conversão de formatos e manipulação de dados",
		tools: [
			{
				name: "Converter CSV para JSON",
				href: "/ferramentas/conversor-csv-json",
				description: "Converta CSV para JSON e vice-versa",
			},
			{
				name: "Converter CSV para SQL",
				href: "/ferramentas/converter-csv-para-sql",
				description: "Gere comandos SQL a partir de CSV",
			},
		],
	},

	{
		id: "csv",
		name: "CSV e Tabelas",
		description: "Visualização e exportação de dados tabulares",
		tools: [
			{
				name: "Visualizador de CSV",
				href: "/ferramentas/visualizador-de-csv",
				description: "Veja CSV como tabela interativa",
			},
			{
				name: "Converter CSV para PDF",
				href: "/ferramentas/converter-csv-para-pdf",
				description: "Transforme CSV em PDF formatado",
			},
		],
	},

	{
		id: "dev",
		name: "Ferramentas para Dev",
		description: "Utilidades técnicas e encoding",
		tools: [
			{
				name: "Código Binário",
				href: "/ferramentas/codigo-binario",
				description: "Texto ↔ binário",
			},
			{
				name: "Código Morse",
				href: "/ferramentas/codigo-morse",
				description: "Texto ↔ morse",
			},
		],
	},

	{
		id: "documentos",
		name: "Documentos",
		description: "Geradores e validadores brasileiros",
		tools: [
			{
				name: "Gerador de CPF",
				href: "/ferramentas/gerador-de-cpf",
				description: "Gere e valide CPFs",
			},
			{
				name: "Gerador de CNPJ",
				href: "/ferramentas/gerador-de-cnpj",
				description: "Gere e valide CNPJs",
			},
			{
				name: "Gerador de Cartão de Crédito",
				href: "/ferramentas/gerador-de-cartao-de-credito",
				description: "Números válidos para testes",
			},
			{
				name: "Validador de Cartão de Crédito",
				href: "/ferramentas/validador-de-cartao-de-credito",
				description: "Valide cartões com Luhn",
			},
		],
	},

	{
		id: "calculadoras",
		name: "Calculadoras",
		description: "Cálculos rápidos do dia a dia",
		tools: [
			{
				name: "Calculadora de Porcentagem",
				href: "/ferramentas/calculadora-de-porcentagem",
				description: "Cálculos de porcentagem rápidos",
			},
			{
				name: "Calculadora de Adicional Noturno",
				href: "/ferramentas/calculadora-adicional-noturno",
				description: "Cálculo trabalhista",
			},
			{
				name: "Calculadora de Salário Líquido",
				href: "/ferramentas/calculadora-salario-liquido",
				description: "INSS, IRRF e descontos",
			},
		],
	},

	{
		id: "sorteios",
		name: "Sorteios e Aleatoriedade",
		description: "Seleção e geração aleatória",
		tools: [
			{
				name: "Sorteio Online",
				href: "/ferramentas/sorteio-online",
				description: "Sorteie listas rapidamente",
			},
			{
				name: "Gerador de Números",
				href: "/ferramentas/gerador-de-numeros",
				description: "Números aleatórios",
			},
		],
	},

	{
		id: "seguranca",
		name: "Segurança",
		description: "Proteção e geração de dados seguros",
		tools: [
			{
				name: "Gerador de Senha",
				href: "/ferramentas/gerador-de-senha",
				description: "Senhas seguras",
			},
			{
				name: "Criptografia de Texto",
				href: "/ferramentas/criptografia-de-texto",
				description: "AES, Base64 e ROT13",
			},
			{
				name: "Gerador de UUID",
				href: "/ferramentas/gerador-de-uuid",
				description: "UUIDs únicos",
			},
		],
	},

	{
		id: "imagens",
		name: "Imagens e QR Code",
		description: "Criação e leitura de imagens e códigos",
		tools: [
			{
				name: "Desenhar Online",
				href: "/ferramentas/desenhar-online",
				description: "Canvas de desenho",
			},
			{
				name: "Criador de Cartão Fidelidade",
				href: "/ferramentas/cartao-fidelidade",
				description: "Cartões prontos para impressão",
			},
			{
				name: "Gerador de QR Code",
				href: "/ferramentas/gerador-de-qr-code",
				description: "QR codes personalizados",
			},
			{
				name: "Leitor de QR Code",
				href: "/ferramentas/leitor-de-qr-code",
				description: "Leia QR por imagem",
			},
			{
				name: "Converter Imagem em Texto",
				href: "/ferramentas/converter-imagem-em-texto",
				description: "OCR no navegador",
			},
		],
	},

	{
		id: "pdf",
		name: "PDF",
		description: "Manipulação de arquivos PDF",
		tools: [
			{
				name: "Juntar PDF",
				href: "/ferramentas/juntar-pdf",
				description: "Una PDFs",
			},
			{
				name: "Dividir PDF",
				href: "/ferramentas/dividir-pdf",
				description: "Separe páginas",
			},
			{
				name: "Comprimir PDF",
				href: "/ferramentas/comprimir-pdf",
				description: "Reduza tamanho",
			},
		],
	},

	{
		id: "colecoes",
		name: "Emojis e Símbolos",
		description: "Coleções para copiar e colar",
		tools: [
			{
				name: "Emojis",
				href: "/ferramentas/emojis",
				description: "Copie emojis",
			},
			{
				name: "Emoticons",
				href: "/ferramentas/emoticons",
				description: "Kaomoji e clássicos",
			},
			{
				name: "Símbolos",
				href: "/ferramentas/simbolos",
				description: "Símbolos especiais",
			},
		],
	},
];

export default function HomePage() {
	return (
		<>
			<section className="border-b border-border bg-card/50 py-16 sm:py-24">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="mx-auto max-w-3xl text-center">
						<h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
							Ferramentas online <span className="text-primary">gratuitas</span>
						</h1>
						<p className="mt-6 text-lg text-muted-foreground">
							Sem cadastro, sem instalação. Tudo direto no navegador.
						</p>
					</div>
				</div>
			</section>

			<section className="py-16">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<ToolSearch categories={categories} />
				</div>
			</section>

			<section className="border-t border-border bg-card/50 py-16">
				<div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
					<h2 className="mb-6 text-2xl font-bold">
						Por que usar o Ferramenta Ninja?
					</h2>

					<div className="grid gap-6 sm:grid-cols-3">
						<div>
							<h3 className="font-semibold">Gratuito</h3>
							<p className="text-sm text-muted-foreground">
								Todas as ferramentas são gratuitas
							</p>
						</div>

						<div>
							<h3 className="font-semibold">Sem cadastro</h3>
							<p className="text-sm text-muted-foreground">Use imediatamente</p>
						</div>

						<div>
							<h3 className="font-semibold">Privacidade</h3>
							<p className="text-sm text-muted-foreground">
								Tudo roda no seu navegador
							</p>
						</div>
					</div>
				</div>
			</section>
		</>
	);
}
