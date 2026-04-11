import type {
  CompanyProfileResponse,
  JobsResponse,
  ResumesResponse,
  ResumeEducationResponse,
  ResumeExperienceResponse,
  AbuseReportResponse,
  ContactResponse,
} from "./pocketbase-types";

// Re-export PocketBase response types for new collections
export type {
  ResumesResponse,
  ResumeEducationResponse,
  ResumeExperienceResponse,
  AbuseReportResponse,
  ContactResponse,
};

export type AuthUser = {
  avatar: string;
  collectionId: string;
  collectionName: string;
  created: string;
  email: string;
  emailVisibility: boolean;
  id: string;
  name: string;
  updated: string;
  username: string;
  verified: boolean;
};

// Derived from PocketBase generated types — source of truth: src/types/pocketbase-types.ts
export type CompanyProfile = CompanyProfileResponse;

export type Job = Omit<
  JobsResponse,
  | "employment_type"
  | "work_mode"
  | "application_type"
  | "category"
  | "status"
  | "expand"
  | "company_name"
  | "location"
  | "url"
  | "company_profile"
> & {
  employment_type: EmploymentType;
  work_mode: WorkMode;
  application_type: ApplicationType;
  category: JobCategory;
  status: JobStatus;
  // These fields are optional in the PocketBase schema; restored from Required<>
  company_name?: string;
  location?: string;
  url?: string;
  company_profile?: string;
  expand?: {
    company_profile?: CompanyProfile;
  };
};

// Fields that can be written when creating/updating a Job (excludes PocketBase system fields)
export type JobInput = Omit<Job, "id" | "collectionId" | "collectionName" | "created" | "updated" | "expand">;

export type JobUpdate = Partial<JobInput> & { id: string };

export type JobFilters = {
  q?: string;
  locations?: LOCATIONS[] | string[];
  categories?: JobCategory[] | string[];
  employmentTypes?: EmploymentType[] | string[];
  workModes?: WorkMode[] | string[];
  companyUserId?: string;
  status?: JobStatus;
};

export type FetchJobOptions = {
  page?: number;
  perPage?: number;
  filters?: JobFilters;
  sort?: string;
};

export enum EmploymentType {
  CLT = "CLT",
  PJ = "PJ",
  TEMPORARY = "TEMPORARY",
  CONTRACT = "CONTRACT",
  INTERNSHIP = "INTERNSHIP",
  FREELANCE = "FREELANCE",
  PCD = "PCD",
  JOVEM_APRENDIZ = "JOVEM_APRENDIZ",
}

export enum JobStatus {
  ACTIVE = "ACTIVE",
  PENDING = "PENDING",
  PAUSED = "PAUSED",
  FINALIZED = "FINALIZED",
}

export enum WorkMode {
  REMOTE = "REMOTE",
  HYBRID = "HYBRID",
  ON_SITE = "ON_SITE",
}

export enum ApplicationType {
  EMAIL = "EMAIL",
  URL = "URL",
  PHONE = "PHONE",
}

export enum JobCategory {
  ADMINISTRATIVE = "ADMINISTRATIVE",
  AGRICULTURE = "AGRICULTURE",
  CUSTOMER_SERVICE = "CUSTOMER_SERVICE",
  CONSTRUCTION = "CONSTRUCTION",
  DESIGN = "DESIGN",
  GENERAL_SERVICES = "GENERAL_SERVICES",
  EDUCATION = "EDUCATION",
  ENGINEERING = "ENGINEERING",
  ENVIRONMENTAL = "ENVIRONMENTAL",
  FINANCE = "FINANCE",
  FOOD = "FOOD",
  HEALTHCARE = "HEALTHCARE",
  HOSPITALITY = "HOSPITALITY",
  HUMAN_RESOURCES = "HUMAN_RESOURCES",
  INDUSTRY = "INDUSTRY",
  INSURANCE = "INSURANCE",
  LEGAL = "LEGAL",
  LOGISTICS = "LOGISTICS",
  MANAGEMENT = "MANAGEMENT",
  MAINTENANCE_INSTALLATION = "MAINTENANCE_INSTALLATION",
  MANUFACTURING = "MANUFACTURING",
  MARKETING = "MARKETING",
  MEDIA = "MEDIA",
  PUBLIC_ADMINISTRATION = "PUBLIC_ADMINISTRATION",
  REAL_ESTATE = "REAL_ESTATE",
  RETAIL = "RETAIL",
  OTHER = "OTHER",
  SALES = "SALES",
  SECURITY = "SECURITY",
  SOCIAL_SERVICES = "SOCIAL_SERVICES",
  SPORTS = "SPORTS",
  SUPPLY_CHAIN = "SUPPLY_CHAIN",
  TECHNOLOGY = "TECHNOLOGY",
  TOURISM = "TOURISM",
  TRANSPORTATION = "TRANSPORTATION",
  WAREHOUSE = "WAREHOUSE",
}

export const WORK_MODE_LABELS: Record<WorkMode, string> = {
  [WorkMode.HYBRID]: "Híbrido",
  [WorkMode.ON_SITE]: "Presencial",
  [WorkMode.REMOTE]: "Remoto",
};

export const EMPLOYMENT_TYPE_LABELS: Record<EmploymentType, string> = {
  [EmploymentType.CLT]: "CLT",
  [EmploymentType.CONTRACT]: "Contrato",
  [EmploymentType.FREELANCE]: "Freelance",
  [EmploymentType.INTERNSHIP]: "Estágio",
  [EmploymentType.PCD]: "PCD",
  [EmploymentType.PJ]: "PJ",
  [EmploymentType.TEMPORARY]: "Temporário",
  [EmploymentType.JOVEM_APRENDIZ]: "Jovem Aprendiz",
};

export const JOB_STATUS_LABELS: Record<JobStatus, string> = {
  [JobStatus.ACTIVE]: "Ativa",
  [JobStatus.FINALIZED]: "Finalizada",
  [JobStatus.PAUSED]: "Pausada",
  [JobStatus.PENDING]: "Aguardando Aprovação",
};

export const JOB_CATEGORY_LABELS: Record<JobCategory, string> = {
  [JobCategory.PUBLIC_ADMINISTRATION]: "Administração Pública",
  [JobCategory.ADMINISTRATIVE]: "Administrativo",
  [JobCategory.AGRICULTURE]: "Agronegócio",
  [JobCategory.WAREHOUSE]: "Almoxarifado, Estoque",
  [JobCategory.FOOD]: "Alimentação, Gastronomia",
  [JobCategory.CUSTOMER_SERVICE]: "Atendimento ao Cliente",
  [JobCategory.SUPPLY_CHAIN]: "Compras, Suprimentos",
  [JobCategory.CONSTRUCTION]: "Construção, Obras",
  [JobCategory.SALES]: "Comercial, Vendas",
  [JobCategory.DESIGN]: "Design, Artes, Criativo",
  [JobCategory.HUMAN_RESOURCES]: "DP, Recursos Humanos",
  [JobCategory.MANAGEMENT]: "Diretoria, Gestão",
  [JobCategory.EDUCATION]: "Educação",
  [JobCategory.ENGINEERING]: "Engenharia",
  [JobCategory.SPORTS]: "Esportes",
  [JobCategory.FINANCE]: "Financeiro",
  [JobCategory.HOSPITALITY]: "Hotelaria, Hospitalidade",
  [JobCategory.REAL_ESTATE]: "Imobiliário",
  [JobCategory.INDUSTRY]: "Indústria, Fábricas",
  [JobCategory.LEGAL]: "Jurídico",
  [JobCategory.LOGISTICS]: "Logística",
  [JobCategory.MAINTENANCE_INSTALLATION]: "Manutenção, Instalação",
  [JobCategory.MARKETING]: "Marketing",
  [JobCategory.ENVIRONMENTAL]: "Meio Ambiente",
  [JobCategory.MEDIA]: "Mídia, Comunicação",
  [JobCategory.MANUFACTURING]: "Produção, Manufatura",
  [JobCategory.HEALTHCARE]: "Saúde",
  [JobCategory.SECURITY]: "Segurança",
  [JobCategory.INSURANCE]: "Seguros",
  [JobCategory.GENERAL_SERVICES]: "Serviços Gerais",
  [JobCategory.SOCIAL_SERVICES]: "Serviço Social",
  [JobCategory.TECHNOLOGY]: "Tecnologia",
  [JobCategory.TRANSPORTATION]: "Transporte",
  [JobCategory.TOURISM]: "Turismo",
  [JobCategory.RETAIL]: "Varejo",
  [JobCategory.OTHER]: "Outros",
};

export enum LOCATIONS {
  FLORIANOPOLIS = "Florianópolis",
  SAO_JOSE = "São José",
  PALHOCA = "Palhoça",
  BIGUACU = "Biguaçu",
  STO_AMARO = "Santo Amaro",
  OTHER = "Outras",
}

export const APPLICATION_VALUES: Record<string, string> = {
  URL: "Site",
  EMAIL: "E-mail",
  PHONE: "WhatsApp",
};

export type FiltersState = {
  q?: string;
  categories: JobCategory[];
  employmentTypes: EmploymentType[];
  workModes: WorkMode[];
  locations: LOCATIONS[];
};

export type JobPostingEmploymentType =
  | "FULL_TIME"
  | "PART_TIME"
  | "CONTRACT"
  | "TEMPORARY"
  | "INTERN"
  | "VOLUNTEER"
  | "PER_DIEM"
  | "OTHER";

export enum AdSenseAdSlot {
  DEFAULT = "9159199551",
  GRID = "8975366722",
}
