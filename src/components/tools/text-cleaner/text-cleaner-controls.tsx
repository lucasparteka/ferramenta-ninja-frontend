"use client";

import { CopyButton } from "@/components/shared/copy-button";

type Props = {
	result: string;
};

export function TextCleanerControls({ result }: Props) {
	return (
		<div className="flex gap-2">
			{result && (
				<CopyButton text={result} label="Copiar" variant="outline" className="gap-1.5" />
			)}
		</div>
	);
}
