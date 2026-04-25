import type { Metadata } from 'next'
import { DM_Sans, Quicksand } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils";
import { buildMetadata, organizationSchema, websiteSchema } from '@/lib/seo';
import StructuredData from '@/components/StructuredData';
import CookieConsent from '@/components/CookieConsent';


// Quicksand para Headings (geometría redondeada similar a Aristotelica, pero con soporte completo de números)
const quicksand = Quicksand({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
});

// DM Sans como body text
const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = buildMetadata({
  title: 'Biocultor | Té de humus de lombriz premium en España',
  description:
    'Compra té de humus de lombriz premium en España para huerto urbano, olivar, cítricos, viveros y jardinería profesional.',
  keywords: [
    'té de humus de lombriz',
    'comprar té de humus de lombriz',
    'humus líquido',
    'abono orgánico líquido',
    'té de lombriz españa',
    'fertilizante ecológico',
  ],
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning className={cn("antialiased scroll-smooth", dmSans.variable, quicksand.variable)}>
      <body className="bg-background text-foreground min-h-screen flex flex-col selection:bg-primary/20 selection:text-primary font-sans">
        <StructuredData id="organization-schema" data={organizationSchema()} />
        <StructuredData id="website-schema" data={websiteSchema()} />
        <ThemeProvider>
          {children}
        </ThemeProvider>
        <CookieConsent />
      </body>
    </html>
  )
}
