"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { generateMultipleCPF } from "@/lib/cpf/generate";
import { CpfList } from "./cpf-list";

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

	return (
		<div className="space-y-6">
			<div className="space-y-4">
				<div className="space-y-2">
					<label
						htmlFor="cpf-quantity"
						className="text-sm font-medium text-foreground mr-3"
					>
						Quantidade de CPFs
					</label>
					<Input
						id="cpf-quantity"
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
						id="format-cpf"
						checked={formatted}
						onCheckedChange={(checked) => setFormatted(checked === true)}
					/>
					<label
						htmlFor="format-cpf"
						className="cursor-pointer text-sm text-foreground"
					>
						Formatar CPF (###.###.###-##)
					</label>
				</div>
			</div>
			<Button onClick={handleGenerate}>Gerar CPF</Button>
			{cpfs.length > 0 && <CpfList cpfs={cpfs} />}
		</div>
	);
}
