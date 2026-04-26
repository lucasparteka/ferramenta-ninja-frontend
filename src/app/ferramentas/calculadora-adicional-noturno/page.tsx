import type { Metadata } from "next";
import Link from "next/link";
import { PageLayout } from "@/components/shared/page-layout";
import { RelatedTools } from "@/components/shared/related-tools";
import { NightAllowanceContent } from "@/components/tools/night-allowance/night-allowance-content";

export const metadata: Metadata = {
	title: "Calculadora de Adicional Noturno | Ferramenta Ninja",
	description:
		"Calcule o valor do adicional noturno de forma simples e rápida. Veja quanto você deve receber a mais pelo trabalho realizado à noite, conforme a legislação trabalhista.",
	keywords: [
		"adicional noturno",
		"calculadora adicional noturno",
		"trabalho noturno",
		"hora noturna",
		"salário adicional",
		"CLT",
		"direitos trabalhistas",
	],
};

function SeoContent() {
	return (
		<>
			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					O que é o adicional noturno?
				</h2>
				<p>
					O adicional noturno é um acréscimo salarial garantido por lei ao
					trabalhador que exerce suas atividades durante o período noturno.
					Trata-se de um direito previsto na{" "}
					<strong className="text-foreground">
						Consolidação das Leis do Trabalho (CLT)
					</strong>{" "}
					e em legislações específicas para trabalhadores rurais.
				</p>
				<div className="mt-4 space-y-3">
					<p>
						<strong className="text-foreground">Empregado urbano:</strong>{" "}
						Considera-se trabalho noturno o realizado entre 22h de um dia e 5h
						do dia seguinte. A remuneração deve ter um acréscimo mínimo de{" "}
						<strong className="text-foreground">20%</strong> sobre o valor da
						hora diurna. (CLT, art. 73)
					</p>
					<p>
						<strong className="text-foreground">Empregado rural:</strong> Na
						lavoura, o período noturno vai de 21h às 5h; na pecuária, de 20h às
						4h. O acréscimo é de{" "}
						<strong className="text-foreground">25%</strong> sobre a remuneração
						normal. (Lei n.º 5.889/73, art. 7.º)
					</p>
				</div>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					O que é a hora noturna reduzida?
				</h2>
				<p>
					Para o trabalhador urbano, a legislação prevê a chamada{" "}
					<strong className="text-foreground">hora noturna reduzida</strong>:
					cada hora noturna equivale a 52 minutos e 30 segundos, em vez de 60
					minutos. Isso significa que, ao trabalhar das 22h às 5h (7 horas
					reais), o empregado computa 8 horas noturnas para fins de remuneração.
				</p>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					O que é RSR/DSR?
				</h2>
				<p>
					O{" "}
					<strong className="text-foreground">
						Repouso Semanal Remunerado (RSR)
					</strong>
					, também chamado de Descanso Semanal Remunerado (DSR), é o valor que o
					trabalhador recebe pelos domingos e feriados em que não trabalhou. O
					adicional noturno também incide sobre o RSR, pois integra a
					remuneração do empregado para esse fim.
				</p>
				<p className="mt-3">
					O cálculo do RSR sobre o adicional noturno é feito dividindo o total
					do adicional pelo número de dias úteis no mês e multiplicando pelo
					número de domingos e feriados.
				</p>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Perguntas Frequentes
				</h2>
				<div className="space-y-6">
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Qual é o percentual mínimo do adicional noturno?
						</h3>
						<p>
							Para trabalhadores urbanos, o mínimo é de 20% sobre o valor da
							hora diurna, conforme o art. 73 da CLT. Para trabalhadores rurais,
							o mínimo é de 25%, conforme a Lei n.º 5.889/73. Convenções
							coletivas podem prever percentuais maiores.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							O adicional noturno incide sobre horas extras?
						</h3>
						<p>
							Sim. Quando as horas extras são realizadas no período noturno, o
							trabalhador tem direito ao adicional noturno somado ao adicional
							de horas extras. Ambos os adicionais incidem sobre o valor da hora
							normal.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							O trabalhador que só trabalha à noite tem direito ao adicional?
						</h3>
						<p>
							Sim. O adicional noturno é devido a todo trabalhador que exerce
							suas atividades no horário noturno, independentemente de também
							trabalhar durante o dia. O direito é garantido pela CLT e não pode
							ser suprimido.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							O adicional noturno é descontado do Imposto de Renda?
						</h3>
						<p>
							Sim. O adicional noturno integra o salário bruto e, portanto,
							compõe a base de cálculo do INSS e do Imposto de Renda Retido na
							Fonte (IRRF), assim como as demais verbas remuneratórias.
						</p>
					</div>
				</div>
			</section>

			<section>
				<h3 className="mb-2 text-lg font-semibold text-foreground">
					Veja também
				</h3>
				<Link
					href="/ferramentas/calculadora-salario-liquido"
					className="text-primary underline underline-offset-4"
				>
					Calculadora de salário líquido
				</Link>
			</section>
		</>
	);
}

export default function CalculadoraAdicionalNoturnoPage() {
	return (
		<PageLayout
			toolHref="/ferramentas/calculadora-adicional-noturno"
			title="Calculadora de Adicional Noturno"
			description="Calcule o valor do adicional noturno de forma simples e rápida. Saiba quanto você deve receber a mais pelo trabalho realizado à noite, conforme a legislação trabalhista."
			relatedTools={
				<RelatedTools currentHref="/ferramentas/calculadora-adicional-noturno" />
			}
			extraContent={<SeoContent />}
		>
			<NightAllowanceContent />
		</PageLayout>
	);
}
