import type { Metadata } from "next";
import { PageLayout } from "@/components/shared/page-layout";
import { RelatedTools } from "@/components/shared/related-tools";
import { KeepAwake } from "@/components/tools/keep-awake/keep-awake";

export const metadata: Metadata = {
	title: "Manter Tela Ligada Online Grátis | Ferramenta Ninja",
	description:
		"Impeça a tela do seu dispositivo de desligar com timer programado. Funciona no navegador, sem instalar nada.",
	keywords: [
		"manter tela ligada",
		"tela não desliga",
		"impedir bloqueio de tela",
		"tela sempre ligada",
		"screen awake",
		"timer tela ligada",
	],
	openGraph: {
		title: "Manter Tela Ligada Online Grátis | Ferramenta Ninja",
		description:
			"Impeça a tela do seu dispositivo de desligar com timer programado. Funciona no navegador, sem instalar nada.",
	},
};

const faq = [
	{
		question: "Funciona em qual sistema operacional?",
		answer:
			"Funciona em qualquer sistema operacional que tenha um navegador moderno: Windows, macOS, Linux, Android e iOS.",
	},
	{
		question: "Precisa instalar algo?",
		answer:
			"Não. A ferramenta roda 100% no navegador, sem downloads, extensões ou instalações. Basta abrir a página e clicar em Ativar.",
	},
	{
		question: "Gasta muita bateria?",
		answer:
			"Manter a tela ligada consome mais bateria do que o modo de espera. Recomendamos usar com o carregador conectado em sessões longas. No modo programado, a ferramenta desliga automaticamente ao fim do tempo, economizando bateria.",
	},
	{
		question: "Funciona em segundo plano?",
		answer:
			"O timer continua contando em segundo plano, mas a tela só permanece ligada enquanto o navegador estiver ativo. Em dispositivos móveis com economia de energia ativada, o sistema pode desligar a tela mesmo com a ferramenta ligada.",
	},
	{
		question: "O timer é preciso?",
		answer:
			"Sim. O timer continua contando mesmo se você trocar de aba, minimizar ou deixar a página em segundo plano.",
	},
];

function SeoContent() {
	return (
		<>
			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Para que usar o Manter Tela Ligada?
				</h2>
				<div className="space-y-3">
					<p>
						Esta ferramenta é útil em diversas situações do dia a dia, sem
						precisar instalar nenhum aplicativo:
					</p>
					<ul className="list-disc space-y-2 pl-6">
						<li>
							<strong className="text-foreground">Apresentações:</strong>{" "}
							mantenha a tela ligada durante slides e reuniões sem
							interrupção.
						</li>
						<li>
							<strong className="text-foreground">Leitura longa:</strong>{" "}
							leia documentos, artigos e e-books sem que a tela apague.
						</li>
						<li>
							<strong className="text-foreground">PC corporativo:</strong>{" "}
							evite bloqueios de tela em estações de trabalho com políticas
							restritivas de segurança.
						</li>
						<li>
							<strong className="text-foreground">Cozinha:</strong> acompanhe
							receitas e timers de preparo sem que a tela apague.
						</li>
						<li>
							<strong className="text-foreground">Estudos:</strong> assista
							videoaulas, aulas online e faça provas sem interrupções.
						</li>
						<li>
							<strong className="text-foreground">Monitoramento:</strong>{" "}
							mantenha dashboards e painéis de controle visíveis por longos
							períodos.
						</li>
					</ul>
				</div>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Como usar a ferramenta
				</h2>
				<div className="space-y-3">
					<p>
						Escolha entre dois modos: <strong>infinito</strong>, que mantém a
						tela ligada indefinidamente até você clicar em "Desativar", ou{" "}
						<strong>programado</strong>, que desliga automaticamente após o
						tempo definido. No modo programado, você pode usar os presets
						rápidos (15 min, 30 min, 1 h) ou ajustar o slider de 1 a 10 horas
						com passos de 30 minutos.
					</p>
					<p>
						Basta clicar em "Ativar" e a ferramenta começa a funcionar
						imediatamente. O timer mostra o tempo decorrido e, no modo
						programado, quanto tempo ainda falta. Quando terminar, a tela
						volta a desligar normalmente.
					</p>
				</div>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-bold text-foreground">
					Compatibilidade
				</h2>
				<div className="space-y-3">
					<p>
						A ferramenta funciona nos principais navegadores modernos: Chrome,
						Edge, Opera, Safari e Firefox. Não é necessário instalar nada,
						apenas abrir a página e clicar em "Ativar".
					</p>
				</div>
			</section>
		</>
	);
}

export default function ManterTelaLigadaPage() {
	return (
		<PageLayout
			toolHref="/ferramentas/manter-tela-ligada"
			title="Manter Tela Ligada"
			description="Impeça a tela do seu dispositivo de desligar com timer programado. Rápido, gratuito e sem cadastro."
			relatedTools={
				<RelatedTools currentHref="/ferramentas/manter-tela-ligada" />
			}
			extraContent={<SeoContent />}
			faq={faq}
		>
			<KeepAwake />
		</PageLayout>
	);
}
