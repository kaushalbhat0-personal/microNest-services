import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { APP_NAME, APP_DESCRIPTION } from '@micronest/config'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: APP_NAME,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${inter.className} h-full bg-white text-gray-900 antialiased`}
      >
        {children}
      </body>
    </html>
  )
}
