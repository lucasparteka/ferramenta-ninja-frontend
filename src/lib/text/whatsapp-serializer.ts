type TiptapMark = {
	type: string;
};

type TiptapNode = {
	type: string;
	text?: string;
	marks?: TiptapMark[];
	content?: TiptapNode[];
};

function serializeInline(node: TiptapNode): string {
	if (node.type === "hardBreak") return "\n";

	if (node.type === "text") {
		let text = node.text ?? "";
		for (const mark of node.marks ?? []) {
			if (mark.type === "bold") text = `*${text}*`;
			else if (mark.type === "italic") text = `_${text}_`;
			else if (mark.type === "strike") text = `~${text}~`;
			else if (mark.type === "code") text = `\`${text}\``;
		}
		return text;
	}

	return "";
}

function serializeParagraph(node: TiptapNode): string {
	if (!node.content) return "";
	return node.content.map(serializeInline).join("");
}

export function serializeToWhatsApp(json: TiptapNode): string {
	if (!json?.content) return "";
	return json.content.map(serializeParagraph).join("\n");
}
