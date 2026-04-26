"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
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
import { type BmiResult, calculateBmi } from "@/lib/health/bmi";

const bmiSchema = z.object({
	weight: z.coerce
		.number({ message: "Informe o peso" })
		.gt(0, "Peso deve ser maior que zero")
		.lte(500, "Valor de peso muito alto"),
	height: z.coerce
		.number({ message: "Informe a altura" })
		.gt(0, "Altura deve ser maior que zero")
		.lte(272, "Valor de altura muito alto"),
});

type BmiFormValues = z.infer<typeof bmiSchema>;

const COLOR_BY_CLASS: Record<BmiResult["classification"], string> = {
	underweight: "border-warning/40 bg-warning/10",
	normal: "border-emerald-500/40 bg-emerald-500/10",
	overweight: "border-warning/40 bg-warning/10",
	obesity1: "border-destructive/40 bg-destructive/10",
	obesity2: "border-destructive/40 bg-destructive/10",
	obesity3: "border-destructive/40 bg-destructive/10",
};

export function BmiCalculatorClient() {
	const [result, setResult] = useState<BmiResult | null>(null);

	const form = useForm<BmiFormValues>({
		resolver: zodResolver(bmiSchema) as Resolver<BmiFormValues>,
		defaultValues: { weight: undefined, height: undefined },
	});

	function onSubmit(data: BmiFormValues) {
		setResult(calculateBmi({ weightKg: data.weight, heightCm: data.height }));
	}

	return (
		<div className="space-y-6">
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-6 max-w-md"
				>
					<FormField
						control={form.control}
						name="weight"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Peso (kg)</FormLabel>
								<FormControl>
									<Input
										type="number"
										step="0.1"
										min={0}
										placeholder="70"
										{...field}
										value={field.value ?? ""}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="height"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Altura (cm)</FormLabel>
								<FormControl>
									<Input
										type="number"
										step="1"
										min={0}
										placeholder="170"
										{...field}
										value={field.value ?? ""}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<Button type="submit">Calcular IMC</Button>
				</form>
			</Form>

			{result && (
				<div
					className={`rounded-lg border p-4 space-y-3 ${COLOR_BY_CLASS[result.classification]}`}
				>
					<div>
						<p className="text-sm text-muted-foreground">Seu IMC</p>
						<p className="text-3xl font-bold text-foreground">
							{result.value.toFixed(1)}
						</p>
						<p className="text-base font-medium text-foreground">
							{result.label}
						</p>
					</div>
					<p className="text-sm text-foreground">
						Faixa de peso saudável para sua altura:{" "}
						<strong>
							{result.healthyRange.min.toFixed(1)} kg —{" "}
							{result.healthyRange.max.toFixed(1)} kg
						</strong>
					</p>
				</div>
			)}

			<div className="rounded-lg border border-border bg-background/60 p-4">
				<h3 className="mb-3 text-sm font-semibold text-foreground">
					Tabela de classificação OMS
				</h3>
				<dl className="grid gap-2 text-sm sm:grid-cols-2">
					<ClassRow label="Abaixo do peso" range="< 18,5" />
					<ClassRow label="Peso normal" range="18,5 — 24,9" />
					<ClassRow label="Sobrepeso" range="25,0 — 29,9" />
					<ClassRow label="Obesidade grau I" range="30,0 — 34,9" />
					<ClassRow label="Obesidade grau II" range="35,0 — 39,9" />
					<ClassRow label="Obesidade grau III" range="≥ 40,0" />
				</dl>
			</div>
		</div>
	);
}

function ClassRow({ label, range }: { label: string; range: string }) {
	return (
		<div className="flex items-center justify-between rounded-md border border-border bg-background px-3 py-2">
			<dt className="text-foreground">{label}</dt>
			<dd className="text-muted-foreground">{range}</dd>
		</div>
	);
}
