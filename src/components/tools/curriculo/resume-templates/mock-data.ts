import type { ResumeTemplateData } from "./types"

export const RESUME_MOCK_DATA: ResumeTemplateData = {
  name: "Carolina Mendes",
  headline: "Analista de Marketing Digital",
  email: "carolina.mendes@email.com.br",
  phone: "(48) 99812-3456",
  location: "Florianópolis, SC",
  summary:
    "Profissional com 6 anos de experiência em marketing digital, especializada em estratégias de conteúdo, SEO e gestão de campanhas pagas. Apaixonada por dados e storytelling, com histórico comprovado de crescimento orgânico e geração de leads qualificados para empresas de médio e grande porte.",
  photoUrl: null,
  socialLinks: [
    { platform: "LinkedIn", url: "https://linkedin.com/in/carolinamendes" },
    { platform: "Portfólio", url: "https://carolinamendes.com.br" },
  ],
  experiences: [
    {
      role: "Analista de Marketing Digital Sênior",
      company: "Agência Impacto Digital",
      location: "Florianópolis, SC",
      startDate: "2021-03",
      endDate: "",
      isCurrent: true,
      description:
        "Gestão de campanhas de mídia paga (Google Ads e Meta Ads) com budget mensal de R$ 80 mil.\nAumento de 140% no tráfego orgânico em 12 meses por meio de estratégia de SEO e conteúdo.\nLiderança de equipe com 4 pessoas, garantindo entregas alinhadas aos OKRs dos clientes.",
    },
    {
      role: "Analista de Conteúdo e SEO",
      company: "StartupSC Tecnologia",
      location: "Florianópolis, SC",
      startDate: "2018-08",
      endDate: "2021-02",
      isCurrent: false,
      description:
        "Criação de estratégia de blog e produção de mais de 200 artigos otimizados para SEO.\nRedução de 35% no custo por lead por meio de testes A/B em landing pages.\nImplementação de automações de e-mail marketing com taxa de abertura acima de 28%.",
    },
  ],
  education: [
    {
      institution: "Universidade Federal de Santa Catarina",
      degree: "Bacharelado",
      field: "Comunicação Social — Publicidade e Propaganda",
      startYear: "2013",
      endYear: "2017",
      isCurrent: false,
      description: "",
    },
  ],
  skills: [
    { name: "Google Ads" },
    { name: "Meta Ads" },
    { name: "SEO On & Off-Page" },
    { name: "Google Analytics 4" },
    { name: "RD Station" },
    { name: "Copywriting" },
  ],
  languages: [
    { name: "Português", level: "Nativo" },
    { name: "Inglês", level: "Avançado" },
  ],
}
