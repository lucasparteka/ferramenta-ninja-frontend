"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { validateCNPJ } from "@/lib/cnpj/validate";

export function CnpjValidator() {
	const [input, setInput] = useState("");
	const [result, setResult] = useState<boolean | null>(null);

	function handleInput(value: string) {
		setInput(value);
		setResult(null);
	}

	function handleValidate() {
		setResult(validateCNPJ(input));
	}

	return (
		<div className="space-y-4">
			<div className="space-y-2">
				<label
					htmlFor="cnpj-validate-input"
					className="mr-3 text-sm font-medium text-foreground"
				>
					Digite um CNPJ para validar
				</label>
				<Input
					id="cnpj-validate-input"
					type="text"
					value={input}
					onChange={(e) => handleInput(e.target.value)}
					placeholder="00.000.000/0000-00"
					maxLength={18}
					className="max-w-xs font-mono"
				/>
			</div>

			<Button
				variant="outline"
				onClick={handleValidate}
				disabled={!input.trim()}
			>
				Validar CNPJ
			</Button>

			{result !== null && (
				<div
					className={`rounded-lg border p-4 ${
						result
							? "border-success/30 bg-success/10"
							: "border-destructive/30 bg-destructive/10"
					}`}
				>
					<p
						className={`font-semibold ${result ? "text-success" : "text-destructive"}`}
					>
						{result ? "CNPJ válido" : "CNPJ inválido"}
					</p>
					{!result && (
						<p className="mt-1 text-sm text-muted-foreground">
							Verifique os dígitos e tente novamente.
						</p>
					)}
				</div>
			)}
		</div>
	);
}
