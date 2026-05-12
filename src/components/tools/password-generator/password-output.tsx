import { CopyButton } from "@/components/shared/copy-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type PasswordOutputProps = {
	password: string;
};

export function PasswordOutput({ password }: PasswordOutputProps) {
	return (
		<div className="space-y-2">
			<Label htmlFor="password-output">Senha gerada</Label>
			<div className="flex gap-2">
				<Input
					id="password-output"
					type="text"
					readOnly
					value={password}
					placeholder='Clique em "Gerar senha"'
					className="flex-1 font-mono"
				/>
				<CopyButton
					text={password}
					label="Copiar"
					disabled={!password}
					variant="outline"
				/>
			</div>
		</div>
	);
}
