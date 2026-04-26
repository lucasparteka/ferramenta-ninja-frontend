import type { Metadata } from "next";
import Link from "next/link";
import { StaticPage } from "@/components/shared/static-page";
import { getAllTools } from "@/lib/data/tools";

export const metadata: Metadata = {
	title: "Sobre o Ferramenta Ninja",
	description:
		"Conheça a missão, princípios e metodologia por trás do Ferramenta Ninja — ferramentas online gratuitas, sem cadastro e privadas.",
	alternates: { canonical: "/sobre" },
	openGraph: {
		title: "Sobre o Ferramenta Ninja",
		description:
			"Ferramentas online gratuitas, sem cadastro e privadas. Conheça nossa missão.",
		url: "/sobre",
		type: "website",
	},
};

export default function SobrePage() {
	const total = getAllTools().length;

	return (
		<StaticPage
			title="Sobre o Ferramenta Ninja"
			description="Ferramentas online gratuitas, sem cadastro e privadas."
			breadcrumbLabel="Sobre"
			href="/sobre"
		>
			<section>
				<h2 className="mb-3 text-xl font-bold text-foreground">Nossa missão</h2>
				<p>
					O Ferramenta Ninja existe para resolver tarefas pequenas do dia a dia
					sem fricção: cálculos trabalhistas, conversões, geradores, validadores
					e utilitários comuns. Hoje reunimos {total} ferramentas, todas
					gratuitas, sem cadastro e processadas localmente no seu navegador.
				</p>
			</section>

			<section>
				<h2 className="mb-3 text-xl font-bold text-foreground">Princípios</h2>
				<ul className="list-disc space-y-2 pl-6 text-muted-foreground">
					<li>
						<strong className="text-foreground">Gratuito sempre.</strong> Sem
						planos pagos, sem watermark, sem limite de uso.
					</li>
					<li>
						<strong className="text-foreground">Sem cadastro.</strong> Você não
						precisa criar conta nem informar e-mail.
					</li>
					<li>
						<strong className="text-foreground">Privacidade.</strong> Nossas
						ferramentas rodam no navegador. Seus dados não são enviados para
						servidores nem armazenados.
					</li>
					<li>
						<strong className="text-foreground">Direto ao ponto.</strong> Cada
						ferramenta resolve uma tarefa específica, sem distração.
					</li>
					<li>
						<strong className="text-foreground">Em português.</strong> Conteúdo,
						copy e suporte 100% em pt-BR, com atenção a particularidades
						brasileiras (CLT, INSS, IRRF, FGTS, Selic, CDI).
					</li>
				</ul>
			</section>

			<section>
				<h2 className="mb-3 text-xl font-bold text-foreground">Metodologia</h2>
				<p>
					Calculadoras trabalhistas e financeiras seguem a legislação brasileira
					vigente e tabelas oficiais (INSS, IRRF, FGTS, salário-mínimo). Quando
					há atualização legal ou de tetos/alíquotas, revisamos e atualizamos as
					fórmulas. Detalhes técnicos completos estão em{" "}
					<Link href="/metodologia" className="text-primary underline">
						metodologia
					</Link>
					.
				</p>
			</section>

			<section>
				<h2 className="mb-3 text-xl font-bold text-foreground">
					Suporte e contato
				</h2>
				<p>
					Encontrou erro de cálculo, sugestão ou dúvida? Veja a página de{" "}
					<Link href="/contato" className="text-primary underline">
						contato
					</Link>
					.
				</p>
			</section>
		</StaticPage>
	);
}
