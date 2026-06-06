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

const platformBenefits = [
  {
    icon: (
      <svg className="h-5 w-5 text-lavender" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
    title: 'One Login',
    description: 'Single account across all ecosystems',
  },
  {
    icon: (
      <svg className="h-5 w-5 text-lavender" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125V9.75M6.75 12h.008v.008H6.75V12zM9.75 12h.008v.008H9.75V12zM12.75 12h.008v.008H12.75V12z" />
      </svg>
    ),
    title: 'Shared Billing',
    description: 'One subscription, multiple products',
  },
  {
    icon: (
      <svg className="h-5 w-5 text-lavender" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
    title: 'Shared Analytics',
    description: 'Cross-ecosystem insights',
  },
]

function ChevronRight() {
  return (
    <svg className="h-4 w-4 flex-shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  )
}

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
      document.documentElement.dataset.mobileDrawerOpen = ''
    } else {
      document.body.style.overflow = ''
      delete document.documentElement.dataset.mobileDrawerOpen
    }
    return () => {
      document.body.style.overflow = ''
      delete document.documentElement.dataset.mobileDrawerOpen
    }
  }, [mobileOpen])

  return (
    <>
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
            className="flex items-center justify-center min-h-[48px] min-w-[48px] rounded-lg text-charcoal md:hidden"
            aria-label="Open menu"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </nav>
      </header>

      {/* Mobile drawer — rendered outside <header>, no stacking context bleed */}
      <div
        className={clsx(
          'fixed inset-0 z-[100] md:hidden transition-all duration-300',
          mobileOpen ? 'pointer-events-auto' : 'pointer-events-none'
        )}
      >
        {/* Backdrop — z-[100] to cover FloatingCTA (z-40) and page content */}
        <div
          className={clsx(
            'fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300',
            mobileOpen ? 'opacity-100' : 'opacity-0'
          )}
          onClick={() => setMobileOpen(false)}
        />

        {/* Panel — z-[110] above backdrop */}
        <div
          className={clsx(
            'fixed inset-y-0 right-0 w-full max-w-md bg-cream z-[110] flex flex-col shadow-2xl transition-transform duration-300 ease-out',
            mobileOpen ? 'translate-x-0' : 'translate-x-full'
          )}
        >
          {/* Fixed header */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-border-light flex-shrink-0">
            <Logo />
            <button
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center min-h-[48px] min-w-[48px] rounded-lg text-charcoal hover:bg-gray-100 transition-colors"
              aria-label="Close menu"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Scrollable content area */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            {/* Primary Nav */}
            <nav className="space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={clsx(
                    'flex items-center min-h-[48px] rounded-xl px-4 py-2.5 text-sm font-medium transition-colors',
                    pathname === link.href
                      ? 'bg-lavender/10 text-lavender'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-charcoal'
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Platform Benefits */}
            <div className="mt-10">
              <p className="px-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-400">
                Platform
              </p>
              <div className="mt-3 space-y-1">
                {platformBenefits.map((benefit) => (
                  <div
                    key={benefit.title}
                    className="flex items-center gap-3 min-h-[52px] rounded-xl px-3 py-2.5"
                  >
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-lavender/10">
                      {benefit.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-charcoal">{benefit.title}</p>
                      <p className="text-xs text-gray-500 truncate">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Products */}
            <div className="mt-10">
              <p className="px-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-400">
                Products
              </p>
              <div className="mt-3 space-y-2">
                {products.map((p) => (
                  <Link
                    key={p.href}
                    href={p.href}
                    onClick={() => setMobileOpen(false)}
                    className={clsx(
                      'flex items-center gap-3 min-h-[72px] rounded-2xl px-4 py-3.5 transition-colors',
                      pathname === p.href
                        ? 'bg-lavender/5'
                        : 'hover:bg-gray-50'
                    )}
                  >
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-charcoal text-sm font-bold text-white">
                      {p.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-charcoal">{p.name}</p>
                      <p className="text-xs text-gray-500 truncate">{p.tagline}</p>
                    </div>
                    <ChevronRight />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Sticky footer CTA */}
          <div className="flex-shrink-0 border-t border-border-light bg-cream px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="inline-flex items-center rounded-full bg-lavender/10 px-2.5 py-0.5 text-[11px] font-medium text-lavender">
                  Free
                </span>
                <span className="text-xs text-gray-500">No credit card</span>
              </div>
              {isLoggedIn ? (
                <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
                  <button className="min-h-[48px] rounded-full bg-charcoal px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-charcoal/90 active:scale-[0.97]">
                    Dashboard
                  </button>
                </Link>
              ) : (
                <Link href="/signup" onClick={() => setMobileOpen(false)}>
                  <button className="min-h-[48px] rounded-full bg-charcoal px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-charcoal/90 active:scale-[0.97]">
                    Create Free Account
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
