import Link from "next/link";
import { categories, getAllTools } from "@/lib/data/tools";

const POPULAR_LIMIT = 8;

function getPopularTools() {
	return getAllTools()
		.slice()
		.sort((a, b) => {
			const wa = a.weight ?? 0;
			const wb = b.weight ?? 0;
			if (wb !== wa) return wb - wa;
			return a.name.localeCompare(b.name, "pt-BR");
		})
		.slice(0, POPULAR_LIMIT);
}

export function Footer() {
	const currentYear = new Date().getFullYear();
	const popular = getPopularTools();

	return (
		<footer className="mt-auto border-t border-border bg-card">
			<div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
				<div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
					<div>
						<Link href="/" className="flex items-center">
							<span className="text-lg font-bold text-primary">ferramenta</span>
							<span className="text-lg font-bold text-accent">.ninja</span>
						</Link>
						<p className="mt-3 text-sm text-muted-foreground">
							Ferramentas online gratuitas para todos.
						</p>
					</div>

					<div>
						<h2 className="mb-3 text-sm font-semibold text-foreground">
							Categorias
						</h2>
						<ul className="space-y-2 text-sm">
							{categories.map((cat) => (
								<li key={cat.id}>
									<Link
										href={`/categorias/${cat.id}`}
										className="text-muted-foreground transition-colors hover:text-foreground"
									>
										{cat.name}
									</Link>
								</li>
							))}
						</ul>
					</div>

					<div>
						<h2 className="mb-3 text-sm font-semibold text-foreground">
							Ferramentas populares
						</h2>
						<ul className="space-y-2 text-sm">
							{popular.map((tool) => (
								<li key={tool.href}>
									<Link
										href={tool.href}
										className="text-muted-foreground transition-colors hover:text-foreground"
									>
										{tool.name}
									</Link>
								</li>
							))}
						</ul>
					</div>

					<div>
						<h2 className="mb-3 text-sm font-semibold text-foreground">
							Recursos
						</h2>
						<ul className="space-y-2 text-sm">
							<li>
								<Link
									href="/ferramentas"
									className="text-muted-foreground transition-colors hover:text-foreground"
								>
									Todas as ferramentas
								</Link>
							</li>
							<li>
								<Link
									href="/blog"
									className="text-muted-foreground transition-colors hover:text-foreground"
								>
									Blog
								</Link>
							</li>
							<li>
								<a
									href="/sitemap.xml"
									className="text-muted-foreground transition-colors hover:text-foreground"
								>
									Sitemap
								</a>
							</li>
						</ul>
					</div>

					<div>
						<h2 className="mb-3 text-sm font-semibold text-foreground">
							Sobre
						</h2>
						<ul className="space-y-2 text-sm">
							<li>
								<Link
									href="/sobre"
									className="text-muted-foreground transition-colors hover:text-foreground"
								>
									Sobre
								</Link>
							</li>
							<li>
								<Link
									href="/metodologia"
									className="text-muted-foreground transition-colors hover:text-foreground"
								>
									Metodologia
								</Link>
							</li>
							<li>
								<Link
									href="/contato"
									className="text-muted-foreground transition-colors hover:text-foreground"
								>
									Contato
								</Link>
							</li>
							<li>
								<Link
									href="/politica-de-privacidade"
									className="text-muted-foreground transition-colors hover:text-foreground"
								>
									Privacidade
								</Link>
							</li>
							<li>
								<Link
									href="/termos-de-uso"
									className="text-muted-foreground transition-colors hover:text-foreground"
								>
									Termos de uso
								</Link>
							</li>
						</ul>
					</div>
				</div>

				<div className="mt-10 flex flex-col items-center justify-between gap-2 border-t border-border pt-6 sm:flex-row">
					<p className="text-sm text-muted-foreground">
						© {currentYear} Ferramenta Ninja. Todos os direitos reservados.
					</p>
					<p className="text-sm text-muted-foreground">
						Sem cadastro, sem instalação.
					</p>
				</div>
			</div>
		</footer>
	);
}
