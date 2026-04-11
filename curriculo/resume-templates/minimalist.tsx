import { Mail, Phone, MapPin, ExternalLink } from "lucide-react";
import type { ResumeTemplateData } from "./types";

function formatMonthYear(yyyyMM: string): string {
  if (!yyyyMM) return "";
  const [year, month] = yyyyMM.split("-");
  const labels = ["jan.", "fev.", "mar.", "abr.", "mai.", "jun.", "jul.", "ago.", "set.", "out.", "nov.", "dez."];
  const m = parseInt(month, 10);
  if (isNaN(m) || m < 1 || m > 12) return year;
  return `${labels[m - 1]} ${year}`;
}

function SectionTitle({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3 mb-3 section">
      <h2 className="text-xs font-semibold uppercase tracking-widest shrink-0">{title}</h2>
      <div className="flex-1 h-px" style={{ backgroundColor: "var(--accent)", opacity: 0.25 }} />
    </div>
  );
}

export function MinimalistTemplate({
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
      className="bg-white w-full text-base leading-relaxed px-10 pt-10 pb-10"
      style={{
        "--accent": color ?? "#1c1c1c",
        fontFamily: fontVar ? `var(${fontVar})` : "var(--font-inter)",
        zoom: fontZoom,
      } as React.CSSProperties}
    >
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-semibold leading-tight tracking-tight">
            {data.name}
          </h1>
          {data.headline && <p className="text-base mt-1 opacity-80">{data.headline}</p>}
        </div>
      </div>

      <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm mb-6 border-t border-b py-3">
        {data.email && (
          <span className="flex items-center gap-2">
            <Mail size={14} className="shrink-0 opacity-70" />
            {data.email}
          </span>
        )}
        {data.phone && (
          <span className="flex items-center gap-2">
            <Phone size={14} className="shrink-0 opacity-70" />
            {data.phone}
          </span>
        )}
        {data.location && (
          <span className="flex items-center gap-2">
            <MapPin size={14} className="shrink-0 opacity-70" />
            {data.location}
          </span>
        )}
        {hasSocialLinks &&
          data.socialLinks!.map((link, i) => (
            <span key={i} className="flex items-center gap-2">
              <ExternalLink size={14} className="shrink-0 opacity-70" />
              {link.url.replace(/^https?:\/\/(www\.)?/, "")}
            </span>
          ))}
      </div>

      <div className="space-y-6">
        {hasSummary && (
          <section className="section">
            <SectionTitle title="Perfil" />
            <p className="text-base leading-relaxed">{data.summary}</p>
          </section>
        )}

        {hasExperiences && (
          <section className="section">
            <SectionTitle title="Experiência" />
            <div className="space-y-5">
              {data.experiences!.map((exp, i) => (
                <div key={i} className="pdf-item flex gap-6">
                  <div className="w-[110px] shrink-0 pt-0.5">
                    <p className="text-sm leading-snug opacity-70">
                      {formatMonthYear(exp.startDate)}
                      <br />
                      {exp.isCurrent ? "Atual" : formatMonthYear(exp.endDate || "")}
                    </p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-base leading-snug">{exp.role}</p>
                    <p className="text-sm mt-0.5 opacity-80">
                      {exp.company}
                      {exp.location ? <span> · {exp.location}</span> : null}
                    </p>
                    {exp.description && (
                      <p className="text-sm mt-2 leading-relaxed whitespace-pre-line opacity-90">
                        {exp.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {hasEducation && (
          <section className="section">
            <SectionTitle title="Formação" />
            <div className="space-y-5">
              {data.education!.map((edu, i) => (
                <div key={i} className="pdf-item flex gap-6">
                  <div className="w-[110px] shrink-0 pt-0.5">
                    <p className="text-sm leading-snug opacity-70">
                      {edu.startYear}
                      <br />
                      {edu.isCurrent ? "Atual" : edu.endYear || ""}
                    </p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-base leading-snug">
                      {edu.degree}
                      {edu.field ? <span className="font-normal"> — {edu.field}</span> : null}
                    </p>
                    <p className="text-sm mt-0.5 opacity-80">{edu.institution}</p>
                    {edu.description && (
                      <p className="text-sm mt-2 leading-relaxed opacity-90">{edu.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {(hasSkills || hasLanguages) && (
          <div className={hasSkills && hasLanguages ? "grid grid-cols-2 gap-8" : ""}>
            {hasSkills && (
              <section className="section">
                <SectionTitle title="Habilidades" />
                <ul className="space-y-2 text-sm">
                  {data.skills!.map((s, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 shrink-0 rounded-full" style={{ backgroundColor: "var(--accent)" }} />
                      {s.name}
                    </li>
                  ))}
                </ul>
              </section>
            )}
            {hasLanguages && (
              <section className="section">
                <SectionTitle title="Idiomas" />
                <ul className="space-y-2 text-sm">
                  {data.languages!.map((l, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 shrink-0 rounded-full" style={{ backgroundColor: "var(--accent)" }} />
                      <span>{l.name}</span>
                      <span className="opacity-70">— {l.level}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}