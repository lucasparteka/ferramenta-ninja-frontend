import { Button } from "@/components/ui/button";

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
				<input
					id="password-output"
					type="text"
					readOnly
					value={password}
					placeholder='Clique em "Gerar senha"'
					className="flex-1 rounded-lg border border-border bg-input px-4 py-2 font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
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
