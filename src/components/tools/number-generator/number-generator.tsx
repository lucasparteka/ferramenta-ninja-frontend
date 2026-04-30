"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/select-native";
import { generateNumbers } from "@/lib/random/numbers";

type Order = "random" | "asc" | "desc";

type NumberGeneratorOptions = {
	count: number;
	min: number;
	max: number;
	columns: number;
	order: Order;
	unique: boolean;
};

const DEFAULT_OPTIONS: NumberGeneratorOptions = {
	count: 50,
	min: 1,
	max: 100,
	columns: 1,
	order: "random",
	unique: false,
};

const COLS_CLASS: Record<number, string> = {
	1: "grid-cols-1",
	2: "grid-cols-2",
	3: "grid-cols-3",
	4: "grid-cols-4",
	5: "grid-cols-5",
	6: "grid-cols-6",
	8: "grid-cols-8",
	10: "grid-cols-10",
};

export function NumberGenerator() {
	const [options, setOptions] =
		useState<NumberGeneratorOptions>(DEFAULT_OPTIONS);
	const [numbers, setNumbers] = useState<number[]>([]);
	const [copied, setCopied] = useState(false);

	function set<K extends keyof NumberGeneratorOptions>(
		key: K,
		value: NumberGeneratorOptions[K],
	) {
		setOptions((prev) => ({ ...prev, [key]: value }));
		setNumbers([]);
	}

	function handleInt(key: "count" | "min" | "max" | "columns", raw: string) {
		const value = Number(raw);
		if (!Number.isNaN(value)) set(key, value);
	}

	function handleGenerate() {
		setNumbers(generateNumbers(options));
		setCopied(false);
	}

	function handleCopy() {
		if (numbers.length === 0) return;
		navigator.clipboard.writeText(numbers.join("\n"));
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	}

	const rangeSize = Math.abs(options.max - options.min) + 1;
	const uniqueWarning = options.unique && options.count > rangeSize;

	return (
		<div className="flex flex-col gap-6 sm:flex-row">
			<div className="space-y-6 sm:w-[30%] sm:shrink-0">
				<div className="grid grid-cols-1 gap-4">
					<div className="space-y-1">
						<label
							htmlFor="num-count"
							className="flex w-full text-sm font-medium text-foreground"
						>
							Números
						</label>
						<Input
							id="num-count"
							type="number"
							min={1}
							max={1000}
							value={options.count}
						onChange={(e) => handleInt("count", e.target.value)}
						/>
					</div>

					<div className="space-y-1">
						<label className="flex w-full text-sm font-medium text-foreground">
							Entre
						</label>
						<div className="flex items-center gap-2">
							<Input
								type="number"
								value={options.min}
								onChange={(e) => handleInt("min", e.target.value)}
						aria-label="Valor mínimo"
							/>
							<span className="shrink-0 text-sm text-muted-foreground">e</span>
							<Input
								type="number"
								value={options.max}
								onChange={(e) => handleInt("max", e.target.value)}
						aria-label="Valor máximo"
							/>
						</div>
					</div>

					<div className="space-y-1">
						<label
							htmlFor="num-columns"
							className="flex w-full text-sm font-medium text-foreground"
						>
							Colunas
						</label>
						<NativeSelect
							id="num-columns"
							value={options.columns}
						onChange={(e) => set("columns", Number(e.target.value))}
						>
							{[1, 2, 3, 4, 5, 6, 8, 10].map((n) => (
								<option key={n} value={n}>
									{n}
								</option>
							))}
						</NativeSelect>
					</div>

					<div className="space-y-1">
						<label
							htmlFor="num-order"
							className="flex w-full text-sm font-medium text-foreground"
						>
							Ordem
						</label>
						<NativeSelect
							id="num-order"
							value={options.order}
						onChange={(e) => set("order", e.target.value as Order)}
						>
							<option value="random">Aleatória</option>
							<option value="asc">Crescente</option>
							<option value="desc">Decrescente</option>
						</NativeSelect>
					</div>

					<div className="space-y-2">
						<span className="text-sm font-medium text-foreground">
							Números únicos
						</span>
						<div className="flex h-10 items-center">
							<label className="flex cursor-pointer items-center gap-2">
								<input
									type="checkbox"
									checked={options.unique}
									onChange={(e) => set("unique", e.target.checked)}
									className="accent-primary"
								/>
								<span className="text-sm text-foreground">Ativar</span>
							</label>
						</div>
					</div>
				</div>

				{uniqueWarning && (
					<p className="text-sm text-warning">
						O intervalo contém {rangeSize} números únicos disponíveis. A
						quantidade será ajustada automaticamente.
					</p>
				)}

				<div className="flex gap-3">
					<Button onClick={handleGenerate}>Gerar números</Button>
					{numbers.length > 0 && (
						<Button variant="outline" onClick={handleGenerate}>
							Gerar novamente
						</Button>
					)}
				</div>
			</div>

			<div className="flex-1">
				{numbers.length > 0 && (
					<div className="space-y-3">
						<div className="flex items-center justify-between">
							<p className="text-sm font-medium text-foreground">
								{numbers.length}{" "}
								{numbers.length === 1 ? "número gerado" : "números gerados"}
							</p>
							<Button variant="outline" size="sm" onClick={handleCopy}>
								{copied ? "Copiado!" : "Copiar"}
							</Button>
						</div>
						<div
							className={`grid gap-2 rounded-lg border border-border bg-secondary p-4 ${COLS_CLASS[options.columns] ?? "grid-cols-1"}`}
						>
							{numbers.map((num, i) => (
								<div
									key={i}
									className="rounded-lg bg-card px-3 py-2 text-center font-mono text-foreground"
								>
									{num}
								</div>
							))}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
