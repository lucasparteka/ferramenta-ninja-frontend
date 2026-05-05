"use client";

import { useId, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { NativeSelect } from "@/components/ui/select-native";
import { ResultBox } from "@/components/shared/result-box";
import { CopyButton } from "@/components/shared/copy-button";
import { hashText, hashFile, hmacText, hmacFile, ALGORITHM_LABELS, type HashAlgorithm } from "@/lib/crypto/hash";

type Mode = "hash" | "verify";

export function HashGenerator() {
	const uid = useId();
	const [mode, setMode] = useState<Mode>("hash");
	const [input, setInput] = useState("");
	const [algo, setAlgo] = useState<HashAlgorithm>("sha256");
	const [useHmac, setUseHmac] = useState(false);
	const [secretKey, setSecretKey] = useState("");
	const [file, setFile] = useState<File | null>(null);
	const [result, setResult] = useState("");
	const [loading, setLoading] = useState(false);
	const [verifyHash, setVerifyHash] = useState("");
	const [verifyResult, setVerifyResult] = useState<boolean | null>(null);

	async function compute() {
		setResult("");
		setLoading(true);
		try {
			let hex: string;
			if (file) {
				hex = useHmac
					? await hmacFile(file, algo, secretKey || "")
					: await hashFile(file, algo);
			} else {
				hex = useHmac
					? await hmacText(input, algo, secretKey || "")
					: await hashText(input, algo);
			}
			setResult(hex);
		} catch {
			setResult("Erro ao calcular hash");
		} finally {
			setLoading(false);
		}
	}

	function handleVerify() {
		setVerifyResult(result.toLowerCase() === verifyHash.toLowerCase().trim());
	}

	function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
		const f = e.target.files?.[0] ?? null;
		setFile(f);
		setResult("");
		setVerifyResult(null);
	}

	return (
		<div className="space-y-6">
			<div className="flex flex-wrap gap-2">
				<Button
					type="button"
					variant={mode === "hash" ? "default" : "outline"}
					size="sm"
					onClick={() => { setMode("hash"); setVerifyResult(null); }}
				>
					Gerar Hash
				</Button>
				<Button
					type="button"
					variant={mode === "verify" ? "default" : "outline"}
					size="sm"
					onClick={() => { setMode("verify"); setVerifyResult(null); }}
				>
					Verificar
				</Button>
			</div>

			{mode === "verify" && result && (
				<div className="rounded-lg border border-border p-4 space-y-3">
					<h3 className="text-sm font-medium">Verificar Hash</h3>
					<div className="space-y-1">
						<label htmlFor={`${uid}-verify`} className="text-xs uppercase tracking-wider text-muted-foreground">
							Hash para comparar
						</label>
						<Input
							id={`${uid}-verify`}
							value={verifyHash}
							onChange={(e) => { setVerifyHash(e.target.value); setVerifyResult(null); }}
							placeholder="Cole o hash aqui..."
						/>
					</div>
					<Button type="button" size="sm" onClick={handleVerify} disabled={!verifyHash}>
						Comparar
					</Button>
					{verifyResult !== null && (
						<p className={`text-sm font-medium ${verifyResult ? "text-green-600" : "text-red-600"}`}>
							{verifyResult ? "✓ Hash corresponde ao texto" : "✗ Hash não corresponde"}
						</p>
					)}
				</div>
			)}

			<div className="grid gap-4 sm:grid-cols-2">
				<div className="space-y-1">
					<label htmlFor={`${uid}-algo`} className="text-xs uppercase tracking-wider text-muted-foreground">
						Algoritmo
					</label>
					<NativeSelect
						id={`${uid}-algo`}
						value={algo}
						onChange={(e) => { setAlgo(e.target.value as HashAlgorithm); setResult(""); setVerifyResult(null); }}
					>
						{Object.entries(ALGORITHM_LABELS).map(([value, label]) => (
							<option key={value} value={value}>{label}</option>
						))}
					</NativeSelect>
				</div>

				<div className="flex items-end pb-1">
					<label className="flex items-center gap-2 text-sm">
						<input
							type="checkbox"
							checked={useHmac}
							onChange={(e) => { setUseHmac(e.target.checked); setResult(""); setVerifyResult(null); }}
							className="h-4 w-4 rounded"
						/>
						HMAC (com chave secreta)
					</label>
				</div>
			</div>

			{useHmac && (
				<div className="space-y-1">
					<label htmlFor={`${uid}-key`} className="text-xs uppercase tracking-wider text-muted-foreground">
						Chave secreta
					</label>
					<Input
						id={`${uid}-key`}
						value={secretKey}
						onChange={(e) => { setSecretKey(e.target.value); setResult(""); }}
						placeholder="Digite a chave secreta..."
					/>
				</div>
			)}

			<div className="space-y-1">
				<label htmlFor={`${uid}-input`} className="text-xs uppercase tracking-wider text-muted-foreground">
					Texto de entrada
				</label>
				<Textarea
					id={`${uid}-input`}
					value={input}
					onChange={(e) => { setInput(e.target.value); setResult(""); setVerifyResult(null); }}
					placeholder="Digite o texto para gerar o hash..."
					rows={4}
					disabled={!!file}
				/>
			</div>

			<div className="space-y-1">
				<label htmlFor={`${uid}-file`} className="text-xs uppercase tracking-wider text-muted-foreground">
					Ou escolha um arquivo
				</label>
				<div className="flex items-center gap-3">
					<Input
						id={`${uid}-file`}
						type="file"
						onChange={handleFileChange}
						className="cursor-pointer"
						disabled={!!input}
					/>
					{file && (
						<button
							type="button"
							onClick={() => { setFile(null); setResult(""); setVerifyResult(null); }}
							className="text-xs text-muted-foreground underline"
						>
							Remover
						</button>
					)}
				</div>
				{file && (
					<p className="text-xs text-muted-foreground">{file.name} ({(file.size / 1024).toFixed(1)} KB)</p>
				)}
			</div>

			<Button type="button" onClick={compute} disabled={loading || (!input && !file)}>
				{loading ? "Calculando..." : "Calcular Hash"}
			</Button>

			{result && (
				<ResultBox label={useHmac ? "HMAC" : "Hash"}>
					<div className="flex items-start gap-2">
						<code className="flex-1 break-all rounded bg-muted px-3 py-2 text-sm font-mono">
							{result}
						</code>
						<CopyButton text={result} />
					</div>
				</ResultBox>
			)}
		</div>
	);
}
