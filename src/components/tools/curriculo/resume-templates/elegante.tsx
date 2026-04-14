import { ExternalLink, Mail, MapPin, Phone } from "lucide-react";
import type { ResumeTemplateData } from "./types";

function formatMonthYear(yyyyMM: string): string {
	if (!yyyyMM) return "";
	const [year, month] = yyyyMM.split("-");
	const labels = [
		"jan.",
		"fev.",
		"mar.",
		"abr.",
		"mai.",
		"jun.",
		"jul.",
		"ago.",
		"set.",
		"out.",
		"nov.",
		"dez.",
	];
	const m = parseInt(month, 10);
	if (isNaN(m) || m < 1 || m > 12) return year;
	return `${labels[m - 1]} ${year}`;
}

function Section({
	title,
	children,
}: {
	title: string;
	children: React.ReactNode;
}) {
	return (
		<section className="section">
			<div className="flex items-center gap-3 mb-3">
				<h2 className="text-xs font-semibold uppercase tracking-widest shrink-0">
					{title}
				</h2>
				<div
					className="flex-1 h-px opacity-40"
					style={{ backgroundColor: "var(--accent)" }}
				/>
			</div>
			{children}
		</section>
	);
}

export function EleganteTemplate({
	data,
	color,
	fontVar,
	fontZoom,
}: {
	data: ResumeTemplateData;
	color?: string;
	fontVar?: string;
	fontZoom?: number;
}) {
	const hasExperiences = !!data.experiences?.length;
	const hasEducation = !!data.education?.length;
	const hasSkills = !!data.skills?.length;
	const hasLanguages = !!data.languages?.length;
	const hasSocialLinks = !!data.socialLinks?.length;
	const hasSummary = !!data.summary;

	return (
		<div
			className="bg-white w-full text-base px-10 pt-10 pb-10"
			style={
				{
					"--accent": color ?? "#1b3a5c",
					fontFamily: fontVar ? `var(${fontVar})` : "var(--font-inter)",
					zoom: fontZoom,
				} as React.CSSProperties
			}
		>
			<div className="flex items-start justify-between gap-6 mb-7">
				{data.photoUrl ? (
					// eslint-disable-next-line @next/next/no-img-element
					<img
						src={data.photoUrl}
						alt={data.name}
						className="w-[68px] h-[68px] rounded-full object-cover border shrink-0"
						style={{ borderColor: "var(--accent)", opacity: 0.4 }}
					/>
				) : (
					<div />
				)}

				<div className="text-right">
					<h1 className="text-2xl font-semibold leading-tight tracking-tight">
						{data.name}
					</h1>
					{data.headline && (
						<p className="text-base mt-1 italic opacity-80">{data.headline}</p>
					)}
					<div className="flex flex-wrap justify-end gap-x-4 gap-y-2 mt-3 text-sm opacity-80">
						{data.location && (
							<span className="flex items-center gap-2">
								<MapPin size={14} style={{ color: "var(--accent)" }} />
								{data.location}
							</span>
						)}
						{data.phone && (
							<span className="flex items-center gap-2">
								<Phone size={14} style={{ color: "var(--accent)" }} />
								{data.phone}
							</span>
						)}
						{data.email && (
							<span className="flex items-center gap-2">
								<Mail size={14} style={{ color: "var(--accent)" }} />
								{data.email}
							</span>
						)}
						{hasSocialLinks &&
							data.socialLinks!.map((link, i) => (
								<span key={i} className="flex items-center gap-2">
									<ExternalLink size={14} style={{ color: "var(--accent)" }} />
									{link.url.replace(/^https?:\/\/(www\.)?/, "")}
								</span>
							))}
					</div>
				</div>
			</div>

			<div className="space-y-6">
				{hasSummary && (
					<Section title="Resumo">
						<p className="text-base leading-relaxed opacity-90">
							{data.summary}
						</p>
					</Section>
				)}
				{hasExperiences && (
					<Section title="Experiência Profissional">
						<div className="space-y-5">
							{data.experiences!.map((exp, i) => (
								<div
									key={i}
									className="pdf-item flex items-start justify-between gap-4"
								>
									<div className="flex-1 min-w-0">
										<p className="font-semibold text-base leading-snug">
											{exp.role}
										</p>
										<p className="text-sm mt-1 opacity-80">
											{exp.company}
											{exp.location ? <span> · {exp.location}</span> : null}
										</p>
										{exp.description && (
											<p className="text-sm mt-2 leading-relaxed whitespace-pre-line opacity-90">
												{exp.description}
											</p>
										)}
									</div>
									<p
										className="text-sm shrink-0 mt-1 whitespace-nowrap text-right font-medium"
										style={{ color: "var(--accent)" }}
									>
										{formatMonthYear(exp.startDate)} –{" "}
										{exp.isCurrent
											? "Atual"
											: formatMonthYear(exp.endDate || "")}
									</p>
								</div>
							))}
						</div>
					</Section>
				)}
				{hasEducation && (
					<Section title="Formação Acadêmica">
						<div className="space-y-4">
							{data.education!.map((edu, i) => (
								<div
									key={i}
									className="pdf-item flex items-start justify-between gap-4"
								>
									<div className="flex-1 min-w-0">
										<p className="font-semibold text-base leading-snug">
											{edu.degree}
											{edu.field ? (
												<span className="font-normal"> — {edu.field}</span>
											) : null}
										</p>
										<p className="text-sm mt-1 opacity-80">{edu.institution}</p>
										{edu.description && (
											<p className="text-sm mt-2 leading-relaxed opacity-90">
												{edu.description}
											</p>
										)}
									</div>
									<p
										className="text-sm shrink-0 whitespace-nowrap text-right font-medium"
										style={{ color: "var(--accent)" }}
									>
										{edu.startYear} –{" "}
										{edu.isCurrent ? "Atual" : edu.endYear || ""}
									</p>
								</div>
							))}
						</div>
					</Section>
				)}
				{(hasSkills || hasLanguages) && (
					<Section title="Habilidades e Idiomas">
						<div className="flex gap-10 text-sm">
							{hasSkills && (
								<div className="flex-1 space-y-2">
									{data.skills!.map((s, i) => (
										<div key={i} className="flex items-center gap-2">
											<div
												className="w-px h-4 shrink-0"
												style={{ backgroundColor: "var(--accent)" }}
											/>
											{s.name}
										</div>
									))}
								</div>
							)}
							{hasLanguages && (
								<div className="flex-1 space-y-2">
									{data.languages!.map((l, i) => (
										<div key={i} className="flex items-center gap-2">
											<div
												className="w-px h-4 shrink-0"
												style={{ backgroundColor: "var(--accent)" }}
											/>
											<span>{l.name}</span>
											<span className="opacity-70">— {l.level}</span>
										</div>
									))}
								</div>
							)}
						</div>
					</Section>
				)}
			</div>
		</div>
	);
}
