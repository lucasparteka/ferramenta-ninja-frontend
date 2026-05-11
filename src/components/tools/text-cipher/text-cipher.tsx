"use client";

import { ArrowLeftRight, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { CopyButton } from "@/components/shared/copy-button";
import { LayoutC } from "@/components/shared/layout-c";
import { StatusBar } from "@/components/shared/status-bar";
import { Button } from "@/components/ui/button";
import type { Algorithm } from "@/lib/crypto/cipher";
import {
	decodeBase64,
	decryptAES,
	encodeBase64,
	encryptAES,
	rot13,
} from "@/lib/crypto/cipher";

type Mode = "encrypt" | "decrypt";

const ALGO_LABELS: Record<Algorithm, string> = {
	"aes-gcm": "AES-256",
	base64: "Base64",
	rot13: "ROT13",
};

export function TextCipher() {
	const [input, setInput] = useState("");
	const [mode, setMode] = useState<Mode>("encrypt");
	const [algorithm, setAlgorithm] = useState<Algorithm>("aes-gcm");
	const [password, setPassword] = useState("");
	const [output, setOutput] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (!input.trim()) {
			setOutput("");
			setError(null);
			return;
		}
		if (algorithm === "aes-gcm" && !password) {
			setOutput("");
			setError(null);
			return;
		}

		let cancelled = false;
		setLoading(true);

		(async () => {
			try {
				let result: string;
				if (algorithm === "aes-gcm") {
					result =
						mode === "encrypt"
							? await encryptAES(input, password)
							: await decryptAES(input, password);
				} else if (algorithm === "base64") {
					result =
						mode === "encrypt" ? encodeBase64(input) : decodeBase64(input);
				} else {
					result = rot13(input);
				}
				if (!cancelled) {
					setOutput(result);
					setError(null);
				}
			} catch (e) {
				if (!cancelled) {
					setOutput("");
					setError(e instanceof Error ? e.message : "Erro desconhecido.");
				}
			} finally {
				if (!cancelled) setLoading(false);
			}
		})();

		return () => {
			cancelled = true;
		};
	}, [input, mode, algorithm, password]);

	function handleSwap() {
		if (output) {
			setInput(output);
			setMode(mode === "encrypt" ? "decrypt" : "encrypt");
		}
	}

	function handleClear() {
		setInput("");
		setPassword("");
	}

	const inputLen = input.length;
	const outputLen = output.length;

	return (
		<LayoutC
			left={
				<>
					<div className="flex items-center justify-between border-b border-border bg-muted/40 px-3 py-2">
						<span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
							Entrada
						</span>
						<div className="flex items-center gap-1">
							{(["encrypt", "decrypt"] as const).map((m) => (
								<button
									key={m}
									type="button"
									onClick={() => setMode(m)}
									className={`rounded px-2 py-0.5 text-[11px] transition-colors ${
										mode === m
											? "bg-foreground/10 font-medium text-foreground"
											: "text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
									}`}
								>
									{m === "encrypt" ? "Cifrar" : "Decifrar"}
								</button>
							))}
							<Button
								variant="ghost"
								size="icon-sm"
								onClick={handleSwap}
								disabled={!output}
								aria-label="Trocar entrada e saída"
							>
								<ArrowLeftRight className="h-3.5 w-3.5" />
							</Button>
							<Button
								variant="ghost"
								size="icon-sm"
								onClick={handleClear}
								disabled={!input}
								aria-label="Limpar"
							>
								<Trash2 className="h-3.5 w-3.5" />
							</Button>
						</div>
					</div>

					<div className="flex items-center justify-between border-b border-border px-3 py-2">
						<span className="text-[11px] text-muted-foreground">Algoritmo</span>
						<div className="flex items-center gap-1">
							{(["aes-gcm", "base64", "rot13"] as const).map((alg) => (
								<button
									key={alg}
									type="button"
									onClick={() => setAlgorithm(alg)}
									className={`rounded px-2 py-0.5 text-[11px] transition-colors ${
										algorithm === alg
											? "bg-foreground/10 font-medium text-foreground"
											: "text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
									}`}
								>
									{ALGO_LABELS[alg]}
								</button>
							))}
						</div>
					</div>

					{algorithm === "aes-gcm" && (
						<div className="flex items-center gap-2 border-b border-border px-3 py-2">
							<span className="shrink-0 text-[11px] text-muted-foreground">
								Senha
							</span>
							<input
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								placeholder="Digite a senha..."
								className="flex-1 bg-transparent text-[11px] text-foreground placeholder:text-muted-foreground focus:outline-none"
							/>
						</div>
					)}

					<textarea
						value={input}
						onChange={(e) => setInput(e.target.value)}
						placeholder="Digite ou cole o texto aqui..."
						className="flex-1 min-h-[280px] resize-none bg-transparent p-3 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
						spellCheck={false}
					/>
				</>
			}
			right={
				<>
					<div className="flex items-center justify-between border-b border-border bg-muted/40 px-3 py-2">
						<span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
							Saída
						</span>
						<CopyButton
							text={output}
							disabled={!output}
							variant="ghost"
							size="icon-sm"
							iconOnly
						/>
					</div>

					<div className="flex-1 min-h-[280px] bg-muted/20 p-3">
						{error ? (
							<p className="text-xs text-destructive">{error}</p>
						) : output ? (
							<pre className="font-mono text-sm text-foreground whitespace-pre-wrap break-all select-all">
								{output}
							</pre>
						) : null}
					</div>
				</>
			}
			footer={
				<StatusBar
					items={[
						{
							label: "",
							value: loading
								? "Processando..."
								: output
									? "Concluído"
									: error
										? "Erro"
										: "Aguardando",
							mono: false,
							variant: loading
								? "warning"
								: output
									? "success"
									: error
										? "danger"
										: "default",
						},
						{ label: "Entrada", value: `${inputLen} chars`, mono: true },
						{ label: "Saída", value: `${outputLen} chars`, mono: true },
					]}
				/>
			}
		/>
	);
}
