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
    <div className="mb-3 section">
      <h2 className="text-xs font-semibold uppercase tracking-widest">{title}</h2>
      <div className="h-px mt-1.5 opacity-30" style={{ backgroundColor: "var(--accent)" }} />
    </div>
  );
}

export function ModernoTemplate({
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
      className="bg-white w-full text-base px-9 pt-9 pb-9"
      style={{
        "--accent": color ?? "#c0a86e",
        fontFamily: fontVar ? `var(${fontVar})` : "var(--font-inter)",
        zoom: fontZoom,
      } as React.CSSProperties}
    >
      <div className="border-b-[3px] pb-5 mb-6" style={{ borderColor: "var(--accent)" }}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl font-semibold leading-none tracking-tight uppercase">
              {data.name}
            </h1>
            {data.headline && (
              <p className="text-base font-semibold mt-2 uppercase tracking-wide" style={{ color: "var(--accent)" }}>
                {data.headline}
              </p>
            )}
          </div>
          {data.photoUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={data.photoUrl}
              alt={data.name}
              className="w-16 rounded-full object-cover shrink-0 border-2"
              style={{ borderColor: "var(--accent)" }}
            />
          )}
        </div>

        <div className="flex flex-wrap gap-x-5 gap-y-2 mt-3 text-sm">
          {data.email && (
            <span className="flex items-center gap-2">
              <Mail size={14} style={{ color: "var(--accent)" }} />
              {data.email}
            </span>
          )}
          {data.phone && (
            <span className="flex items-center gap-2">
              <Phone size={14} style={{ color: "var(--accent)" }} />
              {data.phone}
            </span>
          )}
          {data.location && (
            <span className="flex items-center gap-2">
              <MapPin size={14} style={{ color: "var(--accent)" }} />
              {data.location}
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

      <div className="space-y-6">
        {hasSummary && (
          <section className="section">
            <SectionTitle title="Resumo" />
            <p className="text-base leading-relaxed opacity-90">{data.summary}</p>
          </section>
        )}

        {hasExperiences && (
          <section className="section">
            <SectionTitle title="Experiência Profissional" />
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
                    <p className="text-sm font-medium shrink-0 mt-0.5 whitespace-nowrap" style={{ color: "var(--accent)" }}>
                      {formatMonthYear(exp.startDate)} –{" "}
                      {exp.isCurrent ? "Atual" : formatMonthYear(exp.endDate || "")}
                    </p>
                  </div>
                  {exp.description && (
                    <ul className="mt-2 space-y-1.5">
                      {exp.description
                        .split("\n")
                        .filter(Boolean)
                        .map((line, j) => (
                          <li key={j} className="text-sm leading-relaxed flex gap-2 opacity-90">
                            <span className="shrink-0" style={{ color: "var(--accent)" }}>
                              •
                            </span>
                            <span>{line.replace(/^[-•]\s*/, "")}</span>
                          </li>
                        ))}
                    </ul>
                  )}
                  {i < data.experiences!.length - 1 && (
                    <div className="border-b border-dashed mt-4 opacity-40" />
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {hasEducation && (
          <section className="section">
            <SectionTitle title="Formação" />
            <div className="space-y-4">
              {data.education!.map((edu, i) => (
                <div key={i} className="pdf-item flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-semibold text-base">
                      {edu.degree}
                      {edu.field ? <span className="font-normal"> — {edu.field}</span> : null}
                    </p>
                    <p className="text-sm mt-0.5 opacity-80">{edu.institution}</p>
                    {edu.description && (
                      <p className="text-sm mt-2 leading-relaxed opacity-90">{edu.description}</p>
                    )}
                  </div>
                  <p className="text-sm font-medium shrink-0 whitespace-nowrap" style={{ color: "var(--accent)" }}>
                    {edu.startYear} – {edu.isCurrent ? "Atual" : edu.endYear || ""}
                  </p>
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
                      <span
                        className="w-1.5 h-1.5 shrink-0 rounded-sm"
                        style={{ backgroundColor: "var(--accent)" }}
                      />
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
                      <span
                        className="w-1.5 h-1.5 shrink-0 rounded-sm"
                        style={{ backgroundColor: "var(--accent)" }}
                      />
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