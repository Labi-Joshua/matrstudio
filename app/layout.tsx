import type { Metadata } from 'next'
import { Manrope, IBM_Plex_Mono } from 'next/font/google'
import './globals.css'

const manrope = Manrope({
  variable: '--font-manrope',
  subsets: ['latin'],
  display: 'swap',
})

const ibmPlexMono = IBM_Plex_Mono({
  variable: '--font-ibm-plex-mono',
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
})

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://resources.matrstudio.com'

const siteJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${BASE_URL}/#website`,
      name: 'Matr Studio',
      url: BASE_URL,
      description: 'A curated index of tools, frameworks, articles, and insights for designers who care about the craft.',
      potentialAction: {
        '@type': 'SearchAction',
        target: { '@type': 'EntryPoint', urlTemplate: `${BASE_URL}/?q={search_term_string}` },
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'Organization',
      '@id': `${BASE_URL}/#organization`,
      name: 'Matr Studio',
      url: BASE_URL,
      logo: `${BASE_URL}/matr-logo.png`,
    },
  ],
}

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Curated Design Resources for the Modern Craft — Matr Studio',
    template: '%s — Matr Studio',
  },
  description:
    'A curated library of design resources — tools, articles, books, videos, and frameworks for UX and product designers who care about the craft.',
  keywords: [
    'design resources', 'design tools', 'UI design', 'UX design', 'product design',
    'design systems', 'design thinking', 'design craft', 'Matr Studio',
  ],
  authors: [{ name: 'Matr Studio', url: BASE_URL }],
  creator: 'Matr Studio',
  openGraph: {
    title: 'Curated Design Resources for the Modern Craft — Matr Studio',
    description: 'A curated library of design resources — tools, articles, books, videos, and frameworks for UX and product designers.',
    siteName: 'Matr Studio',
    url: BASE_URL,
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Curated Design Resources for the Modern Craft — Matr Studio',
    description: 'A curated library of design resources — tools, articles, books, videos, and frameworks for UX and product designers.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: BASE_URL,
  },
  verification: {
    google: 'g0AsM9Jc86UR9s6gZlkZzn9sZ8aLzdIub-TUHq6ITEk',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${manrope.variable} ${ibmPlexMono.variable} h-full antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }}
        />
      </head>
      <body className="flex min-h-screen flex-col bg-background text-foreground">{children}</body>
    </html>
  )
}
