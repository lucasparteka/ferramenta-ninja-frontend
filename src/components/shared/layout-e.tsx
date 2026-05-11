"use client";

import { AlertTriangle, Loader2, Search } from "lucide-react";

type LayoutEProps = {
	header?: React.ReactNode;
	searchBar: React.ReactNode;
	state: "empty" | "loading" | "error" | "result";
	emptyState?: React.ReactNode;
	loadingState?: React.ReactNode;
	errorState?: React.ReactNode;
	result: React.ReactNode;
};

export function LayoutE({
	header,
	searchBar,
	state,
	emptyState,
	loadingState,
	errorState,
	result,
}: LayoutEProps) {
	return (
		<div className="space-y-6">
			{header}
			<div className="space-y-6">
				{searchBar}
				{state === "empty" && (emptyState ?? <EmptyState />)}
				{state === "loading" && (loadingState ?? <LoadingState />)}
				{state === "error" && (errorState ?? <ErrorState />)}
				{state === "result" && result}
			</div>
		</div>
	);
}

function EmptyState() {
	return (
		<div className="flex min-h-[200px] flex-col items-center justify-center gap-2 rounded-md border border-dashed border-border bg-muted/30 p-8 text-center">
			<Search className="h-5 w-5 text-muted-foreground" strokeWidth={1.75} />
			<p className="text-sm text-foreground">
				Digite um identificador para consultar
			</p>
			<p className="text-xs text-muted-foreground">
				Dados atualizados em tempo real
			</p>
		</div>
	);
}

function LoadingState() {
	return (
		<div className="flex min-h-[200px] items-center justify-center rounded-md border border-border bg-muted/20">
			<Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
		</div>
	);
}

function ErrorState({ message }: { message?: string }) {
	return (
		<div className="rounded-md border border-destructive/30 bg-destructive/5 p-4">
			<div className="flex items-start gap-2">
				<AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-destructive" />
				<p className="text-xs text-destructive">
					{message ?? "Identificador não encontrado ou inválido."}
				</p>
			</div>
		</div>
	);
}
