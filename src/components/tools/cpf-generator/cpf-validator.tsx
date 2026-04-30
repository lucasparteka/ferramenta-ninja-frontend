"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { validateCPF } from "@/lib/cpf/validate";

export function CpfValidator() {
	const [input, setInput] = useState("");
	const [result, setResult] = useState<boolean | null>(null);

	function handleInput(value: string) {
		setInput(value);
		setResult(null);
	}

	function handleValidate() {
		setResult(validateCPF(input));
	}

	return (
		<div className="space-y-4">
			<div className="space-y-2">
				<label
					htmlFor="cpf-validate-input"
					className="text-sm font-medium text-foreground mr-3"
				>
					Digite um CPF para validar
				</label>
				<Input
					id="cpf-validate-input"
					type="text"
					value={input}
					onChange={(e) => handleInput(e.target.value)}
					placeholder="000.000.000-00"
					maxLength={14}
					className="max-w-xs font-mono"
				/>
			</div>

			<Button
				variant="outline"
				onClick={handleValidate}
				disabled={!input.trim()}
			>
				Validar CPF
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
						{result ? "CPF válido" : "CPF inválido"}
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
