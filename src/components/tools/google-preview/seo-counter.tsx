"use client";

type Props = {
	label: string;
	length: number;
	min: number;
	max: number;
	status: "empty" | "short" | "good" | "long";
};

function getStatusLabel(status: Props["status"]) {
	if (status === "good") return "Ideal";
	if (status === "short") return "Muito curto";
	if (status === "long") return "Muito longo";
	return "Vazio";
}

function getBarColor(status: Props["status"]) {
	if (status === "good") return "bg-green-500";
	if (status === "short") return "bg-yellow-500";
	if (status === "long") return "bg-red-500";
	return "bg-muted-foreground/20";
}

function getStatusColor(status: Props["status"]) {
	if (status === "good") return "text-green-600";
	if (status === "short") return "text-yellow-600";
	if (status === "long") return "text-red-600";
	return "text-muted-foreground";
}

export function SeoCounter({ label, length, min, max, status }: Props) {
	const percentage = Math.min((length / max) * 100, 100);

	return (
		<div className="flex flex-col gap-1.5 text-xs">
			<div className="flex items-center justify-between">
				<span className="text-muted-foreground">
					{label}:{" "}
					<span className={getStatusColor(status)}>
						{getStatusLabel(status)}
					</span>
				</span>
				<span className="tabular-nums text-muted-foreground">
					{length} / {max}
				</span>
			</div>

			<div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
				<div
					className={`h-full rounded-full transition-all ${getBarColor(status)}`}
					style={{ width: `${percentage}%` }}
				/>
			</div>

			<span className="text-muted-foreground">
				Recomendado: {min}–{max} caracteres
			</span>
		</div>
	);
}
