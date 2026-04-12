import PageWrapper from "@/components/page-wrapper";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calculadora de Salário Líquido | Portal Floripa Empregos",
  description:
    "Calcule seu salário líquido com base no salário bruto, número de dependentes e descontos. Descubra quanto realmente vai para o seu bolso.",
  keywords: [
    "salário líquido",
    "calculadora salário",
    "descontos INSS",
    "IRRF",
    "trabalhista",
    "folha de pagamento",
    "calculadora salário Florianópolis",
    "salário líquido SC",
  ],
  openGraph: {
    title: "Calculadora de Salário Líquido",
    description:
      "Veja quanto você realmente recebe após impostos e descontos. Calculadora gratuita e atualizada.",
    url: "https://portalfloripaempregos.com.br/calculadora-salario-liquido",
    siteName: "Portal Floripa Empregos",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: "https://portalfloripaempregos.com.br/images/og-floripa-empregos.png",
        width: 1200,
        height: 630,
        alt: "Calculadora de Salário Líquido — Floripa Empregos",
      },
    ],
  },
  alternates: {
    canonical:
      "https://portalfloripaempregos.com.br/calculadora-salario-liquido",
  },
  twitter: {
    card: "summary_large_image",
    title: "Calculadora de Salário Líquido",
    description:
      "Veja quanto você realmente recebe após impostos e descontos. Calculadora gratuita e atualizada.",
    images: [
      "https://portalfloripaempregos.com.br/images/og-floripa-empregos.png",
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <PageWrapper>
      <div className="content spacing">{children}</div>
    </PageWrapper>
  );
}
