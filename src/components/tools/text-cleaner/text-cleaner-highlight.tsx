"use client";

type Props = {
	text: string;
};

function highlight(text: string) {
	return text
		.replace(/ /g, "·")
		.replace(/\n/g, "↵\n")
		.replace(/\t/g, "⇥")
		.replace(/[\u200B-\u200D\uFEFF]/g, "⟡");
}

export function TextCleanerHighlight({ text }: Props) {
	const formatted = highlight(text);

	return (
		<div className="rounded-md border p-4">
			<pre className="whitespace-pre-wrap font-mono text-sm text-muted-foreground">
				{formatted}
			</pre>
		</div>
	);
}
