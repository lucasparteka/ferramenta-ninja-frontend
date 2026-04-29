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

export function ClassicTemplate(data: EmailSignatureData) {
	const sp = spacingValue(data.spacing);
	return (
		<table
			cellPadding={0}
			cellSpacing={0}
			border={0}
			style={{
				fontFamily: "Arial, Helvetica, sans-serif",
				fontSize: data.fontSize,
			}}
		>
			<tbody>
				{data.greeting && (
					<tr>
						<td style={{ paddingBottom: sp, color: "#374151" }}>
							{data.greeting}
						</td>
					</tr>
				)}
				<tr>
					<td style={{ paddingBottom: sp }}>
						<strong
							style={{
								color: data.primaryColor,
								fontSize: data.fontSize + 2,
							}}
						>
							{data.fullName}
						</strong>
						<br />
						<span style={{ color: data.secondaryColor }}>
							{data.jobTitle}
							{data.company && `, ${data.company}`}
						</span>
					</td>
				</tr>
				<tr>
					<td style={{ paddingBottom: sp }}>
						{data.email && (
							<div>
								<a
									href={`mailto:${data.email}`}
									style={{ color: data.secondaryColor, textDecoration: "none" }}
								>
									{data.email}
								</a>
							</div>
						)}
						{data.phone && (
							<div style={{ color: data.secondaryColor }}>{data.phone}</div>
						)}
						{data.mobile && (
							<div style={{ color: data.secondaryColor }}>{data.mobile}</div>
						)}
						{data.website && (
							<div>
								<a
									href={data.website}
									target="_blank"
									rel="noopener noreferrer"
									style={{
										color: data.primaryColor,
										textDecoration: "none",
									}}
								>
									{data.website}
								</a>
							</div>
						)}
						{data.address && (
							<div style={{ color: data.secondaryColor }}>{data.address}</div>
						)}
					</td>
				</tr>
				{data.socials.length > 0 && (
					<tr>
						<td style={{ paddingBottom: sp }}>
							<SocialIcons socials={data.socials} color={data.secondaryColor} />
						</td>
					</tr>
				)}
				{data.ctaText && (
					<tr>
						<td style={{ paddingBottom: sp }}>
							<a
								href={data.ctaUrl || "#"}
								style={{
									display: "inline-block",
									padding: "6px 14px",
									backgroundColor: data.primaryColor,
									color: "#fff",
									textDecoration: "none",
									borderRadius: 4,
								}}
							>
								{data.ctaText}
							</a>
						</td>
					</tr>
				)}
				{data.includeDisclaimer && data.disclaimerText && (
					<tr>
						<td>
							<p
								style={{
									fontSize: Math.max(10, data.fontSize - 2),
									color: "#9ca3af",
									maxWidth: 480,
								}}
							>
								{data.disclaimerText}
							</p>
						</td>
					</tr>
				)}
			</tbody>
		</table>
	);
}
