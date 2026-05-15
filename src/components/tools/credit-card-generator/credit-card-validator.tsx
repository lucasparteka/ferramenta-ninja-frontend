"use client";

import { CreditCard } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { LayoutE } from "@/components/shared/layout-e";
import { ResultSheet } from "@/components/shared/result-sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

	const state = result ? "result" : "empty";

	return (
		<LayoutE
			state={state}
			searchBar={
				<form
					onSubmit={handleValidate}
					className="flex gap-2 max-md:flex-col md:items-end"
				>
					<div className="flex flex-col gap-1">
						<Label htmlFor="card-number-input">Número do cartão</Label>
						<Input
							id="card-number-input"
							type="text"
							inputMode="numeric"
							value={input}
							onChange={(e) => handleChange(e.target.value)}
							maxLength={19}
							placeholder="0000 0000 0000 0000"
							className="font-mono"
						/>
					</div>
					<Button onClick={handleValidate} disabled={input.length < 13}>
						<CreditCard className="mr-2 h-3.5 w-3.5" />
						Validar cartão
					</Button>
				</form>
			}
			emptyState={
				<div className="flex min-h-50 flex-col items-center justify-center gap-2 bg-card p-8 text-center">
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
					<ResultSheet
						variant="grid"
						cols={1}
						sections={[
							{
								title: "Resultado da Validação",
								rows: [
									{
										label: "Status",
										value: (
											<span
												className={`font-semibold ${result.valid ? "text-success" : "text-destructive"}`}
											>
												{result.valid ? "Cartão válido" : "Cartão inválido"}
											</span>
										),
									},
									{ label: "Bandeira", value: result.brand },
									{
										label: "Número",
										value: result.formatted ?? input,
										mono: true,
									},
									{
										label: "Algoritmo de Luhn",
										value: (
											<span
												className={`font-semibold ${result.valid ? "text-success" : "text-destructive"}`}
											>
												{result.valid ? "OK" : "INVÁLIDO"}
											</span>
										),
									},
								],
							},
						]}
					/>
				)
			}
			footerActions={
				result && !result.valid ? (
					<span className="text-xs text-muted-foreground">
						O número não passa na verificação do algoritmo de Luhn.
					</span>
				) : (
					<>
						<span className="text-xs text-muted-foreground">
							Precisa de um número para testar?
						</span>
						<Link
							href="/ferramentas/gerador-de-cartao-de-credito"
							className="inline-flex h-8 items-center rounded-md border border-border bg-background px-3 text-xs font-medium text-foreground hover:bg-muted"
						>
							Gerador de Cartão
						</Link>
					</>
				)
			}
		/>
	);
}
