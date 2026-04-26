import type { FaqItem } from "@/lib/seo/jsonld";

type CategoryContent = {
	intro: string;
	longDescription: string;
	faq?: FaqItem[];
};

export const categoryContent: Record<string, CategoryContent> = {
	texto: {
		intro:
			"Ferramentas para manipular, contar, limpar e formatar texto direto no navegador.",
		longDescription:
			"Lidar com texto bruto consome tempo: contar palavras de uma redação, remover linhas duplicadas em uma lista, limpar caracteres invisíveis colados de um e-mail, formatar mensagens para o WhatsApp ou comparar duas versões de um documento. Reunimos aqui as ferramentas de texto mais usadas no dia a dia, todas funcionando 100% no seu navegador. Nada é enviado para servidores — privacidade total. Use sem cadastro, sem instalação e quantas vezes precisar.",
		faq: [
			{
				question: "Meus textos são salvos em algum servidor?",
				answer:
					"Não. Todas as ferramentas de texto rodam localmente no seu navegador. O conteúdo nunca sai do seu computador.",
			},
			{
				question: "Existe limite de tamanho para o texto?",
				answer:
					"O limite é a memória do seu navegador. Para textos comuns (artigos, listas, redações) não há restrição prática.",
			},
		],
	},
	"geradores-texto": {
		intro: "Gere conteúdo de texto para protótipos, testes e inspiração.",
		longDescription:
			"Lorem Ipsum, frases aleatórias e geradores temáticos são úteis em maquetes, layouts e testes de campo. Em vez de inventar conteúdo na hora, use um gerador para preencher rápido e focar no design ou na lógica. As ferramentas funcionam offline no navegador — basta abrir e copiar.",
	},
	dados: {
		intro:
			"Conversores e codificadores: binário, base64, hash, código Morse, unidades.",
		longDescription:
			"Converter dados entre formatos é tarefa recorrente: gerar hash MD5/SHA, codificar em base64, traduzir um número decimal para binário, ou simplesmente converter quilômetros para milhas. Centralizamos os conversores mais usados, todos client-side. Sem rede, sem upload, sem espera.",
		faq: [
			{
				question: "Os hashes gerados são confiáveis para uso em segurança?",
				answer:
					"Os algoritmos seguem padrões públicos (RFC), mas para uso crítico (autenticação, criptografia) sempre valide com bibliotecas auditadas no seu backend.",
			},
		],
	},
	csv: {
		intro: "Visualize, converta e transforme arquivos CSV sem instalar nada.",
		longDescription:
			"CSV é o formato universal de planilhas, mas trabalhar com arquivos grandes ou converter para JSON, SQL ou PDF normalmente exige scripts. Aqui você arrasta o arquivo, vê o resultado e baixa — tudo sem upload para servidor. Útil para analistas, desenvolvedores e qualquer um que precise extrair valor rápido de uma planilha.",
		faq: [
			{
				question: "Os arquivos são enviados para algum servidor?",
				answer:
					"Não. O parsing acontece inteiramente no navegador. Seus dados não saem do seu computador.",
			},
			{
				question: "Qual o tamanho máximo de arquivo CSV suportado?",
				answer:
					"Depende da memória disponível no navegador. Arquivos até algumas dezenas de megabytes funcionam bem na maioria dos dispositivos.",
			},
		],
	},
	documentos: {
		intro:
			"Crie currículos, recibos, ordens de serviço e outros documentos prontos para imprimir.",
		longDescription:
			"Documentos práticos sem precisar de Word ou Google Docs: monte um currículo profissional, gere um recibo formal, emita uma ordem de serviço, crie um cartão fidelidade ou monte um cardápio digital. Cada ferramenta gera PDF pronto para impressão ou compartilhamento. Sem cadastro, sem watermark, sem limite de uso.",
		faq: [
			{
				question: "Posso usar comercialmente os documentos gerados?",
				answer:
					"Sim. Os PDFs são seus, sem watermark e sem restrição de uso. Use livremente para fins pessoais ou comerciais.",
			},
		],
	},
	calculadoras: {
		intro:
			"Calculadoras de salário, férias, 13º, rescisão, financiamento, IMC e mais.",
		longDescription:
			"Calcular folha de pagamento, férias, rescisão ou financiamento exige conhecer fórmulas oficiais e tabelas atualizadas (INSS, IRRF, FGTS). Nossas calculadoras seguem a legislação brasileira vigente e são revisadas conforme atualizações de tetos e alíquotas. Use para conferir o holerite, planejar uma demissão consciente, simular um financiamento ou avaliar saúde — tudo gratuito e sem cadastro.",
		faq: [
			{
				question: "As calculadoras seguem a legislação brasileira atual?",
				answer:
					"Sim. As calculadoras trabalhistas (salário, férias, 13º, rescisão, hora extra) seguem a CLT e tabelas oficiais de INSS e IRRF vigentes. Atualizamos conforme mudanças entram em vigor.",
			},
			{
				question: "Os resultados podem substituir uma assessoria contábil?",
				answer:
					"Não. As calculadoras são ferramentas de apoio para conferência e simulação. Para decisões definitivas, consulte um contador ou advogado.",
			},
			{
				question: "Meus dados financeiros são salvos?",
				answer:
					"Não. Todos os cálculos rodam no seu navegador. Nada é enviado para servidores.",
			},
		],
	},
	sorteios: {
		intro: "Sorteios e geradores de números aleatórios para qualquer ocasião.",
		longDescription:
			"Precisa sortear um vencedor, distribuir tarefas ou gerar números aleatórios para teste? Use nossos sorteios online — funcionam no navegador, sem cadastro, sem login. Resultado imediato e auditável.",
	},
	seguranca: {
		intro:
			"Geradores e validadores de senhas, UUIDs, CPF, CNPJ e cartões para teste.",
		longDescription:
			"Geradores de senhas seguras com tamanho e composição configuráveis, UUIDs para sistemas, e validadores/geradores de documentos brasileiros (CPF, CNPJ) para uso em desenvolvimento. Importante: os documentos gerados são matematicamente válidos mas fictícios — destinam-se exclusivamente a testes e nunca devem ser usados para fraude.",
		faq: [
			{
				question: "As senhas geradas são realmente aleatórias?",
				answer:
					"Sim. Usamos a Web Crypto API do navegador (crypto.getRandomValues), que é criptograficamente segura.",
			},
			{
				question: "Posso usar os CPF/CNPJ gerados para algum cadastro real?",
				answer:
					"Não. Os documentos são fictícios e existem apenas para teste de software. Usar para fraude é crime previsto no Código Penal.",
			},
		],
	},
	imagens: {
		intro: "Editores e processadores de imagem direto no navegador.",
		longDescription:
			"Reduza, converta e edite imagens sem instalar Photoshop. Tudo funciona localmente — suas imagens nunca são enviadas a servidores. Ideal para tarefas rápidas: comprimir uma foto antes de enviar por e-mail, converter PNG para JPG, ou fazer um desenho rápido.",
	},
	pdf: {
		intro: "Junte, comprima e manipule arquivos PDF sem upload.",
		longDescription:
			"PDFs costumam ser pesados e difíceis de manipular sem ferramentas pagas. Aqui você junta arquivos, comprime tamanho e faz operações comuns direto no navegador. Os arquivos não saem do seu computador — privacidade preservada.",
		faq: [
			{
				question: "Meus PDFs são enviados para algum servidor?",
				answer:
					"Não. Toda a manipulação acontece no navegador via JavaScript. Os arquivos permanecem locais.",
			},
		],
	},
	colecoes: {
		intro:
			"Emojis, símbolos especiais e emoticons prontos para copiar e colar.",
		longDescription:
			"Coleções organizadas de emojis, símbolos Unicode e emoticons. Encontre rápido o caractere que precisa, clique e cole onde quiser. Útil para mensagens, redes sociais, design e documentação.",
	},
};
