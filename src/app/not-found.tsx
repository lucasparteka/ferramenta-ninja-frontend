import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
	return (
		<div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
			<h1 className="text-4xl font-semibold text-foreground">404</h1>
			<h2 className="text-2xl font-semibold text-foreground">
				Página não encontrada
			</h2>
			<p className="text-muted-foreground">
				A página que você está procurando não existe.
			</p>
			<Button variant="default" className="mt-4" render={<Link href="/" />}>
				Voltar ao início
			</Button>
		</div>
	);
}
