import type { Metadata } from "next";
import { PageLayout } from "@/components/shared/page-layout";
import { RelatedTools } from "@/components/shared/related-tools";
import { ChristmasBonusCalculatorClient } from "@/components/tools/christmas-bonus-calculator/christmas-bonus-calculator-client";

export const metadata: Metadata = {
	title: "Calculadora de 13º Salário 2026 | Ferramenta Ninja",
	description:
		"Calcule o 13º salário com tabelas INSS e IRRF 2026 atualizadas. Veja o valor das duas parcelas e os descontos.",
	keywords: [
		"calculadora 13 salario",
		"décimo terceiro 2026",
		"13o proporcional",
		"calculo 13 salario",
		"primeira parcela 13",
	],
};

function SeoContent() {
	return (
		<>
			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Como funciona o 13º salário
				</h2>
				<p>
					O 13º salário (gratificação natalina) está previsto na Lei 4.090/1962
					e equivale a 1/12 do salário por mês trabalhado no ano. Cada mês com
					15 dias ou mais conta como avo cheio.
				</p>
				<p className="mt-3">
					O pagamento é feito em duas parcelas: a primeira até 30 de novembro
					(50% sem desconto) e a segunda até 20 de dezembro (a outra metade,
					descontados INSS e IRRF sobre o total bruto).
				</p>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Adiantamento da 1ª parcela junto às férias
				</h2>
				<p>
					Pela Lei 4.749/1965 art. 2º §2º, o empregado pode requerer no mês de
					janeiro do ano corrente que a 1ª parcela do 13º (50%) seja paga junto
					com as férias do mesmo ano.
				</p>
				<p className="mt-3">
					O valor da 1ª parcela permanece o mesmo (50% do bruto). Apenas a
					data de pagamento muda — em vez de ser paga até 30 de novembro,
					antecipa-se para a ocasião das férias.
				</p>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Descontos
				</h2>
				<ul className="list-disc space-y-2 pl-6">
					<li>
						<strong>INSS:</strong> calculado sobre o 13º total, conforme tabela
						2026 (Portaria MPS/MF nº 13/2026).
					</li>
					<li>
						<strong>IRRF:</strong> calculado sobre o 13º total descontado o
						INSS, sem aplicar o redutor da reforma 2025 (que vale apenas para
						salário mensal).
					</li>
					<li>
						<strong>FGTS:</strong> 8% depositado pelo empregador, sem desconto
						no holerite do trabalhador.
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
							Quem trabalhou menos de um ano tem direito?
						</h3>
						<p>
							Sim. O 13º proporcional contempla cada mês com 15 dias ou mais
							trabalhados, na razão de 1/12 do salário por mês.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Adicionais habituais entram no cálculo?
						</h3>
						<p>
							Sim. Insalubridade, periculosidade, hora extra habitual, comissões
							e adicional noturno entram pela média e compõem a base do 13º.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Justa causa perde o 13º?
						</h3>
						<p>
							Sim. O empregado dispensado por justa causa perde o direito ao 13º
							proporcional do ano da rescisão.
						</p>
					</div>
				</div>
			</section>
		</>
	);
}

export default function ChristmasBonusPage() {
	return (
		<PageLayout
			toolHref="/ferramentas/calculadora-13-salario"
			title="Calculadora de 13º Salário"
			description="Descubra o valor das duas parcelas e os descontos com tabelas oficiais 2026."
			relatedTools={
				<RelatedTools currentHref="/ferramentas/calculadora-13-salario" />
			}
			extraContent={<SeoContent />}
		>
			<ChristmasBonusCalculatorClient />
		</PageLayout>
	);
}
