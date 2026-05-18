import type { Metadata } from "next";
import { PageLayout } from "@/components/shared/page-layout";
import { RelatedTools } from "@/components/shared/related-tools";
import { ColorContrastChecker } from "@/components/tools/color-contrast/color-contrast-checker";

export const metadata: Metadata = {
	title: "Verificador de Contraste de Cores WCAG Online Grátis | Ferramenta Ninja",
	description:
		"Verifique a taxa de contraste entre cor de texto e fundo conforme WCAG 2.1. Classifica AA e AAA para texto normal, texto grande e componentes. Inclui simulador de daltonismo.",
	keywords: [
		"verificar contraste cores",
		"taxa de contraste wcag",
		"wcag aa aaa",
		"acessibilidade cores",
		"contraste texto fundo",
		"daltonismo simulador",
		"contraste de cores online",
	],
};

const faq = [
	{
		question: "O que é taxa de contraste?",
		answer:
			"A taxa de contraste mede a diferença de luminosidade entre duas cores, como texto e fundo. Calculada pela fórmula WCAG 2.1, ela vai de 1:1 (cores idênticas) a 21:1 (preto sobre branco). Quanto maior o valor, mais legível é o texto.",
	},
	{
		question: "Qual é o mínimo de contraste para acessibilidade?",
		answer:
			'O WCAG 2.1 define dois níveis: AA exige 4.5:1 para texto normal e 3:1 para texto grande (18pt+ ou 14pt+ bold). AAA exige 7:1 para texto normal e 4.5:1 para texto grande. A maioria dos projetos mira no nível AA como requisito mínimo.',
	},
	{
		question: 'O que é "texto grande" no contexto WCAG?',
		answer:
			"Texto grande é definido como 18 pontos tipográficos (≈24px) ou maior, ou 14 pontos (≈18.67px) com peso bold. Texto grande recebe critérios mais flexíveis porque é naturalmente mais legível em contraste menor.",
	},
	{
		question: "Para que servem os simuladores de daltonismo?",
		answer:
			"Os simuladores mostram como a combinação de cores parece para pessoas com deficiências de percepção de cor: protanopia (dificuldade com vermelho), deuteranopia (dificuldade com verde) e tritanopia (dificuldade com azul). Isso ajuda a verificar se o design é acessível para todos.",
	},
	{
		question: "Os dados são enviados para algum servidor?",
		answer:
			"Não. Todo o cálculo acontece localmente no navegador usando matemática pura (fórmulas WCAG). Nenhum dado é transmitido ou armazenado em servidores externos.",
	},
];

function SeoContent() {
	return (
		<>
			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Por que contraste de cores importa
				</h2>
				<div className="space-y-3">
					<p>
						Contraste insuficiente entre texto e fundo é um dos problemas de
						acessibilidade mais comuns na web. Afeta diretamente usuários com
						baixa visão, daltonismo ou que usam dispositivos em condições de
						iluminação adversa — como sol forte em telas externas.
					</p>
					<p>
						Além do impacto em acessibilidade, o contraste adequado melhora a
						legibilidade geral e reduz a fadiga visual de todos os usuários,
						independentemente de limitações específicas.
					</p>
				</div>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Critérios WCAG 2.1 explicados
				</h2>
				<div className="space-y-3">
					<ul className="list-disc space-y-2 pl-6">
						<li>
							<strong className="text-foreground">Nível A:</strong> requisitos
							mínimos. Não inclui critérios de contraste de cor.
						</li>
						<li>
							<strong className="text-foreground">Nível AA (recomendado):</strong>{" "}
							4.5:1 para texto normal, 3:1 para texto grande e componentes de
							interface. É o nível exigido pela maioria das legislações de
							acessibilidade.
						</li>
						<li>
							<strong className="text-foreground">Nível AAA (excelência):</strong>{" "}
							7:1 para texto normal, 4.5:1 para texto grande. Garante legibilidade
							máxima, inclusive para usuários com deficiência visual severa.
						</li>
					</ul>
				</div>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Como usar o verificador
				</h2>
				<div className="space-y-3">
					<p>
						<strong className="text-foreground">1. Escolha as cores:</strong>{" "}
						use os color pickers ou insira os valores manualmente em HEX, RGB ou
						HSL. O preview e os critérios atualizam em tempo real.
					</p>
					<p>
						<strong className="text-foreground">2. Leia o resultado:</strong>{" "}
						a taxa de contraste aparece em destaque no painel direito, seguida
						de todos os critérios WCAG 2.1 com indicação de aprovação ou reprovação.
					</p>
					<p>
						<strong className="text-foreground">3. Use a sugestão:</strong>{" "}
						se a combinação reprovar no nível AA para texto normal, a ferramenta
						sugere automaticamente a cor de texto mais próxima que passa no critério.
					</p>
					<p>
						<strong className="text-foreground">4. Teste o daltonismo:</strong>{" "}
						ative os simuladores para verificar como as cores aparecem para pessoas
						com diferentes tipos de deficiência de percepção de cor.
					</p>
				</div>
			</section>
		</>
	);
}

export default function VerificadorDeContrastePage() {
	return (
		<PageLayout
			toolHref="/ferramentas/verificador-de-contraste-de-cores"
			title="Verificador de Contraste de Cores"
			description="Calcule a taxa de contraste WCAG 2.1 entre texto e fundo. Classifica AA e AAA, inclui simulador de daltonismo e sugestão automática de cor acessível."
			relatedTools={
				<RelatedTools currentHref="/ferramentas/verificador-de-contraste-de-cores" />
			}
			extraContent={<SeoContent />}
			faq={faq}
		>
			<ColorContrastChecker />
		</PageLayout>
	);
}
