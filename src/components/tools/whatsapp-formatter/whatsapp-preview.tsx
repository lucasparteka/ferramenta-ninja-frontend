import { CheckCheck, User } from "lucide-react";

type WhatsAppPreviewProps = {
	text: string;
};

function parseInline(text: string): React.ReactNode[] {
	const regex = /(\*[^*\n]+\*|_[^_\n]+_|~[^~\n]+~|`[^`\n]+`)/g;
	const parts: React.ReactNode[] = [];
	let lastIndex = 0;
	let match: RegExpExecArray | null;

	while ((match = regex.exec(text)) !== null) {
		if (match.index > lastIndex) {
			parts.push(text.slice(lastIndex, match.index));
		}

		const raw = match[0];
		const inner = raw.slice(1, -1);
		const key = match.index;
		const innerNodes = parseInline(inner);

		if (raw.startsWith("*")) {
			parts.push(<strong key={key}>{innerNodes}</strong>);
		} else if (raw.startsWith("_")) {
			parts.push(<em key={key}>{innerNodes}</em>);
		} else if (raw.startsWith("~")) {
			parts.push(<del key={key}>{innerNodes}</del>);
		} else if (raw.startsWith("`")) {
			parts.push(
				<code
					key={key}
					className="rounded bg-black/10 px-0.5 font-mono text-[0.85em]"
				>
					{innerNodes}
				</code>,
			);
		}

		lastIndex = match.index + raw.length;
	}

	if (lastIndex < text.length) {
		parts.push(text.slice(lastIndex));
	}

	return parts.length > 0 ? parts : [text];
}

function renderWhatsAppText(text: string): React.ReactNode {
	const lines = text.split("\n");
	return lines.map((line, index) => (
		<span key={index}>
			{parseInline(line)}
			{index < lines.length - 1 && <br />}
		</span>
	));
}

export function WhatsAppPreview({ text }: WhatsAppPreviewProps) {
	return (
		<div className="flex flex-col overflow-hidden rounded-lg border border-border">
			<div
				className="flex items-center gap-3 px-4 py-3"
				style={{ backgroundColor: "#075e54" }}
			>
				<div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white/20">
					<User className="size-5 text-white" />
				</div>
				<div>
					<p className="text-sm font-semibold text-white">Seu contato</p>
					<p className="text-xs text-white/70">online</p>
				</div>
			</div>

			<div
				className="flex min-h-[280px] flex-1 flex-col justify-end p-4"
				style={{ backgroundColor: "#efeae2" }}
			>
				{text ? (
					<div className="flex justify-end">
						<div
							className="max-w-[85%] rounded-lg rounded-tr-none px-3 py-2 shadow-sm"
							style={{ backgroundColor: "#dcf8c6" }}
						>
							<p
								className="text-sm leading-relaxed break-words"
								style={{ color: "#111b21" }}
							>
								{renderWhatsAppText(text)}
							</p>
							<div className="mt-1 flex items-center justify-end gap-1">
								<span className="text-xs" style={{ color: "#667781" }}>
									12:34
								</span>
								<CheckCheck className="size-3.5" style={{ color: "#53bdeb" }} />
							</div>
						</div>
					</div>
				) : (
					<div className="flex flex-1 items-center justify-center">
						<p className="text-center text-sm text-muted-foreground">
							A pré-visualização aparecerá aqui
						</p>
					</div>
				)}
			</div>
		</div>
	);
}
