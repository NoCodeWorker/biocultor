export const siteConfig = {
  name: 'Biocultor',
  legalName: 'Biocultor Shop',
  alternateName: 'Biocultor Shop',
  description:
    'Té de humus de lombriz elaborado en España para huerto urbano, olivar, cítricos y jardinería profesional.',
  locale: 'es-ES',
  country: 'ES',
  currency: 'EUR',
  defaultUrl: 'https://biocultor.com',
  supportEmail: 'soporte@biocultor.com',
  supportPhone: '+34 900 123 456',
  city: 'Santa Cruz de la Zarza',
  region: 'Toledo',
  brandLogoPng: '/brand-biocultor-logo-1200.png',
  defaultOgImage: '/brand-biocultor-og.png',
  productSlug: 'te-humus-liquido-premium',
  socials: [
    'https://www.instagram.com/biocultorshop',
    'https://www.linkedin.com/company/biocultor',
    'https://www.facebook.com/biocultorshop'
  ]
} as const;

export function getBaseUrl() {
  return process.env.NEXT_PUBLIC_APP_URL || siteConfig.defaultUrl;
}
