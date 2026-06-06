import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'MicroNest — One platform. Multiple business operating systems.',
    template: `%s | MicroNest`,
  },
  description:
    'MicroNest is a platform of purpose-built business operating systems. Launch, manage and scale niche businesses from a single account. Activate only the tools you need.',
  openGraph: {
    title: 'MicroNest — One platform. Multiple business operating systems.',
    description:
      'Launch, manage and scale niche businesses from a single account. Activate only the tools you need.',
    type: 'website',
    siteName: 'MicroNest',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${inter.className} h-full bg-cream text-charcoal antialiased`}
      >
        {children}
      </body>
    </html>
  )
}
