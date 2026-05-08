"use client";

/* ------------------------------------------------------------------ */
/*  FaviconShell — layout 3-painéis usado por todos os modos.          */
/*                                                                     */
/*  ┌─────────────────────────────────────────────────────────────┐   */
/*  │ HEADER: título + ação primária "Gerar Favicon"              │   */
/*  ├──────────────┬──────────────────────────────┬──────────────┤   */
/*  │ ◀ MODE TABS  │  CENTER: live preview        │ ▶ PROPRIEDADES│   */
/*  │   + SOURCE   │  + mini 16/32/48             │   (cor / fmt /│   */
/*  │   panel      │  + browser tab mock           │    tamanho)   │   */
/*  └──────────────┴──────────────────────────────┴──────────────┘   */
/*  Após "Gerar": <ResultPanel> aparece abaixo (preview-grid + export) */
/* ------------------------------------------------------------------ */

import { Loader2, Wand2 } from "lucide-react";
import { type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FaviconShellProps {
	/** Conteúdo da coluna esquerda — geralmente <ModeTabs/> + painel de origem */
	left: ReactNode;
	/** Conteúdo central — geralmente <LivePreview/> */
	center: ReactNode;
	/** Conteúdo da coluna direita — propriedades */
	right: ReactNode;
	/** Sob o shell — preview grid + export panel (quando o usuário gerou) */
	footer?: ReactNode;
	/** Callback para o botão "Gerar Favicon" no header */
	onGenerate: () => void;
	/** Desabilita o botão de gerar (sem fonte / loading) */
	canGenerate: boolean;
	isGenerating?: boolean;
	/** Mensagem de erro inline (opcional) */
	error?: string | null;
}

export function FaviconShell({
	left,
	center,
	right,
	footer,
	onGenerate,
	canGenerate,
	isGenerating,
	error,
}: FaviconShellProps) {
	return (
		<div className="space-y-6">
			{/* Header sticky */}
			<header className="sticky top-0 z-20 -mx-4 flex flex-wrap items-center justify-between gap-3 border-b bg-background/85 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/70 sm:mx-0 sm:rounded-xl sm:border sm:px-5">
				<div>
					<h2 className="text-lg font-semibold tracking-tight text-foreground">
						Gerador de Favicon
					</h2>
					<p className="text-xs text-muted-foreground">
						Crie um pacote completo (PNGs, .ico e manifest) a partir de imagem,
						SVG, texto ou emoji.
					</p>
				</div>
				<Button
					onClick={onGenerate}
					disabled={!canGenerate || isGenerating}
					className="shrink-0"
				>
					{isGenerating ? (
						<>
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							Gerando...
						</>
					) : (
						<>
							<Wand2 className="mr-2 h-4 w-4" />
							Gerar Favicon
						</>
					)}
				</Button>
			</header>

			{error && (
				<div className="rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
					{error}
				</div>
			)}

			{/* Three panes */}
			<div
				className={cn(
					"grid gap-4",
					"grid-cols-1",
					"lg:grid-cols-[280px_minmax(0,1fr)_320px]",
				)}
			>
				<aside className="space-y-4 rounded-xl border bg-card p-4">
					{left}
				</aside>

				<section className="rounded-xl border bg-background p-5">
					{center}
				</section>

				<aside className="space-y-5 rounded-xl border bg-card p-4">
					{right}
				</aside>
			</div>

			{footer}
		</div>
	);
}
