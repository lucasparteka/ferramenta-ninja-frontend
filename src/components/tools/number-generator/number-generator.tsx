"use client";

import { useState } from "react";
import { Dices, RefreshCw } from "lucide-react";
import { CopyButton } from "@/components/shared/copy-button";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/select-native";
import { SectionLabel } from "@/components/shared/layout-b/section-label";
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

const GAP_CLASS: Record<number, string> = {
	1: "gap-2",
	2: "gap-2",
	3: "gap-2",
	4: "gap-2",
	5: "gap-2",
	6: "gap-2",
	8: "gap-1",
	10: "gap-1",
};

const CELL_CLASS: Record<number, string> = {
	1: "rounded-md bg-card px-3 py-2 text-center font-mono text-sm text-foreground border border-border",
	2: "rounded-md bg-card px-3 py-2 text-center font-mono text-sm text-foreground border border-border",
	3: "rounded-md bg-card px-3 py-2 text-center font-mono text-sm text-foreground border border-border",
	4: "rounded-md bg-card px-3 py-2 text-center font-mono text-sm text-foreground border border-border",
	5: "rounded-md bg-card px-1.5 py-1 text-center font-mono text-xs text-foreground",
	6: "rounded-md bg-card px-1.5 py-1 text-center font-mono text-xs text-foreground",
	8: "rounded-md bg-card px-1 py-0.5 text-center font-mono text-caption text-foreground",
	10: "rounded-md bg-card px-1 py-0.5 text-center font-mono text-caption text-foreground",
};

export function NumberGenerator() {
	const [options, setOptions] =
		useState<NumberGeneratorOptions>(DEFAULT_OPTIONS);
	const [numbers, setNumbers] = useState<number[]>([]);

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
	}

	const rangeSize = Math.abs(options.max - options.min) + 1;
	const uniqueWarning = options.unique && options.count > rangeSize;

	return (
		<div className="grid grid-cols-1 items-start lg:grid-cols-[1fr_360px] border rounded-md overflow-hidden">
			<div className="bg-card flex flex-col h-full">
				<div className="divide-y divide-border">
					<div className="p-5">
						<SectionLabel>Configuração</SectionLabel>
						<div className="space-y-3.5">
							<div>
								<Label
									htmlFor="num-count"
									className="mb-1.5 block text-xs text-foreground"
								>
									Quantidade
								</Label>
								<Input
									id="num-count"
									type="number"
									min={1}
									max={1000}
									value={options.count}
									onChange={(e) => handleInt("count", e.target.value)}
								/>
							</div>

							<div>
								<Label className="mb-1.5 block text-xs text-foreground">
									Intervalo
								</Label>
								<div className="flex items-center gap-2">
									<Input
										type="number"
										value={options.min}
										onChange={(e) => handleInt("min", e.target.value)}
										aria-label="Valor mínimo"
									/>
									<span className="shrink-0 text-sm text-muted-foreground">
										e
									</span>
									<Input
										type="number"
										value={options.max}
										onChange={(e) => handleInt("max", e.target.value)}
										aria-label="Valor máximo"
									/>
								</div>
							</div>

							<div>
								<Label
									htmlFor="num-columns"
									className="mb-1.5 block text-xs text-foreground"
								>
									Colunas
								</Label>
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

							<div>
								<Label
									htmlFor="num-order"
									className="mb-1.5 block text-xs text-foreground"
								>
									Ordem
								</Label>
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

							<div>
								<Label className="mb-1.5 block text-xs text-foreground">
									Números únicos
								</Label>
								<div className="flex items-center gap-2">
									<Checkbox
										id="unique"
										checked={options.unique}
										onCheckedChange={(checked) =>
											set("unique", checked === true)
										}
									/>
									<Label
										htmlFor="unique"
										className="text-xs text-foreground cursor-pointer"
									>
										Ativar
									</Label>
								</div>
							</div>

							{uniqueWarning && (
								<p className="rounded-md bg-warning-surface px-3 py-2 text-caption text-warning">
									O intervalo contém {rangeSize} números únicos disponíveis. A
									quantidade será ajustada automaticamente.
								</p>
							)}
						</div>
					</div>
				</div>

				<div className="flex items-center justify-between border-t border-border bg-muted px-5 py-3 mt-auto">
					<span className="text-[11.5px] text-muted-foreground">
						Gerado no navegador
					</span>
					<Button onClick={handleGenerate}>
						<Dices className="mr-1.5 h-3.5 w-3.5" />
						Gerar números
					</Button>
				</div>
			</div>

			<aside className="flex h-full lg:border-l max-lg:border-t flex-col gap-3">
				<div className="flex-1">
					{numbers.length > 0 ? (
						<>
							<div className="p-5 bg-card border-b">
								<div className="mb-2 flex items-center justify-between">
									<span className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
										{numbers.length}{" "}
										{numbers.length === 1 ? "número gerado" : "números gerados"}
									</span>
								</div>
								<div className="flex items-baseline gap-1 font-mono">
									<span className="text-[32px] font-semibold leading-none tracking-tight text-foreground">
										{numbers.length}
									</span>
									<span className="text-sm font-medium text-muted-foreground">
										{numbers.length === 1 ? "número" : "números"}
									</span>
								</div>
							</div>
							<div className="px-5 py-3">
								<p className="mb-2 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
									Lista
								</p>
								<div
									className={`grid ${GAP_CLASS[options.columns] ?? "gap-2"} ${COLS_CLASS[options.columns] ?? "grid-cols-1"}`}
								>
									{numbers.map((num, i) => (
										<div
											key={i}
											className={
												CELL_CLASS[options.columns] ??
												"rounded-md bg-card px-3 py-2 text-center font-mono text-sm text-foreground border border-border"
											}
										>
											{num}
										</div>
									))}
								</div>
							</div>
							<div className="flex gap-2 border-t border-border p-3">
								<CopyButton
									text={numbers.join("\n")}
									label="Copiar"
									variant="outline"
								/>
								<Button variant="outline" size="sm" onClick={handleGenerate}>
									<RefreshCw className="mr-1.5 h-3.5 w-3.5" />
									Gerar novamente
								</Button>
							</div>
						</>
					) : (
						<div className="flex flex-col items-center justify-center gap-2 p-6 text-center">
							<p className="text-sm text-muted-foreground">
								Configure e clique em Gerar
							</p>
						</div>
					)}
				</div>
			</aside>
		</div>
	);
}
