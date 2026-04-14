type GeneratorType = "lorem" | "random";
type UnitType = "words" | "sentences" | "paragraphs";

type GeneratorOptions = {
	type: GeneratorType;
	quantity: number;
	unit: UnitType;
	startWithLorem: boolean;
};

type GeneratorControlsProps = {
	options: GeneratorOptions;
	onChange: (options: GeneratorOptions) => void;
};

const selectClass =
	"w-full rounded-lg border border-border bg-input px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring";

export function GeneratorControls({
	options,
	onChange,
}: GeneratorControlsProps) {
	function set<K extends keyof GeneratorOptions>(
		key: K,
		value: GeneratorOptions[K],
	) {
		onChange({ ...options, [key]: value });
	}

	function handleQuantity(raw: string) {
		const value = Number(raw);
		if (!Number.isNaN(value)) {
			set("quantity", Math.min(100, Math.max(1, value)));
		}
	}

	return (
		<div className="grid gap-4 sm:grid-cols-3">
			<div className="space-y-2">
				<label
					htmlFor="generator-type"
					className="text-sm font-medium text-foreground"
				>
					Tipo de texto
				</label>
				<select
					id="generator-type"
					value={options.type}
					onChange={(e) => set("type", e.target.value as GeneratorType)}
					className={selectClass}
				>
					<option value="lorem">Lorem Ipsum</option>
					<option value="random">Texto aleatório</option>
				</select>
			</div>

			<div className="space-y-2">
				<label
					htmlFor="generator-quantity"
					className="text-sm font-medium text-foreground"
				>
					Quantidade
				</label>
				<input
					id="generator-quantity"
					type="number"
					min={1}
					max={100}
					value={options.quantity}
					onChange={(e) => handleQuantity(e.target.value)}
					className={selectClass}
				/>
			</div>

			<div className="space-y-2">
				<label
					htmlFor="generator-unit"
					className="text-sm font-medium text-foreground"
				>
					Formato
				</label>
				<select
					id="generator-unit"
					value={options.unit}
					onChange={(e) => set("unit", e.target.value as UnitType)}
					className={selectClass}
				>
					<option value="words">Palavras</option>
					<option value="sentences">Frases</option>
					<option value="paragraphs">Parágrafos</option>
				</select>
			</div>

			{options.type === "lorem" && (
				<div className="sm:col-span-3">
					<label className="flex cursor-pointer items-center gap-2">
						<input
							type="checkbox"
							checked={options.startWithLorem}
							onChange={(e) => set("startWithLorem", e.target.checked)}
							className="accent-primary"
						/>
						<span className="text-sm text-foreground">
							Começar com "Lorem ipsum dolor sit amet..."
						</span>
					</label>
				</div>
			)}
		</div>
	);
}
