import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

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
	{ key: "uppercase", label: "Letras maiúsculas" },
	{ key: "lowercase", label: "Letras minúsculas" },
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

	return (
		<div className="space-y-6">
			<div className="space-y-3">
				<div className="flex items-center justify-between">
					<label
						htmlFor="password-length"
						className="text-sm font-medium text-foreground"
					>
						Tamanho da senha
					</label>
					<Input
						type="number"
						value={config.length}
						min={4}
						max={64}
						onChange={(e) => handleLength(Number(e.target.value))}
						className="w-16 text-center text-foreground"
						aria-label="Tamanho da senha em caracteres"
					/>
				</div>
				<input
					id="password-length"
					type="range"
					min={4}
					max={64}
					value={config.length}
					onChange={(e) => handleLength(Number(e.target.value))}
					className="w-full accent-primary"
				/>
			</div>

			<div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
			{checkboxOptions.map((option) => (
				<div
					key={option.key}
					className="flex items-center gap-2 rounded-lg border border-border bg-secondary p-3 transition-colors hover:border-primary"
				>
					<Checkbox
						id={`password-opt-${option.key}`}
						checked={config[option.key]}
						onCheckedChange={() => handleToggle(option.key)}
					/>
					<label
						htmlFor={`password-opt-${option.key}`}
						className="cursor-pointer text-sm text-foreground"
					>
						{option.label}
					</label>
				</div>
			))}
			</div>
		</div>
	);
}
