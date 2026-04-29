import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type PasswordOutputProps = {
	password: string;
	onCopy: () => void;
	copied: boolean;
};

export function PasswordOutput({
	password,
	onCopy,
	copied,
}: PasswordOutputProps) {
	return (
		<div className="space-y-2">
			<label
				htmlFor="password-output"
				className="text-sm font-medium text-foreground"
			>
				Senha gerada
			</label>
			<div className="flex gap-2">
				<Input
					id="password-output"
					type="text"
					readOnly
					value={password}
					placeholder='Clique em "Gerar senha"'
					className="flex-1 font-mono text-foreground"
				/>
				<Button
					variant="outline"
					onClick={onCopy}
					disabled={!password}
					aria-label="Copiar senha"
				>
					{copied ? "Copiado!" : "Copiar"}
				</Button>
			</div>
			{copied && <p className="text-sm text-success">Senha copiada!</p>}
		</div>
	);
}
