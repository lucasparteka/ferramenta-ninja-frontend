"use client";

import { AlertTriangle, Info, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";
import { Chip } from "@/components/shared/layout-b/chip";
import { ResultRow } from "@/components/shared/layout-b/result-row";
import { SectionLabel } from "@/components/shared/layout-b/section-label";
import { NumberInput } from "@/components/shared/number-input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { type BmiClassification, calculateBmi } from "@/lib/health/bmi";

interface BmiFormState {
	weight: number;
	height: number;
}

const DEFAULTS: BmiFormState = { weight: 0, height: 0 };

const CHIP_TONE: Record<BmiClassification, "warn" | "success" | "danger"> = {
	underweight: "warn",
	normal: "success",
	overweight: "warn",
	obesity1: "danger",
	obesity2: "danger",
	obesity3: "danger",
};

export function BmiClient() {
	const [state, setState] = useState<BmiFormState>(DEFAULTS);

	function set<K extends keyof BmiFormState>(key: K) {
		return (value: BmiFormState[K]) =>
			setState((s) => ({ ...s, [key]: value }));
	}

	const result = useMemo(() => {
		if (!(state.weight > 0) || !(state.height > 0)) return null;
		try {
			return calculateBmi({ weightKg: state.weight, heightCm: state.height });
		} catch {
			return null;
		}
	}, [state]);

	return (
		<div className="grid grid-cols-1 items-start lg:grid-cols-[1fr_360px] border rounded-md overflow-hidden">
			{/* Coluna esquerda — formulário */}
			<div className="bg-card flex flex-col h-full">
				<div className="divide-y divide-border">
					<div className="p-5">
						<SectionLabel>Medidas</SectionLabel>
						<div className="space-y-3.5">
							<div className="grid grid-cols-2 gap-3.5">
								<div>
									<Label htmlFor="weight" className="mb-1.5 block text-xs">
										Peso (kg)
									</Label>
									<NumberInput
										id="weight"
										value={state.weight}
										onChange={(v) => set("weight")(v)}
										min={0}
										step={0.1}
										placeholder="70"
									/>
								</div>
								<div>
									<Label htmlFor="height" className="mb-1.5 block text-xs">
										Altura (cm)
									</Label>
									<NumberInput
										id="height"
										value={state.height}
										onChange={(v) => set("height")(v)}
										min={0}
										placeholder="170"
									/>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="flex items-center justify-between border-t border-border bg-muted px-5 py-3 mt-auto">
					<div className="flex items-center gap-1.5 text-[11.5px] text-muted-foreground">
						<Info size={12} />O cálculo é atualizado automaticamente
					</div>
					<Button
						type="button"
						variant="ghost"
						size="sm"
						onClick={() => setState(DEFAULTS)}
					>
						<RotateCcw className="mr-1.5 h-3 w-3" />
						Resetar
					</Button>
				</div>
			</div>

			{/* Coluna direita — resultado */}
			<aside className="flex h-full lg:border-l max-lg:border-t flex-col gap-3">
				<div className="flex-1">
					{result ? (
						<div className="p-4.5 bg-card border-b">
							<div className="mb-2 flex items-center justify-between">
								<span className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
									Seu IMC
								</span>
								<Chip tone={CHIP_TONE[result.classification]}>
									{result.label}
								</Chip>
							</div>
							<span className="text-[32px] font-semibold leading-none tracking-tight font-mono text-foreground">
								{result.value.toFixed(1)}
							</span>
							<p className="mt-2 text-[11.5px] text-muted-foreground">
								Faixa saudável:{" "}
								<span className="font-mono text-foreground">
									{result.healthyRange.min.toFixed(1)} —{" "}
									{result.healthyRange.max.toFixed(1)} kg
								</span>
							</p>
						</div>
					) : (
						<div className="flex flex-col items-center justify-center gap-2 p-6 text-center">
							<p className="text-sm text-muted-foreground">
								Informe peso e altura para ver o resultado
							</p>
						</div>
					)}
					<div className="px-4.5 py-3">
						<p className="mb-1 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
							Classificação OMS
						</p>
						<ResultRow label="Abaixo do peso" value="< 18,5" />
						<ResultRow label="Peso normal" value="18,5 — 24,9" />
						<ResultRow label="Sobrepeso" value="25,0 — 29,9" />
						<ResultRow label="Obesidade grau I" value="30,0 — 34,9" />
						<ResultRow label="Obesidade grau II" value="35,0 — 39,9" />
						<ResultRow label="Obesidade grau III" value="≥ 40,0" />
					</div>
				</div>
				<div className="flex items-start gap-2 border-t border-warning-line bg-warning-surface px-4.5 py-3 text-[11.5px] leading-relaxed text-muted-foreground">
					<AlertTriangle className="mt-px h-3.5 w-3.5 shrink-0 text-warning" />
					<span>
						O IMC é uma referência para adultos em geral. Atletas, crianças,
						gestantes e idosos requerem avaliação individualizada.
					</span>
				</div>
			</aside>
		</div>
	);
}
