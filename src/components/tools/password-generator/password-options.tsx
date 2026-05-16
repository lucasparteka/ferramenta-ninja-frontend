import { Checkbox } from "@/components/ui/checkbox";
import { NumberInput } from "@/components/shared/number-input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/shared/slider";

type PasswordConfig = {
	length: number;
	uppercase: boolean;
	lowercase: boolean;
	numbers: boolean;
	symbols: boolean;
};

type CheckboxOption = {
	key: keyof Omit<PasswordConfig, "length">;
	label: string;
};

type PasswordOptionsProps = {
	config: PasswordConfig;
	onChange: (config: PasswordConfig) => void;
};

const checkboxOptions: CheckboxOption[] = [
	{ key: "uppercase", label: "Maiúsculas" },
	{ key: "lowercase", label: "Minúsculas" },
	{ key: "numbers", label: "Números" },
	{ key: "symbols", label: "Símbolos" },
];

export function PasswordOptions({ config, onChange }: PasswordOptionsProps) {
	function handleLength(value: number) {
		const clamped = Math.min(64, Math.max(4, Number.isNaN(value) ? 4 : value));
		onChange({ ...config, length: clamped });
	}

	function handleToggle(key: keyof Omit<PasswordConfig, "length">) {
		onChange({ ...config, [key]: !config[key] });
	}

	const isValid =
		config.uppercase || config.lowercase || config.numbers || config.symbols;

	return (
		<div className="space-y-4">
			<div className="space-y-1.5">
				<div className="flex items-center justify-between">
					<Label
						htmlFor="password-length"
						className="text-xs font-medium text-foreground"
					>
						Tamanho
					</Label>
					<span className="font-mono text-[11px] text-muted-foreground">
						{config.length}
					</span>
				</div>
				<Slider
					id="password-length"
					min={4}
					max={64}
					value={[config.length]}
					onValueChange={(v) => handleLength(v[0])}
				/>
			</div>

			<div className="flex items-center gap-2">
				<Label
					htmlFor="password-length-num"
					className="text-xs text-muted-foreground"
				>
					Ou digite:
				</Label>
				<NumberInput
					id="password-length-num"
					value={config.length}
					onChange={(v) => handleLength(v)}
					min={4}
					max={64}
					className="h-8 w-16 text-center"
					aria-label="Tamanho da senha em caracteres"
				/>
			</div>

			<div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
				{checkboxOptions.map((option) => (
					<div
						key={option.key}
						className="flex items-center gap-2 rounded-md border border-border bg-card p-2.5 transition-colors hover:border-foreground/20"
					>
						<Checkbox
							id={`password-opt-${option.key}`}
							checked={config[option.key]}
							onCheckedChange={() => handleToggle(option.key)}
						/>
						<Label
							htmlFor={`password-opt-${option.key}`}
							className="cursor-pointer text-xs"
						>
							{option.label}
						</Label>
					</div>
				))}
			</div>

			{!isValid && (
				<div
					className="rounded-md border border-destructive/30 bg-destructive/5 p-3"
					role="alert"
				>
					<p className="text-xs text-destructive">
						Selecione pelo menos um tipo de caractere
					</p>
				</div>
			)}
		</div>
	);
}
