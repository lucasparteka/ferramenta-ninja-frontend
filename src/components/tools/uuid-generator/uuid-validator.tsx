"use client";

import { useState } from "react";
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

	function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
		if (event.key === "Enter") handleValidate();
	}

	return (
		<div className="space-y-4">
			<div className="space-y-1">
				<Label htmlFor="uuid-validate-input">UUID para validar</Label>
				<Input
					id="uuid-validate-input"
					type="text"
					value={input}
					onChange={(e) => handleInput(e.target.value)}
					onKeyDown={handleKeyDown}
					placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
					className="max-w-lg font-mono text-foreground"
				/>
			</div>

			<Button
				variant="outline"
				onClick={handleValidate}
				disabled={!input.trim()}
			>
				Validar UUID
			</Button>

			{result !== null && (
				<div
					className={`rounded-lg border p-4 ${
						result.valid
							? "border-success/30 bg-success/10"
							: "border-destructive/30 bg-destructive/10"
					}`}
				>
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
			)}
		</div>
	);
}
