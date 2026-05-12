"use client";

import { Trash2 } from "lucide-react";
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
	type UnitDef,
} from "@/lib/units/convert";
import { cn } from "@/lib/utils";

export function UnitConverterClient() {
	const [categoryId, setCategoryId] = useState<UnitCategoryId>("length");
	const [fromId, setFromId] = useState("m");
	const [value, setValue] = useState("1");

	const category = useMemo(() => getCategory(categoryId), [categoryId]);

	const numeric = Number(value.replace(",", "."));
	const valid = Number.isFinite(numeric) && value.trim() !== "";

	const fromUnit = category.units.find((u) => u.id === fromId);

	function handleCategoryChange(next: UnitCategoryId) {
		const cat = getCategory(next);
		setCategoryId(next);
		setFromId(cat.units[0].id);
	}

	function handleClear() {
		setValue("");
	}

	function handleRowClick(unit: UnitDef) {
		const converted = convertUnit(numeric, categoryId, fromId, unit.id);
		if (valid && Number.isFinite(converted)) {
			setValue(formatConverted(converted));
		}
		setFromId(unit.id);
	}

	const formulaUnit = category.units.find((u) => u.id !== fromId);
	const formulaStr =
		valid && fromUnit && formulaUnit
			? `${value} ${fromUnit.label} = ${formatConverted(convertUnit(numeric, categoryId, fromId, formulaUnit.id))} ${formulaUnit.label}`
			: "—";

	const copyStr = valid && fromUnit ? `${value} ${fromUnit.label}` : "";

	return (
		<LayoutC
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
					<div className="flex flex-1 flex-col p-3 space-y-3">
						<div className="space-y-1.5">
							<label
								htmlFor="unit-category"
								className="text-xs font-medium text-muted-foreground"
							>
								Categoria
							</label>
							<NativeSelect
								id="unit-category"
								value={categoryId}
								onChange={(e) =>
									handleCategoryChange(e.target.value as UnitCategoryId)
								}
								className="w-full"
							>
								{UNIT_CATEGORIES.map((c) => (
									<option key={c.id} value={c.id}>
										{c.label}
									</option>
								))}
							</NativeSelect>
						</div>
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
								Unidade
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
						<div className="rounded-md border border-border bg-muted/40 px-3 py-2 font-mono text-[11px] text-muted-foreground tabular-nums leading-relaxed break-all">
							{formulaStr}
						</div>
					</div>
				</>
			}
			right={
				<>
					<PaneHeader
						title="Resultados"
						actions={
							<CopyButton
								text={copyStr}
								disabled={!copyStr}
								variant="ghost"
								size="icon-sm"
								iconOnly
							/>
						}
					/>
					<ul
						className="flex-1 overflow-y-auto"
						aria-label="Resultados da conversão"
					>
						{category.units.map((unit) => {
							const isActive = unit.id === fromId;
							const converted = valid
								? convertUnit(numeric, categoryId, fromId, unit.id)
								: Number.NaN;
							const convertedStr =
								valid && Number.isFinite(converted)
									? formatConverted(converted)
									: "—";
							const labelMatch = unit.label.match(/^(.*?)\s*\(([^)]+)\)\s*$/);
							const unitName = labelMatch ? labelMatch[1] : unit.label;
							const unitSym = labelMatch ? labelMatch[2] : undefined;
							return (
								<li
									key={unit.id}
									tabIndex={isActive ? -1 : 0}
									onClick={() => !isActive && handleRowClick(unit)}
									onKeyDown={(e) => {
										if (!isActive && (e.key === "Enter" || e.key === " ")) {
											e.preventDefault();
											handleRowClick(unit);
										}
									}}
									aria-label={`${unit.label}: ${convertedStr}${isActive ? " (base atual)" : ""}`}
									className={cn(
										"group flex items-center justify-between px-3 py-2.5 border-b border-border last:border-b-0 gap-3",
										isActive
											? "bg-accent/60 cursor-default"
											: "cursor-pointer hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-inset focus-visible:ring-2 focus-visible:ring-ring/30",
									)}
								>
									<div className="flex flex-col gap-0.5 min-w-0">
										<span
											className={cn(
												"text-xs truncate",
												isActive
													? "text-accent-foreground font-medium"
													: "text-foreground",
											)}
										>
											{unitName}
										</span>
										{unitSym && (
											<span
												className={cn(
													"font-mono text-[10px]",
													isActive
														? "text-accent-foreground/60"
														: "text-muted-foreground",
												)}
											>
												{unitSym}
											</span>
										)}
									</div>
									<div className="flex items-center gap-2 shrink-0">
										{!isActive && (
											<span className="text-[10px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-150 whitespace-nowrap">
												← usar como base
											</span>
										)}
										<span
											className={cn(
												"font-mono text-sm tabular-nums",
												isActive
													? "text-accent-foreground font-medium"
													: "text-foreground",
											)}
										>
											{convertedStr}
										</span>
									</div>
								</li>
							);
						})}
					</ul>
				</>
			}
			footer={
				<StatusBar
					items={[
						{
							label: "",
							value:
								valid && fromUnit ? `${value} ${fromUnit.label}` : "Aguardando",
							mono: valid,
							variant: valid ? "success" : "default",
						},
						{
							label: "",
							value: `${category.units.length} unidades`,
							mono: true,
						},
						{
							label: "",
							value: category.label,
							mono: false,
						},
					]}
				/>
			}
		/>
	);
}
