import type { Metadata } from "next";
import { PageLayout } from "@/components/shared/page-layout";
import { RelatedTools } from "@/components/shared/related-tools";
import { GradientGenerator } from "@/components/tools/gradient-generator/gradient-generator";

export const metadata: Metadata = {
	title: "Gerador de Gradiente CSS Online Grátis | Ferramenta Ninja",
	description:
		"Crie gradientes CSS personalizados com múltiplas cores e ângulos. Gere o código pronto para copiar. Ferramenta gratuita para desenvolvedores e designers.",
};

const faq = [
	{
		question: "O que é um gradiente CSS?",
		answer:
			"É uma transição suave entre duas ou mais cores aplicada como fundo de um elemento HTML. Pode ser linear (em uma direção) ou radial (a partir de um centro).",
	},
	{
		question: "Quantas cores posso usar?",
		answer:
			"Você pode usar de 2 a 5 cores em um único gradiente. Basta adicionar mais paradas de cor e ajustar suas posições.",
	},
	{
		question: "O código funciona em todos os navegadores?",
		answer:
			"Sim. O código gerado usa a sintaxe moderna padrão de gradientes CSS, suportada por todos os navegadores modernos.",
	},
];

function SeoContent() {
	return (
		<>
			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					O que é um gradiente CSS?
				</h2>
				<p>
					Gradiente CSS é uma transição suave entre duas ou mais cores, aplicada
					como fundo de elementos HTML. É uma alternativa moderna e leve a
					imagens de fundo, reduzindo tempo de carregamento e permitindo
					animações e interatividade.
				</p>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Tipos de gradiente
				</h2>
				<div className="space-y-3">
					<ul className="list-disc space-y-2 pl-6">
						<li>
							<strong className="text-foreground">Linear:</strong> cores fluem
							em uma direção reta. Você controla o ângulo (0° a 360°) para
							definir a direção.
						</li>
						<li>
							<strong className="text-foreground">Radial:</strong> cores emanam
							de um ponto central para fora, criando um efeito circular ou
							elíptico.
						</li>
					</ul>
				</div>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Como usar esta ferramenta
				</h2>
				<div className="space-y-3">
					<p>
						Escolha o tipo de gradiente, ajuste as cores e suas posições, defina
						o ângulo (se linear) e visualize o resultado em tempo real. Quando
						estiver satisfeito, copie o código CSS com um clique.
					</p>
				</div>
			</section>
		</>
	);
}

export default function GeradorGradienteCssPage() {
	return (
		<PageLayout
			toolHref="/ferramentas/gerador-gradiente-css"
			title="Gerador de Gradiente CSS"
			description="Crie gradientes CSS personalizados com múltiplas cores e ângulos. Gere o código pronto para copiar. Rápido, gratuito e sem cadastro."
			relatedTools={
				<RelatedTools currentHref="/ferramentas/gerador-gradiente-css" />
			}
			extraContent={<SeoContent />}
			faq={faq}
		>
			<GradientGenerator />
		</PageLayout>
	);
}
