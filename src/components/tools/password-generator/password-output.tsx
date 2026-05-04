import { CopyButton } from "@/components/shared/copy-button";
import { Input } from "@/components/ui/input";

type PasswordOutputProps = {
	password: string;
};

export function PasswordOutput({
	password,
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
