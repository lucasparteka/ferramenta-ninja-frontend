"use client";

import { CreditCard } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { LayoutE } from "@/components/shared/layout-e";
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
		const digits = value.replace(/\D/g, "").slice(0, 16);
		const masked = digits.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
		setInput(masked);
		setResult(null);
	}

	function handleKeyDown(e: React.KeyboardEvent) {
		if (e.key === "Enter") {
			handleValidate();
		}
	}

	const state = result ? "result" : "empty";

	return (
		<LayoutE
			state={state}
			searchBar={
				<div className="space-y-3">
					<div className="space-y-1.5">
						<label
							htmlFor="card-number-input"
							className="text-xs font-medium text-muted-foreground"
						>
							Número do cartão
						</label>
						<Input
							id="card-number-input"
							type="text"
							inputMode="numeric"
							value={input}
							onChange={(e) => handleChange(e.target.value)}
							onKeyDown={handleKeyDown}
							maxLength={19}
							placeholder="0000 0000 0000 0000"
							className="font-mono max-w-xs"
						/>
					</div>
					<Button onClick={handleValidate} disabled={input.length < 13}>
						<CreditCard className="mr-2 h-3.5 w-3.5" />
						Validar cartão
					</Button>
				</div>
			}
			emptyState={
				<div className="flex min-h-[200px] flex-col items-center justify-center gap-2 rounded-md border border-dashed border-border bg-muted/30 p-8 text-center">
					<CreditCard
						className="h-5 w-5 text-muted-foreground"
						strokeWidth={1.75}
					/>
					<p className="text-sm text-foreground">
						Digite um número de cartão para validar
					</p>
					<p className="text-xs text-muted-foreground">
						Usa o algoritmo de Luhn para verificação
					</p>
				</div>
			}
			result={
				result && (
					<div className="space-y-4">
						<div
							className={`rounded-md border p-4 ${
								result.valid
									? "border-success/30 bg-success/10"
									: "border-destructive/30 bg-destructive/10"
							}`}
						>
							<p
								className={`text-sm font-semibold ${
									result.valid ? "text-success" : "text-destructive"
								}`}
							>
								{result.valid ? "Cartão válido" : "Cartão inválido"}
							</p>
							{result.formatted && (
								<p className="mt-1 font-mono text-xs text-muted-foreground">
									{result.formatted}
								</p>
							)}
							<p className="mt-1 text-xs text-muted-foreground">
								Bandeira detectada: {result.brand}
							</p>
							{!result.valid && (
								<p className="mt-2 text-xs text-muted-foreground">
									O número não passa na verificação do algoritmo de Luhn.
								</p>
							)}
						</div>

						<p className="text-xs text-muted-foreground">
							Precisa de um número para testar?{" "}
							<Link
								href="/ferramentas/gerador-de-cartao-de-credito"
								className="text-primary underline underline-offset-4 hover:opacity-80"
							>
								Use o Gerador de Cartão de Crédito
							</Link>
						</p>
					</div>
				)
			}
		/>
	);
}
