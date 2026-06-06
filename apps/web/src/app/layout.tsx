import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { APP_NAME } from '@micronest/config'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: `${APP_NAME} — Run your business without spreadsheets`,
    template: `%s | ${APP_NAME}`,
  },
  description:
    'MicroNest is a platform of purpose-built business ecosystems for PG owners, clinics, freelancers, and real estate professionals. One account. Multiple businesses.',
  openGraph: {
    title: `${APP_NAME} — Run your business without spreadsheets`,
    description:
      'Purpose-built software for PGs, clinics, freelancers, and real estate. One account. Multiple businesses.',
    type: 'website',
    siteName: APP_NAME,
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
