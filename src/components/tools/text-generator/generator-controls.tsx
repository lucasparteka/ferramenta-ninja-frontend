import { Checkbox } from "@/components/ui/checkbox";
import { NumberInput } from "@/components/shared/number-input";
import { Label } from "@/components/ui/label";
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

	return (
		<div className="grid gap-4 sm:grid-cols-3">
			<div className="space-y-2">
				<Label htmlFor="generator-type">Tipo de texto</Label>
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
				<Label htmlFor="generator-quantity">Quantidade</Label>
				<NumberInput
					id="generator-quantity"
					value={options.quantity}
					onChange={(v) => set("quantity", v)}
					min={1}
					max={100}
				/>
			</div>

			<div className="space-y-2">
				<Label htmlFor="generator-unit">Formato</Label>
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
					<div className="flex items-center gap-2">
						<Checkbox
							id="start-with-lorem"
							checked={options.startWithLorem}
							onCheckedChange={(checked) =>
								set("startWithLorem", checked === true)
							}
						/>
						<Label htmlFor="start-with-lorem" className="cursor-pointer">
							Começar com "Lorem ipsum dolor sit amet..."
						</Label>
					</div>
				</div>
			)}
		</div>
	);
}
