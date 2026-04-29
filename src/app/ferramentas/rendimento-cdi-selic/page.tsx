import type { Metadata } from "next";
import { PageLayout } from "@/components/shared/page-layout";
import { RelatedTools } from "@/components/shared/related-tools";
import { FixedIncomeClient } from "@/components/tools/fixed-income/fixed-income-client";

export const metadata: Metadata = {
	title: "Calculadora de Rendimento CDI e Selic | Ferramenta Ninja",
	description:
		"Simule rendimento de CDB, LCI, LCA, Tesouro Selic e prefixados. Considera IR regressivo e IOF para cálculo do rendimento líquido.",
	keywords: [
		"rendimento cdi",
		"calculadora cdb",
		"selic",
		"rendimento liquido",
		"ir regressivo",
	],
};

function SeoContent() {
	return (
		<>
			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Como funciona a tributação de renda fixa
				</h2>
				<p>
					CDBs, Tesouro Direto e fundos de renda fixa estão sujeitos ao IR
					regressivo previsto na Lei 11.033/2004:
				</p>
				<ul className="mt-3 list-disc space-y-1 pl-6">
					<li>Até 180 dias: 22,5%</li>
					<li>De 181 a 360 dias: 20%</li>
					<li>De 361 a 720 dias: 17,5%</li>
					<li>Acima de 720 dias: 15%</li>
				</ul>
				<p className="mt-3">
					Resgates antes de 30 dias pagam IOF regressivo (96% no dia 1, 0% no
					dia 30) sobre o rendimento, conforme Decreto 6.306/2007.
				</p>
				<p className="mt-3">
					LCI e LCA são <strong>isentos de IR e IOF</strong> para pessoa física
					(Lei 11.033/2004 art. 1º §1º), o que pode tornar uma LCI a 90% do CDI
					mais rentável que um CDB a 100% do CDI.
				</p>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">Como simular</h2>
				<ul className="list-disc space-y-2 pl-6">
					<li>Informe o valor aplicado e o prazo em dias corridos.</li>
					<li>
						Escolha o indexador (CDI, Selic ou prefixado) e a taxa anual
						vigente.
					</li>
					<li>
						No CDI/Selic, ajuste o percentual do indexador (90%, 100%, 110%
						etc.).
					</li>
					<li>
						Para LCI/LCA, selecione o tipo correto para zerar IR e IOF
						automaticamente.
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
							A taxa do CDI é a mesma da Selic?
						</h3>
						<p>
							São próximas, mas não idênticas. O CDI segue de perto a Selic meta
							com pequena diferença diária. Para simulações, usar a taxa anual
							divulgada do CDI é o padrão.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							A simulação considera marcação a mercado?
						</h3>
						<p>
							Não. Considera apenas o rendimento até o vencimento. Tesouro
							prefixado e IPCA+ podem oscilar antes do vencimento, mas o resgate
							na data informada usa a taxa contratada.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							A simulação inclui FGC?
						</h3>
						<p>
							A cobertura do FGC é informativa (até R$ 250 mil por CPF e
							instituição) e não influencia o cálculo de rendimento.
						</p>
					</div>
				</div>
			</section>
		</>
	);
}

export default function FixedIncomePage() {
	return (
		<PageLayout
			toolHref="/ferramentas/rendimento-cdi-selic"
			title="Calculadora de Rendimento CDI/Selic"
			description="Simule o rendimento líquido de CDB, LCI, LCA e Tesouro com IR regressivo."
			relatedTools={
				<RelatedTools currentHref="/ferramentas/rendimento-cdi-selic" />
			}
			extraContent={<SeoContent />}
		>
			<FixedIncomeClient />
		</PageLayout>
	);
}
