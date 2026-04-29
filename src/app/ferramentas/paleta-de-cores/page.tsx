import type { Metadata } from "next";
import { PageLayout } from "@/components/shared/page-layout";
import { RelatedTools } from "@/components/shared/related-tools";
import { ColorPalette } from "@/components/tools/color-palette/color-palette";

export const metadata: Metadata = {
	title: "Paleta de Cores Online Grátis | Ferramenta Ninja",
	description:
		"Gere paletas de cores harmônicas a partir de uma cor base. Complementar, análoga, triádica e monocromática. Ferramenta gratuita para designers e desenvolvedores.",
};

const faq = [
	{
		question: "O que é uma paleta de cores harmônica?",
		answer:
			"É um conjunto de cores que funcionam bem juntas visualmente, baseado em relações matemáticas na roda de cores. Harmonia garante que o design fique equilibrado e agradável.",
	},
	{
		question: "Qual tipo de paleta devo usar?",
		answer:
			"Use complementar para contraste forte, análoga para suavidade, triádica para equilíbrio vibrante e monocromática para elegância e simplicidade.",
	},
	{
		question: "Posso copiar o HEX das cores?",
		answer:
			"Sim. Clique em qualquer cor da paleta para copiar o código HEX automaticamente para a área de transferência.",
	},
];

function SeoContent() {
	return (
		<>
			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					O que é uma paleta de cores?
				</h2>
				<p>
					Uma paleta de cores é um conjunto selecionado de cores usado em design
					gráfico, web design, ilustração e branding. Escolher cores que
					harmonizam entre si é fundamental para criar layouts visualmente
					agradáveis e transmitir a mensagem certa ao público.
				</p>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Tipos de harmonia de cores
				</h2>
				<div className="space-y-3">
					<ul className="list-disc space-y-2 pl-6">
						<li>
							<strong className="text-foreground">Complementar:</strong> duas
							cores opostas na roda de cores. Cria contraste máximo e destaque
							visual.
						</li>
						<li>
							<strong className="text-foreground">Análoga:</strong> cores
							adjacentes na roda. Transições suaves e naturais, ideais para
							designs relaxantes.
						</li>
						<li>
							<strong className="text-foreground">Triádica:</strong> três cores
							equidistantes. Equilíbrio vibrante entre variedade e harmonia.
						</li>
						<li>
							<strong className="text-foreground">Monocromática:</strong>{" "}
							variações de tonalidade, saturação e brilho de uma única cor.
							Elegante e minimalista.
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
						Escolha uma cor base usando o seletor de cor ou digitando um código
						HEX. Selecione o tipo de harmonia desejada e a paleta é gerada
						instantaneamente. Clique em qualquer cor para copiar seu código HEX.
					</p>
				</div>
			</section>
		</>
	);
}

export default function PaletaDeCoresPage() {
	return (
		<PageLayout
			toolHref="/ferramentas/paleta-de-cores"
			title="Paleta de Cores"
			description="Gere paletas de cores harmônicas a partir de uma cor base. Escolha entre complementar, análoga, triádica e monocromática. Rápido, gratuito e sem cadastro."
			relatedTools={<RelatedTools currentHref="/ferramentas/paleta-de-cores" />}
			extraContent={<SeoContent />}
			faq={faq}
		>
			<ColorPalette />
		</PageLayout>
	);
}
