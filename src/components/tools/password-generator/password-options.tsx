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
					<input
						type="number"
						value={config.length}
						min={4}
						max={64}
						onChange={(e) => handleLength(Number(e.target.value))}
						className="w-16 rounded-lg border border-border bg-input px-2 py-1 text-center text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
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
					<label
						key={option.key}
						className="flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-secondary p-3 transition-colors hover:border-primary"
					>
						<input
							type="checkbox"
							checked={config[option.key]}
							onChange={() => handleToggle(option.key)}
							className="accent-primary"
						/>
						<span className="text-sm text-foreground">{option.label}</span>
					</label>
				))}
			</div>
		</div>
	);
}
