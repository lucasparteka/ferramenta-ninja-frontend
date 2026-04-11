import { resumeFontVars } from "@/lib/resume-fonts";

export default function ResumeBuilderLayout({ children }: { children: React.ReactNode }) {
  return <div className={resumeFontVars}>{children}</div>;
}
