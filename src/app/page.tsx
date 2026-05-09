import type { Metadata } from "next";
import { ToolSearch } from "@/components/home/tool-search";

export const metadata: Metadata = {
	title: "Ferramentas online gratuitas",
	description:
		"Converta, formate, calcule e gere arquivos online. Sem cadastro, sem instalação, tudo no navegador.",
};

export default function HomePage() {
	return (
		<>
			<section className="border-b border-border py-12">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="mx-auto max-w-4xl text-center">
						<div className="space-y-1">
							<h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
								Ferramentas online{" "}
								<span className="text-primary underline">gratuitas</span>
							</h1>
							<p className="mt-6 text-lg text-muted-foreground">
								Ferramentas gratuitas para produtividade, conversão de arquivos,
								formatação de dados, geração de conteúdos e mais. Sem cadastro,
								sem downloads e com uso instantâneo no navegador.
							</p>
						</div>
					</div>
				</div>
			</section>

			<section className="py-8">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<ToolSearch />
				</div>
			</section>

			<section className="border-t border-border bg-card/50 py-12">
				<div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
					<h2 className="mb-4 text-base font-semibold text-foreground">
						Por que usar o Ferramenta Ninja
					</h2>

					<div className="grid gap-3 sm:grid-cols-3">
						<div className="rounded-md border border-border bg-card p-4">
							<h3 className="text-sm font-semibold text-foreground">
								Gratuito
							</h3>
							<p className="mt-1 text-sm text-muted-foreground">
								Todas as ferramentas são gratuitas e sem limite de uso.
							</p>
						</div>

						<div className="rounded-md border border-border bg-card p-4">
							<h3 className="text-sm font-semibold text-foreground">
								Sem cadastro
							</h3>
							<p className="mt-1 text-sm text-muted-foreground">
								Acesse e use imediatamente, sem criar conta ou fornecer dados.
							</p>
						</div>

						<div className="rounded-md border border-border bg-card p-4">
							<h3 className="text-sm font-semibold text-foreground">
								Privacidade
							</h3>
							<p className="mt-1 text-sm text-muted-foreground">
								Tudo roda no seu navegador. Nenhum dado é enviado para
								servidores.
							</p>
						</div>
					</div>
				</div>
			</section>
		</>
	);
}
