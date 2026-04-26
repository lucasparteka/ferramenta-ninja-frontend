type JsonLdProps = {
	data: Record<string, unknown> | Record<string, unknown>[];
};

export function JsonLd({ data }: JsonLdProps) {
	const json = JSON.stringify(data).replace(/</g, "\\u003c");
	return (
		<script
			type="application/ld+json"
			// biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD payload sanitized via JSON.stringify + escaping
			dangerouslySetInnerHTML={{ __html: json }}
		/>
	);
}
