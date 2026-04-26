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
import {
	type AmortizationResult,
	type AmortizationSystem,
	calculateAmortization,
} from "@/lib/finance/amortization";
import { parseCurrencyToNumber } from "@/utils/number";

const schema = z.object({
	principal: z.string().min(1, "Informe o valor"),
	annualRate: z.coerce.number().min(0).max(100),
	months: z.coerce.number().min(1).max(600),
	system: z.enum(["sac", "price"]),
});

type FormValues = z.infer<typeof schema>;

export function LoanCalculatorClient() {
	const [results, setResults] = useState<{
		sac: AmortizationResult;
		price: AmortizationResult;
		selected: AmortizationSystem;
	} | null>(null);

	const form = useForm<FormValues>({
		resolver: zodResolver(schema) as Resolver<FormValues>,
		defaultValues: {
			principal: "",
			annualRate: 12,
			months: 120,
			system: "price",
		},
	});

	function onSubmit(data: FormValues) {
		const base = {
			principal: parseCurrencyToNumber(data.principal),
			annualRate: data.annualRate / 100,
			months: data.months,
		};
		setResults({
			sac: calculateAmortization({ ...base, system: "sac" }),
			price: calculateAmortization({ ...base, system: "price" }),
			selected: data.system,
		});
	}

	return (
		<div className="space-y-6">
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-6 max-w-xl"
				>
					<FormField
						control={form.control}
						name="principal"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Valor financiado</FormLabel>
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

					<div className="grid gap-4 sm:grid-cols-2">
						<FormField
							control={form.control}
							name="annualRate"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Taxa de juros anual (%)</FormLabel>
									<FormControl>
										<Input type="number" step="0.01" min={0} {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="months"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Prazo (meses)</FormLabel>
									<FormControl>
										<Input type="number" min={1} max={600} {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					<FormField
						control={form.control}
						name="system"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Sistema</FormLabel>
								<FormControl>
									<NativeSelect {...field}>
										<option value="price">Tabela Price (parcela fixa)</option>
										<option value="sac">SAC (parcela decrescente)</option>
									</NativeSelect>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<Button type="submit">Simular financiamento</Button>
				</form>
			</Form>

			{results && (
				<>
					<Comparison sac={results.sac} price={results.price} />
					<Schedule
						result={results.selected === "sac" ? results.sac : results.price}
					/>
				</>
			)}
		</div>
	);
}

function Comparison({
	sac,
	price,
}: {
	sac: AmortizationResult;
	price: AmortizationResult;
}) {
	return (
		<div className="grid gap-4 sm:grid-cols-2">
			<SystemCard title="SAC" result={sac} />
			<SystemCard title="Price" result={price} />
		</div>
	);
}

function SystemCard({
	title,
	result,
}: {
	title: string;
	result: AmortizationResult;
}) {
	return (
		<div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
			<p className="text-sm font-semibold text-foreground">{title}</p>
			<dl className="mt-3 space-y-1 text-sm">
				<Row label="Primeira parcela" value={brl(result.firstPayment)} />
				<Row label="Última parcela" value={brl(result.lastPayment)} />
				<Row label="Total pago" value={brl(result.totalPaid)} />
				<Row label="Total em juros" value={brl(result.totalInterest)} />
			</dl>
		</div>
	);
}

function Schedule({ result }: { result: AmortizationResult }) {
	return (
		<details className="rounded-md border border-border bg-background/60 p-3">
			<summary className="cursor-pointer text-sm font-medium text-foreground">
				Tabela de amortização ({result.system === "sac" ? "SAC" : "Price"})
			</summary>
			<div className="mt-3 max-h-96 overflow-auto">
				<table className="w-full text-sm">
					<thead className="sticky top-0 bg-background text-left">
						<tr>
							<th className="px-2 py-1">Mês</th>
							<th className="px-2 py-1">Parcela</th>
							<th className="px-2 py-1">Juros</th>
							<th className="px-2 py-1">Amort.</th>
							<th className="px-2 py-1">Saldo</th>
						</tr>
					</thead>
					<tbody>
						{result.schedule.map((e) => (
							<tr key={e.month} className="border-t border-border">
								<td className="px-2 py-1">{e.month}</td>
								<td className="px-2 py-1">{brl(e.payment)}</td>
								<td className="px-2 py-1">{brl(e.interest)}</td>
								<td className="px-2 py-1">{brl(e.amortization)}</td>
								<td className="px-2 py-1">{brl(e.balance)}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</details>
	);
}

function Row({ label, value }: { label: string; value: string }) {
	return (
		<div className="flex justify-between">
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
