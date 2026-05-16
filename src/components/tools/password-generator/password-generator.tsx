"use client";

import { useEffect, useState } from "react";
import { Info, RefreshCw, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/shared/copy-button";
import { LayoutB } from "@/components/shared/layout-b";
import { SectionLabel } from "@/components/shared/layout-b/section-label";
import { PasswordOptions } from "./password-options";
import { PasswordStrength } from "./password-strength";

type PasswordConfig = {
	length: number;
	uppercase: boolean;
	lowercase: boolean;
	numbers: boolean;
	symbols: boolean;
};

const UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
const NUMBERS = "0123456789";
const SYMBOLS = "!@#$%^&*()_+-=[]{}|;:,.<>?";

const DEFAULT_CONFIG: PasswordConfig = {
	length: 12,
	uppercase: true,
	lowercase: true,
	numbers: true,
	symbols: false,
};

function buildPassword(config: PasswordConfig): string {
	const charsets: string[] = [];
	if (config.uppercase) charsets.push(UPPERCASE);
	if (config.lowercase) charsets.push(LOWERCASE);
	if (config.numbers) charsets.push(NUMBERS);
	if (config.symbols) charsets.push(SYMBOLS);

	if (charsets.length === 0) return "";

	const combined = charsets.join("");

	const guaranteed = charsets.map((charset) => {
		const arr = new Uint32Array(1);
		crypto.getRandomValues(arr);
		return charset[arr[0] % charset.length];
	});

	const remaining = Math.max(0, config.length - guaranteed.length);
	const rest = Array.from({ length: remaining }, () => {
		const arr = new Uint32Array(1);
		crypto.getRandomValues(arr);
		return combined[arr[0] % combined.length];
	});

	const allChars = [...guaranteed, ...rest];

	for (let i = allChars.length - 1; i > 0; i--) {
		const arr = new Uint32Array(1);
		crypto.getRandomValues(arr);
		const j = arr[0] % (i + 1);
		[allChars[i], allChars[j]] = [allChars[j], allChars[i]];
	}

	return allChars.join("");
}

export function PasswordGenerator() {
	const [config, setConfig] = useState<PasswordConfig>(DEFAULT_CONFIG);
	const [password, setPassword] = useState(() => buildPassword(DEFAULT_CONFIG));

	const isValid =
		config.uppercase || config.lowercase || config.numbers || config.symbols;

	useEffect(() => {
		const valid =
			config.uppercase || config.lowercase || config.numbers || config.symbols;
		if (!valid) {
			setPassword("");
			return;
		}
		setPassword(buildPassword(config));
	}, [config]);

	function generate() {
		if (!isValid) return;
		setPassword(buildPassword(config));
	}

	function reset() {
		setConfig(DEFAULT_CONFIG);
		setPassword(buildPassword(DEFAULT_CONFIG));
	}

	const form = (
		<div className="bg-card flex flex-col h-full border border-border rounded-md overflow-hidden">
			<div className="divide-y divide-border">
				<div className="p-4">
					<SectionLabel>Configuração</SectionLabel>
					<div className="space-y-3">
						<PasswordOptions config={config} onChange={setConfig} />
					</div>
				</div>
			</div>

			<div className="flex items-center justify-between border-t border-border bg-muted/40 px-4 py-3 mt-auto">
				<div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
					<Info size={12} />
					Gerada no navegador · crypto API
				</div>
				<Button type="button" variant="ghost" size="sm" onClick={reset}>
					<RotateCcw className="mr-1.5 h-3 w-3" />
					Resetar
				</Button>
			</div>
		</div>
	);

	const result = (
		<>
			{!isValid && (
				<div className="flex flex-col items-center justify-center gap-2 py-6 text-center">
					<p className="text-sm text-muted-foreground">
						Selecione pelo menos um tipo de caractere
					</p>
				</div>
			)}

			{isValid && password && (
				<>
					<SectionLabel>Senha gerada</SectionLabel>
					<div className="rounded-md border border-border bg-muted/40 p-3 mb-4">
						<p
							aria-live="polite"
							className="font-mono text-lg break-all select-all text-foreground leading-relaxed"
						>
							{password}
						</p>
					</div>

					<div className="flex gap-2 mb-4">
						<CopyButton
							text={password}
							label="Copiar"
							variant="outline"
							size="sm"
							className="flex-1"
						/>
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={generate}
							className="flex-1"
						>
							<RefreshCw className="mr-1.5 h-3 w-3" />
							Regenerar
						</Button>
					</div>

					<PasswordStrength password={password} />
				</>
			)}
		</>
	);

	return <LayoutB form={form} result={result} />;
}
