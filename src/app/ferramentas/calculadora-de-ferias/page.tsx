import type { Metadata } from "next";
import { PageLayout } from "@/components/shared/page-layout";
import { RelatedTools } from "@/components/shared/related-tools";
import { VacationCalculatorClient } from "@/components/tools/vacation-calculator/vacation-calculator-client";

export const metadata: Metadata = {
	title: "Calculadora de Férias 2026 | Ferramenta Ninja",
	description:
		"Calcule o valor das férias com 1/3 constitucional, abono pecuniário e descontos de INSS e IRRF. Tabelas oficiais 2026.",
	keywords: [
		"calculadora ferias",
		"ferias 2026",
		"abono pecuniario",
		"1/3 ferias",
		"ferias proporcionais",
	],
};

function SeoContent() {
	return (
		<>
			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Como funcionam as férias
				</h2>
				<p>
					O direito a férias é garantido pela CLT (arts. 129 a 153). Após cada
					período aquisitivo de 12 meses, o trabalhador adquire 30 dias de
					descanso remunerado, acrescidos do 1/3 constitucional previsto no art.
					7º XVII da Constituição.
				</p>
				<p className="mt-3">
					O empregado pode converter 10 dias em abono pecuniário (CLT art. 143),
					recebendo o equivalente em dinheiro e tirando 20 dias de descanso. O
					abono também recebe 1/3 e é isento de INSS e IRRF.
				</p>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Fracionamento das férias
				</h2>
				<p>
					Pela CLT art. 134 §1º (Reforma Trabalhista, Lei 13.467/2017), as
					férias podem ser divididas em até 3 períodos, desde que:
				</p>
				<ul className="mt-3 list-disc space-y-1 pl-6">
					<li>Um dos períodos tenha pelo menos 14 dias corridos.</li>
					<li>Os demais períodos não sejam inferiores a 5 dias cada.</li>
					<li>Haja concordância do empregado.</li>
				</ul>
				<p className="mt-3">
					Ajuste o campo "Dias de férias" para calcular o valor proporcional de
					uma fração específica das férias.
				</p>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Faltas reduzem os dias de férias
				</h2>
				<p>
					Conforme o art. 130 da CLT, o número de faltas injustificadas no
					período aquisitivo reduz os dias de férias:
				</p>
				<ul className="mt-3 list-disc space-y-1 pl-6">
					<li>Até 5 faltas: 30 dias</li>
					<li>De 6 a 14 faltas: 24 dias</li>
					<li>De 15 a 23 faltas: 18 dias</li>
					<li>De 24 a 32 faltas: 12 dias</li>
					<li>Acima de 32 faltas: sem direito</li>
				</ul>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">Descontos</h2>
				<ul className="list-disc space-y-2 pl-6">
					<li>
						<strong>INSS:</strong> incide sobre férias + 1/3 (tabela 2026).
					</li>
					<li>
						<strong>IRRF:</strong> incide sobre férias + 1/3, sem aplicar o
						redutor da reforma 2025.
					</li>
					<li>
						<strong>Abono pecuniário:</strong> isento de INSS e IRRF (IN RFB
						1500/2014).
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
							Quando as férias devem ser pagas?
						</h3>
						<p>
							Até 2 dias antes do início do período de férias (CLT art. 145).
							Atraso gera pagamento em dobro.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Posso vender todos os 30 dias?
						</h3>
						<p>
							Não. A lei limita o abono a 1/3 do período (10 dias). O restante
							deve ser usufruído como descanso.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Férias proporcionais na rescisão são tributadas?
						</h3>
						<p>
							Férias indenizadas pagas em rescisão não sofrem incidência de IRRF
							nem INSS, conforme IN RFB 1500/2014.
						</p>
					</div>
				</div>
			</section>
		</>
	);
}

export default function VacationCalculatorPage() {
	return (
		<PageLayout
			toolHref="/ferramentas/calculadora-de-ferias"
			title="Calculadora de Férias"
			description="Calcule o valor líquido das férias com 1/3 e abono pecuniário."
			relatedTools={
				<RelatedTools currentHref="/ferramentas/calculadora-de-ferias" />
			}
			extraContent={<SeoContent />}
		>
			<VacationCalculatorClient />
		</PageLayout>
	);
}
