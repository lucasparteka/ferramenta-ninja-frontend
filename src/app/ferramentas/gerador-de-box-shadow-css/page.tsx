import type { Metadata } from "next";
import { PageLayout } from "@/components/shared/page-layout";
import { BoxShadowGenerator } from "@/components/tools/box-shadow/box-shadow-generator";

export const metadata: Metadata = {
	title: "Gerador de Box Shadow CSS Online Grátis",
	description:
		"Crie sombras CSS personalizadas com preview em tempo real. Ajuste offset, blur, spread, opacidade e cor. Suporte a múltiplas camadas e presets prontos.",
	keywords: [
		"gerador de sombra css",
		"box shadow generator",
		"sombra em css",
		"css shadow",
		"box-shadow css",
		"gerador de box shadow",
		"sombra css online",
	],
};

const faq = [
	{
		question: "O que é box-shadow no CSS?",
		answer:
			"A propriedade box-shadow do CSS adiciona efeitos de sombra ao redor de um elemento. Você pode controlar o deslocamento horizontal e vertical, o desfoque (blur), o espalhamento (spread), a cor e a opacidade da sombra.",
	},
	{
		question: "Qual a diferença entre blur e spread?",
		answer:
			"Blur (desfoque) controla o quanto a sombra é borrada — valores maiores criam sombras mais suaves e difusas. Spread (espalhamento) expande ou contrai o tamanho da sombra antes do desfoque ser aplicado — valores positivos expandem, negativos contraem.",
	},
	{
		question: "O que é inset em box-shadow?",
		answer:
			"A palavra-chave inset inverte a sombra para dentro do elemento, criando um efeito de sombra interna. É útil para simular profundidade, como em botões pressionados ou campos de input com aparência embutida.",
	},
	{
		question: "Posso usar múltiplas sombras no mesmo elemento?",
		answer:
			"Sim! O CSS permite declarar várias sombras separadas por vírgula na mesma propriedade box-shadow. Isso é útil para criar efeitos mais complexos, como sombras em camadas ou combinações de sombra interna e externa.",
	},
	{
		question: "Como funciona a opacidade da sombra?",
		answer:
			"A opacidade controla a transparência da cor da sombra. 100% é totalmente opaco (cor sólida) e 0% é totalmente transparente (invisível). Valores entre 10% e 30% são comuns para sombras sutis em interfaces.",
	},
];

function SeoContent() {
	return (
		<section className="mt-12 space-y-8">
			<h2 className="text-2xl font-bold text-foreground">
				Como usar o gerador de box-shadow
			</h2>
			<p className="text-muted-foreground">
				Selecione uma das camadas de sombra ou adicione uma nova. Use os sliders
				para ajustar o deslocamento horizontal (X) e vertical (Y), o desfoque
				(blur), o espalhamento (spread), a opacidade e a cor da sombra.
			</p>
			<p className="text-muted-foreground">
				Alterne entre sombra normal e sombra interna (inset) com o seletor de
				tipo. O preview em tempo real mostra o efeito aplicado em um quadrado e
				em um botão, para que você visualize como ficará em elementos reais.
			</p>
			<p className="text-muted-foreground">
				Quando estiver satisfeito, copie o código CSS gerado e cole no seu
				projeto. Você também pode aplicar um preset clicando em uma das opções
				prontas.
			</p>

			<h2 className="text-2xl font-bold text-foreground">
				Dicas para sombras profissionais
			</h2>
			<p className="text-muted-foreground">
				Para sombras sutis em cards e modais, use valores baixos de desfoque
				(4-8px) e opacidade entre 8% e 15%. Para criar profundidade realista,
				combine duas camadas: uma sombra próxima e nítida com uma sombra
				distante e difusa.
			</p>
			<p className="text-muted-foreground">
				Sombra interna (inset) funciona bem para simular estados pressionados de
				botões ou inputs com aparência de campo de formulário.
			</p>

			<h2 className="text-2xl font-bold text-foreground">
				Compatibilidade e navegadores
			</h2>
			<p className="text-muted-foreground">
				A propriedade box-shadow é suportada por todos os navegadores modernos,
				incluindo Chrome, Firefox, Safari e Edge. Não é necessário prefixo de
				vendor para versões atuais.
			</p>
		</section>
	);
}

export default function BoxShadowPage() {
	return (
		<PageLayout
			title="Gerador de Box Shadow CSS"
			description="Crie sombras CSS personalizadas com preview em tempo real. Ajuste offset, blur, spread, opacidade e cor."
			faq={faq}
			extraContent={<SeoContent />}
		>
			<BoxShadowGenerator />
		</PageLayout>
	);
}
