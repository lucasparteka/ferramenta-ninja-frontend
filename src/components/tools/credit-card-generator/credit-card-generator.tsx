"use client";

import { RefreshCw } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { CopyButton } from "@/components/shared/copy-button";
import { Button } from "@/components/ui/button";
import {
	CARD_BRANDS,
	formatCardNumber,
	type GeneratedCard,
	generateCreditCard,
} from "@/lib/credit-card/generate";
import { CardPreview } from "./card-preview";

const BRAND_KEYS = Object.keys(CARD_BRANDS) as Array<keyof typeof CARD_BRANDS>;

export function CreditCardGenerator() {
	const [selectedBrand, setSelectedBrand] =
		useState<keyof typeof CARD_BRANDS>("visa");
	const [card, setCard] = useState<GeneratedCard | null>(null);

	function handleGenerate() {
		setCard(generateCreditCard(selectedBrand));
	}

	return (
		<div className="space-y-6">
			<div className="space-y-2">
				<label
					htmlFor="card-brand"
					className="text-sm font-medium text-foreground"
				>
					Bandeira
				</label>
				<div className="flex flex-wrap gap-2">
					{BRAND_KEYS.map((key) => (
						<button
							key={key}
							type="button"
							onClick={() => setSelectedBrand(key)}
							className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
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

			<Button onClick={handleGenerate} className="gap-1.5">
				<RefreshCw className="size-4" />
				Gerar Cartão
			</Button>

			{card && (
				<div className="space-y-6">
					<CardPreview card={card} />

					<div className="space-y-3">
						<h3 className="text-sm font-medium text-foreground">
							Dados gerados
						</h3>
						<ul className="space-y-2">
							{[
								{
									label: "Número",
									value: formatCardNumber(card.number, card.brand),
									raw: card.number,
								},
								{
									label: "Validade",
									value: card.expiry,
									raw: card.expiry,
								},
								{
									label: "CVV",
									value: card.cvv,
									raw: card.cvv,
								},
							].map(({ label, value, raw }) => (
								<li
									key={label}
									className="flex items-center justify-between gap-3 rounded-lg border border-border bg-secondary px-4 py-3"
								>
									<div>
										<span className="text-xs text-muted-foreground">
											{label}
										</span>
										<p className="font-mono text-sm text-foreground">{value}</p>
									</div>
									<CopyButton text={raw} iconOnly size="icon-sm" />
								</li>
							))}
						</ul>
					</div>
				</div>
			)}

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
	);
}
