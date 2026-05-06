"use client";

import { useEffect } from "react";
import { RotateCcw } from "lucide-react";

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
		<div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
			<h1 className="text-6xl font-bold text-destructive">500</h1>
			<h2 className="text-2xl font-semibold text-foreground">
				Algo deu errado
			</h2>
			<p className="max-w-md text-muted-foreground">
				Ocorreu um erro inesperado. Tente novamente ou volte mais tarde.
			</p>
			<button
				type="button"
				onClick={reset}
				className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-primary px-6 py-2 font-medium text-primary-foreground transition-opacity hover:opacity-90"
			>
				<RotateCcw className="size-4" />
				Tentar novamente
			</button>
		</div>
	);
}
