import { Mail, Phone, MapPin, ExternalLink } from "lucide-react"
import type { ResumeTemplateData } from "./types"

function formatMonthYear(yyyyMM: string): string {
  if (!yyyyMM) return ""
  const [year, month] = yyyyMM.split("-")
  const labels = ["jan.", "fev.", "mar.", "abr.", "mai.", "jun.", "jul.", "ago.", "set.", "out.", "nov.", "dez."]
  const m = parseInt(month, 10)
  if (isNaN(m) || m < 1 || m > 12) return year
  return `${labels[m - 1]} ${year}`
}

function SectionTitle({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-2 mb-3 section">
      <span className="w-[3px] h-4 rounded-sm shrink-0" style={{ backgroundColor: "var(--accent)" }} />
      <h2 className="text-base font-semibold uppercase tracking-widest">{title}</h2>
    </div>
  )
}

export function ExecutivoTemplate({
  data,
  color,
  fontVar,
  fontZoom,
}: {
  data: ResumeTemplateData
  color?: string
  fontVar?: string
  fontZoom?: number
}) {
  const hasExperiences = !!data.experiences?.length
  const hasEducation = !!data.education?.length
  const hasSkills = !!data.skills?.length
  const hasLanguages = !!data.languages?.length
  const hasSocialLinks = !!data.socialLinks?.length
  const hasSummary = !!data.summary

  return (
    <div
      className="bg-white w-full text-base"
      style={{
        "--accent": color ?? "#4a9b8e",
        fontFamily: fontVar ? `var(${fontVar})` : "var(--font-inter)",
        zoom: fontZoom,
      } as React.CSSProperties}
    >
      <div
        className="px-9 pt-8 pb-7 flex items-center gap-6"
        style={{ backgroundColor: "color-mix(in srgb, var(--accent) 18%, #1a2a38)" }}
      >
        {data.photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={data.photoUrl}
            alt={data.name}
            className="w-[72px] h-[72px] rounded-full object-cover border-2 border-white/25 shrink-0"
          />
        ) : null}
        <div className="flex-1 min-w-0 text-white">
          <h1 className="text-2xl font-semibold leading-tight">{data.name}</h1>
          {data.headline && <p className="text-base mt-1 opacity-90">{data.headline}</p>}
          <div className="flex flex-wrap gap-x-5 gap-y-2 mt-3 text-sm opacity-80">
            {data.email && (
              <span className="flex items-center gap-1.5">
                <Mail size={14} />
                {data.email}
              </span>
            )}
            {data.phone && (
              <span className="flex items-center gap-1.5">
                <Phone size={14} />
                {data.phone}
              </span>
            )}
            {data.location && (
              <span className="flex items-center gap-1.5">
                <MapPin size={14} />
                {data.location}
              </span>
            )}
            {hasSocialLinks &&
              data.socialLinks!.map((link, i) => (
                <span key={i} className="flex items-center gap-1.5">
                  <ExternalLink size={14} />
                  {link.url.replace(/^https?:\/\/(www\.)?/, "")}
                </span>
              ))}
          </div>
        </div>
      </div>

      <div className="px-9 py-7 space-y-8">
        {hasSummary && (
          <section className="section">
            <SectionTitle title="Perfil Profissional" />
            <p className="text-base leading-relaxed opacity-90">{data.summary}</p>
          </section>
        )}
        {hasExperiences && (
          <section className="section">
            <SectionTitle title="Experiência Profissional" />
            <div className="space-y-5">
              {data.experiences!.map((exp, i) => (
                <div key={i} className="pdf-item flex gap-5">
                  <div className="w-[120px] shrink-0 pt-1 text-right">
                    <p className="text-xs font-medium leading-snug" style={{ color: "var(--accent)" }}>
                      {formatMonthYear(exp.startDate)} –{" "}
                      {exp.isCurrent ? "Atual" : formatMonthYear(exp.endDate || "")}
                    </p>
                  </div>
                  <div className="flex-1 min-w-0 border-l-2 pl-4" style={{ borderColor: "color-mix(in srgb, var(--accent) 20%, transparent)" }}>
                    <p className="font-semibold text-base">{exp.role}</p>
                    <p className="text-sm font-medium mt-0.5" style={{ color: "var(--accent)" }}>
                      {exp.company}
                      {exp.location ? <span className="opacity-70"> · {exp.location}</span> : null}
                    </p>
                    {exp.description && (
                      <ul className="mt-2 space-y-1.5">
                        {exp.description
                          .split("\n")
                          .filter(Boolean)
                          .map((line, j) => (
                            <li key={j} className="text-sm leading-relaxed flex gap-2 opacity-90 pl-4">
                              <span>{line.replace(/^[-•▸]\s*/, "")}</span>
                            </li>
                          ))}
                      </ul>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
        {hasEducation && (
          <section className="section">
            <SectionTitle title="Formação Acadêmica" />
            <div className="space-y-4">
              {data.education!.map((edu, i) => (
                <div key={i} className="pdf-item flex gap-5">
                  <div className="w-[120px] shrink-0 pt-1 text-right">
                    <p className="text-xs font-medium leading-snug" style={{ color: "var(--accent)" }}>
                      {edu.startYear} – {edu.isCurrent ? "Atual" : edu.endYear || ""}
                    </p>
                  </div>
                  <div className="flex-1 min-w-0 border-l-2 pl-4" style={{ borderColor: "color-mix(in srgb, var(--accent) 20%, transparent)" }}>
                    <p className="font-semibold text-base">
                      {edu.degree}
                      {edu.field ? <span className="font-normal"> — {edu.field}</span> : null}
                    </p>
                    <p className="text-sm font-semibold mt-0.5 opacity-80" style={{ color: "var(--accent)" }}>{edu.institution}</p>
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
                <div className="flex flex-wrap gap-2">
                  {data.skills!.map((s, i) => (
                    <span
                      key={i}
                      className="text-sm px-2.5 py-1 rounded font-medium"
                      style={{
                        backgroundColor: "color-mix(in srgb, var(--accent) 12%, white)",
                        color: "color-mix(in srgb, var(--accent) 80%, #000)",
                      }}
                    >
                      {s.name}
                    </span>
                  ))}
                </div>
              </section>
            )}
            {hasLanguages && (
              <section className="section">
                <SectionTitle title="Idiomas" />
                <ul className="space-y-2">
                  {data.languages!.map((l, i) => (
                    <li key={i}>
                      <p className="text-base font-medium">{l.name}</p>
                      <p className="text-sm opacity-70">{l.level}</p>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
