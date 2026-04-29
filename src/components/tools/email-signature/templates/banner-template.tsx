import { SocialIcons } from "../social-icons";
import type { EmailSignatureData } from "../types";

function spacingValue(spacing: EmailSignatureData["spacing"]): number {
	switch (spacing) {
		case "compact":
			return 4;
		case "spacious":
			return 16;
		default:
			return 8;
	}
}

export function BannerTemplate(data: EmailSignatureData) {
	const sp = spacingValue(data.spacing);
	return (
		<div
			className="font-sans text-foreground"
			style={{ fontSize: data.fontSize, maxWidth: 520 }}
		>
			{data.bannerUrl && (
				<img
					src={data.bannerUrl}
					alt={data.company || "Banner"}
					className="mb-2 h-20 w-full rounded object-cover"
				/>
			)}
			{data.greeting && (
				<p className="mb-2 text-muted-foreground">{data.greeting}</p>
			)}
			<div className="flex items-start justify-between gap-4">
				<div>
					<div style={{ marginBottom: sp }}>
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
				</div>
				{data.logoUrl && (
					<img
						src={data.logoUrl}
						alt={data.company || "Logo"}
						className="h-10 object-contain"
					/>
				)}
			</div>
			{data.socials.length > 0 && (
				<div style={{ marginTop: sp }}>
					<SocialIcons socials={data.socials} color={data.secondaryColor} />
				</div>
			)}
			{data.ctaText && (
				<div style={{ marginTop: sp }}>
					<a
						href={data.ctaUrl || "#"}
						className="inline-block rounded px-4 py-1.5 text-white no-underline"
						style={{ backgroundColor: data.primaryColor }}
					>
						{data.ctaText}
					</a>
				</div>
			)}
			{data.includeDisclaimer && data.disclaimerText && (
				<p className="mt-3 max-w-md text-xs text-muted-foreground">
					{data.disclaimerText}
				</p>
			)}
		</div>
	);
}
