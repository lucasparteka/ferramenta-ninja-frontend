import { Checkbox } from "@/components/ui/checkbox";

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
		<div className="flex flex-wrap gap-x-6 gap-y-3">
		<div className="flex items-center gap-2">
			<Checkbox
				id="ignore-case"
				checked={options.ignoreCase}
				onCheckedChange={() => handleToggle("ignoreCase")}
			/>
			<label htmlFor="ignore-case" className="cursor-pointer text-sm text-foreground">
				Ignorar maiúsculas e minúsculas
			</label>
		</div>
		<div className="flex items-center gap-2">
			<Checkbox
				id="trim-whitespace"
				checked={options.trimWhitespace}
				onCheckedChange={() => handleToggle("trimWhitespace")}
			/>
			<label htmlFor="trim-whitespace" className="cursor-pointer text-sm text-foreground">
				Remover espaços
			</label>
		</div>
		<div className="flex items-center gap-2">
			<Checkbox
				id="sort-asc"
				checked={options.sortOrder === "asc"}
				onCheckedChange={() => handleSortOrder("asc")}
			/>
			<label htmlFor="sort-asc" className="cursor-pointer text-sm text-foreground">
				Ordenar resultados de A-Z
			</label>
		</div>
		<div className="flex items-center gap-2">
			<Checkbox
				id="sort-desc"
				checked={options.sortOrder === "desc"}
				onCheckedChange={() => handleSortOrder("desc")}
			/>
			<label htmlFor="sort-desc" className="cursor-pointer text-sm text-foreground">
				Ordenar resultados de Z-A
			</label>
		</div>
		</div>
	);
}
