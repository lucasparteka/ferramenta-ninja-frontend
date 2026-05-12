"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { RotateCcw } from "lucide-react";
import { useEffect } from "react";
import { CurrencyInput } from "react-currency-mask";
import { type Resolver, useForm } from "react-hook-form";
import { z } from "zod";
import { SectionLabel } from "@/components/shared/layout-b/section-label";
import { OptionSwitch } from "@/components/shared/option-switch";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/select-native";
import { parseCurrencyToNumber } from "@/utils/number";
import type { CalculateNightAllowanceResult } from "./types";
import { calculateNightAllowance } from "./utils";

const schema = z.object({
	grossSalary: z.string().min(1, "Informe o salário bruto"),
	contractualHours: z.coerce
		.number({ message: "Informe as horas contratuais" })
		.min(1, "O valor mínimo é 1"),
	workedHours: z.coerce.number().min(0, "Mínimo 0"),
	minutes: z.coerce.number().min(0).max(59, "Máximo 59"),
	percentageAllowance: z.coerce
		.number({ message: "Informe o percentual" })
		.min(0, "Mínimo 0"),
	usefulDays: z.coerce.number().min(1, "Mínimo 1"),
	holidaysAndSundays: z.coerce.number().min(0, "Mínimo 0"),
	isRural: z.enum(["yes", "no"]),
	isNighttimeWork: z.enum(["yes", "no"]),
});

type FormValues = z.infer<typeof schema>;

type NightAllowanceFormProps = {
	onCalculate: (data: CalculateNightAllowanceResult | null) => void;
};

function getAutoPct(isRural: string): number {
	return isRural === "yes" ? 25 : 20;
}

function formatHours(value: number): string {
	return `${value.toFixed(2).replace(".", ",")}h`;
}

export function NightAllowanceCalculatorForm(props: NightAllowanceFormProps) {
	const { onCalculate } = props;

	const form = useForm<FormValues>({
		resolver: zodResolver(schema) as Resolver<FormValues>,
		defaultValues: {
			grossSalary: "",
			contractualHours: 220,
			workedHours: 0,
			minutes: 0,
			percentageAllowance: 20,
			usefulDays: 22,
			holidaysAndSundays: 4,
			isRural: "no",
			isNighttimeWork: "no",
		},
	});

	const watchedIsRural = form.watch("isRural");
	const watchedIsNighttimeWork = form.watch("isNighttimeWork");
	const watchedWorkedHours = form.watch("workedHours");
	const watchedMinutes = form.watch("minutes");

	// Auto-update percentage when rural changes
	useEffect(() => {
		const auto = getAutoPct(watchedIsRural);
		form.setValue("percentageAllowance", auto);
	}, [watchedIsRural, form]);

	function onSubmit(data: FormValues) {
		const grossSalary = parseCurrencyToNumber(data.grossSalary);

		const result = calculateNightAllowance({
			grossSalary,
			contractualHours: data.contractualHours,
			workedHours: data.workedHours,
			minutes: data.minutes,
			percentageAllowance: data.percentageAllowance,
			usefulDays: data.usefulDays,
			holidaysAndSundays: data.holidaysAndSundays,
			isRural: data.isRural === "yes",
			isNighttimeWork: data.isNighttimeWork === "yes",
		});

		onCalculate(result);
	}

	function handleReset() {
		form.reset();
		onCalculate(null);
	}

	// Derived: equivalent night hours
	function getEquivalentNightHours(): number {
		const h = Number(watchedWorkedHours) || 0;
		const m = Number(watchedMinutes) || 0;
		const totalMin = h * 60 + m;
		if (watchedIsNighttimeWork === "yes") {
			return totalMin / 60;
		}
		if (watchedIsRural === "yes") {
			return totalMin / 60;
		}
		return totalMin / 52.5;
	}

	const showConverted = watchedIsNighttimeWork === "no";
	const convertedHours = getEquivalentNightHours();

	const hourTypeHint =
		watchedIsNighttimeWork === "no"
			? watchedIsRural === "yes"
				? "Horas diurnas serão usadas diretamente (rural não aplica redução noturna)."
				: "Horas diurnas serão convertidas para noturnas (urbano: 52min30s = 1h noturna)."
			: "Horas já computadas em regime noturno — sem conversão.";

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="flex flex-col h-full"
			>
				<div className="divide-y divide-border">
					{/* ── Funcionário ── */}
					<div className="p-5">
						<SectionLabel>Funcionário</SectionLabel>
						<div className="space-y-3.5">
							<FormField
								control={form.control}
								name="grossSalary"
								render={({ field }) => (
									<FormItem>
										<Label
											htmlFor="na-salary"
											className="block text-xs text-foreground"
										>
											Salário bruto
										</Label>
										<FormControl>
											<div className="relative">
												<span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 font-mono text-xs text-muted-foreground">
													R$
												</span>
												<CurrencyInput
													value={field.value}
													onChangeValue={(_, __, masked) =>
														field.onChange(masked as string)
													}
													InputElement={
														<Input
															id="na-salary"
															type="text"
															placeholder="0,00"
															className="pl-8 font-mono"
															{...field}
														/>
													}
												/>
											</div>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<div className="grid grid-cols-2 items-start gap-3.5">
								<FormField
									control={form.control}
									name="contractualHours"
									render={({ field }) => (
										<FormItem>
											<Label
												htmlFor="na-hours"
												className="block text-xs text-foreground"
											>
												Horas contratuais
											</Label>
											<FormControl>
												<div className="relative">
													<Input
														id="na-hours"
														type="number"
														min={1}
														className="pr-8 font-mono"
														{...field}
													/>
													<span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 font-mono text-xs text-muted-foreground">
														h
													</span>
												</div>
											</FormControl>
											<p className="mt-1 text-xs text-muted-foreground">
												Padrão: 220 h/mês
											</p>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="isRural"
									render={({ field }) => (
										<FormItem>
											<Label
												htmlFor="na-rural"
												className="block text-xs text-foreground"
											>
												Categoria
											</Label>
											<FormControl>
												<NativeSelect
													id="na-rural"
													value={field.value}
													onChange={(e) => field.onChange(e.target.value)}
												>
													<option value="no">Urbano (20%)</option>
													<option value="yes">Rural (25%)</option>
												</NativeSelect>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						</div>
					</div>

					{/* ── Jornada noturna ── */}
					<div className="p-5">
						<SectionLabel>Jornada noturna</SectionLabel>
						<div className="space-y-3.5">
							<FormField
								control={form.control}
								name="isNighttimeWork"
								render={({ field }) => (
									<FormItem>
										<span className="block text-xs font-medium text-foreground">
											Tipo de hora informada
										</span>
										<FormControl>
											<OptionSwitch
												options={[
													{
														label: "Diurnas",
														value: "no",
													},
													{
														label: "Noturnas",
														value: "yes",
													},
												]}
												value={field.value}
												onChange={field.onChange}
												fullWidth
											/>
										</FormControl>
										<p className="mt-1.5 text-xs text-muted-foreground">
											{hourTypeHint}
										</p>
										<FormMessage />
									</FormItem>
								)}
							/>
							<div className="grid grid-cols-2 items-start gap-3.5">
								<FormField
									control={form.control}
									name="workedHours"
									render={({ field }) => (
										<FormItem>
											<Label
												htmlFor="na-worked"
												className="block text-xs text-foreground"
											>
												Horas trabalhadas
											</Label>
											<FormControl>
												<div className="relative">
													<Input
														id="na-worked"
														type="number"
														min={0}
														className="pr-8 font-mono"
														{...field}
													/>
													<span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 font-mono text-xs text-muted-foreground">
														h
													</span>
												</div>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="minutes"
									render={({ field }) => (
										<FormItem>
											<Label
												htmlFor="na-minutes"
												className="block text-xs text-foreground"
											>
												Minutos adicionais
											</Label>
											<FormControl>
												<div className="relative">
													<Input
														id="na-minutes"
														type="number"
														min={0}
														max={59}
														className="pr-10 font-mono"
														{...field}
													/>
													<span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 font-mono text-xs text-muted-foreground">
														min
													</span>
												</div>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							{showConverted && (
								<div className="flex items-center justify-between rounded-md bg-muted px-3 py-2">
									<span className="text-xs text-muted-foreground">
										Horas noturnas equivalentes
									</span>
									<span className="font-mono text-xs tabular-nums text-foreground">
										{formatHours(convertedHours)}
									</span>
								</div>
							)}
						</div>
					</div>

					{/* ── Parâmetros do mês ── */}
					<div className="p-5">
						<SectionLabel>Parâmetros do mês</SectionLabel>
						<div className="space-y-3.5">
							<div className="grid grid-cols-2 items-start gap-3.5">
								<FormField
									control={form.control}
									name="usefulDays"
									render={({ field }) => (
										<FormItem>
											<Label
												htmlFor="na-useful"
												className="block text-xs text-foreground"
											>
												Dias úteis
											</Label>
											<FormControl>
												<Input
													id="na-useful"
													type="number"
													min={1}
													max={31}
													className="font-mono"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="holidaysAndSundays"
									render={({ field }) => (
										<FormItem>
											<Label
												htmlFor="na-rest"
												className="block text-xs text-foreground"
											>
												Dom. e feriados
											</Label>
											<FormControl>
												<Input
													id="na-rest"
													type="number"
													min={0}
													max={31}
													className="font-mono"
													{...field}
												/>
											</FormControl>
											<p className="mt-1 text-xs text-muted-foreground">
												Para cálculo do RSR/DSR
											</p>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							<FormField
								control={form.control}
								name="percentageAllowance"
								render={({ field }) => (
									<FormItem>
										<Label
											htmlFor="na-pct"
											className="block text-xs text-foreground"
										>
											Percentual do adicional
										</Label>
										<FormControl>
											<div className="relative">
												<Input
													id="na-pct"
													type="number"
													min={0}
													max={100}
													step="0.01"
													className="pr-8 font-mono"
													{...field}
												/>
												<span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 font-mono text-xs text-muted-foreground">
													%
												</span>
											</div>
										</FormControl>
										<p className="mt-1 text-xs text-muted-foreground">
											Urbano: 20% · Rural: 25% · Pode ser ajustado manualmente.
										</p>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
					</div>
				</div>

				{/* ── Footer ── */}
				<div className="flex items-center justify-between border-t border-border bg-muted px-5 py-3 mt-auto">
					<Button type="button" variant="ghost" size="sm" onClick={handleReset}>
						<RotateCcw className="mr-1.5 h-3 w-3" />
						Resetar
					</Button>
					<Button type="submit">Calcular adicional noturno</Button>
				</div>
			</form>
		</Form>
	);
}
