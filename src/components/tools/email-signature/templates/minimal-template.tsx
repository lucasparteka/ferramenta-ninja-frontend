import { SocialIcons } from "../social-icons";
import type { EmailSignatureData } from "../types";

function spacingClass(spacing: EmailSignatureData["spacing"]): string {
	switch (spacing) {
		case "compact":
			return "space-y-1";
		case "spacious":
			return "space-y-4";
		default:
			return "space-y-2";
	}
}

export function MinimalTemplate(data: EmailSignatureData) {
	const sp = spacingClass(data.spacing);
	return (
		<div
			className={`font-sans text-foreground ${sp}`}
			style={{ fontSize: data.fontSize }}
		>
			{data.greeting && (
				<p className="text-muted-foreground">{data.greeting}</p>
			)}
			<div>
				<p
					className="font-bold"
					style={{
						fontSize: data.fontSize + 2,
						color: data.primaryColor,
					}}
				>
					{data.fullName}
				</p>
				<p style={{ color: data.secondaryColor }}>
					{data.jobTitle}
					{data.department && ` — ${data.department}`}
					{data.company && ` | ${data.company}`}
				</p>
			</div>
			<div className="flex flex-wrap gap-x-3 gap-y-1 text-sm">
				{data.email && (
					<a
						href={`mailto:${data.email}`}
						style={{ color: data.secondaryColor }}
					>
						{data.email}
					</a>
				)}
				{data.phone && (
					<span style={{ color: data.secondaryColor }}>{data.phone}</span>
				)}
				{data.mobile && (
					<span style={{ color: data.secondaryColor }}>{data.mobile}</span>
				)}
				{data.website && (
					<a
						href={data.website}
						target="_blank"
						rel="noopener noreferrer"
						style={{ color: data.primaryColor }}
					>
						{data.website}
					</a>
				)}
				{data.address && (
					<span style={{ color: data.secondaryColor }}>{data.address}</span>
				)}
			</div>
			{data.socials.length > 0 && (
				<SocialIcons socials={data.socials} color={data.secondaryColor} />
			)}
			{data.ctaText && (
				<a
					href={data.ctaUrl || "#"}
					className="inline-block rounded px-4 py-1.5 text-white no-underline"
					style={{ backgroundColor: data.primaryColor }}
				>
					{data.ctaText}
				</a>
			)}
			{data.includeDisclaimer && data.disclaimerText && (
				<p className="max-w-md text-xs text-muted-foreground">
					{data.disclaimerText}
				</p>
			)}
		</div>
	);
}
