import { Button } from "@/components/ui/button";

type Transformation = {
	key: string;
	label: string;
};

type TextActionsProps = {
	onTransform: (key: string) => void;
	disabled: boolean;
};

const transformations: Transformation[] = [
	{ key: "uppercase", label: "MAIÚSCULO" },
	{ key: "lowercase", label: "minúsculo" },
	{ key: "capitalize", label: "Capitalizar" },
	{ key: "removeExtraSpaces", label: "Remover espaços extras" },
	{ key: "removeAccents", label: "Remover acentos" },
	{ key: "reverseText", label: "Inverter texto" },
];

export function TextActions({ onTransform, disabled }: TextActionsProps) {
	return (
		<div className="flex flex-wrap gap-2">
			{transformations.map((transformation) => (
				<Button
					key={transformation.key}
					variant="outline"
					size="sm"
					onClick={() => onTransform(transformation.key)}
					disabled={disabled}
				>
					{transformation.label}
				</Button>
			))}
		</div>
	);
}
