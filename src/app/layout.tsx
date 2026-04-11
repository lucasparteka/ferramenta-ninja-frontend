import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import { Toaster } from 'sonner';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://ferramenta.ninja'),
  title: {
    default: 'Ferramenta Ninja — Ferramentas Online Gratuitas',
    template: '%s | Ferramenta Ninja',
  },
  description:
    'Ferramentas online gratuitas para desenvolvedores e profissionais. Conversores, formatadores, geradores e muito mais.',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://ferramenta.ninja',
    siteName: 'Ferramenta Ninja',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="flex min-h-screen flex-col bg-background text-foreground antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
