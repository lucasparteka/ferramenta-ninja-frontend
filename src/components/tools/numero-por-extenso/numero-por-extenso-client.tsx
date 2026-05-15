"use client";

import { Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { CurrencyInput } from "react-currency-mask";
import { CopyButton } from "@/components/shared/copy-button";
import { LayoutC } from "@/components/shared/layout-c";
import { OptionSwitch } from "@/components/shared/option-switch";
import { PaneHeader } from "@/components/shared/pane-header";
import { StatusBar } from "@/components/shared/status-bar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { numberToWords } from "@/lib/extenso/numero-extenso";

const EXAMPLES = [
	{ label: "R$ 1,00", value: 1 },
	{ label: "R$ 100,00", value: 100 },
	{ label: "R$ 1.234,56", value: 1234.56 },
	{ label: "R$ 1.000.000,00", value: 1000000 },
	{ label: "R$ 0,50", value: 0.5 },
];

const MAX_VALUE = 999_999_999_999_999;

export function NumeroPorExtensoClient() {
	const [value, setValue] = useState<number>(0);
	const [mode, setMode] = useState<"currency" | "numeric">("currency");

	const words = useMemo(
		() =>
			value > 0 ? numberToWords(value, { currency: mode === "currency" }) : "",
		[value, mode],
	);

	const capitalized = words
		? words.charAt(0).toUpperCase() + words.slice(1)
		: "";

	function handleClear() {
		setValue(0);
	}

	return (
		<LayoutC
			toolbar={
				<div className="flex items-center gap-4">
					<span className="text-caption font-semibold uppercase tracking-wider text-muted-foreground">
						Modo
					</span>
					<OptionSwitch
						options={[
							{ label: "Numérico", value: "numeric" },
							{ label: "Moeda R$", value: "currency" },
						]}
						value={mode}
						onChange={(v) => setMode(v as "currency" | "numeric")}
						size="sm"
					/>
				</div>
			}
			left={
				<>
					<PaneHeader
						title="Entrada"
						actions={
							<Button
								variant="ghost"
								size="icon-xs"
								type="button"
								onClick={handleClear}
								aria-label="Limpar"
							>
								<Trash2 />
							</Button>
						}
					/>
					<div className="flex flex-1 flex-col p-3 space-y-4">
						<div className="space-y-1.5">
							<Label
								htmlFor="valor-input"
								className="text-xs text-muted-foreground"
							>
								Valor
							</Label>
							<CurrencyInput
								maxLength={25}
								value={value}
								onChangeValue={(_, numberValue) => {
									const num = Number(numberValue) || 0;
									if (num > MAX_VALUE) return;
									setValue(num);
								}}
								InputElement={
									<Input
										id="valor-input"
										type="text"
										placeholder={mode === "currency" ? "R$ 0,00" : "0"}
										className="font-mono tabular-nums"
									/>
								}
							/>
						</div>
						<div className="flex flex-wrap gap-1.5">
							<span className="text-caption text-muted-foreground self-center mr-1">
								Exemplos:
							</span>
							{EXAMPLES.map((ex) => (
								<button
									key={ex.label}
									type="button"
									onClick={() => setValue(ex.value)}
									className="rounded border border-border bg-card px-2 py-0.5 text-caption text-foreground hover:bg-muted transition-colors"
								>
									{ex.label}
								</button>
							))}
						</div>
					</div>
				</>
			}
			right={
				<>
					<PaneHeader
						title="Resultado"
						actions={
							<CopyButton
								text={capitalized}
								disabled={!capitalized}
								variant="ghost"
								size="icon-xs"
								iconOnly
							/>
						}
					/>
					<div className="flex-1 min-h-[280px] bg-muted/20 p-3 cursor-default select-all">
						{capitalized ? (
							<p className="font-mono text-sm text-foreground leading-relaxed">
								{capitalized}
							</p>
						) : (
							<p className="text-sm text-muted-foreground">
								Insira um valor para gerar o texto por extenso...
							</p>
						)}
					</div>
				</>
			}
			footer={
				<StatusBar
					items={[
						{
							label: "",
							value: capitalized ? "Gerado" : "Aguardando",
							mono: false,
							variant: capitalized ? "success" : "default",
						},
						{
							label: "Valor",
							value: `R$ ${value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
							mono: true,
						},
						{
							label: "Chars",
							value: `${capitalized.length} caracteres`,
							mono: true,
						},
					]}
				/>
			}
		/>
	);
}
