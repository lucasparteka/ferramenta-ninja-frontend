"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { NativeSelect } from "@/components/ui/select-native";
import { Textarea } from "@/components/ui/textarea";
import { binaryToText, textToBinary } from "@/lib/encoding/binary";

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
					<Textarea
						id="bin-input"
						rows={8}
						placeholder="Digite o texto ou cole o código binário aqui..."
						value={input}
						onChange={(e) => {
							setInput(e.target.value);
							resetOutput();
						}}
						className="bg-input text-foreground resize-none"
					/>
				</div>

				<div className="space-y-1">
					<label
						htmlFor="bin-separator"
						className="flex w-full text-sm font-medium text-foreground"
					>
						Separador (texto → binário)
					</label>
					<NativeSelect
						id="bin-separator"
						value={separator}
						onChange={(e) => {
							setSeparator(e.target.value);
							resetOutput();
						}}
						className="bg-input text-foreground"
					>
						<option value=" ">Com espaços — 01001000 01100101</option>
						<option value="">Sem espaços — 0100100001100101</option>
					</NativeSelect>
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
					<label
						htmlFor="copy-result"
						className="text-sm font-medium text-foreground"
					>
						Resultado
					</label>
					{output && (
						<Button
							id="copy-result"
							variant="outline"
							size="sm"
							onClick={handleCopy}
						>
							{copied ? "Copiado!" : "Copiar"}
						</Button>
					)}
				</div>
				<Textarea
					rows={8}
					readOnly
					value={output}
					placeholder="O resultado aparecerá aqui..."
					className="bg-secondary text-foreground resize-none"
				/>
			</div>
		</div>
	);
}
