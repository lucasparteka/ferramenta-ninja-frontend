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

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="mb-3 section">
      <h2 className="text-sm font-semibold uppercase tracking-widest pb-1.5 border-b">
        {title}
      </h2>
    </div>
  );
}

export function TraditionalTemplate({
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
      className="bg-white w-full text-base text-neutral-900"
      style={{
        "--accent": color ?? "#2c3e50",
        fontFamily: fontVar ? `var(${fontVar})` : "var(--font-inter)",
        zoom: fontZoom,
      } as React.CSSProperties}
    >
      <div className="px-10 pt-8 pb-7 text-white" style={{ backgroundColor: "var(--accent)" }}>
        <div className="flex items-center gap-6">
          {data.photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={data.photoUrl}
              alt={data.name}
              className="w-[72px] h-[72px] rounded-full object-cover border-2 border-white/30 shrink-0"
            />
          ) : null}
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-semibold leading-tight">{data.name}</h1>
            {data.headline && <p className="text-sm mt-1 opacity-90">{data.headline}</p>}
            <div className="flex flex-wrap gap-x-5 gap-y-1 mt-3 text-sm opacity-80">
              {data.email && (
                <span className="flex items-center gap-1.5">
                  <Mail size={14} className="shrink-0" />
                  {data.email}
                </span>
              )}
              {data.phone && (
                <span className="flex items-center gap-1.5">
                  <Phone size={14} className="shrink-0" />
                  {data.phone}
                </span>
              )}
              {data.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin size={14} className="shrink-0" />
                  {data.location}
                </span>
              )}
              {hasSocialLinks &&
                data.socialLinks!.map((link, i) => (
                  <span key={i} className="flex items-center gap-1.5">
                    <ExternalLink size={14} className="shrink-0" />
                    {link.url.replace(/^https?:\/\/(www\.)?/, "")}
                  </span>
                ))}
            </div>
          </div>
        </div>
      </div>

      <div className="px-10 py-7 space-y-6">
        {hasSummary && (
          <section className="section">
            <SectionHeader title="Perfil Profissional" />
            <p className="text-base leading-relaxed">{data.summary}</p>
          </section>
        )}

        {hasExperiences && (
          <section className="section">
            <SectionHeader title="Experiência Profissional" />
            <div className="space-y-5">
              {data.experiences!.map((exp, i) => (
                <div key={i} className="pdf-item">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="font-semibold text-base">{exp.role}</p>
                      <p className="text-sm mt-0.5 opacity-80">
                        {exp.company}
                        {exp.location ? <span> · {exp.location}</span> : null}
                      </p>
                    </div>
                    <p className="text-xs font-medium shrink-0 mt-0.5 whitespace-nowrap">
                      {formatMonthYear(exp.startDate)} –{" "}
                      {exp.isCurrent ? "Atual" : formatMonthYear(exp.endDate || "")}
                    </p>
                  </div>
                  {exp.description && (
                    <p className="text-sm mt-2 leading-relaxed whitespace-pre-line">
                      {exp.description}
                    </p>
                  )}
                  {i < data.experiences!.length - 1 && <div className="border-b border-dashed mt-4" />}
                </div>
              ))}
            </div>
          </section>
        )}

        {hasEducation && (
          <section className="section">
            <SectionHeader title="Formação Acadêmica" />
            <div className="space-y-5">
              {data.education!.map((edu, i) => (
                <div key={i} className="pdf-item">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="font-semibold text-base">
                        {edu.degree}
                        {edu.field ? <span className="font-normal"> — {edu.field}</span> : null}
                      </p>
                      <p className="text-sm mt-0.5 opacity-80">{edu.institution}</p>
                    </div>
                    <p className="text-xs font-medium shrink-0 mt-0.5 whitespace-nowrap">
                      {edu.startYear} – {edu.isCurrent ? "Atual" : edu.endYear || ""}
                    </p>
                  </div>
                  {edu.description && <p className="text-sm mt-2 leading-relaxed">{edu.description}</p>}
                  {i < data.education!.length - 1 && <div className="border-b border-dashed mt-4" />}
                </div>
              ))}
            </div>
          </section>
        )}

        {(hasSkills || hasLanguages) && (
          <div className={hasSkills && hasLanguages ? "grid grid-cols-2 gap-8" : ""}>
            {hasSkills && (
              <section className="section">
                <SectionHeader title="Habilidades" />
                <ul className="space-y-2 text-sm">
                  {data.skills!.map((s, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-current" />
                      {s.name}
                    </li>
                  ))}
                </ul>
              </section>
            )}
            {hasLanguages && (
              <section className="section">
                <SectionHeader title="Idiomas" />
                <ul className="space-y-2 text-sm">
                  {data.languages!.map((l, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-current" />
                      <span>{l.name}</span>
                      <span>— {l.level}</span>
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