import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import { headers } from 'next/headers';
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
    images: [{ url: '/api/og', width: 1200, height: 630, alt: 'Ferramenta Ninja' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ferramenta Ninja — Ferramentas Online Gratuitas',
    description:
      'Ferramentas online gratuitas para desenvolvedores e profissionais. Conversores, formatadores, geradores e muito mais.',
    images: ['/api/og'],
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const isPdfRender = headersList.get('x-is-pdf-render') === '1';

  if (isPdfRender) {
    return (
      <html lang="pt-BR" className={`${inter.variable} ${spaceGrotesk.variable} bg-white`}>
        <body className="bg-white">{children}</body>
      </html>
    );
  }

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
