"use client";

import { CheckCircle } from "lucide-react";
import { useState } from "react";
import { Chip } from "@/components/shared/layout-b/chip";
import { LayoutD } from "@/components/shared/layout-d";
import { ToolHeader } from "@/components/shared/tool-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCnpjMask } from "@/lib/cnpj/lookup";
import { validateCNPJ } from "@/lib/cnpj/validate";

export function CnpjValidator() {
	const [input, setInput] = useState("");
	const [result, setResult] = useState<boolean | null>(null);

	function handleInput(value: string) {
		const digits = value.replace(/\D/g, "").slice(0, 14);
		setInput(formatCnpjMask(digits));
		setResult(null);
	}

	function handleValidate() {
		setResult(validateCNPJ(input));
	}

	function handleReset() {
		setInput("");
		setResult(null);
	}

	function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
		if (e.key === "Enter" && input.trim()) handleValidate();
	}

	return (
		<LayoutD
			header={
				<ToolHeader
					title="Validar CNPJ"
					badge="DOCUMENTO"
					actions={
						<>
							<Button
								variant="secondary"
								size="sm"
								onClick={handleReset}
								disabled={!input}
							>
								Limpar
							</Button>
							<Button
								size="sm"
								onClick={handleValidate}
								disabled={!input.trim()}
							>
								<CheckCircle className="mr-1.5 h-3 w-3" />
								Validar
							</Button>
						</>
					}
				/>
			}
			sidebar={
				result === null ? (
					<div className="flex flex-col items-center justify-center gap-2 p-6 text-center min-h-[12rem]">
						<p className="text-sm text-muted-foreground">
							Digite um CNPJ para validar
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
							{result ? "CNPJ válido" : "CNPJ inválido"}
						</p>
						{!result && (
							<p className="mt-1 text-sm text-muted-foreground">
								Verifique os dígitos e tente novamente.
							</p>
						)}
					</div>
				)
			}
			sidebarWidth={360}
		>
			<div className="p-4">
				<Label htmlFor="cnpj-validate-input" className="mb-1.5 block text-xs">
					CNPJ
				</Label>
				<Input
					id="cnpj-validate-input"
					type="text"
					value={input}
					onChange={(e) => handleInput(e.target.value)}
					onKeyDown={handleKeyDown}
					placeholder="00.000.000/0000-00"
					maxLength={18}
					className="max-w-xs font-mono"
				/>
			</div>
		</LayoutD>
	);
}
