import type { Metadata } from 'next'
import { DM_Sans, Quicksand } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils";
import { buildMetadata, organizationSchema, websiteSchema } from '@/lib/seo';
import StructuredData from '@/components/StructuredData';
import CookieConsentLazy from '@/components/CookieConsentLazy';


// Quicksand para Headings (geometría redondeada similar a Aristotelica, pero con soporte completo de números)
const quicksand = Quicksand({
  weight: ['500', '700'],
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
  preload: true,
  adjustFontFallback: true,
});

// DM Sans como body text
const dmSans = DM_Sans({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  preload: true,
  adjustFontFallback: true,
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
      <head>
        {/* DNS Prefetch & Preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://js.stripe.com" />
        
        {/* Preload LCP hero image with responsive support to match next/image perfectly */}
        <link
          rel="preload"
          as="image"
          href="/_next/image?url=%2Fte-de-humus-de-lombriz-biocultor.avif&w=1200&q=60"
          imageSrcSet="/_next/image?url=%2Fte-de-humus-de-lombriz-biocultor.avif&w=750&q=60 750w, /_next/image?url=%2Fte-de-humus-de-lombriz-biocultor.avif&w=1200&q=60 1200w, /_next/image?url=%2Fte-de-humus-de-lombriz-biocultor.avif&w=1920&q=60 1920w"
          imageSizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 1200px"
          type="image/avif"
          fetchPriority="high"
        />
      </head>
      <body className="bg-background text-foreground min-h-screen flex flex-col selection:bg-primary/20 selection:text-primary font-sans">
        <StructuredData id="organization-schema" data={organizationSchema()} />
        <StructuredData id="website-schema" data={websiteSchema()} />
        <ThemeProvider>
          {children}
        </ThemeProvider>
        <CookieConsentLazy />
      </body>
    </html>
  )
}
