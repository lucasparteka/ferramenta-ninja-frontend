import PageWrapper from "@/components/page-wrapper";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calculadora de Adicional Noturno | Portal Floripa Empregos",
  description:
    "Calcule o valor do seu adicional noturno de forma simples e rápida. Veja quanto você deve receber a mais pelo trabalho realizado à noite, conforme a legislação trabalhista.",
  keywords: [
    "adicional noturno",
    "calculadora adicional noturno",
    "trabalho noturno",
    "hora noturna",
    "salário adicional",
    "CLT",
    "direitos trabalhistas",
  ],
  alternates: {
    canonical:
      "https://portalfloripaempregos.com.br/calculadora-adicional-noturno",
  },
  openGraph: {
    title: "Calculadora de Adicional Noturno | Portal Floripa Empregos",
    description:
      "Calcule o valor do seu adicional noturno de forma simples e rápida. Veja quanto você deve receber a mais pelo trabalho realizado à noite, conforme a legislação trabalhista.",
    url: "https://portalfloripaempregos.com.br/calculadora-adicional-noturno",
    siteName: "Floripa Empregos",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: "https://portalfloripaempregos.com.br/images/og-floripa-empregos.png",
        width: 1200,
        height: 630,
        alt: "Floripa Empregos — Vagas de Emprego em Florianópolis e Região",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Calculadora de Adicional Noturno | Portal Floripa Empregos",
    description:
      "Calcule o valor do seu adicional noturno de forma simples e rápida. Veja quanto você deve receber a mais pelo trabalho realizado à noite, conforme a legislação trabalhista.",
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
