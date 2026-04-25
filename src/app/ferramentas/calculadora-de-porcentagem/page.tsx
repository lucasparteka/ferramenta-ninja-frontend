import type { Metadata } from "next";
import { PageLayout } from "@/components/shared/page-layout";
import { RelatedTools } from "@/components/shared/related-tools";
import { PercentageCalculator } from "@/components/tools/percentage-calculator/percentage-calculator";

export const metadata: Metadata = {
	title: "Calculadora de Porcentagem Online Grátis | Ferramenta Ninja",
	description:
		"Calcule porcentagens, variações, aumentos e descontos com 5 calculadoras interativas. Resultados em tempo real, sem cadastro, direto no navegador.",
};

function SeoContent() {
	return (
		<>
			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					O que cada calculadora faz?
				</h2>
				<ul className="list-disc space-y-3 pl-6">
					<li>
						<strong className="text-foreground">
							Calculadora 1 — Porcentagem de um valor:
						</strong>{" "}
						calcula quanto representa uma porcentagem de um número. Exemplo:
						quanto é 15% de 200? Resposta: 30.
					</li>
					<li>
						<strong className="text-foreground">
							Calculadora 2 — Qual é a porcentagem:
						</strong>{" "}
						descobre qual porcentagem um valor representa em relação a outro.
						Exemplo: 40 é qual porcentagem de 200? Resposta: 20%.
					</li>
					<li>
						<strong className="text-foreground">
							Calculadora 3 — Variação percentual:
						</strong>{" "}
						calcula o aumento ou redução percentual entre dois valores. Exemplo:
						um produto que custava R$ 80 e passou a custar R$ 100 teve variação
						de +25%.
					</li>
					<li>
						<strong className="text-foreground">
							Calculadora 4 — Aumentar por porcentagem:
						</strong>{" "}
						aplica um acréscimo percentual a um valor. Exemplo: R$ 500 com
						aumento de 10% resulta em R$ 550.
					</li>
					<li>
						<strong className="text-foreground">
							Calculadora 5 — Diminuir por porcentagem:
						</strong>{" "}
						aplica um desconto percentual a um valor. Exemplo: R$ 500 com
						desconto de 20% resulta em R$ 400.
					</li>
				</ul>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Usos comuns de porcentagem
				</h2>
				<div className="space-y-3">
					<p>
						<strong className="text-foreground">Descontos e promoções:</strong>{" "}
						use a Calculadora 5 para saber o preço final de um produto com
						desconto, ou a Calculadora 2 para descobrir qual desconto foi
						aplicado ao comparar o preço original com o preço promocional.
					</p>
					<p>
						<strong className="text-foreground">Reajustes e aumentos:</strong> a
						Calculadora 4 é ideal para calcular reajustes salariais, aumentos de
						preço ou correção monetária. A Calculadora 3 mostra qual foi a
						variação percentual entre dois valores quaisquer.
					</p>
					<p>
						<strong className="text-foreground">Notas e aproveitamento:</strong>{" "}
						a Calculadora 2 permite calcular quantos por cento de questões foram
						acertadas em uma prova, ou qual foi o aproveitamento em relação à
						meta.
					</p>
					<p>
						<strong className="text-foreground">
							Finanças e investimentos:
						</strong>{" "}
						calcule o rendimento percentual de um investimento, a taxa de juros
						efetiva ou a variação de um ativo entre dois períodos usando a
						Calculadora 3.
					</p>
					<p>
						<strong className="text-foreground">Impostos e taxas:</strong> use a
						Calculadora 1 para saber o valor exato de um imposto ou taxa (como
						12% de R$ 3.000) sem precisar de uma planilha.
					</p>
				</div>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Como calcular porcentagem
				</h2>
				<p>
					O cálculo de porcentagem é baseado em uma relação de proporção em
					relação a 100. A palavra "porcentagem" vem do latim{" "}
					<em>per centum</em>, que significa "por cem". Ou seja, 25% equivale a
					25 de cada 100, ou à fração 25/100 = 0,25.
				</p>
				<ul className="mt-4 list-disc space-y-2 pl-6">
					<li>
						Para calcular <strong>X% de Y</strong>: multiplique Y por X e divida
						por 100. Fórmula: <strong>(X × Y) ÷ 100</strong>
					</li>
					<li>
						Para saber <strong>qual % A representa de B</strong>: divida A por B
						e multiplique por 100. Fórmula: <strong>(A ÷ B) × 100</strong>
					</li>
					<li>
						Para calcular <strong>variação percentual</strong> de A para B:
						subtraia A de B, divida pelo valor absoluto de A e multiplique por
						100. Fórmula: <strong>((B − A) ÷ |A|) × 100</strong>
					</li>
				</ul>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Perguntas Frequentes
				</h2>
				<div className="space-y-6">
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Como calcular porcentagem?
						</h3>
						<p>
							Depende do que você precisa. Use a Calculadora 1 para saber o
							valor de uma porcentagem, a Calculadora 2 para descobrir qual
							porcentagem um valor representa, ou a Calculadora 3 para medir
							variações entre dois números.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Como calcular aumento percentual?
						</h3>
						<p>
							Use a Calculadora 4. Insira o valor original e a porcentagem de
							aumento desejada. O resultado mostra o novo valor após o
							acréscimo. Exemplo: R$ 1.000 com aumento de 15% resulta em R$
							1.150.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Como calcular desconto percentual?
						</h3>
						<p>
							Use a Calculadora 5. Insira o valor original e a porcentagem de
							desconto. O resultado é o valor final após a redução. Exemplo: R$
							250 com 30% de desconto resulta em R$ 175.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Qual a diferença entre variação percentual e porcentagem de um
							valor?
						</h3>
						<p>
							Porcentagem de um valor (Calculadora 1) indica quanto uma fração
							representa de um total fixo. Variação percentual (Calculadora 3)
							mede a mudança relativa entre dois valores ao longo do tempo,
							podendo ser positiva (aumento) ou negativa (redução).
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Os cálculos são precisos?
						</h3>
						<p>
							Sim. Os resultados são arredondados para duas casas decimais e
							exibidos no formato numérico brasileiro. Todo o processamento
							acontece no seu navegador, sem enviar dados para servidores
							externos.
						</p>
					</div>
				</div>
			</section>
		</>
	);
}

export default function CalculadoraDePorcentagemPage() {
	return (
		<PageLayout
			title="Calculadora de Porcentagem Online Grátis"
			description="5 calculadoras de porcentagem em uma só página: calcule valores, variações, descontos e aumentos percentuais com resultado em tempo real."
			relatedTools={
				<RelatedTools currentHref="/ferramentas/calculadora-de-porcentagem" />
			}
			extraContent={<SeoContent />}
		>
			<PercentageCalculator />
		</PageLayout>
	);
}
