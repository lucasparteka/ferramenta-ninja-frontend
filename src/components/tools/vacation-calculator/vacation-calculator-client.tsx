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
import {
	calculateVacation,
	MIN_VACATION_PERIOD_DAYS,
	type VacationResult,
} from "@/lib/labor/vacation";
import { parseCurrencyToNumber } from "@/utils/number";

const schema = z.object({
	salary: z.string().min(1, "Informe o salário bruto"),
	monthsAtCompany: z.coerce
		.number()
		.min(1, "Mínimo 1 mês")
		.max(12, "Máximo 12 meses"),
	absences: z.coerce.number().min(0),
	sellAbono: z.boolean(),
	dependents: z.coerce.number().min(0),
	daysToTake: z.coerce.number().min(0).max(30),
});

type FormValues = z.infer<typeof schema>;

export function VacationCalculatorClient() {
	const [result, setResult] = useState<VacationResult | null>(null);

	const form = useForm<FormValues>({
		resolver: zodResolver(schema) as Resolver<FormValues>,
		defaultValues: {
			salary: "",
			monthsAtCompany: 12,
			absences: 0,
			sellAbono: false,
			dependents: 0,
			daysToTake: 30,
		},
	});

	function onSubmit(data: FormValues) {
		const r = calculateVacation({
			monthlySalary: parseCurrencyToNumber(data.salary),
			monthsAtCompany: data.monthsAtCompany,
			unjustifiedAbsences: data.absences,
			sellAbono: data.sellAbono,
			dependents: data.dependents,
			daysToTake: data.daysToTake,
		});
		setResult(r);
	}

	return (
		<div className="space-y-6">
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-6 max-w-xl"
				>
					<div className="grid gap-4 sm:grid-cols-2 items-start">
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
							name="daysToTake"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Dias de férias</FormLabel>
									<FormControl>
										<Input
											type="number"
											min={MIN_VACATION_PERIOD_DAYS}
											max={30}
											{...field}
										/>
									</FormControl>
									<p className="text-xs text-muted-foreground">
										Mínimo {MIN_VACATION_PERIOD_DAYS} dias por período (CLT 134
										§1). Em fracionamento, um período deve ter ≥14 dias.
									</p>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					<div className="grid gap-4 sm:grid-cols-2">
						<FormField
							control={form.control}
							name="monthsAtCompany"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Meses no período aquisitivo</FormLabel>
									<FormControl>
										<Input type="number" min={1} max={12} {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="absences"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Faltas injustificadas</FormLabel>
									<FormControl>
										<Input type="number" min={0} {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					<FormField
						control={form.control}
						name="dependents"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Dependentes</FormLabel>
								<FormControl>
									<Input type="number" min={0} {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="sellAbono"
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
										Vender abono pecuniário (até 1/3 dos dias de direito — CLT
										art. 143)
									</span>
								</label>
							</FormItem>
						)}
					/>

					<Button type="submit">Calcular férias</Button>
				</form>
			</Form>

			{result && <ResultCard result={result} />}
		</div>
	);
}

function ResultCard({ result }: { result: VacationResult }) {
	if (result.entitledDays === 0) {
		return (
			<div className="rounded-lg border border-warning/30 bg-warning/10 p-4 text-sm text-foreground">
				Sem direito a férias no período informado (faltas excessivas ou tempo
				insuficiente).
			</div>
		);
	}

	const validationLabel =
		result.validationError === "days-below-minimum"
			? `Dias informados abaixo do mínimo legal de ${5} dias por período (CLT 134 §1). Ajustado para o mínimo.`
			: result.validationError === "days-exceed-available"
				? `Dias informados excedem o disponível (${result.availableForVacation}). Ajustado para o máximo permitido.`
				: null;

	return (
		<div className="space-y-4">
			{validationLabel && (
				<div className="rounded-lg border border-warning/30 bg-warning/10 p-4 text-sm text-foreground">
					{validationLabel}
				</div>
			)}
			<div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
				<p className="text-sm text-muted-foreground">Total líquido a receber</p>
				<p className="text-3xl font-bold text-foreground">
					{brl(result.netAmount)}
				</p>
			</div>
			<dl className="grid gap-2 text-sm sm:grid-cols-2">
				<Row label="Dias de direito" value={`${result.entitledDays} dias`} />
				<Row
					label="Disponível para férias"
					value={`${result.availableForVacation} dias`}
				/>
				<Row label="Dias de férias" value={`${result.vacationDaysTaken} dias`} />
				<Row label="Dias vendidos (abono)" value={`${result.abonoDays} dias`} />
				<Row label="Férias (base)" value={brl(result.vacationBase)} />
				<Row label="1/3 constitucional" value={brl(result.oneThirdBonus)} />
				<Row label="Abono pecuniário" value={brl(result.abonoPecuniario)} />
				<Row label="1/3 sobre abono" value={brl(result.abonoOneThird)} />
				<Row label="INSS" value={brl(result.inss)} />
				<Row label="IRRF" value={brl(result.irrf)} />
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
