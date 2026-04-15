"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getDescriptionStatus, getTitleStatus } from "@/lib/seo/seo-preview";
import { SeoCounter } from "./seo-counter";

type PreviewData = {
	title: string;
	description: string;
	url: string;
	keyword: string;
};

type Props = {
	data: PreviewData;
	onChange: (data: PreviewData) => void;
};

export function GooglePreviewInput({ data, onChange }: Props) {
	const { title, description, url, keyword } = data;

	const titleStatus = getTitleStatus(title.length);
	const descStatus = getDescriptionStatus(description.length);

	function update(partial: Partial<PreviewData>) {
		onChange({ ...data, ...partial });
	}

	return (
		<div className="flex flex-col gap-6">
			<div className="flex flex-col gap-2">
				<Label htmlFor="preview-title">Título (title tag)</Label>
				<Input
					id="preview-title"
					placeholder="Título da página"
					value={title}
					onChange={(e) => update({ title: e.target.value })}
				/>
				<SeoCounter
					label="Título"
					length={title.length}
					min={30}
					max={60}
					status={titleStatus}
				/>
			</div>

			<div className="flex flex-col gap-2">
				<Label htmlFor="preview-description">Meta descrição</Label>
				<Textarea
					id="preview-description"
					placeholder="Descrição da página para os mecanismos de busca"
					value={description}
					onChange={(e) => update({ description: e.target.value })}
					className="min-h-20 resize-none"
				/>
				<SeoCounter
					label="Descrição"
					length={description.length}
					min={120}
					max={160}
					status={descStatus}
				/>
			</div>

			<div className="flex flex-col gap-2">
				<Label htmlFor="preview-url">URL da página</Label>
				<Input
					id="preview-url"
					type="url"
					placeholder="https://seusite.com/pagina"
					value={url}
					onChange={(e) => update({ url: e.target.value })}
				/>
			</div>

			<div className="flex flex-col gap-2">
				<Label htmlFor="preview-keyword">Palavra-chave (opcional)</Label>
				<Input
					id="preview-keyword"
					placeholder="palavra-chave para destacar no resultado"
					value={keyword}
					onChange={(e) => update({ keyword: e.target.value })}
				/>
			</div>
		</div>
	);
}
