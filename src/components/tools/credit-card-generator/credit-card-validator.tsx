"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	type ValidationResult,
	validateCreditCard,
} from "@/lib/credit-card/validate";

export function CreditCardValidator() {
	const [input, setInput] = useState("");
	const [result, setResult] = useState<ValidationResult | null>(null);

	function handleValidate() {
		setResult(validateCreditCard(input));
	}

	function handleChange(value: string) {
		const digits = value.replace(/\D/g, "").slice(0, 19);
		setInput(digits);
		setResult(null);
	}

	return (
		<div className="space-y-4">
			<div className="space-y-2">
				<label
					htmlFor="card-number-input"
					className="text-sm font-medium text-foreground"
				>
					Número do cartão
				</label>
				<Input
					id="card-number-input"
					type="text"
					inputMode="numeric"
					value={input}
					onChange={(e) => handleChange(e.target.value)}
					maxLength={19}
					placeholder="0000 0000 0000 0000"
					className="max-w-xs font-mono"
				/>
			</div>

			<Button onClick={handleValidate} disabled={input.length < 13}>
				Validar Cartão
			</Button>

			{result && (
				<div
					className={`rounded-lg border p-4 ${
						result.valid
							? "border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-400"
							: "border-destructive/30 bg-destructive/10 text-destructive"
					}`}
				>
					<p className="font-semibold">
						{result.valid ? "Cartão válido" : "Cartão inválido"}
					</p>
					{result.formatted && (
						<p className="mt-1 font-mono text-sm opacity-80">
							{result.formatted}
						</p>
					)}
					<p className="mt-1 text-sm opacity-80">
						Bandeira detectada: {result.brand}
					</p>
					{!result.valid && (
						<p className="mt-2 text-sm opacity-70">
							O número não passa na verificação do algoritmo de Luhn.
						</p>
					)}
				</div>
			)}

			<p className="text-sm text-muted-foreground">
				Precisa de um número para testar?{" "}
				<Link
					href="/ferramentas/gerador-de-cartao-de-credito"
					className="text-primary underline underline-offset-4 hover:opacity-80"
				>
					Use o Gerador de Cartão de Crédito
				</Link>
			</p>
		</div>
	);
}
