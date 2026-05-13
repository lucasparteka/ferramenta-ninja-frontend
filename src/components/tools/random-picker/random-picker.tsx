"use client";

import { Shuffle, Trash2 } from "lucide-react";
import { useState } from "react";
import { LayoutD } from "@/components/shared/layout-d";
import { SidebarSection } from "@/components/shared/sidebar-section";
import { StatusBar } from "@/components/shared/status-bar";
import { SwitchRow } from "@/components/shared/switch-row";
import { ToolHeader } from "@/components/shared/tool-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { drawRandomItems } from "@/lib/random/draw";

type PickerOptions = {
	winnersCount: number;
	allowRepeat: boolean;
	removeEmpty: boolean;
};

const DEFAULT_OPTIONS: PickerOptions = {
	winnersCount: 1,
	allowRepeat: false,
	removeEmpty: true,
};

function parseItems(input: string, removeEmpty: boolean): string[] {
	return input
		.split("\n")
		.map((line) => line.trim())
		.filter((line) => !removeEmpty || line !== "");
}

export function RandomPicker() {
	const [input, setInput] = useState("");
	const [options, setOptions] = useState<PickerOptions>(DEFAULT_OPTIONS);
	const [winners, setWinners] = useState<string[] | null>(null);
	const [drawing, setDrawing] = useState(false);
	const [error, setError] = useState("");

	const items = parseItems(input, options.removeEmpty);
	const maxWinners = options.allowRepeat ? 50 : Math.max(1, items.length);

	function set<K extends keyof PickerOptions>(key: K, value: PickerOptions[K]) {
		setOptions((prev) => ({ ...prev, [key]: value }));
	}

	function handleInput(value: string) {
		setInput(value);
		setWinners(null);
		setError("");
	}

	function handleDraw() {
		if (items.length === 0) {
			setError("Adicione pelo menos um item para sortear.");
			return;
		}
		setError("");
		setWinners(null);
		setDrawing(true);
		setTimeout(() => {
			const result = drawRandomItems(items, {
				winnersCount: options.winnersCount,
				allowRepeat: options.allowRepeat,
			});
			setWinners(result);
			setDrawing(false);
		}, 400);
	}

	function handleClear() {
		setInput("");
		setWinners(null);
		setError("");
	}

	function handleWinnersCount(raw: string) {
		const value = Number(raw);
		if (!Number.isNaN(value) && value >= 1) {
			set("winnersCount", Math.min(maxWinners, value));
		}
	}

	return (
		<LayoutD
			header={
				<ToolHeader
					title="Sorteio Aleatório"
					badge="SORTEIO"
					actions={
						<>
							<Button size="sm" onClick={handleDraw} disabled={drawing}>
								<Shuffle className="mr-1.5 h-3 w-3" />
								{drawing ? "Sorteando..." : "Sortear"}
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
						</>
					}
				/>
			}
			sidebar={
				<>
					{winners && (
						<SidebarSection title="Resultado">
							<ol className="space-y-1.5">
								{winners.map((winner, index) => (
									<li
										key={winner}
										className="flex items-center gap-2 rounded border border-primary/30 bg-primary/10 px-2.5 py-2"
									>
										<span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
											{index + 1}
										</span>
										<span className="truncate text-xs font-medium text-foreground">
											{winner}
										</span>
									</li>
								))}
							</ol>
						</SidebarSection>
					)}

					<SidebarSection title="Opções">
						<div className="flex items-center justify-between">
							<span className="text-xs text-muted-foreground">Vencedores</span>
							<Input
								type="number"
								min={1}
								max={maxWinners}
								value={options.winnersCount}
								onChange={(e) => handleWinnersCount(e.target.value)}
								className="h-7 w-16 text-right font-mono text-xs"
							/>
						</div>

						<SwitchRow
							label="Permitir repetição"
							checked={options.allowRepeat}
							onChange={(v) => set("allowRepeat", v)}
						/>

						<SwitchRow
							label="Ignorar linhas vazias"
							checked={options.removeEmpty}
							onChange={(v) => set("removeEmpty", v)}
						/>
					</SidebarSection>
				</>
			}
		>
			<Label htmlFor="picker-input" className="sr-only">
				Digite os itens (um por linha)
			</Label>
			<textarea
				id="picker-input"
				value={input}
				onChange={(e) => handleInput(e.target.value)}
				placeholder={"Ana\nBruno\nCarla\nDaniel"}
				className="flex-1 min-h-[280px] resize-none bg-transparent p-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
			/>

			<StatusBar
				items={[
					{
						label: "",
						value: error || (items.length > 0 ? "Pronto para sortear" : "Aguardando itens"),
						mono: false,
						variant: error ? "danger" : items.length > 0 ? "success" : "default",
					},
					{
						label: "",
						value: `${items.length} ${items.length === 1 ? "item" : "itens"}`,
						mono: true,
					},
				]}
			/>
		</LayoutD>
	);
}
