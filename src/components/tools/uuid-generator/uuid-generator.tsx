"use client";

import { RefreshCw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { CopyButton } from "@/components/shared/copy-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	generateMultipleUuids,
	NAMESPACE_VALUES,
	type UuidNamespace,
	type UuidVersion,
} from "@/lib/uuid/generate";

const VERSIONS: { value: UuidVersion; label: string }[] = [
	{ value: "v1", label: "v1" },
	{ value: "v3", label: "v3" },
	{ value: "v4", label: "v4" },
	{ value: "v5", label: "v5" },
];

const NAMESPACES: { value: UuidNamespace; label: string }[] = [
	{ value: "dns", label: "DNS" },
	{ value: "url", label: "URL" },
	{ value: "custom", label: "Personalizado" },
];

const VERSION_DESCRIPTIONS: Record<UuidVersion, string> = {
	v1: "Baseado em data/hora e endereço MAC. Cada UUID gerado é único no tempo.",
	v3: "Baseado em namespace e nome usando hash MD5. O mesmo par namespace + nome sempre gera o mesmo UUID.",
	v4: "Completamente aleatório. Versão mais utilizada para identificadores únicos.",
	v5: "Baseado em namespace e nome usando hash SHA-1. O mesmo par namespace + nome sempre gera o mesmo UUID.",
};

export function UuidGenerator() {
	const [selectedVersion, setSelectedVersion] = useState<UuidVersion>("v4");
	const [quantity, setQuantity] = useState(1);
	const [name, setName] = useState("");
	const [namespaceType, setNamespaceType] = useState<UuidNamespace>("dns");
	const [customNamespace, setCustomNamespace] = useState("");
	const [uuids, setUuids] = useState<string[]>([]);

	const needsNameInput = selectedVersion === "v3" || selectedVersion === "v5";

	function resolveNamespace(): string {
		if (namespaceType === "custom") return customNamespace;
		return NAMESPACE_VALUES[namespaceType];
	}

	function handleGenerate() {
		if (
			needsNameInput &&
			namespaceType === "custom" &&
			!customNamespace.trim()
		) {
			toast.error("Informe um UUID de namespace personalizado.");
			return;
		}
		const namespace = resolveNamespace();
		const generated = generateMultipleUuids(quantity, selectedVersion, {
			name,
			namespace,
		});
		setUuids(generated);
	}

	function handleQuantity(raw: string) {
		const value = Number(raw);
		if (!Number.isNaN(value)) setQuantity(Math.min(100, Math.max(1, value)));
	}

	return (
		<div className="space-y-6">
			<div className="space-y-4">
				<div className="space-y-2">
					<Label>Versão</Label>
					<div className="flex flex-wrap gap-2">
						{VERSIONS.map(({ value, label }) => (
							<button
								key={value}
								type="button"
								onClick={() => {
									setSelectedVersion(value);
									setUuids([]);
								}}
								className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
									selectedVersion === value
										? "bg-primary text-primary-foreground"
										: "border border-border bg-background text-foreground hover:bg-secondary"
								}`}
							>
								{label}
							</button>
						))}
					</div>
					<p className="text-sm text-muted-foreground">
						{VERSION_DESCRIPTIONS[selectedVersion]}
					</p>
				</div>

				{needsNameInput && (
					<div className="space-y-4 rounded-lg border border-border p-4">
						<div className="space-y-2">
							<Label>Namespace</Label>
							<div className="flex flex-wrap gap-2">
								{NAMESPACES.map(({ value, label }) => (
									<button
										key={value}
										type="button"
										onClick={() => setNamespaceType(value)}
										className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
											namespaceType === value
												? "bg-primary text-primary-foreground"
												: "border border-border bg-background text-foreground hover:bg-secondary"
										}`}
									>
										{label}
									</button>
								))}
							</div>
							{namespaceType !== "custom" && (
								<p className="font-mono text-xs text-muted-foreground">
									{NAMESPACE_VALUES[namespaceType]}
								</p>
							)}
						</div>

						{namespaceType === "custom" && (
							<div className="space-y-1">
								<Label htmlFor="uuid-namespace">UUID do namespace</Label>
								<Input
									id="uuid-namespace"
									type="text"
									value={customNamespace}
									onChange={(e) => setCustomNamespace(e.target.value)}
									placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
									className="font-mono"
								/>
							</div>
						)}

						<div className="space-y-1">
							<Label htmlFor="uuid-name">Nome</Label>
							<Input
								id="uuid-name"
								type="text"
								value={name}
								onChange={(e) => setName(e.target.value)}
								placeholder="Digite o nome para gerar o UUID"
							/>
						</div>
					</div>
				)}

				{!needsNameInput && (
					<div className="space-y-1">
						<Label htmlFor="uuid-quantity">Quantidade</Label>
						<Input
							id="uuid-quantity"
							type="number"
							min={1}
							max={100}
							value={quantity}
							onChange={(e) => handleQuantity(e.target.value)}
							className="w-24"
						/>
						<p className="text-xs text-muted-foreground">
							Máximo de 100 UUIDs por vez
						</p>
					</div>
				)}
			</div>

			<Button onClick={handleGenerate} className="gap-1.5">
				<RefreshCw className="size-4" />
				Gerar UUID
			</Button>

			{uuids.length > 0 && (
				<div className="space-y-3">
					{uuids.length > 1 && (
						<div className="flex items-center justify-between">
							<span className="text-sm text-muted-foreground">
								{uuids.length} UUIDs gerados
							</span>
							<CopyButton
								text={uuids.join("\n")}
								label="Copiar todos"
							/>
						</div>
					)}
					<ul className="space-y-2">
						{uuids.map((uuid) => (
							<li
								key={uuid}
								className="flex items-center justify-between gap-3 rounded-lg border border-border bg-secondary/40 px-4 py-2.5"
							>
								<span className="font-mono text-sm text-foreground">
									{uuid}
								</span>
								<CopyButton text={uuid} iconOnly size="icon-sm" />
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
}
