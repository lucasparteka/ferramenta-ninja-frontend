"use client";

import { useMemo, useState } from "react";
import { CurrencyInput } from "react-currency-mask";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { numberToWords } from "@/lib/extenso/numero-extenso";

const EXAMPLES = [
	{ label: "R$ 1,00", value: 1 },
	{ label: "R$ 100,00", value: 100 },
	{ label: "R$ 1.234,56", value: 1234.56 },
	{ label: "R$ 1.000.000,00", value: 1000000 },
	{ label: "R$ 0,50", value: 0.5 },
];

const MAX_VALUE = 999_999_999_999_999; // 999 trilhões

export function NumeroPorExtensoClient() {
	const [value, setValue] = useState<number>(0);
	const [currency, setCurrency] = useState(true);
	const [copied, setCopied] = useState(false);

	console.log("value", value);

	const words = useMemo(
		() => (value > 0 ? numberToWords(value, { currency }) : ""),
		[value, currency],
	);

	function handleCopy() {
		if (!words) return;
		navigator.clipboard.writeText(words);
		setCopied(true);
		setTimeout(() => setCopied(false), 1500);
	}

	const capitalized = words
		? words.charAt(0).toUpperCase() + words.slice(1)
		: "";

	return (
		<div className="space-y-6">
			<div className="space-y-4">
				<div className="space-y-2">
					<label
						htmlFor="valor-input"
						className="block text-sm font-medium text-foreground"
					>
						Valor
					</label>
					<div className="max-w-sm">
						<CurrencyInput
							maxLength={25}
							value={value}
							onChangeValue={(_, numberValue) => {
								const num = Number(numberValue) || 0;

								if (num > MAX_VALUE) return;

								setValue(num);
							}}
							InputElement={
								<Input id="valor-input" type="text" placeholder="R$ 0,00" />
							}
						/>
					</div>
				</div>

			<div className="flex items-center gap-2">
				<Checkbox
					id="include-currency"
					checked={currency}
					onCheckedChange={(checked) => setCurrency(checked === true)}
				/>
				<label htmlFor="include-currency" className="cursor-pointer text-sm text-foreground">
					Incluir &quot;reais&quot; e &quot;centavos&quot; (R$)
				</label>
			</div>

				<div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
					<span className="mr-1">Exemplos:</span>
					{EXAMPLES.map((ex) => (
						<button
							key={ex.label}
							type="button"
							onClick={() => setValue(ex.value)}
							className="rounded-full border border-border bg-background px-2 py-0.5 text-foreground hover:bg-muted"
						>
							{ex.label}
						</button>
					))}
				</div>
			</div>

			{capitalized && (
				<div className="rounded-lg border border-primary/30 bg-primary/5 p-4 space-y-3">
					<p className="text-lg leading-relaxed text-foreground">
						{capitalized}
					</p>
					<div className="flex flex-wrap gap-2">
						<Button variant="outline" onClick={handleCopy}>
							{copied ? "Copiado!" : "Copiar"}
						</Button>
					</div>
				</div>
			)}
		</div>
	);
}
