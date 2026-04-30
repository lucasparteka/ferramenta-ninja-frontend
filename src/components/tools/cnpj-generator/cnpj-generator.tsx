"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { generateMultipleCNPJ } from "@/lib/cnpj/generate";
import { CnpjList } from "./cnpj-list";

export function CnpjGenerator() {
	const [quantity, setQuantity] = useState(1);
	const [formatted, setFormatted] = useState(true);
	const [cnpjs, setCnpjs] = useState<string[]>([]);
	const [copiedAll, setCopiedAll] = useState(false);

	function handleQuantity(raw: string) {
		const value = Number(raw);
		if (!Number.isNaN(value)) {
			setQuantity(Math.min(100, Math.max(1, value)));
		}
	}

	function handleGenerate() {
		setCnpjs(generateMultipleCNPJ(quantity, formatted));
		setCopiedAll(false);
	}

	function handleCopyAll() {
		navigator.clipboard.writeText(cnpjs.join("\n"));
		setCopiedAll(true);
		setTimeout(() => setCopiedAll(false), 2000);
	}

	return (
		<div className="space-y-6">
			<div className="space-y-4">
				<div className="space-y-2">
					<label
						htmlFor="cnpj-quantity"
						className="mr-3 text-sm font-medium text-foreground"
					>
						Quantidade de CNPJs
					</label>
					<Input
						id="cnpj-quantity"
						type="number"
						min={1}
						max={100}
						value={quantity}
						onChange={(e) => handleQuantity(e.target.value)}
						className="w-24"
					/>
				</div>

				<label className="flex cursor-pointer items-center gap-2">
					<input
						type="checkbox"
						checked={formatted}
						onChange={(e) => setFormatted(e.target.checked)}
						className="accent-primary"
					/>
					<span className="text-sm text-foreground">
						Formatar CNPJ (##.###.###/####-##)
					</span>
				</label>
			</div>

			<Button onClick={handleGenerate}>Gerar CNPJ</Button>

			{cnpjs.length > 0 && (
				<CnpjList
					cnpjs={cnpjs}
					onCopyAll={handleCopyAll}
					copiedAll={copiedAll}
				/>
			)}
		</div>
	);
}
