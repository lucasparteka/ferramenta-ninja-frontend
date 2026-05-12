import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type PickerOptions = {
	winnersCount: number;
	allowRepeat: boolean;
	removeEmpty: boolean;
};

type RandomPickerOptionsProps = {
	options: PickerOptions;
	maxWinners: number;
	onChange: (options: PickerOptions) => void;
};

export function RandomPickerOptions({
	options,
	maxWinners,
	onChange,
}: RandomPickerOptionsProps) {
	function set<K extends keyof PickerOptions>(key: K, value: PickerOptions[K]) {
		onChange({ ...options, [key]: value });
	}

	function handleWinnersCount(raw: string) {
		const value = Number(raw);
		if (!Number.isNaN(value) && value >= 1) {
			set("winnersCount", Math.min(maxWinners, value));
		}
	}

	return (
		<div className="space-y-4">
			<div className="space-y-2">
				<Label htmlFor="winners-count">Quantidade de vencedores</Label>
				<Input
					id="winners-count"
					type="number"
					min={1}
					max={maxWinners}
					value={options.winnersCount}
					onChange={(e) => handleWinnersCount(e.target.value)}
					className="w-24"
				/>
			</div>

			<div className="flex flex-wrap gap-x-6 gap-y-3">
				<div className="flex items-center gap-2">
					<Checkbox
						id="allow-repeat"
						checked={options.allowRepeat}
						onCheckedChange={(checked) => set("allowRepeat", checked === true)}
					/>
					<Label htmlFor="allow-repeat" className="cursor-pointer">
						Permitir repetição
					</Label>
				</div>

				<div className="flex items-center gap-2">
					<Checkbox
						id="remove-empty"
						checked={options.removeEmpty}
						onCheckedChange={(checked) => set("removeEmpty", checked === true)}
					/>
					<Label htmlFor="remove-empty" className="cursor-pointer">
						Ignorar linhas vazias
					</Label>
				</div>
			</div>
		</div>
	);
}
