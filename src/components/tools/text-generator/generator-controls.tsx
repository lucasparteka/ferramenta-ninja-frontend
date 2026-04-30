import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/select-native";

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
				<NativeSelect
					id="generator-type"
					value={options.type}
					onChange={(e) => set("type", e.target.value as GeneratorType)}
				>
					<option value="lorem">Lorem Ipsum</option>
					<option value="random">Texto aleatório</option>
				</NativeSelect>
			</div>

			<div className="space-y-2">
				<label
					htmlFor="generator-quantity"
					className="text-sm font-medium text-foreground"
				>
					Quantidade
				</label>
				<Input
					id="generator-quantity"
					type="number"
					min={1}
					max={100}
					value={options.quantity}
					onChange={(e) => handleQuantity(e.target.value)}
				/>
			</div>

			<div className="space-y-2">
				<label
					htmlFor="generator-unit"
					className="text-sm font-medium text-foreground"
				>
					Formato
				</label>
				<NativeSelect
					id="generator-unit"
					value={options.unit}
					onChange={(e) => set("unit", e.target.value as UnitType)}
				>
					<option value="words">Palavras</option>
					<option value="sentences">Frases</option>
					<option value="paragraphs">Parágrafos</option>
				</NativeSelect>
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
