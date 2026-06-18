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

export const metadata: Metadata = {
  title: {
    default: 'Matrstudio Operational Index',
    template: '%s — Matrstudio',
  },
  description:
    'A curated library of tools, frameworks, and insights for designers who care about the craft.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'),
  openGraph: {
    title: 'Matrstudio Operational Index',
    description: 'A curated library of tools, frameworks, and insights for designers who care about the craft.',
    siteName: 'Matrstudio',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Matrstudio Operational Index',
    description: 'A curated library of tools, frameworks, and insights for designers who care about the craft.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${manrope.variable} ${ibmPlexMono.variable} h-full antialiased`}>
      <body className="flex min-h-screen flex-col bg-background text-foreground">{children}</body>
    </html>
  )
}
