import type { Metadata } from "next";
import { PageLayout } from "@/components/shared/page-layout";
import { RelatedTools } from "@/components/shared/related-tools";
import { CompoundInterestClient } from "@/components/tools/compound-interest/compound-interest-client";

export const metadata: Metadata = {
	title: "Calculadora de Juros Compostos | Ferramenta Ninja",
	description:
		"Simule juros compostos com aportes mensais e veja a evolução do patrimônio mês a mês. Inclui taxa anual, prazo e timing dos aportes.",
	keywords: [
		"juros compostos",
		"calculadora juros compostos",
		"investimento mensal",
		"simulador investimento",
		"juros sobre juros",
	],
};

function SeoContent() {
	return (
		<>
			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					O que são juros compostos
				</h2>
				<p>
					Juros compostos são juros calculados sobre o saldo acumulado, ou
					seja, juros que rendem juros. A fórmula básica é{" "}
					<strong>M = P × (1 + i)<sup>n</sup></strong>, onde M é o montante,
					P o capital inicial, i a taxa do período e n o número de períodos.
				</p>
				<p className="mt-3">
					Quando há aportes mensais, soma-se o termo{" "}
					<strong>PMT × [((1 + i)<sup>n</sup> − 1) / i]</strong>. Esta
					calculadora gera a evolução mês a mês, distinguindo aportes feitos no
					início (annuity-due) ou no fim do período (annuity-end).
				</p>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Para que serve
				</h2>
				<ul className="list-disc space-y-2 pl-6">
					<li>Planejar aposentadoria com aportes mensais.</li>
					<li>Comparar diferentes taxas de retorno.</li>
					<li>Visualizar o efeito do tempo no patrimônio.</li>
					<li>Calcular meta de investimento.</li>
				</ul>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Perguntas Frequentes
				</h2>
				<div className="space-y-6">
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							A taxa informada é nominal ou efetiva?
						</h3>
						<p>
							A taxa anual é convertida em mensal equivalente pela fórmula{" "}
							(1 + i<sub>a</sub>)<sup>1/12</sup> − 1, considerada a taxa
							efetiva.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							A simulação considera impostos?
						</h3>
						<p>
							Não. Para simular impostos sobre renda fixa, use a calculadora
							de rendimento CDI/Selic.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Faz diferença aportar no início ou no fim do mês?
						</h3>
						<p>
							Sim. Aportar no início rende um mês a mais por aporte. Em prazos
							longos, a diferença é significativa.
						</p>
					</div>
				</div>
			</section>
		</>
	);
}

export default function CompoundInterestPage() {
	return (
		<PageLayout
			title="Calculadora de Juros Compostos"
			description="Simule investimentos com aportes mensais e veja a evolução do patrimônio."
			relatedTools={
				<RelatedTools currentHref="/ferramentas/calculadora-juros-compostos" />
			}
			extraContent={<SeoContent />}
		>
			<CompoundInterestClient />
		</PageLayout>
	);
}
