"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { binaryToText, textToBinary } from "@/lib/encoding/binary";

const selectClass =
	"w-full rounded-lg border border-border bg-input px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring";

const textareaClass =
	"w-full rounded-lg border border-border bg-input px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none";

const outputClass =
	"w-full rounded-lg border border-border bg-secondary px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none";

export function BinaryConverter() {
	const [input, setInput] = useState("");
	const [separator, setSeparator] = useState(" ");
	const [output, setOutput] = useState("");
	const [error, setError] = useState("");
	const [copied, setCopied] = useState(false);

	function resetOutput() {
		setOutput("");
		setError("");
	}

	function handleEncode() {
		setError("");
		const cleaned = input.trim();
		if (!cleaned) {
			setError("Digite o texto de entrada.");
			return;
		}
		try {
			setOutput(textToBinary(cleaned, separator));
		} catch (e) {
			setError(
				e instanceof Error ? e.message : "Erro ao converter para binário.",
			);
		}
	}

	function handleDecode() {
		setError("");
		const cleaned = input.trim();
		if (!cleaned) {
			setError("Digite o código binário.");
			return;
		}
		try {
			setOutput(binaryToText(cleaned));
		} catch (e) {
			setError(
				e instanceof Error ? e.message : "Erro ao converter para texto.",
			);
		}
	}

	function handleCopy() {
		if (!output) return;
		navigator.clipboard.writeText(output);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	}

	return (
		<div className="flex flex-col gap-6 sm:flex-row">
			<div className="space-y-4 sm:flex-1">
				<div className="space-y-1">
					<label
						htmlFor="bin-input"
						className="flex w-full text-sm font-medium text-foreground"
					>
						Texto de entrada
					</label>
					<textarea
						id="bin-input"
						rows={8}
						placeholder="Digite o texto ou cole o código binário aqui..."
						value={input}
						onChange={(e) => {
							setInput(e.target.value);
							resetOutput();
						}}
						className={textareaClass}
					/>
				</div>

				<div className="space-y-1">
					<label
						htmlFor="bin-separator"
						className="flex w-full text-sm font-medium text-foreground"
					>
						Separador (texto → binário)
					</label>
					<select
						id="bin-separator"
						value={separator}
						onChange={(e) => {
							setSeparator(e.target.value);
							resetOutput();
						}}
						className={selectClass}
					>
						<option value=" ">Com espaços — 01001000 01100101</option>
						<option value="">Sem espaços — 0100100001100101</option>
					</select>
				</div>

				{error && <p className="text-sm text-destructive">{error}</p>}

				<div className="flex flex-wrap gap-3">
					<Button onClick={handleEncode}>Texto → Binário</Button>
					<Button variant="outline" onClick={handleDecode}>
						Binário → Texto
					</Button>
				</div>
			</div>

			<div className="space-y-1 sm:flex-1">
				<div className="flex items-center justify-between">
					<label className="text-sm font-medium text-foreground">
						Resultado
					</label>
					{output && (
						<Button variant="outline" size="sm" onClick={handleCopy}>
							{copied ? "Copiado!" : "Copiar"}
						</Button>
					)}
				</div>
				<textarea
					rows={8}
					readOnly
					value={output}
					placeholder="O resultado aparecerá aqui..."
					className={outputClass}
				/>
			</div>
		</div>
	);
}
