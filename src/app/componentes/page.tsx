"use client";

import { Eraser, RotateCcw, Trash2, X } from "lucide-react";
import Head from "next/head";
import { Button } from "@/components/ui/button";

function Section({
	title,
	children,
}: {
	title: string;
	children: React.ReactNode;
}) {
	return (
		<section className="space-y-4">
			<h2 className="text-xl font-bold text-foreground">{title}</h2>
			<div className="flex flex-wrap items-center gap-4 rounded-xl border border-border bg-card p-6">
				{children}
			</div>
		</section>
	);
}

function VariantLabel({ label }: { label: string }) {
	return (
		<div className="flex w-full items-center gap-2">
			<span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
				{label}
			</span>
			<div className="h-px flex-1 bg-border" />
		</div>
	);
}

export default function ComponentesPage() {
	return (
		<div className="min-h-screen bg-background py-12">
			<div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-12">
				<div className="text-center">
					<h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
						Componentes
					</h1>
					<p className="mt-4 text-lg text-muted-foreground">
						Página de rascunho para testes e decisões de design.
					</p>
				</div>

				{/* ===================== BOTÃO LIMPAR ===================== */}
				<div className="space-y-6">
					<div className="flex items-center gap-3">
						<h2 className="text-2xl font-bold text-foreground">
							Botão "Limpar"
						</h2>
						<span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
							Em decisão
						</span>
					</div>

					{/* Variante 1: Ghost + Ícone X */}
					<Section title="Variação 1 — Ghost + Ícone X">
						<VariantLabel label="Padrão" />
						<Button variant="ghost" size="sm">
							<X className="size-4" />
							Limpar
						</Button>
						<Button variant="ghost">
							<X className="size-4" />
							Limpar
						</Button>
						<Button variant="ghost" disabled>
							<X className="size-4" />
							Limpar
						</Button>

						<VariantLabel label="Com texto vermelho no hover" />
						<Button
							variant="ghost"
							className="hover:text-destructive hover:bg-destructive/10"
						>
							<X className="size-4" />
							Limpar
						</Button>
					</Section>

					{/* Variante 2: Outline + Ícone X */}
					<Section title="Variação 2 — Outline + Ícone X">
						<VariantLabel label="Padrão" />
						<Button variant="outline" size="sm">
							<X className="size-4" />
							Limpar
						</Button>
						<Button variant="outline">
							<X className="size-4" />
							Limpar
						</Button>
						<Button variant="outline" disabled>
							<X className="size-4" />
							Limpar
						</Button>

						<VariantLabel label="Borda e texto vermelhos" />
						<Button
							variant="outline"
							className="border-destructive/50 text-destructive hover:bg-destructive/10 hover:text-destructive"
						>
							<X className="size-4" />
							Limpar
						</Button>
					</Section>

					{/* Variante 3: Ghost + Ícone Eraser */}
					<Section title="Variação 3 — Ghost + Ícone Borracha">
						<VariantLabel label="Padrão" />
						<Button variant="ghost" size="sm">
							<Eraser className="size-4" />
							Limpar
						</Button>
						<Button variant="ghost">
							<Eraser className="size-4" />
							Limpar
						</Button>

						<VariantLabel label="Com texto vermelho no hover" />
						<Button
							variant="ghost"
							className="hover:text-destructive hover:bg-destructive/10"
						>
							<Eraser className="size-4" />
							Limpar
						</Button>
					</Section>

					{/* Variante 4: Ghost + Ícone RotateCcw */}
					<Section title="Variação 4 — Ghost + Ícone Reset">
						<VariantLabel label="Padrão" />
						<Button variant="ghost" size="sm">
							<RotateCcw className="size-4" />
							Limpar
						</Button>
						<Button variant="ghost">
							<RotateCcw className="size-4" />
							Limpar
						</Button>

						<VariantLabel label="Com texto vermelho no hover" />
						<Button
							variant="ghost"
							className="hover:text-destructive hover:bg-destructive/10"
						>
							<RotateCcw className="size-4" />
							Limpar
						</Button>
					</Section>

					{/* Variante 5: Ghost + Ícone Trash2 */}
					<Section title="Variação 5 — Ghost + Ícone Lixeira">
						<VariantLabel label="Padrão" />
						<Button variant="ghost" size="sm">
							<Trash2 className="size-4" />
							Limpar
						</Button>
						<Button variant="ghost">
							<Trash2 className="size-4" />
							Limpar
						</Button>

						<VariantLabel label="Com texto vermelho no hover" />
						<Button
							variant="ghost"
							className="hover:text-destructive hover:bg-destructive/10"
						>
							<Trash2 className="size-4" />
							Limpar
						</Button>
					</Section>

					{/* Variante 6: Secondary + Ícone X */}
					<Section title="Variação 6 — Secondary + Ícone X">
						<VariantLabel label="Padrão" />
						<Button variant="secondary" size="sm">
							<X className="size-4" />
							Limpar
						</Button>
						<Button variant="secondary">
							<X className="size-4" />
							Limpar
						</Button>
						<Button variant="secondary" disabled>
							<X className="size-4" />
							Limpar
						</Button>
					</Section>

					{/* Variante 7: Apenas ícone (Ghost) */}
					<Section title="Variação 7 — Apenas ícone (Ghost)">
						<VariantLabel label="Ícone X" />
						<Button
							variant="ghost"
							size="icon"
							className="hover:text-destructive hover:bg-destructive/10"
						>
							<X className="size-4" />
						</Button>

						<VariantLabel label="Ícone Borracha" />
						<Button
							variant="ghost"
							size="icon"
							className="hover:text-destructive hover:bg-destructive/10"
						>
							<Eraser className="size-4" />
						</Button>

						<VariantLabel label="Ícone Reset" />
						<Button
							variant="ghost"
							size="icon"
							className="hover:text-destructive hover:bg-destructive/10"
						>
							<RotateCcw className="size-4" />
						</Button>
					</Section>

					{/* Variante 8: Link style */}
					<Section title="Variação 8 — Estilo Link">
						<Button
							variant="link"
							className="text-destructive hover:text-destructive/80"
						>
							<X className="size-4" />
							Limpar
						</Button>
					</Section>
				</div>

				{/* ===================== BOTÕES PRIMÁRIOS ===================== */}
				<div className="space-y-6">
					<h2 className="text-2xl font-bold text-foreground">Botão Primário</h2>
					<Section title="Variantes e tamanhos">
						<Button variant="default" size="sm">
							Small
						</Button>
						<Button variant="default">Default</Button>
						<Button variant="default" size="lg">
							Large
						</Button>
						<Button variant="default" disabled>
							Disabled
						</Button>
					</Section>
				</div>

				{/* ===================== INPUTS ===================== */}
				<div className="space-y-6">
					<h2 className="text-2xl font-bold text-foreground">Inputs</h2>
					<Section title="Input + Textarea + Select">
						<input
							type="text"
							placeholder="Input padrão..."
							className="h-9 w-64 rounded-lg border border-input bg-card px-2.5 py-1 text-sm outline-none focus-visible:ring-1 focus-visible:ring-ring"
						/>
						<textarea
							placeholder="Textarea padrão..."
							rows={3}
							className="w-64 rounded-lg border border-input bg-card px-2.5 py-2 text-sm outline-none focus-visible:ring-1 focus-visible:ring-ring"
						/>
					</Section>
				</div>
			</div>
		</div>
	);
}
