import type { Metadata } from "next";
import { ToolSearch } from "@/components/home/tool-search";
import { categories } from "@/lib/data/tools";

export const metadata: Metadata = {
	title: "Ferramentas Online Gratuitas",
	description:
		"Acesse dezenas de ferramentas online gratuitas para desenvolvedores, designers e profissionais. Sem cadastro, sem instalação.",
};

export default function HomePage() {
	return (
		<>
			<section className="border-b border-border bg-card/50 py-16 sm:py-24">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="mx-auto max-w-3xl text-center">
						<h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
							Ferramentas online <span className="text-primary">gratuitas</span>
						</h1>
						<p className="mt-6 text-lg text-muted-foreground">
							Sem cadastro, sem instalação. Tudo direto no navegador.
						</p>
					</div>
				</div>
			</section>

			<section className="py-16">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<ToolSearch categories={categories} />
				</div>
			</section>

			<section className="border-t border-border bg-card/50 py-16">
				<div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
					<h2 className="mb-6 text-2xl font-bold">
						Por que usar o Ferramenta Ninja?
					</h2>

					<div className="grid gap-6 sm:grid-cols-3">
						<div>
							<h3 className="font-semibold">Gratuito</h3>
							<p className="text-sm text-muted-foreground">
								Todas as ferramentas são gratuitas
							</p>
						</div>

						<div>
							<h3 className="font-semibold">Sem cadastro</h3>
							<p className="text-sm text-muted-foreground">Use imediatamente</p>
						</div>

						<div>
							<h3 className="font-semibold">Privacidade</h3>
							<p className="text-sm text-muted-foreground">
								Tudo roda no seu navegador
							</p>
						</div>
					</div>
				</div>
			</section>
		</>
	);
}
