"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { CurrencyInput } from "react-currency-mask";
import { type Resolver, useForm } from "react-hook-form";
import { z } from "zod";
import {
	ResultBox,
	ResultGrid,
	ResultRow,
} from "@/components/shared/result-box";
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
	type CompoundInterestResult,
	calculateCompoundInterest,
} from "@/lib/finance/compound-interest";
import { parseCurrencyToNumber } from "@/utils/number";

const schema = z.object({
	principal: z.string(),
	monthlyContribution: z.string(),
	annualRate: z.coerce.number().min(0, "Taxa mínima 0%"),
	months: z.coerce.number().min(1, "Mínimo 1 mês").max(600, "Máximo 50 anos"),
	contributionTiming: z.enum(["begin", "end"]),
});

type FormValues = z.infer<typeof schema>;

export function CompoundInterestClient() {
	const [result, setResult] = useState<CompoundInterestResult | null>(null);

	const form = useForm<FormValues>({
		resolver: zodResolver(schema) as Resolver<FormValues>,
		defaultValues: {
			principal: "",
			monthlyContribution: "",
			annualRate: 12,
			months: 60,
			contributionTiming: "end",
		},
	});

	function onSubmit(data: FormValues) {
		const r = calculateCompoundInterest({
			principal: parseCurrencyToNumber(data.principal),
			monthlyContribution: parseCurrencyToNumber(data.monthlyContribution),
			annualRate: data.annualRate / 100,
			months: data.months,
			contributionTiming: data.contributionTiming,
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
					<FormField
						control={form.control}
						name="principal"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Aporte inicial</FormLabel>
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
						name="monthlyContribution"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Aporte mensal</FormLabel>
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
									<FormLabel>Período (meses)</FormLabel>
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
						name="contributionTiming"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Quando o aporte é feito</FormLabel>
								<FormControl>
									<NativeSelect {...field}>
										<option value="end">Fim do mês (padrão)</option>
										<option value="begin">Início do mês</option>
									</NativeSelect>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<Button type="submit">Calcular juros compostos</Button>
				</form>
			</Form>

			{result && <ResultCard result={result} />}
		</div>
	);
}

function ResultCard({ result }: { result: CompoundInterestResult }) {
	return (
		<div className="space-y-4">
			<ResultBox
				label="Montante final"
				value={brl(result.finalBalance)}
				hint={`Taxa mensal equivalente: ${(result.monthlyRate * 100).toFixed(4)}%`}
			/>
			<ResultGrid>
				<ResultRow label="Total investido" value={brl(result.totalInvested)} />
				<ResultRow label="Total em juros" value={brl(result.totalInterest)} />
			</ResultGrid>

			<details className="rounded-lg border border-border bg-card p-3">
				<summary className="cursor-pointer text-sm font-medium text-foreground">
					Ver evolução mês a mês
				</summary>
				<div className="mt-3 max-h-96 overflow-auto">
					<table className="w-full text-sm">
						<thead className="sticky top-0 bg-background text-left">
							<tr>
								<th className="px-2 py-1">Mês</th>
								<th className="px-2 py-1">Juros</th>
								<th className="px-2 py-1">Saldo</th>
							</tr>
						</thead>
						<tbody>
							{result.schedule.map((e) => (
								<tr key={e.month} className="border-t border-border">
									<td className="px-2 py-1">{e.month}</td>
									<td className="px-2 py-1">{brl(e.interest)}</td>
									<td className="px-2 py-1">{brl(e.balance)}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</details>
		</div>
	);
}

function brl(value: number): string {
	return value.toLocaleString("pt-BR", {
		style: "currency",
		currency: "BRL",
	});
}
