"use client";

import { Trash2 } from "lucide-react";
import { useId, useState } from "react";
import { CopyButton } from "@/components/shared/copy-button";
import { LayoutC } from "@/components/shared/layout-c";
import { StatusBar } from "@/components/shared/status-bar";
import { SwitchRow } from "@/components/shared/switch-row";
import { Button } from "@/components/ui/button";
import {
	ALGORITHM_LABELS,
	type HashAlgorithm,
	hashFile,
	hashText,
	hmacFile,
	hmacText,
} from "@/lib/crypto/hash";

export function HashGenerator() {
	const uid = useId();
	const [input, setInput] = useState("");
	const [algo, setAlgo] = useState<HashAlgorithm>("sha256");
	const [useHmac, setUseHmac] = useState(false);
	const [secretKey, setSecretKey] = useState("");
	const [file, setFile] = useState<File | null>(null);
	const [hashResult, setHashResult] = useState("");
	const [loading, setLoading] = useState(false);
	const [verifyHash, setVerifyHash] = useState("");
	const [verifyResult, setVerifyResult] = useState<boolean | null>(null);

	async function compute() {
		setHashResult("");
		setVerifyResult(null);
		setLoading(true);
		try {
			const hex = file
				? useHmac
					? await hmacFile(file, algo, secretKey || "")
					: await hashFile(file, algo)
				: useHmac
					? await hmacText(input, algo, secretKey || "")
					: await hashText(input, algo);
			setHashResult(hex);
		} catch {
			setHashResult("Erro ao calcular hash");
		} finally {
			setLoading(false);
		}
	}

	function handleVerify() {
		setVerifyResult(
			hashResult.toLowerCase() === verifyHash.toLowerCase().trim(),
		);
	}

	function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
		const f = e.target.files?.[0] ?? null;
		setFile(f);
		setHashResult("");
		setVerifyResult(null);
	}

	function handleClear() {
		setInput("");
		setFile(null);
		setHashResult("");
		setVerifyResult(null);
		setVerifyHash("");
	}

	return (
		<LayoutC
			left={
				<>
					<div className="flex items-center justify-between border-b border-border bg-muted/40 px-3 py-2">
						<span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
							Entrada
						</span>
						<Button
							variant="ghost"
							size="icon-sm"
							onClick={handleClear}
							disabled={!input && !file}
							aria-label="Limpar"
						>
							<Trash2 className="h-3.5 w-3.5" />
						</Button>
					</div>

					<div className="flex items-center justify-between border-b border-border px-3 py-2">
						<span className="text-[11px] text-muted-foreground">Algoritmo</span>
						<select
							value={algo}
							onChange={(e) => {
								setAlgo(e.target.value as HashAlgorithm);
								setHashResult("");
								setVerifyResult(null);
							}}
							className="bg-transparent text-[11px] text-foreground focus:outline-none"
						>
							{Object.entries(ALGORITHM_LABELS).map(([value, label]) => (
								<option key={value} value={value}>
									{label}
								</option>
							))}
						</select>
					</div>

					<div className="border-b border-border px-3 py-2">
						<SwitchRow
							label="HMAC com chave secreta"
							checked={useHmac}
							onChange={(v) => {
								setUseHmac(v);
								setHashResult("");
								setVerifyResult(null);
							}}
						/>
					</div>

					{useHmac && (
						<div className="flex items-center gap-2 border-b border-border px-3 py-2">
							<span className="shrink-0 text-[11px] text-muted-foreground">
								Chave
							</span>
							<input
								id={`${uid}-key`}
								value={secretKey}
								onChange={(e) => {
									setSecretKey(e.target.value);
									setHashResult("");
								}}
								placeholder="Digite a chave secreta..."
								className="flex-1 bg-transparent text-[11px] text-foreground placeholder:text-muted-foreground focus:outline-none"
							/>
						</div>
					)}

					<textarea
						id={`${uid}-input`}
						value={input}
						onChange={(e) => {
							setInput(e.target.value);
							setHashResult("");
							setVerifyResult(null);
						}}
						placeholder="Digite o texto para gerar o hash..."
						disabled={!!file}
						className="flex-1 min-h-[200px] resize-none bg-transparent p-3 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none disabled:opacity-40"
						spellCheck={false}
					/>

					<div className="flex items-center gap-3 border-t border-border px-3 py-2">
						<span className="shrink-0 text-[11px] text-muted-foreground">
							Arquivo
						</span>
						<input
							id={`${uid}-file`}
							type="file"
							onChange={handleFileChange}
							disabled={!!input}
							className="flex-1 cursor-pointer text-[11px] text-foreground disabled:opacity-40"
						/>
						{file && (
							<button
								type="button"
								onClick={() => {
									setFile(null);
									setHashResult("");
									setVerifyResult(null);
								}}
								className="shrink-0 text-[11px] text-muted-foreground underline"
							>
								Remover
							</button>
						)}
					</div>
				</>
			}
			right={
				<>
					<div className="flex items-center justify-between border-b border-border bg-muted/40 px-3 py-2">
						<span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
							Hash
						</span>
						<CopyButton
							text={hashResult}
							disabled={!hashResult || loading}
							variant="ghost"
							size="icon-sm"
							iconOnly
						/>
					</div>

					<div className="flex-1 min-h-[200px] bg-muted/20 p-3">
						{hashResult ? (
							<code className="break-all font-mono text-sm text-foreground select-all">
								{hashResult}
							</code>
						) : null}
					</div>

					{hashResult && (
						<div className="border-t border-border px-3 py-3 space-y-2">
							<span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
								Verificar
							</span>
							<div className="flex items-center gap-2">
								<input
									value={verifyHash}
									onChange={(e) => {
										setVerifyHash(e.target.value);
										setVerifyResult(null);
									}}
									placeholder="Cole o hash para comparar..."
									className="flex-1 rounded border border-border bg-transparent px-2 py-1 font-mono text-[11px] text-foreground placeholder:text-muted-foreground focus:outline-none"
								/>
								<Button
									type="button"
									size="sm"
									variant="outline"
									onClick={handleVerify}
									disabled={!verifyHash}
								>
									Comparar
								</Button>
							</div>
							{verifyResult !== null && (
								<p
									className={`text-xs font-medium ${verifyResult ? "text-success" : "text-destructive"}`}
								>
									{verifyResult
										? "✓ Hash corresponde"
										: "✗ Hash não corresponde"}
								</p>
							)}
						</div>
					)}
				</>
			}
			footer={
				<StatusBar
					items={[
						{
							label: "",
							value: loading
								? "Calculando..."
								: hashResult
									? `${ALGORITHM_LABELS[algo]} · ${hashResult.length} chars`
									: "Aguardando",
							mono: false,
							variant: loading ? "warning" : hashResult ? "success" : "default",
						},
					]}
					right={
						<Button
							type="button"
							size="sm"
							onClick={compute}
							disabled={loading || (!input && !file)}
						>
							{loading ? "Calculando..." : "Calcular Hash"}
						</Button>
					}
				/>
			}
		/>
	);
}
