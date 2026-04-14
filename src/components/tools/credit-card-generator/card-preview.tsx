import {
	formatCardNumber,
	type GeneratedCard,
} from "@/lib/credit-card/generate";

type CardPreviewProps = {
	card: GeneratedCard;
};

const brandGradients: Record<string, string> = {
	visa: "from-blue-700 to-blue-500",
	mastercard: "from-red-600 to-orange-400",
	amex: "from-emerald-700 to-emerald-500",
	elo: "from-yellow-500 to-yellow-300",
	hipercard: "from-red-900 to-red-700",
};

const brandTextColor: Record<string, string> = {
	elo: "text-gray-900",
};

export function CardPreview({ card }: CardPreviewProps) {
	const gradient = brandGradients[card.brand] ?? "from-gray-700 to-gray-500";
	const textColor = brandTextColor[card.brand] ?? "text-white";
	const formatted = formatCardNumber(card.number, card.brand);

	return (
		<div
			className={`relative w-full max-w-sm rounded-2xl bg-linear-to-br ${gradient} p-6 shadow-xl`}
			style={{ aspectRatio: "1.586" }}
		>
			<div className="flex h-full flex-col justify-between">
				<div className="flex items-start justify-between">
					<div
						className="h-8 w-10 rounded-md border border-white/30 bg-yellow-300/80"
						aria-hidden="true"
					>
						<div className="mt-2 ml-1 h-3 w-3 rounded-sm bg-yellow-500/60" />
					</div>
					<span
						className={`text-sm font-semibold tracking-wide ${textColor} opacity-90`}
					>
						{card.brandLabel}
					</span>
				</div>

				<div
					className={`font-mono text-xl font-bold tracking-widest ${textColor}`}
				>
					{formatted}
				</div>

				<div className="flex items-end justify-between">
					<div>
						<p
							className={`text-xs uppercase tracking-widest ${textColor} opacity-60`}
						>
							Validade
						</p>
						<p className={`font-mono text-sm font-semibold ${textColor}`}>
							{card.expiry}
						</p>
					</div>
					<div className="text-right">
						<p
							className={`text-xs uppercase tracking-widest ${textColor} opacity-60`}
						>
							CVV
						</p>
						<p className={`font-mono text-sm font-semibold ${textColor}`}>
							{card.cvv}
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
