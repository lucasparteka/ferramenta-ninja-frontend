"use client";

import { Loader2, Wand2 } from "lucide-react";
import type { ReactNode } from "react";
import { LayoutA } from "@/components/shared/layout-a";
import { Button } from "@/components/ui/button";

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
			<LayoutA
				leftPanel={<div className="divide-y divide-border">{left}</div>}
				centerPanel={
					<div className="p-4 flex-1 flex flex-col">
						{error && (
							<div className="			mb-4 rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
								{error}
							</div>
						)}
						{center}
					</div>
				}
				rightPanel={
					<div className="divide-y divide-border">
						{right}
						<div className="p-4">
							<h3 className="text-caption font-semibold uppercase tracking-wider text-muted-foreground mb-3">
								Ações
							</h3>
							<Button
								onClick={onGenerate}
								disabled={!canGenerate || isGenerating}
								className="w-full"
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
						</div>
					</div>
				}
			/>
			{footer}
		</div>
	);
}
