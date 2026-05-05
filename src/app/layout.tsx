import type { Metadata } from "next";
import { headers } from "next/headers";
import { Toaster } from "sonner";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { JsonLd } from "@/components/seo/json-ld";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { organizationSchema, websiteSchema } from "@/lib/seo/jsonld";
import "./globals.css";

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
			type: "image/png",
			url: "/images/favicon-light.ico",
			href: "/images/favicon-light.ico",
			media: "(prefers-color-scheme: dark)",
		},
	],
};

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const headersList = await headers();
	const isPdfRender = headersList.get("x-is-pdf-render") === "1";

	if (isPdfRender) {
		return (
			<html lang="pt-BR" className={`antialiased bg-white`}>
				<body className="bg-white">{children}</body>
			</html>
		);
	}

	return (
		<html lang="pt-BR" className={`antialiased`}>
			<head>
				<JsonLd data={organizationSchema()} />
				<JsonLd data={websiteSchema()} />
			</head>
			<body className="flex min-h-screen flex-col bg-background text-foreground antialiased">
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
