"use client";

import { cn } from "@/lib/utils";

type PasswordStrengthProps = {
	password: string;
};

function calculateEntropy(password: string): number {
	if (!password) return 0;

	let charsetSize = 0;
	if (/[a-z]/.test(password)) charsetSize += 26;
	if (/[A-Z]/.test(password)) charsetSize += 26;
	if (/[0-9]/.test(password)) charsetSize += 10;
	if (/[^a-zA-Z0-9]/.test(password)) charsetSize += 32;

	if (charsetSize === 0) return 0;

	return password.length * Math.log2(charsetSize);
}

type StrengthLevel = {
	label: string;
	level: number;
	barClass: string;
	textClass: string;
};

function getStrengthLevel(entropy: number): StrengthLevel {
	if (entropy < 28)
		return {
			label: "Muito fraca",
			level: 1,
			barClass: "bg-destructive",
			textClass: "text-destructive",
		};
	if (entropy < 36)
		return {
			label: "Fraca",
			level: 2,
			barClass: "bg-warning",
			textClass: "text-warning",
		};
	if (entropy < 60)
		return {
			label: "Razoável",
			level: 3,
			barClass: "bg-muted-foreground",
			textClass: "text-muted-foreground",
		};
	if (entropy < 80)
		return {
			label: "Forte",
			level: 4,
			barClass: "bg-success",
			textClass: "text-success",
		};
	return {
		label: "Muito forte",
		level: 5,
		barClass: "bg-success",
		textClass: "text-success",
	};
}

function formatBreakTime(entropy: number): string {
	const attemptsPerSecond = 1e10;
	const totalCombinations = Math.pow(2, entropy);
	const seconds = totalCombinations / attemptsPerSecond;

	if (seconds < 1) return "Instantâneo";
	if (seconds < 60) return `${Math.round(seconds)} segundos`;
	if (seconds < 3600) return `${Math.round(seconds / 60)} minutos`;
	if (seconds < 86400) return `${Math.round(seconds / 3600)} horas`;
	if (seconds < 31536000) return `${Math.round(seconds / 86400)} dias`;
	if (seconds < 31536000 * 1000)
		return `${Math.round(seconds / 31536000)} anos`;
	if (seconds < 31536000 * 1e6)
		return `${(seconds / 31536000 / 1000).toFixed(0)} mil anos`;
	if (seconds < 31536000 * 1e9)
		return `${(seconds / 31536000 / 1e6).toFixed(0)} milhões de anos`;
	return "Séculos+";
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
	const entropy = calculateEntropy(password);
	const strength = getStrengthLevel(entropy);
	const breakTime = formatBreakTime(entropy);

	return (
		<div className="border-t border-border pt-3">
			<p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
				Força
			</p>

			<div className="mb-2 flex gap-1">
				{[1, 2, 3, 4, 5].map((i) => (
					<div
						key={i}
						className={cn(
							"h-1 flex-1 rounded-full transition-colors",
							i <= strength.level ? strength.barClass : "bg-border",
						)}
					/>
				))}
			</div>

			<div className="flex items-center justify-between">
				<span className={cn("text-xs font-medium", strength.textClass)}>
					{strength.label}
				</span>
				<span className="font-mono text-[11px] text-muted-foreground">
					{Math.round(entropy)} bits
				</span>
			</div>

			<p className="mt-1 text-[11px] text-muted-foreground">
				Quebra por força bruta:{" "}
				<span className="font-mono text-foreground">{breakTime}</span>
			</p>
		</div>
	);
}
