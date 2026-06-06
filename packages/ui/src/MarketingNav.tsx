'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import clsx from 'clsx'
import { Logo } from './Logo'

const products = [
  { name: 'StayNest', tagline: 'For PG & Hostel Owners', href: '/ecosystems/staynest', icon: 'S' },
  { name: 'ClinicNest', tagline: 'For Clinics & Practices', href: '/ecosystems/clinicnest', icon: 'C' },
  { name: 'FreelanceNest', tagline: 'For Freelancers', href: '/ecosystems/freelancenest', icon: 'F' },
  { name: 'PropertyNest', tagline: 'For Real Estate', href: '/ecosystems/propertynest', icon: 'P' },
]

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/ecosystems', label: 'Ecosystems' },
  { href: '/about', label: 'About' },
]

export function MarketingNav({ isLoggedIn = false }: { isLoggedIn?: boolean }) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  useEffect(() => {
    setMobileOpen(false)
    setDropdownOpen(false)
  }, [pathname])

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  return (
    <header className="sticky top-0 z-50 border-b border-border-light bg-cream/90 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex-shrink-0">
          <Logo />
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            if (link.label === 'Ecosystems') {
              return (
                <div key={link.href} className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    onMouseEnter={() => setDropdownOpen(true)}
                    onMouseLeave={() => setDropdownOpen(false)}
                    className={clsx(
                      'flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                      pathname.startsWith('/ecosystems')
                        ? 'bg-lavender/10 text-lavender'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-charcoal'
                    )}
                  >
                    Products
                    <svg className={`h-3.5 w-3.5 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {dropdownOpen && (
                    <div
                      onMouseEnter={() => setDropdownOpen(true)}
                      onMouseLeave={() => setDropdownOpen(false)}
                      className="absolute left-0 top-full mt-1 w-64 rounded-card border border-border-light bg-white p-2 shadow-lg"
                    >
                      {products.map((p) => (
                        <Link
                          key={p.href}
                          href={p.href}
                          className={clsx(
                            'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors',
                            pathname === p.href
                              ? 'bg-lavender/10 text-lavender'
                              : 'text-gray-600 hover:bg-gray-100 hover:text-charcoal'
                          )}
                        >
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-charcoal text-xs font-bold text-white">
                            {p.icon}
                          </div>
                          <div>
                            <p className="font-medium text-charcoal">{p.name}</p>
                            <p className="text-xs text-gray-500">{p.tagline}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )
            }
            return (
              <Link
                key={link.href}
                href={link.href}
                className={clsx(
                  'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  pathname === link.href
                    ? 'bg-lavender/10 text-lavender'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-charcoal'
                )}
              >
                {link.label}
              </Link>
            )
          })}
        </div>

        {/* Desktop auth */}
        <div className="hidden items-center gap-2 md:flex">
          {isLoggedIn ? (
            <Link href="/dashboard">
              <button className="rounded-full bg-charcoal px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-charcoal/90">
                Dashboard
              </button>
            </Link>
          ) : (
            <>
              <Link href="/login">
                <button className="rounded-full px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:text-charcoal">
                  Log in
                </button>
              </Link>
              <Link href="/signup">
                <button className="rounded-full bg-charcoal px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-charcoal/90">
                  Start Free
                </button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(true)}
          className="flex items-center justify-center rounded-lg p-2 text-charcoal md:hidden"
          aria-label="Open menu"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </nav>

      {/* Mobile full-screen drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/20" onClick={() => setMobileOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-full max-w-sm bg-cream p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <Logo />
              <button
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center rounded-lg p-2 text-charcoal"
                aria-label="Close menu"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mt-8 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={clsx(
                    'block rounded-lg px-4 py-3 text-base font-medium transition-colors',
                    pathname === link.href
                      ? 'bg-lavender/10 text-lavender'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-charcoal'
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="mt-2 border-t border-border-light pt-2">
              <p className="px-4 py-2 text-xs font-medium uppercase tracking-wider text-gray-500">
                Products
              </p>
              {products.map((p) => (
                <Link
                  key={p.href}
                  href={p.href}
                  onClick={() => setMobileOpen(false)}
                  className={clsx(
                    'flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition-colors',
                    pathname === p.href
                      ? 'bg-lavender/10 text-lavender'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-charcoal'
                  )}
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-charcoal text-xs font-bold text-white">
                    {p.icon}
                  </div>
                  <div>
                    <p className="font-medium text-charcoal">{p.name}</p>
                    <p className="text-xs text-gray-500">{p.tagline}</p>
                  </div>
                </Link>
              ))}
            </div>

            <div className="absolute bottom-8 left-6 right-6">
              {isLoggedIn ? (
                <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
                  <button className="w-full rounded-full bg-charcoal px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-charcoal/90">
                    Dashboard
                  </button>
                </Link>
              ) : (
                <Link href="/signup" onClick={() => setMobileOpen(false)}>
                  <button className="w-full rounded-full bg-charcoal px-5 py-3 text-base font-medium text-white transition-colors hover:bg-charcoal/90">
                    Start Free
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
