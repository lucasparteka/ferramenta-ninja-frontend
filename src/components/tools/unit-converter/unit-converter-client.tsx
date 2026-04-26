"use client";

import { ArrowLeftRight } from "lucide-react";
import { useMemo, useState } from "react";
import { ResultBox } from "@/components/shared/result-box";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
	const result =
		Number.isFinite(numeric) && value.trim() !== ""
			? convertUnit(numeric, categoryId, fromId, toId)
			: Number.NaN;

	function handleCategoryChange(next: UnitCategoryId) {
		const cat = getCategory(next);
		setCategoryId(next);
		setFromId(cat.units[0].id);
		setToId(cat.units[1]?.id ?? cat.units[0].id);
	}

	function swap() {
		setFromId(toId);
		setToId(fromId);
	}

	return (
		<div className="space-y-6">
			<div className="space-y-2 max-w-sm">
				<label
					htmlFor="unit-category"
					className="block text-sm font-medium text-foreground"
				>
					Categoria
				</label>
				<NativeSelect
					id="unit-category"
					value={categoryId}
					onChange={(e) =>
						handleCategoryChange(e.target.value as UnitCategoryId)
					}
				>
					{UNIT_CATEGORIES.map((c) => (
						<option key={c.id} value={c.id}>
							{c.label}
						</option>
					))}
				</NativeSelect>
			</div>

			<div className="grid gap-4 sm:grid-cols-2">
				<div className="space-y-2">
					<label
						htmlFor="unit-value"
						className="block text-sm font-medium text-foreground"
					>
						Valor
					</label>
					<Input
						id="unit-value"
						type="text"
						inputMode="decimal"
						value={value}
						onChange={(e) => setValue(e.target.value)}
						placeholder="0"
					/>
				</div>
				<div className="space-y-2">
					<label
						htmlFor="unit-from"
						className="block text-sm font-medium text-foreground"
					>
						De
					</label>
					<NativeSelect
						id="unit-from"
						value={fromId}
						onChange={(e) => setFromId(e.target.value)}
					>
						{category.units.map((u) => (
							<option key={u.id} value={u.id}>
								{u.label}
							</option>
						))}
					</NativeSelect>
				</div>
			</div>

			<div className="flex justify-center">
				<Button type="button" variant="outline" onClick={swap}>
					<ArrowLeftRight className="size-4" />
					Inverter
				</Button>
			</div>

			<div className="grid gap-4 sm:grid-cols-2">
				<div className="space-y-2">
					<label
						htmlFor="unit-result"
						className="block text-sm font-medium text-foreground"
					>
						Resultado
					</label>
					<Input
						id="unit-result"
						type="text"
						readOnly
						value={Number.isFinite(result) ? formatConverted(result) : ""}
						placeholder="—"
					/>
				</div>
				<div className="space-y-2">
					<label
						htmlFor="unit-to"
						className="block text-sm font-medium text-foreground"
					>
						Para
					</label>
					<NativeSelect
						id="unit-to"
						value={toId}
						onChange={(e) => setToId(e.target.value)}
					>
						{category.units.map((u) => (
							<option key={u.id} value={u.id}>
								{u.label}
							</option>
						))}
					</NativeSelect>
				</div>
			</div>

			{Number.isFinite(result) && value.trim() !== "" && (
				<ResultBox label="Conversão">
					<p className="text-lg font-semibold text-foreground">
						{value} {category.units.find((u) => u.id === fromId)?.label} ={" "}
						{formatConverted(result)}{" "}
						{category.units.find((u) => u.id === toId)?.label}
					</p>
				</ResultBox>
			)}
		</div>
	);
}
