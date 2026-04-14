export function Footer() {
	const currentYear = new Date().getFullYear();

	return (
		<footer className="mt-auto border-t border-border bg-card py-8">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
					<p className="text-sm text-muted-foreground">
						{currentYear} Ferramenta Ninja. Todos os direitos reservados.
					</p>
					<p className="text-sm text-muted-foreground">
						Ferramentas online gratuitas para todos.
					</p>
				</div>
			</div>
		</footer>
	);
}
