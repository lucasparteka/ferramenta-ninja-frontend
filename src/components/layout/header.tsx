import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { categories } from "@/lib/data/tools";

export function Header() {
	return (
		<header className="sticky top-0 z-50 w-full border-b border-border bg-card/80 backdrop-blur-md">
			<div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
				<Link href="/" className="flex items-center">
					<span className="text-xl font-bold text-primary">ferramenta</span>
					<span className="text-xl font-bold text-accent">.ninja</span>
				</Link>
				<nav aria-label="Navegação principal">
					<ul className="flex items-center gap-6 text-sm font-medium text-muted-foreground">
						<li>
							<Link
								href="/"
								className="transition-colors hover:text-foreground"
							>
								Início
							</Link>
						</li>
						<li>
							<Link
								href="/ferramentas"
								className="transition-colors hover:text-foreground"
							>
								Ferramentas
							</Link>
						</li>
						<li>
							<Link
								href="/blog"
								className="transition-colors hover:text-foreground"
							>
								Blog
							</Link>
						</li>
						<li>
							<details className="group relative">
								<summary className="flex cursor-pointer list-none items-center gap-1 transition-colors hover:text-foreground [&::-webkit-details-marker]:hidden">
									Categorias
									<ChevronDown className="size-4 transition-transform group-open:rotate-180" />
								</summary>
								<div className="absolute right-0 top-full z-50 mt-2 w-72 rounded-lg border border-border bg-card p-2 shadow-lg">
									<ul className="grid gap-1">
										{categories.map((cat) => (
											<li key={cat.id}>
												<Link
													href={`/categorias/${cat.id}`}
													className="block rounded-sm px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted"
												>
													<span className="font-medium">{cat.name}</span>
													<span className="block text-xs text-muted-foreground">
														{cat.tools.length}{" "}
														{cat.tools.length === 1
															? "ferramenta"
															: "ferramentas"}
													</span>
												</Link>
											</li>
										))}
									</ul>
								</div>
							</details>
						</li>
					</ul>
				</nav>
			</div>
		</header>
	);
}
