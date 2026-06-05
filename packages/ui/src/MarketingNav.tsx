'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'
import { Logo } from './Logo'
import { Button } from './Button'

const links = [
  { href: '/', label: 'Home' },
  { href: '/ecosystems/staynest', label: 'StayNest' },
  { href: '/ecosystems/staynest#pricing', label: 'Pricing' },
  { href: '/ecosystems', label: 'Ecosystems' },
]

export function MarketingNav({ isLoggedIn = false }: { isLoggedIn?: boolean }) {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex-shrink-0">
          <Logo />
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                'text-sm font-medium transition-colors hover:text-indigo-600',
                pathname === link.href
                  ? 'text-indigo-600'
                  : 'text-gray-600'
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <Link href="/dashboard">
              <Button size="sm">Dashboard</Button>
            </Link>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Log in
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">Sign up</Button>
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}
