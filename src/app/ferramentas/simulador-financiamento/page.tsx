import type { Metadata } from "next";
import { PageLayout } from "@/components/shared/page-layout";
import { RelatedTools } from "@/components/shared/related-tools";
import { LoanCalculatorClient } from "@/components/tools/loan-calculator/loan-calculator-client";

export const metadata: Metadata = {
	title: "Simulador de Financiamento SAC e Price | Ferramenta Ninja",
	description:
		"Compare SAC e Tabela Price no mesmo simulador. Veja parcela inicial e final, total pago, juros e tabela completa de amortização.",
	keywords: [
		"simulador financiamento",
		"sac",
		"tabela price",
		"amortizacao",
		"financiamento imobiliario",
	],
};

function SeoContent() {
	return (
		<>
			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">SAC × Price</h2>
				<p>
					O Sistema de Amortização Constante (SAC) mantém a parcela de
					amortização fixa, com juros decrescentes, gerando parcelas que
					diminuem ao longo do tempo. É comum em financiamentos imobiliários da
					Caixa.
				</p>
				<p className="mt-3">
					A Tabela Price mantém a parcela total fixa, calculada pela fórmula PMT
					= P × i / (1 − (1 + i)<sup>−n</sup>). É comum em financiamento de
					veículos e crédito consignado.
				</p>
				<p className="mt-3">
					Para o mesmo principal, taxa e prazo, o SAC paga menos juros totais,
					mas tem parcelas iniciais maiores. O Price tem parcela menor no
					início, mas custo total mais alto.
				</p>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Como interpretar o resultado
				</h2>
				<ul className="list-disc space-y-2 pl-6">
					<li>
						<strong>Primeira parcela:</strong> compromisso inicial — base do
						cálculo de comprometimento de renda (geralmente 30%).
					</li>
					<li>
						<strong>Última parcela:</strong> mostra o decrescimento (SAC) ou a
						constância (Price).
					</li>
					<li>
						<strong>Total em juros:</strong> custo financeiro total do
						empréstimo.
					</li>
					<li>
						<strong>Tabela:</strong> evolução mensal de saldo devedor, juros e
						amortização.
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
							Vale mais a pena SAC ou Price?
						</h3>
						<p>
							SAC paga menos juros no total, mas exige mais renda no início.
							Price tem parcela fixa e mais previsível. A escolha depende da
							capacidade de pagamento atual.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							A simulação inclui seguro e taxas?
						</h3>
						<p>
							Não. Considera apenas amortização e juros. Em financiamentos
							reais, somam-se MIP, DFI e tarifa de administração.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							A taxa de juros informada é mensal ou anual?
						</h3>
						<p>
							A entrada é a taxa anual efetiva. Internamente convertemos para
							mensal equivalente.
						</p>
					</div>
				</div>
			</section>
		</>
	);
}

export default function LoanSimulatorPage() {
	return (
		<PageLayout
			toolHref="/ferramentas/simulador-financiamento"
			title="Simulador de Financiamento"
			description="Compare SAC e Tabela Price em um único simulador com tabela completa."
			relatedTools={
				<RelatedTools currentHref="/ferramentas/simulador-financiamento" />
			}
			extraContent={<SeoContent />}
		>
			<LoanCalculatorClient />
		</PageLayout>
	);
}
