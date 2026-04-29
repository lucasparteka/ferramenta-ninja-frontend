"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/select-native";
import { Textarea } from "@/components/ui/textarea";
import type { Algorithm } from "@/lib/crypto/cipher";
import {
	decodeBase64,
	decryptAES,
	encodeBase64,
	encryptAES,
	rot13,
} from "@/lib/crypto/cipher";

export function TextCipher() {
	const [algorithm, setAlgorithm] = useState<Algorithm>("aes-gcm");
	const [input, setInput] = useState("");
	const [password, setPassword] = useState("");
	const [output, setOutput] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const [copied, setCopied] = useState(false);

	function resetOutput() {
		setOutput("");
		setError("");
	}

	async function handleEncrypt() {
		setError("");
		if (!input.trim()) {
			setError("Digite o texto de entrada.");
			return;
		}
		if (algorithm === "aes-gcm" && !password) {
			setError("Digite a senha para criptografar.");
			return;
		}
		setLoading(true);
		try {
			let result = "";
			if (algorithm === "aes-gcm") result = await encryptAES(input, password);
			else if (algorithm === "base64") result = encodeBase64(input);
			else result = rot13(input);
			setOutput(result);
		} catch (e) {
			setError(e instanceof Error ? e.message : "Erro ao cifrar o texto.");
		}
		setLoading(false);
	}

	async function handleDecrypt() {
		setError("");
		if (!input.trim()) {
			setError("Digite o texto de entrada.");
			return;
		}
		if (algorithm === "aes-gcm" && !password) {
			setError("Digite a senha para descriptografar.");
			return;
		}
		setLoading(true);
		try {
			let result = "";
			if (algorithm === "aes-gcm") result = await decryptAES(input, password);
			else if (algorithm === "base64") result = decodeBase64(input);
			else result = rot13(input);
			setOutput(result);
		} catch (e) {
			setError(e instanceof Error ? e.message : "Erro ao decifrar o texto.");
		}
		setLoading(false);
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
						htmlFor="cipher-input"
						className="flex w-full text-sm font-medium text-foreground"
					>
						Texto de entrada
					</label>
					<Textarea
						id="cipher-input"
						rows={8}
						placeholder="Digite ou cole o texto aqui..."
						value={input}
						onChange={(e) => {
							setInput(e.target.value);
							resetOutput();
						}}
						className="resize-none text-foreground"
					/>
				</div>

				<div className="space-y-1">
					<label
						htmlFor="cipher-algorithm"
						className="flex w-full text-sm font-medium text-foreground"
					>
						Algoritmo
					</label>
					<NativeSelect
						id="cipher-algorithm"
						value={algorithm}
						onChange={(e) => {
							setAlgorithm(e.target.value as Algorithm);
							resetOutput();
						}}
						className="text-foreground"
					>
						<option value="aes-gcm">
							AES-256-GCM — criptografia com senha
						</option>
						<option value="base64">Base64 — codificação</option>
						<option value="rot13">ROT13 — cifra de substituição</option>
					</NativeSelect>
				</div>

				{algorithm === "aes-gcm" && (
					<div className="space-y-1">
						<label
							htmlFor="cipher-password"
							className="flex w-full text-sm font-medium text-foreground"
						>
							Senha
						</label>
						<Input
							id="cipher-password"
							type="password"
							placeholder="Digite a senha..."
							value={password}
							onChange={(e) => {
								setPassword(e.target.value);
								resetOutput();
							}}
							className="text-foreground"
						/>
					</div>
				)}

				{error && <p className="text-sm text-destructive">{error}</p>}

				<div className="flex gap-3">
					<Button onClick={handleEncrypt} disabled={loading}>
						{loading ? "Processando..." : "Cifrar"}
					</Button>
					<Button variant="outline" onClick={handleDecrypt} disabled={loading}>
						{loading ? "Processando..." : "Decifrar"}
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
				<Textarea
					rows={8}
					readOnly
					value={output}
					placeholder="O resultado aparecerá aqui..."
					className="resize-none bg-secondary text-foreground"
				/>
			</div>
		</div>
	);
}
