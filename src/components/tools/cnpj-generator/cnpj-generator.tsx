"use client";

import { Shuffle } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
					<Label htmlFor="cnpj-quantity" className="mr-3">
						Quantidade de CNPJs
					</Label>
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
					<Label htmlFor="format-cnpj" className="cursor-pointer">
						Formatar CNPJ (##.###.###/####-##)
					</Label>
				</div>
			</div>

			<Button onClick={handleGenerate}>
				<Shuffle /> Gerar CNPJ
			</Button>

			{cnpjs.length > 0 && <CnpjList cnpjs={cnpjs} />}
		</div>
	);
}
