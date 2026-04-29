import type { Metadata } from "next";
import { PageLayout } from "@/components/shared/page-layout";
import { RelatedTools } from "@/components/shared/related-tools";
import { Stopwatch } from "@/components/tools/stopwatch/stopwatch";

export const metadata: Metadata = {
	title: "Cronômetro Online Grátis | Ferramenta Ninja",
	description:
		"Cronômetro online preciso com marcação de voltas. Inicie, pause e reinicie direto no navegador. Ferramenta gratuita, sem cadastro.",
};

const faq = [
	{
		question: "O cronômetro funciona em segundo plano?",
		answer:
			"Sim. O cronômetro continua contando mesmo se você trocar de aba ou minimizar o navegador. No entanto, o precisão pode variar se o dispositivo entrar em modo de economia de energia.",
	},
	{
		question: "Qual a precisão do cronômetro?",
		answer:
			"O cronômetro exibe centésimos de segundo (0,01s) e é atualizado em tempo real usando requestAnimationFrame para máxima precisão no navegador.",
	},
	{
		question: "Posso salvar as voltas?",
		answer:
			"As voltas ficam visíveis na tabela abaixo do cronômetro enquanto a página estiver aberta. Para salvá-las, copie manualmente ou tire um print.",
	},
	{
		question: "Funciona no celular?",
		answer:
			"Sim. O cronômetro é totalmente responsivo e funciona perfeitamente em smartphones e tablets com touch.",
	},
];

function SeoContent() {
	return (
		<>
			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Para que usar um cronômetro online?
				</h2>
				<div className="space-y-3">
					<p>
						Um cronômetro online é útil em diversas situações do dia a dia, sem
						precisar instalar nenhum aplicativo:
					</p>
					<ul className="list-disc space-y-2 pl-6">
						<li>
							<strong className="text-foreground">Exercícios físicos:</strong>{" "}
							controle intervalos de treino, descanso e séries.
						</li>
						<li>
							<strong className="text-foreground">Cozinha:</strong> tempo de
							cozimento, fermentação e preparo de receitas.
						</li>
						<li>
							<strong className="text-foreground">Estudos:</strong> técnica
							Pomodoro e gerenciamento de tempo de foco.
						</li>
						<li>
							<strong className="text-foreground">Trabalho:</strong> medição de
							tempo em tarefas, reuniões e atividades.
						</li>
						<li>
							<strong className="text-foreground">Esportes:</strong> marcação de
							voltas em corridas, natação e ciclismo.
						</li>
					</ul>
				</div>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Como usar este cronômetro
				</h2>
				<div className="space-y-3">
					<p>
						Clique em "Iniciar" para começar a contagem. Use "Pausar" para
						interromper temporariamente. "Volta" registra o tempo parcial.
						"Reiniciar" zera tudo. O display mostra minutos, segundos e
						centésimos em tempo real.
					</p>
				</div>
			</section>
		</>
	);
}

export default function CronometroOnlinePage() {
	return (
		<PageLayout
			toolHref="/ferramentas/cronometro-online"
			title="Cronômetro Online"
			description="Cronômetro online preciso com marcação de voltas. Inicie, pause e reinicie direto no navegador. Rápido, gratuito e sem cadastro."
			relatedTools={
				<RelatedTools currentHref="/ferramentas/cronometro-online" />
			}
			extraContent={<SeoContent />}
			faq={faq}
		>
			<Stopwatch />
		</PageLayout>
	);
}
