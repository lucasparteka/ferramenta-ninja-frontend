"use client";

import { CheckCircle } from "lucide-react";
import { useState } from "react";
import { Chip } from "@/components/shared/layout-b/chip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { validateCPF } from "@/lib/cpf/validate";

export function CpfValidator() {
	const [input, setInput] = useState("");
	const [result, setResult] = useState<boolean | null>(null);

	function handleInput(value: string) {
		const digits = value.replace(/\D/g, "").slice(0, 11);
		const masked = digits
			.replace(/^(\d{3})(\d)/, "$1.$2")
			.replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
			.replace(/\.(\d{3})(\d)/, ".$1-$2");
		setInput(masked);
		setResult(null);
	}

	function handleValidate() {
		setResult(validateCPF(input));
	}

	function handleReset() {
		setInput("");
		setResult(null);
	}

	function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
		if (e.key === "Enter" && input.trim()) handleValidate();
	}

	return (
		<div className="grid grid-cols-1 gap-0 items-start lg:grid-cols-[1fr_360px] border border-border rounded-md overflow-hidden">
			{/* Header */}
			<div className="col-span-full flex items-center justify-between border-b border-border px-4 py-2.5 bg-card">
				<div className="flex items-center gap-3">
					<h2 className="text-sm font-semibold tracking-tight">Validar CPF</h2>
					<span className="rounded border border-border px-1.5 py-px font-mono text-[10px] text-muted-foreground">
						DOCUMENTO
					</span>
				</div>
			</div>

			{/* Coluna esquerda — formulário */}
			<div className="bg-card flex flex-col h-full">
				<div className="divide-y divide-border">
					<div className="p-4">
						<div>
							<Label
								htmlFor="cpf-validate-input"
								className="mb-1.5 block text-xs"
							>
								CPF
							</Label>
							<Input
								id="cpf-validate-input"
								type="text"
								value={input}
								onChange={(e) => handleInput(e.target.value)}
								onKeyDown={handleKeyDown}
								placeholder="000.000.000-00"
								maxLength={14}
								className="max-w-xs font-mono"
							/>
						</div>
					</div>
				</div>

				<div className="flex items-center justify-end border-t border-border bg-muted/40 px-4 py-3 mt-auto">
					<div className="flex items-center gap-2">
						<Button
							type="button"
							variant="ghost"
							size="sm"
							onClick={handleReset}
							disabled={!input}
						>
							Limpar
						</Button>
						<Button size="sm" onClick={handleValidate} disabled={!input.trim()}>
							<CheckCircle className="mr-1.5 h-3 w-3" />
							Validar
						</Button>
					</div>
				</div>
			</div>

			{/* Coluna direita — resultado */}
			<aside className="flex h-full lg:border-l max-lg:border-t border-border flex-col">
				{result === null ? (
					<div className="flex flex-col items-center justify-center gap-2 p-6 text-center min-h-[12rem]">
						<p className="text-sm text-muted-foreground">
							Digite um CPF para validar
						</p>
					</div>
				) : (
					<div className="p-4">
						<div className="mb-2 flex items-center justify-between">
							<span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
								Resultado
							</span>
							<Chip tone={result ? "success" : "danger"}>
								{result ? "Válido" : "Inválido"}
							</Chip>
						</div>
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
			</aside>
		</div>
	);
}
