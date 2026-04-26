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
import { DateInput } from "@/components/ui/date-input";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/select-native";
import {
	calculateTermination,
	type NoticePolicy,
	type TerminationResult,
} from "@/lib/labor/termination";
import type { TerminationType } from "@/lib/payroll";
import { parseCurrencyToNumber } from "@/utils/number";

const TERMINATION_TYPES: { value: TerminationType; label: string }[] = [
	{ value: "no-cause", label: "Dispensa sem justa causa" },
	{ value: "with-cause", label: "Dispensa por justa causa" },
	{ value: "resignation", label: "Pedido de demissão" },
	{ value: "agreement", label: "Acordo (CLT 484-A)" },
	{ value: "contract-end", label: "Fim de contrato determinado" },
];

const NOTICE_POLICIES: { value: NoticePolicy; label: string }[] = [
	{ value: "indemnified", label: "Indenizado" },
	{ value: "worked", label: "Trabalhado" },
	{ value: "not-served", label: "Não cumprido" },
];

const schema = z.object({
	salary: z.string().min(1, "Informe o salário bruto"),
	admissionDate: z.string().min(1, "Informe a data de admissão"),
	terminationDate: z.string().min(1, "Informe a data de rescisão"),
	type: z.enum([
		"no-cause",
		"with-cause",
		"resignation",
		"agreement",
		"contract-end",
	]),
	noticePolicy: z.enum(["worked", "indemnified", "not-served"]),
	fgtsBalance: z.string(),
	dependents: z.coerce.number().min(0),
	hasExpiredVacation: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

export function TerminationCalculatorClient() {
	const [result, setResult] = useState<TerminationResult | null>(null);
	const [error, setError] = useState<string | null>(null);

	const form = useForm<FormValues>({
		resolver: zodResolver(schema) as Resolver<FormValues>,
		defaultValues: {
			salary: "",
			admissionDate: "",
			terminationDate: "",
			type: "no-cause",
			noticePolicy: "indemnified",
			fgtsBalance: "",
			dependents: 0,
			hasExpiredVacation: false,
		},
	});

	function onSubmit(data: FormValues) {
		const admission = new Date(`${data.admissionDate}T00:00:00Z`);
		const termination = new Date(`${data.terminationDate}T00:00:00Z`);

		if (Number.isNaN(admission.getTime()) || Number.isNaN(termination.getTime())) {
			setError("Datas inválidas.");
			setResult(null);
			return;
		}
		if (termination.getTime() <= admission.getTime()) {
			setError("A data de rescisão deve ser posterior à admissão.");
			setResult(null);
			return;
		}

		setError(null);
		const r = calculateTermination({
			monthlySalary: parseCurrencyToNumber(data.salary),
			admissionDate: admission,
			terminationDate: termination,
			type: data.type,
			noticePolicy: data.noticePolicy,
			fgtsBalance: parseCurrencyToNumber(data.fgtsBalance),
			dependents: data.dependents,
			hasExpiredVacation: data.hasExpiredVacation,
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

					<div className="grid gap-4 sm:grid-cols-2">
						<FormField
							control={form.control}
							name="admissionDate"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Data de admissão</FormLabel>
									<FormControl>
										<DateInput
											value={field.value}
											onChange={field.onChange}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="terminationDate"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Data de rescisão</FormLabel>
									<FormControl>
										<DateInput
											value={field.value}
											onChange={field.onChange}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					<FormField
						control={form.control}
						name="type"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Motivo da rescisão</FormLabel>
								<FormControl>
									<NativeSelect {...field}>
										{TERMINATION_TYPES.map((t) => (
											<option key={t.value} value={t.value}>
												{t.label}
											</option>
										))}
									</NativeSelect>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="noticePolicy"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Aviso prévio</FormLabel>
								<FormControl>
									<NativeSelect {...field}>
										{NOTICE_POLICIES.map((n) => (
											<option key={n.value} value={n.value}>
												{n.label}
											</option>
										))}
									</NativeSelect>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<div className="grid gap-4 sm:grid-cols-2">
						<FormField
							control={form.control}
							name="fgtsBalance"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Saldo do FGTS (opcional)</FormLabel>
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
					</div>

					<FormField
						control={form.control}
						name="hasExpiredVacation"
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
										Possui férias vencidas (período aquisitivo completo não
										usufruído)
									</span>
								</label>
							</FormItem>
						)}
					/>

					<Button type="submit">Calcular rescisão</Button>
				</form>
			</Form>

			{error && (
				<div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-foreground">
					{error}
				</div>
			)}

			{result && <ResultCard result={result} />}
		</div>
	);
}

function ResultCard({ result }: { result: TerminationResult }) {
	return (
		<div className="space-y-4">
			<div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
				<p className="text-sm text-muted-foreground">Total líquido a receber</p>
				<p className="text-3xl font-bold text-foreground">{brl(result.netTotal)}</p>
				<p className="mt-1 text-xs text-muted-foreground">
					Bruto: {brl(result.grossTotal)} · INSS: {brl(result.inss)} · IRRF:{" "}
					{brl(result.irrf)}
				</p>
			</div>

			<dl className="space-y-2 text-sm">
				{result.lines.map((line) => (
					<Row key={line.label} label={line.label} value={brl(line.amount)} />
				))}
			</dl>

			{result.fgtsWithdrawable > 0 && (
				<div className="rounded-md border border-border bg-background/60 p-3 text-sm">
					<p className="text-muted-foreground">FGTS sacável</p>
					<p className="font-semibold text-foreground">
						{brl(result.fgtsWithdrawable)}
					</p>
				</div>
			)}

			<div className="rounded-md border border-border bg-background/60 p-3 text-sm text-foreground">
				Tempo de empresa: <strong>{result.yearsAtCompany}</strong> anos e{" "}
				<strong>{result.monthsAtCompany % 12}</strong> meses · Aviso prévio:{" "}
				<strong>{result.noticeDays}</strong> dias
			</div>

			<div
				className={
					result.unemploymentInsuranceEligible
						? "rounded-md border border-primary/30 bg-primary/5 p-3 text-sm text-foreground"
						: "rounded-md border border-border bg-background/60 p-3 text-sm text-muted-foreground"
				}
			>
				{result.unemploymentInsuranceEligible
					? "Possível direito ao seguro-desemprego (verifique requisitos no gov.br)."
					: "Modalidade sem direito a seguro-desemprego."}
			</div>
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
