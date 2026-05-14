"use client";

import { Shuffle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { CopyButton } from "@/components/shared/copy-button";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
	CARD_BRANDS,
	formatCardNumber,
	type GeneratedCard,
	generateCreditCard,
} from "@/lib/credit-card/generate";
import { CardPreview } from "./card-preview";
import { LayoutB } from "@/components/shared/layout-b";
import { SectionLabel } from "@/components/shared/layout-b/section-label";
import { ResultRow } from "@/components/shared/layout-b/result-row";

const BRAND_KEYS = Object.keys(CARD_BRANDS) as Array<keyof typeof CARD_BRANDS>;

export function CreditCardGenerator() {
	const [selectedBrand, setSelectedBrand] =
		useState<keyof typeof CARD_BRANDS>("visa");
	const [card, setCard] = useState<GeneratedCard | null>(null);

	function handleGenerate() {
		setCard(generateCreditCard(selectedBrand));
	}

	return (
		<LayoutB
			form={
				<div className="rounded-md border border-border bg-card overflow-hidden">
					<div className="divide-y divide-border">
						<div className="p-4">
							<SectionLabel>Configuração</SectionLabel>
							<div className="mt-3 space-y-3">
								<div className="space-y-2">
									<Label htmlFor="card-brand">Bandeira</Label>
									<div className="flex flex-wrap gap-2">
										{BRAND_KEYS.map((key) => (
											<button
												key={key}
												type="button"
												onClick={() => setSelectedBrand(key)}
												className={`rounded px-4 py-1.5 text-sm font-medium transition-colors ${
													selectedBrand === key
														? "bg-primary text-primary-foreground"
														: "border border-border bg-background text-foreground hover:bg-secondary"
												}`}
											>
												{CARD_BRANDS[key].label}
											</button>
										))}
									</div>
								</div>
								<Button onClick={handleGenerate}>
									<Shuffle />
									Gerar Cartão
								</Button>
							</div>
						</div>
						<div className="p-4">
							<p className="text-sm text-muted-foreground">
								Quer validar um número de cartão?{" "}
								<Link
									href="/ferramentas/validador-de-cartao-de-credito"
									className="text-primary underline underline-offset-4 hover:opacity-80"
								>
									Use o Validador de Cartão de Crédito
								</Link>
							</p>
						</div>
					</div>
				</div>
			}
			result={
				card ? (
					<div className="space-y-4">
						<CardPreview card={card} />
						<div>
							<SectionLabel>Dados gerados</SectionLabel>
						</div>
						<div className="space-y-2">
							<ResultRow
								label="Número"
								value={
									<span className="font-mono text-foreground">
										{formatCardNumber(card.number, card.brand)}
									</span>
								}
								action={
									<CopyButton
										variant="secondary"
										text={card.number}
										iconOnly
										size="icon-sm"
									/>
								}
							/>
							<ResultRow
								label="Validade"
								value={
									<span className="font-mono text-foreground">
										{card.expiry}
									</span>
								}
								action={
									<CopyButton
										variant="secondary"
										text={card.expiry}
										iconOnly
										size="icon-sm"
									/>
								}
							/>
							<ResultRow
								label="CVV"
								value={
									<span className="font-mono text-foreground">{card.cvv}</span>
								}
								action={
									<CopyButton
										variant="secondary"
										text={card.cvv}
										iconOnly
										size="icon-sm"
									/>
								}
							/>
						</div>
						<div className="border-t border-border pt-4">
							<CopyButton
								text={`Número: ${card.number}\nValidade: ${card.expiry}\nCVV: ${card.cvv}`}
								label="Copiar Dados"
								variant="outline"
								size="sm"
								className="w-full"
							/>
						</div>
					</div>
				) : (
					<div className="flex flex-col items-center justify-center gap-2 p-6 text-center min-h-48">
						<p className="text-sm text-muted-foreground">
							Configure e clique em Gerar
						</p>
					</div>
				)
			}
		/>
	);
}
