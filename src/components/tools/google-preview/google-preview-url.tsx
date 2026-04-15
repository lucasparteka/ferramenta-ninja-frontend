"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
	onLoad: (data: {
		title: string;
		description: string;
		url: string;
		keyword: string;
	}) => void;
};

export function GooglePreviewUrl({ onLoad }: Props) {
	const [url, setUrl] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	async function handleFetch() {
		if (!url) return;

		setLoading(true);
		setError("");

		try {
			const res = await fetch("/api/google-preview", {
				method: "POST",
				body: JSON.stringify({ url }),
			});

			const data = await res.json();

			if (!res.ok) {
				throw new Error(data.error || "Erro ao buscar URL");
			}

			onLoad(data);
		} catch {
			setError("Não foi possível analisar o site");
		} finally {
			setLoading(false);
		}
	}

	function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
		if (e.key === "Enter") handleFetch();
	}

	return (
		<div className="flex flex-col gap-2">
			<Label htmlFor="url-import">Importar dados de uma URL</Label>
			<div className="flex gap-2">
				<Input
					id="url-import"
					type="url"
					placeholder="https://seusite.com"
					value={url}
					onChange={(e) => setUrl(e.target.value)}
					onKeyDown={handleKeyDown}
				/>
				<Button
					type="button"
					onClick={handleFetch}
					disabled={loading || !url}
					className="shrink-0"
				>
					{loading ? "Buscando..." : "Buscar"}
				</Button>
			</div>
			{error && <span className="text-sm text-destructive">{error}</span>}
		</div>
	);
}
