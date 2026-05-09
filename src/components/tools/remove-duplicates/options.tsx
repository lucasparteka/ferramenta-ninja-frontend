import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

type DeduplicateOptions = {
	ignoreCase: boolean;
	trimWhitespace: boolean;
	sortOrder: "none" | "asc" | "desc";
};

type RemoveDuplicatesOptionsProps = {
	options: DeduplicateOptions;
	onChange: (options: DeduplicateOptions) => void;
};

export function RemoveDuplicatesOptions({
	options,
	onChange,
}: RemoveDuplicatesOptionsProps) {
	function handleToggle(key: "ignoreCase" | "trimWhitespace") {
		onChange({ ...options, [key]: !options[key] });
	}

	function handleSortOrder(order: "asc" | "desc") {
		onChange({
			...options,
			sortOrder: options.sortOrder === order ? "none" : order,
		});
	}

	return (
		<div className="space-y-3">
			<div className="flex items-center justify-between">
				<Label
					htmlFor="ignore-case"
					className="cursor-pointer text-xs text-muted-foreground"
				>
					Ignorar maiúsculas e minúsculas
				</Label>
				<Checkbox
					id="ignore-case"
					checked={options.ignoreCase}
					onCheckedChange={() => handleToggle("ignoreCase")}
				/>
			</div>
			<div className="flex items-center justify-between">
				<Label
					htmlFor="trim-whitespace"
					className="cursor-pointer text-xs text-muted-foreground"
				>
					Remover espaços
				</Label>
				<Checkbox
					id="trim-whitespace"
					checked={options.trimWhitespace}
					onCheckedChange={() => handleToggle("trimWhitespace")}
				/>
			</div>
			<div className="flex items-center justify-between">
				<Label
					htmlFor="sort-asc"
					className="cursor-pointer text-xs text-muted-foreground"
				>
					Ordenar A-Z
				</Label>
				<Checkbox
					id="sort-asc"
					checked={options.sortOrder === "asc"}
					onCheckedChange={() => handleSortOrder("asc")}
				/>
			</div>
			<div className="flex items-center justify-between">
				<Label
					htmlFor="sort-desc"
					className="cursor-pointer text-xs text-muted-foreground"
				>
					Ordenar Z-A
				</Label>
				<Checkbox
					id="sort-desc"
					checked={options.sortOrder === "desc"}
					onCheckedChange={() => handleSortOrder("desc")}
				/>
			</div>
		</div>
	);
}
