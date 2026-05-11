"use client";

import { ArrowLeftRight, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { CopyButton } from "@/components/shared/copy-button";
import { LayoutC } from "@/components/shared/layout-c";
import { PaneHeader } from "@/components/shared/pane-header";
import { StatusBar } from "@/components/shared/status-bar";
import { Button } from "@/components/ui/button";
import { NativeSelect } from "@/components/ui/select-native";
import {
	convertUnit,
	formatConverted,
	getCategory,
	UNIT_CATEGORIES,
	type UnitCategoryId,
} from "@/lib/units/convert";

export function UnitConverterClient() {
	const [categoryId, setCategoryId] = useState<UnitCategoryId>("length");
	const [fromId, setFromId] = useState("m");
	const [toId, setToId] = useState("cm");
	const [value, setValue] = useState("1");

	const category = useMemo(() => getCategory(categoryId), [categoryId]);

	const numeric = Number(value.replace(",", "."));
	const valid = Number.isFinite(numeric) && value.trim() !== "";
	const result = valid
		? convertUnit(numeric, categoryId, fromId, toId)
		: Number.NaN;

	const fromUnit = category.units.find((u) => u.id === fromId);
	const toUnit = category.units.find((u) => u.id === toId);

	function handleCategoryChange(next: UnitCategoryId) {
		const cat = getCategory(next);
		setCategoryId(next);
		setFromId(cat.units[0].id);
		setToId(cat.units[1]?.id ?? cat.units[0].id);
	}

	function handleSwap() {
		setFromId(toId);
		setToId(fromId);
	}

	function handleClear() {
		setValue("");
	}

	const resultStr = valid ? formatConverted(result) : "";

	return (
		<LayoutC
			toolbar={
				<div className="flex items-center gap-4">
					<span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
						Categoria
					</span>
					<NativeSelect
						id="unit-category"
						value={categoryId}
						onChange={(e) =>
							handleCategoryChange(e.target.value as UnitCategoryId)
						}
						className="h-7 text-[11px]"
					>
						{UNIT_CATEGORIES.map((c) => (
							<option key={c.id} value={c.id}>
								{c.label}
							</option>
						))}
					</NativeSelect>
				</div>
			}
			left={
				<>
					<PaneHeader
						title="Entrada"
						actions={
							<Button
								variant="ghost"
								size="icon-sm"
								aria-label="Limpar"
								onClick={handleClear}
							>
								<Trash2 className="h-3.5 w-3.5" />
							</Button>
						}
					/>
					<div className="flex flex-1 flex-col p-3 space-y-4">
						<div className="space-y-1.5">
							<label
								htmlFor="unit-value"
								className="text-xs font-medium text-muted-foreground"
							>
								Valor
							</label>
							<input
								id="unit-value"
								type="text"
								inputMode="decimal"
								value={value}
								onChange={(e) => setValue(e.target.value)}
								placeholder="0"
								className="w-full rounded-md border border-border bg-transparent px-3 py-1.5 font-mono text-sm tabular-nums outline-none focus:border-foreground/30"
							/>
						</div>
						<div className="space-y-1.5">
							<label
								htmlFor="unit-from"
								className="text-xs font-medium text-muted-foreground"
							>
								De
							</label>
							<NativeSelect
								id="unit-from"
								value={fromId}
								onChange={(e) => setFromId(e.target.value)}
								className="w-full"
							>
								{category.units.map((u) => (
									<option key={u.id} value={u.id}>
										{u.label}
									</option>
								))}
							</NativeSelect>
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
								text={resultStr}
								disabled={!resultStr}
								variant="ghost"
								size="icon-sm"
								iconOnly
							/>
						}
					/>
					<div className="flex flex-1 flex-col p-3 space-y-4">
						<div className="flex-1 flex items-center justify-center min-h-[100px] bg-muted/20 rounded-md cursor-default select-all">
							{resultStr ? (
								<span className="font-mono text-lg tabular-nums text-foreground">
									{resultStr}
								</span>
							) : (
								<span className="text-sm text-muted-foreground">—</span>
							)}
						</div>
						<div className="space-y-1.5">
							<label
								htmlFor="unit-to"
								className="text-xs font-medium text-muted-foreground"
							>
								Para
							</label>
							<NativeSelect
								id="unit-to"
								value={toId}
								onChange={(e) => setToId(e.target.value)}
								className="w-full"
							>
								{category.units.map((u) => (
									<option key={u.id} value={u.id}>
										{u.label}
									</option>
								))}
							</NativeSelect>
						</div>
					</div>
				</>
			}
			swapButton={
				<button
					type="button"
					onClick={handleSwap}
					disabled={!value.trim()}
					className="rounded-full border border-border bg-card p-1.5 text-muted-foreground transition-colors shadow-sm hover:text-foreground hover:bg-muted disabled:opacity-40 disabled:pointer-events-none"
					aria-label="Inverter unidades"
				>
					<ArrowLeftRight className="h-3.5 w-3.5" />
				</button>
			}
			footer={
				<StatusBar
					items={[
						{
							label: "",
							value: resultStr ? "Convertido" : "Aguardando",
							mono: false,
							variant: resultStr ? "success" : "default",
						},
						{
							label: "Fórmula",
							value: resultStr
								? `${value} ${fromUnit?.label ?? ""} = ${resultStr} ${toUnit?.label ?? ""}`
								: "—",
							mono: true,
						},
					]}
				/>
			}
		/>
	);
}
