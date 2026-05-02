"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { generateMultipleCNPJ } from "@/lib/cnpj/generate";
import { CnpjList } from "./cnpj-list";

export function CnpjGenerator() {
	const [quantity, setQuantity] = useState(1);
	const [formatted, setFormatted] = useState(true);
	const [cnpjs, setCnpjs] = useState<string[]>([]);

	function handleQuantity(raw: string) {
		const value = Number(raw);
		if (!Number.isNaN(value)) {
			setQuantity(Math.min(100, Math.max(1, value)));
		}
	}

	function handleGenerate() {
		setCnpjs(generateMultipleCNPJ(quantity, formatted));
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

				<div className="flex items-center gap-2">
					<Checkbox
						id="format-cnpj"
						checked={formatted}
						onCheckedChange={(checked) => setFormatted(checked === true)}
					/>
					<label htmlFor="format-cnpj" className="cursor-pointer text-sm text-foreground">
						Formatar CNPJ (##.###.###/####-##)
					</label>
				</div>
			</div>

			<Button onClick={handleGenerate}>Gerar CNPJ</Button>

			{cnpjs.length > 0 && <CnpjList cnpjs={cnpjs} />}
		</div>
	);
}
