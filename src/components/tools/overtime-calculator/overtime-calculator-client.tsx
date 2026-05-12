"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { useState } from "react";
import { CurrencyInput } from "react-currency-mask";
import { type Resolver, useForm } from "react-hook-form";
import { z } from "zod";
import { CopyButton } from "@/components/shared/copy-button";
import { Chip } from "@/components/shared/layout-b/chip";
import { ResultRow } from "@/components/shared/layout-b/result-row";
import { SectionLabel } from "@/components/shared/layout-b/section-label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { calculateOvertime, type OvertimeResult } from "@/lib/labor/overtime";
import type { WeeklyHours } from "@/lib/payroll/working-hours";
import { parseCurrencyToNumber } from "@/utils/number";

const schema = z.object({
	salary: z.string().min(1, "Informe o salário bruto"),
	weeklyHours: z.coerce.number(),
	hours50: z.coerce.number().min(0, "Mínimo 0"),
	hours100: z.coerce.number().min(0, "Mínimo 0"),
	includeDsr: z.boolean(),
	usefulDays: z.coerce.number().min(0),
	restDays: z.coerce.number().min(0),
});

type FormValues = z.infer<typeof schema>;

function brl(value: number): string {
	return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function buildSummary(r: OvertimeResult): string {
	return [
		`Total horas extras: ${brl(r.total)}`,
		`Valor hora normal: ${brl(r.hourlyRate)}`,
		`Horas extras 50%: ${brl(r.overtime50Total)}`,
		`Horas extras 100%: ${brl(r.overtime100Total)}`,
		`DSR: ${brl(r.dsr)}`,
	].join("\n");
}

export function OvertimeCalculatorClient() {
	const [result, setResult] = useState<OvertimeResult | null>(null);

	const form = useForm<FormValues>({
		resolver: zodResolver(schema) as Resolver<FormValues>,
		defaultValues: {
			salary: "",
			weeklyHours: 44,
			hours50: 0,
			hours100: 0,
			includeDsr: true,
			usefulDays: 22,
			restDays: 5,
		},
	});

	function onSubmit(data: FormValues) {
		const r = calculateOvertime({
			monthlySalary: parseCurrencyToNumber(data.salary),
			weeklyHours: data.weeklyHours as WeeklyHours,
			hours50: data.hours50,
			hours100: data.hours100,
			includeDsr: data.includeDsr,
			usefulDays: data.usefulDays,
			restDays: data.restDays,
		});
		setResult(r);
	}

	function handleReset() {
		form.reset();
		setResult(null);
	}

	const includeDsr = form.watch("includeDsr");

	const [intPart, centsPart] = result
		? brl(result.total).replace("R$ ", "").split(",")
		: ["–", "00"];

	return (
		<div className="grid grid-cols-1 items-start lg:grid-cols-[1fr_360px] border border-border rounded-md overflow-hidden">
			{/* Coluna esquerda — formulário */}
			<div className="bg-card flex flex-col h-full">
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="flex flex-col h-full"
					>
						<div className="divide-y divide-border">
							<div className="p-5">
								<SectionLabel>Salário e jornada</SectionLabel>
								<div className="space-y-3.5">
									<FormField
										control={form.control}
										name="salary"
										render={({ field }) => (
											<FormItem>
												<Label
													htmlFor="ot-salary"
													className="mb-1.5 block text-xs text-foreground"
												>
													Salário bruto mensal
												</Label>
												<FormControl>
													<CurrencyInput
														value={field.value}
														onChangeValue={(_, __, masked) =>
															field.onChange(masked as string)
														}
														InputElement={
															<Input
																id="ot-salary"
																type="text"
																placeholder="R$ 0,00"
																{...field}
															/>
														}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="weeklyHours"
										render={({ field }) => (
											<FormItem>
												<Label
													htmlFor="ot-weekly"
													className="mb-1.5 block text-xs text-foreground"
												>
													Carga horária semanal
												</Label>
												<FormControl>
													<NativeSelect
														id="ot-weekly"
														value={field.value}
														onChange={(e) =>
															field.onChange(Number(e.target.value))
														}
													>
														<option value={44}>44h (220h mensais)</option>
														<option value={40}>40h (200h mensais)</option>
														<option value={36}>36h (180h mensais)</option>
														<option value={30}>30h (150h mensais)</option>
													</NativeSelect>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
							</div>

							<div className="p-5">
								<SectionLabel>Horas extras</SectionLabel>
								<div className="grid grid-cols-2 gap-3.5">
									<FormField
										control={form.control}
										name="hours50"
										render={({ field }) => (
											<FormItem>
												<Label
													htmlFor="ot-h50"
													className="mb-1.5 block text-xs text-foreground"
												>
													50% (dias úteis)
												</Label>
												<FormControl>
													<Input
														id="ot-h50"
														type="number"
														step="0.5"
														min={0}
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="hours100"
										render={({ field }) => (
											<FormItem>
												<Label
													htmlFor="ot-h100"
													className="mb-1.5 block text-xs text-foreground"
												>
													100% (dom./feriado)
												</Label>
												<FormControl>
													<Input
														id="ot-h100"
														type="number"
														step="0.5"
														min={0}
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
							</div>

							<div className="p-5">
								<SectionLabel>DSR</SectionLabel>
								<div className="space-y-3.5">
									<FormField
										control={form.control}
										name="includeDsr"
										render={({ field }) => (
											<FormItem>
												<div className="flex items-center gap-2">
													<Checkbox
														id="ot-dsr"
														checked={field.value}
														onCheckedChange={field.onChange}
													/>
													<Label
														htmlFor="ot-dsr"
														className="cursor-pointer text-xs"
													>
														Incluir DSR — Descanso semanal remunerado
													</Label>
												</div>
											</FormItem>
										)}
									/>
									{includeDsr && (
										<div className="grid grid-cols-2 gap-3.5">
											<FormField
												control={form.control}
												name="usefulDays"
												render={({ field }) => (
													<FormItem>
														<Label
															htmlFor="ot-useful"
															className="mb-1.5 block text-xs text-foreground"
														>
															Dias úteis no mês
														</Label>
														<FormControl>
															<Input
																id="ot-useful"
																type="number"
																min={1}
																{...field}
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
											<FormField
												control={form.control}
												name="restDays"
												render={({ field }) => (
													<FormItem>
														<Label
															htmlFor="ot-rest"
															className="mb-1.5 block text-xs text-foreground"
														>
															Domingos e feriados
														</Label>
														<FormControl>
															<Input
																id="ot-rest"
																type="number"
																min={0}
																{...field}
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
										</div>
									)}
								</div>
							</div>
						</div>

						<div className="flex items-center justify-between border-t border-border bg-muted px-5 py-3 mt-auto">
							<Button
								type="button"
								variant="ghost"
								size="sm"
								onClick={handleReset}
								disabled={!result}
							>
								<RotateCcw className="mr-1.5 h-3 w-3" />
								Resetar
							</Button>
							<Button type="submit">Calcular hora extra</Button>
						</div>
					</form>
				</Form>
			</div>

			{/* Coluna direita — resultado */}
			<aside className="flex h-full lg:border-l max-lg:border-t border-border flex-col">
				{result ? (
					<>
						<div className="p-4 border-b border-border">
							<div className="mb-2 flex items-center justify-between">
								<span className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
									Total de horas extras
								</span>
								<Chip tone="success">Estimativa</Chip>
							</div>
							<div className="flex items-baseline gap-1 font-mono">
								<span className="text-sm font-medium text-muted-foreground">
									R$
								</span>
								<span className="text-[28px] font-semibold leading-none tracking-tight text-foreground">
									{intPart}
								</span>
								<span className="text-lg font-medium leading-none text-muted-foreground">
									,{centsPart}
								</span>
							</div>
						</div>

						<div className="px-4 py-3 flex-1">
							<p className="mb-1 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
								Detalhamento
							</p>
							<ResultRow
								label="Valor da hora normal"
								value={result.hourlyRate}
							/>
							<ResultRow
								label="Horas extras 50%"
								value={result.overtime50Total}
							/>
							<ResultRow
								label="Horas extras 100%"
								value={result.overtime100Total}
							/>
							<ResultRow label="DSR" value={result.dsr} />
						</div>

						<div className="flex gap-2 border-t border-border p-3">
							<CopyButton
								text={buildSummary(result)}
								label="Copiar resumo"
								feedbackText="Copiado"
								variant="outline"
							/>
						</div>
					</>
				) : (
					<div className="flex flex-1 flex-col items-center justify-center gap-2 p-6 text-center">
						<p className="text-sm text-muted-foreground">
							Preencha os dados para calcular as horas extras
						</p>
					</div>
				)}

				<div className="flex items-start gap-2 border-t border-warning-line bg-warning-surface px-4 py-3 text-[11.5px] leading-relaxed text-muted-foreground">
					<AlertTriangle className="mt-px h-3.5 w-3.5 shrink-0 text-warning" />
					<span>
						Estimativa orientativa baseada na legislação vigente (2026).
						Consulte um contador para holerites oficiais.
					</span>
				</div>
			</aside>
		</div>
	);
}
