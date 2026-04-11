export type ResumeTemplateData = {
  name: string;
  headline: string;
  email: string;
  phone: string;
  location?: string;
  summary?: string;
  photoUrl?: string | null;
  socialLinks?: { platform: string; url: string }[];
  experiences?: {
    role: string;
    company: string;
    location?: string;
    startDate: string; // "YYYY-MM"
    endDate?: string;  // "YYYY-MM"
    isCurrent: boolean;
    description?: string;
  }[];
  education?: {
    institution: string;
    degree: string;
    field?: string;
    startYear: string;  // "YYYY"
    endYear?: string;   // "YYYY"
    isCurrent: boolean;
    description?: string;
  }[];
  skills?: { name: string }[];
  languages?: { name: string; level: string }[];
};
