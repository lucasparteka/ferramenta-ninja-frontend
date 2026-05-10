import type { Metadata } from "next";
import { Toaster } from "sonner";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { JsonLd } from "@/components/seo/json-ld";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { organizationSchema, websiteSchema } from "@/lib/seo/jsonld";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
	metadataBase: new URL("https://ferramenta.ninja"),
	title: {
		default: "Ferramenta Ninja — Ferramentas Online Gratuitas",
		template: "%s | Ferramenta Ninja",
	},
	description:
		"Ferramentas online gratuitas para desenvolvedores e profissionais. Conversores, formatadores, geradores e muito mais.",
	openGraph: {
		type: "website",
		locale: "pt_BR",
		url: "https://ferramenta.ninja",
		siteName: "Ferramenta Ninja",
		images: [
			{ url: "/api/og", width: 1200, height: 630, alt: "Ferramenta Ninja" },
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Ferramenta Ninja — Ferramentas Online Gratuitas",
		description:
			"Ferramentas online gratuitas para desenvolvedores e profissionais. Conversores, formatadores, geradores e muito mais.",
		images: ["/api/og"],
	},
	icons: [
		{
			rel: "icon",
			type: "image/x-icon",
			url: "/images/favicon.ico",
			href: "/images/favicon.ico",
			media: "(prefers-color-scheme: light)",
		},
		{
			rel: "icon",
			type: "image/x-icon",
			url: "/images/favicon-light.ico",
			href: "/images/favicon-light.ico",
			media: "(prefers-color-scheme: dark)",
		},
	],
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="pt-BR" className="antialiased">
			<head>
				<JsonLd data={organizationSchema()} />
				<JsonLd data={websiteSchema()} />
			</head>
			<body
				className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased min-h-screen`}
			>
				<ThemeProvider>
					<Header />
					<main className="flex-1">{children}</main>
					<Footer />
					<Toaster />
				</ThemeProvider>
			</body>
		</html>
	);
}
