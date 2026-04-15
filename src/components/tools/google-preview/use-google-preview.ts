"use client";

import { useState } from "react";

export function useGooglePreview() {
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [url, setUrl] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	async function fetchFromUrl() {
		if (!url) return;

		setLoading(true);
		setError(null);

		try {
			const res = await fetch(`/api/fetch-meta?url=${encodeURIComponent(url)}`);
			const data = await res.json();

			if (!res.ok) {
				throw new Error(data.error || "Erro ao buscar dados");
			}

			setTitle(data.title);
			setDescription(data.description);
		} catch (err) {
			if (err instanceof Error) {
				setError(err.message);
			} else {
				setError("Erro inesperado");
			}
		} finally {
			setLoading(false);
		}
	}

	return {
		title,
		description,
		url,
		loading,
		error,
		setTitle,
		setDescription,
		setUrl,
		fetchFromUrl,
	};
}
