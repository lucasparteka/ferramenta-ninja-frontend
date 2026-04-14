import Link from "next/link";

export default function NotFound() {
	return (
		<div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
			<h1 className="text-6xl font-bold text-primary">404</h1>
			<h2 className="text-2xl font-semibold text-foreground">
				Pagina nao encontrada
			</h2>
			<p className="text-muted-foreground">
				A pagina que voce esta procurando nao existe.
			</p>
			<Link
				href="/"
				className="mt-4 rounded-lg bg-primary px-6 py-2 font-medium text-primary-foreground transition-opacity hover:opacity-90"
			>
				Voltar ao inicio
			</Link>
		</div>
	);
}
