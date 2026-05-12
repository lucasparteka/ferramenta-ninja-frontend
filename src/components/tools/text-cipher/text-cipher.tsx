"use client";

import { ArrowLeftRight, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { CopyButton } from "@/components/shared/copy-button";
import { LayoutC } from "@/components/shared/layout-c";
import {
	OptionSwitch,
	type OptionSwitchOption,
} from "@/components/shared/option-switch";
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
import { cn } from "@/lib/utils";

type Mode = "encrypt" | "decrypt";

const MODE_OPTIONS = [
	{ label: "Cifrar", value: "encrypt" },
	{ label: "Decifrar", value: "decrypt" },
] satisfies OptionSwitchOption[];

const ALGO_OPTIONS = [
	{ label: "AES-256", value: "aes-gcm" },
	{ label: "Base64", value: "base64" },
	{ label: "ROT13", value: "rot13" },
] satisfies OptionSwitchOption[];

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
			swapButton={
				<button
					type="button"
					onClick={handleSwap}
					disabled={!output}
					className={cn(
						"rounded-full border border-border bg-card p-1.5 text-muted-foreground transition-colors shadow-sm",
						output
							? "hover:text-foreground hover:bg-muted"
							: "opacity-40 pointer-events-none",
					)}
					aria-label="Inverter entrada e saída"
				>
					<ArrowLeftRight className="h-3.5 w-3.5" />
				</button>
			}
			left={
				<>
					<div className="flex items-center justify-between border-b border-border bg-muted/40 px-3 py-2">
						<span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
							Entrada
						</span>
						<div className="flex items-center gap-2">
							<OptionSwitch
								options={MODE_OPTIONS}
								value={mode}
								onChange={(v) => setMode(v as Mode)}
								size="sm"
							/>
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
						<OptionSwitch
							options={ALGO_OPTIONS}
							value={algorithm}
							onChange={(v) => setAlgorithm(v as Algorithm)}
							size="sm"
						/>
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
