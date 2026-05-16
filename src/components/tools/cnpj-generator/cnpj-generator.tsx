"use client";

import { RotateCcw, Shuffle } from "lucide-react";
import { useState } from "react";
import { CopyButton } from "@/components/shared/copy-button";
import { Chip } from "@/components/shared/layout-b/chip";
import { SectionLabel } from "@/components/shared/layout-b/section-label";
import { LayoutD } from "@/components/shared/layout-d";
import { NumberInput } from "@/components/shared/number-input";
import { ToolHeader } from "@/components/shared/tool-header";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { generateMultipleCNPJ } from "@/lib/cnpj/generate";

export function CnpjGenerator() {
	const [quantity, setQuantity] = useState(1);
	const [formatted, setFormatted] = useState(true);
	const [cnpjs, setCnpjs] = useState<string[]>([]);

	function handleGenerate() {
		setCnpjs(generateMultipleCNPJ(quantity, formatted));
	}

	function handleReset() {
		setCnpjs([]);
		setQuantity(1);
		setFormatted(true);
	}

	return (
		<LayoutD
			header={
				<ToolHeader
					title="Gerador de CNPJ"
					badge="DOCUMENTO"
					actions={
						<>
							<Button
								variant="secondary"
								size="sm"
								onClick={handleReset}
								disabled={!cnpjs.length}
							>
								<RotateCcw className="mr-1.5 h-3 w-3" />
								Resetar
							</Button>
							<Button size="sm" onClick={handleGenerate}>
								<Shuffle className="mr-1.5 h-3 w-3" />
								Gerar
							</Button>
						</>
					}
				/>
			}
			sidebar={
				!cnpjs.length ? (
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
									CNPJs Gerados
								</span>
								<Chip tone="neutral">{cnpjs.length}</Chip>
							</div>
						</div>

						<ul className="divide-y divide-border flex-1 overflow-y-auto max-h-96">
							{cnpjs.map((cnpj) => (
								<li
									key={cnpj}
									className="flex items-center justify-between px-3 py-2"
								>
									<span className="font-mono text-sm text-foreground">
										{cnpj}
									</span>
									<CopyButton text={cnpj} variant="ghost" size="sm" />
								</li>
							))}
						</ul>

						<div className="flex gap-2 border-t border-border p-3">
							<CopyButton
								text={cnpjs.join("\n")}
								label="Copiar tudo"
								variant="outline"
								size="sm"
							/>
						</div>
					</>
				)
			}
			sidebarWidth={360}
		>
			<div className="divide-y divide-border">
				<div className="p-4">
					<SectionLabel>Configuração</SectionLabel>
					<div className="space-y-3">
						<div>
							<Label htmlFor="cnpj-quantity" className="mb-1.5 block text-xs">
								Quantidade de CNPJs
							</Label>
							<NumberInput
								id="cnpj-quantity"
								value={quantity}
								onChange={(v) => setQuantity(v)}
								min={1}
								max={100}
								className="w-24"
							/>
						</div>

						<div className="flex items-center gap-2">
							<Checkbox
								id="format-cnpj"
								checked={formatted}
								onCheckedChange={(checked) => setFormatted(checked === true)}
							/>
							<label
								htmlFor="format-cnpj"
								className="text-xs font-medium cursor-pointer text-foreground"
							>
								Formatar (##.###.###/####-##)
							</label>
						</div>
					</div>
				</div>
			</div>
		</LayoutD>
	);
}
