import Link from "next/link";

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
					</ul>
				</nav>
			</div>
		</header>
	);
}
