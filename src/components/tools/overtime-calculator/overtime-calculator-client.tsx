"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { CurrencyInput } from "react-currency-mask";
import { type Resolver, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
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
		const monthlySalary = parseCurrencyToNumber(data.salary);
		const r = calculateOvertime({
			monthlySalary,
			weeklyHours: data.weeklyHours as WeeklyHours,
			hours50: data.hours50,
			hours100: data.hours100,
			includeDsr: data.includeDsr,
			usefulDays: data.usefulDays,
			restDays: data.restDays,
		});
		setResult(r);
	}

	const includeDsr = form.watch("includeDsr");

	return (
		<div className="space-y-6">
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-6 max-w-2xl"
				>
					<FormField
						control={form.control}
						name="salary"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Salário bruto mensal</FormLabel>
								<FormControl>
									<CurrencyInput
										value={field.value}
										onChangeValue={(_, __, masked) =>
											field.onChange(masked as string)
										}
										InputElement={
											<Input type="text" placeholder="R$ 0,00" {...field} />
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
								<FormLabel>Carga horária semanal</FormLabel>
								<FormControl>
									<NativeSelect
										value={field.value}
										onChange={(e) => field.onChange(Number(e.target.value))}
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

					<div className="grid gap-4 sm:grid-cols-2">
						<FormField
							control={form.control}
							name="hours50"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Horas extras 50% (dias úteis)</FormLabel>
									<FormControl>
										<Input type="number" step="0.5" min={0} {...field} />
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
									<FormLabel>Horas extras 100% (domingo/feriado)</FormLabel>
									<FormControl>
										<Input type="number" step="0.5" min={0} {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					<FormField
						control={form.control}
						name="includeDsr"
						render={({ field }) => (
							<FormItem>
								<label className="flex cursor-pointer items-center gap-2">
									<input
										type="checkbox"
										checked={field.value}
										onChange={(e) => field.onChange(e.target.checked)}
										className="accent-primary"
									/>
									<span className="text-sm text-foreground">
										Incluir DSR - Descanso semanal remunerado
									</span>
								</label>
							</FormItem>
						)}
					/>

					{includeDsr && (
						<div className="grid gap-4 sm:grid-cols-2">
							<FormField
								control={form.control}
								name="usefulDays"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Dias úteis no mês</FormLabel>
										<FormControl>
											<Input type="number" min={1} {...field} />
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
										<FormLabel>Domingos e feriados</FormLabel>
										<FormControl>
											<Input type="number" min={0} {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
					)}

					<Button type="submit">Calcular hora extra</Button>
				</form>
			</Form>

			{result && <OvertimeResultCard result={result} />}
		</div>
	);
}

function OvertimeResultCard({ result }: { result: OvertimeResult }) {
	return (
		<div className="rounded-lg border border-primary/30 bg-primary/5 p-4 space-y-3">
			<div>
				<p className="text-sm text-muted-foreground">Total de horas extras</p>
				<p className="text-3xl font-bold text-foreground">
					{brl(result.total)}
				</p>
			</div>
			<dl className="grid gap-2 text-sm sm:grid-cols-2">
				<Row label="Valor da hora normal" value={brl(result.hourlyRate)} />
				<Row
					label="Horas Extras 50% total"
					value={brl(result.overtime50Total)}
				/>
				<Row
					label="Horas Extras 100% total"
					value={brl(result.overtime100Total)}
				/>
				<Row
					label="DSR - Descanso semanal remunerado"
					value={brl(result.dsr)}
				/>
			</dl>
		</div>
	);
}

function Row({ label, value }: { label: string; value: string }) {
	return (
		<div className="flex justify-between rounded-md border border-border bg-background px-3 py-2">
			<dt className="text-muted-foreground">{label}</dt>
			<dd className="font-medium text-foreground">{value}</dd>
		</div>
	);
}

function brl(value: number): string {
	return value.toLocaleString("pt-BR", {
		style: "currency",
		currency: "BRL",
	});
}
