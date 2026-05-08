"use client";

import { AlertTriangle } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		console.error(error);
	}, [error]);

	return (
		<div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center gap-3 px-4 text-center">
			<AlertTriangle className="h-5 w-5 text-destructive" strokeWidth={1.75} />
			<h1 className="text-2xl font-semibold tracking-tight">Algo deu errado</h1>
			<p className="text-sm text-muted-foreground">
				Não foi possível carregar esta página. Tente novamente.
			</p>
			<Button onClick={reset} className="mt-2">
				Tentar novamente
			</Button>
		</div>
	);
}
