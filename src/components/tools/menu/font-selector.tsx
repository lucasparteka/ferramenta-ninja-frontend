import { NativeSelect } from "@/components/ui/select-native";
import { MENU_FONT_OPTIONS } from "@/lib/menu/fonts";

type FontSelectorProps = {
	value: string;
	onChange: (value: string) => void;
};

export function FontSelector({ value, onChange }: FontSelectorProps) {
	return (
		<NativeSelect value={value} onChange={(e) => onChange(e.target.value)}>
			{MENU_FONT_OPTIONS.map((font) => (
				<option key={font.id} value={font.id}>
					{font.label}
				</option>
			))}
		</NativeSelect>
	);
}
