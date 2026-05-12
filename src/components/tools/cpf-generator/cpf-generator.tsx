"use client";

import { RotateCcw, Shuffle } from "lucide-react";
import { useState } from "react";
import { CopyButton } from "@/components/shared/copy-button";
import { Chip } from "@/components/shared/layout-b/chip";
import { SectionLabel } from "@/components/shared/layout-b/section-label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { generateMultipleCPF } from "@/lib/cpf/generate";

export function CpfGenerator() {
	const [quantity, setQuantity] = useState(1);
	const [formatted, setFormatted] = useState(true);
	const [cpfs, setCpfs] = useState<string[]>([]);

	function handleQuantity(raw: string) {
		const value = Number(raw);
		if (!Number.isNaN(value)) {
			setQuantity(Math.min(100, Math.max(1, value)));
		}
	}

	function handleGenerate() {
		setCpfs(generateMultipleCPF(quantity, formatted));
	}

	function handleReset() {
		setCpfs([]);
		setQuantity(1);
		setFormatted(true);
	}

	return (
		<div className="grid grid-cols-1 gap-0 items-start lg:grid-cols-[1fr_360px] border border-border rounded-md overflow-hidden">
			{/* Header */}
			<div className="col-span-full flex items-center justify-between border-b border-border px-4 py-2.5 bg-card">
				<div className="flex items-center gap-3">
					<h2 className="text-sm font-semibold tracking-tight">
						Gerador de CPF
					</h2>
					<span className="rounded border border-border px-1.5 py-px font-mono text-[10px] text-muted-foreground">
						DOCUMENTO
					</span>
				</div>
			</div>

			{/* Coluna esquerda — formulário */}
			<div className="bg-card flex flex-col h-full">
				<div className="divide-y divide-border">
					<div className="p-4">
						<SectionLabel>Configuração</SectionLabel>
						<div className="space-y-3">
							<div>
								<Label htmlFor="cpf-quantity" className="mb-1.5 block text-xs">
									Quantidade de CPFs
								</Label>
								<Input
									id="cpf-quantity"
									type="number"
									min={1}
									max={100}
									value={quantity}
									onChange={(e) => handleQuantity(e.target.value)}
									className="w-24 font-mono"
								/>
							</div>

							<div className="flex items-center gap-2">
								<Checkbox
									id="format-cpf"
									checked={formatted}
									onCheckedChange={(checked) => setFormatted(checked === true)}
								/>
								<label
									htmlFor="format-cpf"
									className="text-xs font-medium cursor-pointer text-foreground"
								>
									Formatar (###.###.###-##)
								</label>
							</div>
						</div>
					</div>
				</div>

				<div className="flex items-center justify-end border-t border-border bg-muted/40 px-4 py-3 mt-auto">
					<div className="flex items-center gap-2">
						<Button
							type="button"
							variant="ghost"
							size="sm"
							onClick={handleReset}
							disabled={!cpfs.length}
						>
							<RotateCcw className="mr-1.5 h-3 w-3" />
							Resetar
						</Button>
						<Button size="sm" onClick={handleGenerate}>
							<Shuffle className="mr-1.5 h-3 w-3" />
							Gerar
						</Button>
					</div>
				</div>
			</div>

			{/* Coluna direita — resultado */}
			<aside className="flex h-full lg:border-l max-lg:border-t border-border flex-col">
				{!cpfs.length ? (
					<div className="flex flex-col items-center justify-center gap-2 p-6 text-center min-h-48">
						<p className="text-sm text-muted-foreground">
							Configure e clique em Gerar
						</p>
					</div>
				) : (
					<>
						<div className="p-3 border-b border-border">
							<div className="flex items-center justify-between">
								<span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
									CPFs Gerados
								</span>
								<Chip tone="neutral">{cpfs.length}</Chip>
							</div>
						</div>

						<ul className="divide-y divide-border flex-1 overflow-y-auto max-h-96">
							{cpfs.map((cpf) => (
								<li
									key={cpf}
									className="flex items-center justify-between px-3 py-2"
								>
									<span className="font-mono text-sm text-foreground">
										{cpf}
									</span>
									<CopyButton text={cpf} variant="ghost" size="sm" />
								</li>
							))}
						</ul>

						<div className="flex gap-2 border-t border-border p-3">
							<CopyButton
								text={cpfs.join("\n")}
								label="Copiar tudo"
								variant="outline"
								size="sm"
							/>
						</div>
					</>
				)}
			</aside>
		</div>
	);
}
