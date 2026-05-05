import type { Metadata } from "next";
import { PageLayout } from "@/components/shared/page-layout";
import { RelatedTools } from "@/components/shared/related-tools";
import { WorkHoursCalculator } from "@/components/tools/work-hours/work-hours-calculator";

export const metadata: Metadata = {
	title: "Calculadora de Horas Trabalhadas Online Grátis | Ferramenta Ninja",
	description:
		"Calcule suas horas trabalhadas por dia, semana e mês. Entrada e saída com intervalo, total em horas e minutos, estimativa mensal.",
	keywords: [
		"calculadora de horas trabalhadas",
		"calcular horas trabalhadas",
		"jornada de trabalho",
		"calcular hora extra",
		"controle de ponto",
	],
};

function SeoContent() {
	return (
		<>
			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Como calcular horas trabalhadas
				</h2>
				<p>
					Informe os horários de entrada e saída de cada dia da semana,
					incluindo o intervalo de almoço. A ferramenta calcula automaticamente
					o total de horas trabalhadas no dia, na semana e projeta uma
					estimativa mensal.
				</p>
				<p className="mt-3">
					O cálculo é feito subtraindo o intervalo do total entre saída e
					entrada. Se você entrou às 08:00, saiu às 18:00 e teve 1h de almoço, o
					total do dia é 9 horas.
				</p>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Por que usar esta calculadora
				</h2>
				<ul className="list-disc space-y-2 pl-6">
					<li>
						Conferência de ponto manual — compare com seu holerite ou controle
						eletrônico
					</li>
					<li>
						Cálculo de horas extras — veja quanto tempo excedeu sua jornada
						contratual
					</li>
					<li>
						Estimativa mensal — baseada na média diária da semana × 21,67 dias
						úteis (média legal)
					</li>
					<li>
						Freelancers e autônomos — registre horas por cliente e projete
						rendimentos
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
							Como é calculada a estimativa mensal?
						</h3>
						<p>
							A estimativa usa a média de horas dos dias trabalhados na semana e
							multiplica por 21,67 (média de dias úteis por mês no Brasil).
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							A ferramenta considera hora noturna?
						</h3>
						<p>
							Não. Esta calculadora considera horas em relógio padrão (60
							minutos). Para adicional noturno (52min30s), use a Calculadora de
							Adicional Noturno específica.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Posso usar para calcular hora extra?
						</h3>
						<p>
							Sim. Se sua jornada contratual é 8h diárias e o total deu 9h, você
							tem 1h extra. Para o valor monetário, use a Calculadora de Hora
							Extra com o valor do seu salário.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-foreground">
							Os dados ficam salvos em algum lugar?
						</h3>
						<p>
							Não. Todo cálculo é feito no seu navegador. Nada é enviado a
							servidores. Ao fechar a página os dados são perdidos.
						</p>
					</div>
				</div>
			</section>
		</>
	);
}

export default function WorkHoursPage() {
	return (
		<PageLayout
			compact
			toolHref="/ferramentas/calcular-horas-trabalhadas"
			title="Calculadora de Horas Trabalhadas Online"
			description="Calcule horas trabalhadas por dia, semana e mês com entrada e saída."
			relatedTools={
				<RelatedTools currentHref="/ferramentas/calcular-horas-trabalhadas" />
			}
			extraContent={<SeoContent />}
		>
			<WorkHoursCalculator />
		</PageLayout>
	);
}
