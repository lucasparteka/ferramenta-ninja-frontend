import type { FaqItem } from "@/lib/seo/jsonld";

type CategoryContent = {
	intro: string;
	longDescription: string;
	faq?: FaqItem[];
};

export const categoryContent: Record<string, CategoryContent> = {
	texto: {
		intro:
			"Ferramentas para manipular, contar, limpar, formatar e gerar texto direto no navegador.",
		longDescription:
			"Lidar com texto bruto consome tempo: contar palavras de uma redação, remover linhas duplicadas em uma lista, limpar caracteres invisíveis colados de um e-mail, formatar mensagens para o WhatsApp, comparar duas versões de um documento ou gerar Lorem Ipsum para protótipos. Reunimos aqui as ferramentas de texto mais usadas no dia a dia, todas funcionando 100% no seu navegador. Nada é enviado para servidores — privacidade total. Use sem cadastro, sem instalação e quantas vezes precisar.",
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
	dados: {
		intro:
			"Conversores, formatadores e visualizadores de dados: CSV, JSON, binário, base64, hash, código Morse, unidades.",
		longDescription:
			"Converter dados entre formatos é tarefa recorrente: gerar hash MD5/SHA, codificar em base64, traduzir um número decimal para binário, converter quilômetros para milhas, visualizar CSV como tabela ou transformar planilhas em JSON/SQL/PDF. Centralizamos os conversores e processadores de dados mais usados, todos client-side. Sem rede, sem upload, sem espera.",
		faq: [
			{
				question: "Os hashes gerados são confiáveis para uso em segurança?",
				answer:
					"Os algoritmos seguem padrões públicos (RFC), mas para uso crítico (autenticação, criptografia) sempre valide com bibliotecas auditadas no seu backend.",
			},
			{
				question: "Os arquivos CSV são enviados para algum servidor?",
				answer:
					"Não. O parsing acontece inteiramente no navegador. Seus dados não saem do seu computador.",
			},
		],
	},
	documentos: {
		intro:
			"Crie currículos, cardápios, recibos, ordens de serviço e outros documentos prontos para imprimir.",
		longDescription:
			"Documentos práticos sem precisar de Word ou Google Docs: monte um currículo profissional, gere um recibo formal, emita uma ordem de serviço, crie um cartão fidelidade, monte um cardápio digital ou configure uma assinatura de email profissional. Cada ferramenta gera PDF pronto para impressão ou compartilhamento. Sem cadastro, sem watermark, sem limite de uso.",
		faq: [
			{
				question: "Posso usar comercialmente os documentos gerados?",
				answer:
					"Sim. Os PDFs são seus, sem watermark e sem restrição de uso. Use livremente para fins pessoais ou comerciais.",
			},
		],
	},
	identificadores: {
		intro:
			"Gere e valide CPF, CNPJ e cartões de crédito para testes e desenvolvimento.",
		longDescription:
			"Geradores e validadores de documentos brasileiros (CPF, CNPJ) e cartões de crédito para uso em desenvolvimento e testes de software. Os documentos gerados são matematicamente válidos mas fictícios — destinam-se exclusivamente a testes e nunca devem ser usados para fraude.",
		faq: [
			{
				question: "Posso usar os CPF/CNPJ gerados para algum cadastro real?",
				answer:
					"Não. Os documentos são fictícios e existem apenas para teste de software. Usar para fraude é crime previsto no Código Penal.",
			},
		],
	},
	"consultas-brasil": {
		intro:
			"Consulte CEP, CNPJ, tabela FIPE, decodifique PIX e valide boletos brasileiros.",
		longDescription:
			"Ferramentas de consulta a serviços e dados brasileiros: busca de endereço por CEP via ViaCEP, dados cadastrais de empresa na Receita Federal, preço médio de veículos na tabela FIPE, decodificação de strings PIX copia e cola, e validação de boletos bancários. As consultas usam APIs públicas e funcionam direto no navegador.",
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
	utilitarios: {
		intro:
			"Ferramentas úteis do dia a dia: cronômetro, sorteios, teste de digitação e mais.",
		longDescription:
			"Utilitários rápidos para o dia a dia: meça sua velocidade de digitação, use um cronômetro preciso, impeça a tela de desligar, gere links diretos para WhatsApp, sorteie listas ou gere números aleatórios. Tudo funciona no navegador, sem cadastro, sem instalação.",
	},
	seguranca: {
		intro: "Geradores e validadores de senhas, UUIDs, criptografia e hashes.",
		longDescription:
			"Geradores de senhas seguras com tamanho e composição configuráveis, UUIDs para sistemas, criptografia de texto (AES, Base64, ROT13) e geradores de hash (MD5, SHA-1, SHA-256, SHA-512). Ferramentas client-side que não enviam dados para servidores.",
		faq: [
			{
				question: "As senhas geradas são realmente aleatórias?",
				answer:
					"Sim. Usamos a Web Crypto API do navegador (crypto.getRandomValues), que é criptograficamente segura.",
			},
		],
	},
	codigos: {
		intro: "Gere e leia QR codes, códigos de barras e códigos em lote.",
		longDescription:
			"Geradores de QR codes personalizados (com cores, logo, Wi-Fi, PIX), leitor de QR por imagem, gerador de códigos de barras em diversos formatos e geração em lote. Tudo funciona localmente no navegador — seus dados nunca saem do dispositivo.",
	},
	imagens: {
		intro: "Editores e processadores de imagem direto no navegador.",
		longDescription:
			"Reduza, converta, recorte e edite imagens sem instalar Photoshop. Inclui OCR para extrair texto de imagens e desenho livre no navegador. Tudo funciona localmente — suas imagens nunca são enviadas a servidores. Ideal para tarefas rápidas: comprimir uma foto antes de enviar por e-mail, converter PNG para JPG, ou fazer um desenho rápido.",
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
	desenvolvedor: {
		intro: "Ferramentas para desenvolvimento web, programação e design CSS.",
		longDescription:
			"Codificação e decodificação de Base64 e URL, conversão de timestamps, minificação de CSS/JS/HTML, conversão de Markdown para HTML, geração de meta tags e favicons, paletas de cores, gradientes CSS e box shadows. Tudo que um desenvolvedor front-end precisa para prototipar e otimizar rapidamente.",
	},
};
