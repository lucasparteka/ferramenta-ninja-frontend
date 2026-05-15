"use client";

import { CheckCircle } from "lucide-react";
import { useState } from "react";
import { Chip } from "@/components/shared/layout-b/chip";
import { LayoutD } from "@/components/shared/layout-d";
import { ToolHeader } from "@/components/shared/tool-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { validateUuid } from "@/lib/uuid/validate";

type ValidationResult =
	| { valid: true; version: number }
	| { valid: false }
	| null;

const VERSION_LABELS: Record<number, string> = {
	1: "v1 — baseado em data/hora",
	3: "v3 — baseado em namespace (MD5)",
	4: "v4 — aleatório",
	5: "v5 — baseado em namespace (SHA-1)",
	6: "v6 — baseado em data/hora (reordenado)",
	7: "v7 — baseado em data/hora (Unix)",
};

export function UuidValidator() {
	const [input, setInput] = useState("");
	const [result, setResult] = useState<ValidationResult>(null);

	function handleInput(value: string) {
		setInput(value);
		setResult(null);
	}

	function handleValidate() {
		setResult(validateUuid(input));
	}

	function handleReset() {
		setInput("");
		setResult(null);
	}

	function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
		if (event.key === "Enter" && input.trim()) handleValidate();
	}

	return (
		<LayoutD
			header={
				<ToolHeader
					title="Validar UUID"
					badge="UUID"
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
					<div className="flex flex-col items-center justify-center gap-2 p-6 text-center min-h-48 max-md:border-t max-md:border-border">
						<p className="text-sm text-muted-foreground">
							Digite um UUID para validar
						</p>
					</div>
				) : (
					<div className="p-4 min-h-48 max-md:border-t max-md:border-border">
						<div className="mb-2 flex items-center justify-between">
							<span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
								Resultado
							</span>
							<Chip tone={result.valid ? "success" : "danger"}>
								{result.valid ? "Válido" : "Inválido"}
							</Chip>
						</div>
						<p
							className={`font-semibold ${result.valid ? "text-success" : "text-destructive"}`}
						>
							{result.valid ? "UUID válido" : "UUID inválido"}
						</p>
						{result.valid && (
							<p className="mt-1 text-sm text-muted-foreground">
								{VERSION_LABELS[result.version] ?? `Versão ${result.version}`}
							</p>
						)}
						{!result.valid && (
							<p className="mt-1 text-sm text-muted-foreground">
								O valor informado não corresponde a um UUID válido. Verifique o
								formato e tente novamente.
							</p>
						)}
					</div>
				)
			}
			sidebarWidth={360}
		>
			<div className="p-4">
				<Label htmlFor="uuid-validate-input" className="mb-1.5 block text-xs">
					UUID
				</Label>
				<Input
					id="uuid-validate-input"
					type="text"
					value={input}
					onChange={(e) => handleInput(e.target.value)}
					onKeyDown={handleKeyDown}
					placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
					className="max-w-sm font-mono"
				/>
			</div>
		</LayoutD>
	);
}
