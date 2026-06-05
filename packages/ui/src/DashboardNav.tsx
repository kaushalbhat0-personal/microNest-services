'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'
import { Logo } from './Logo'

const links = [
  { href: '/dashboard', label: 'Dashboard', icon: '◉' },
  { href: '/dashboard/ecosystems', label: 'Ecosystems', icon: '⊞' },
  { href: '/dashboard/settings', label: 'Settings', icon: '⚙' },
]

function NavItems({ pathname }: { pathname: string }) {
  return (
    <>
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={clsx(
            'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
            pathname === link.href
              ? 'bg-indigo-50 text-indigo-700'
              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
          )}
        >
          <span className="text-lg">{link.icon}</span>
          {link.label}
        </Link>
      ))}
    </>
  )
}

function LogoutButton({ action }: { action: () => void }) {
  return (
    <form action={action}>
      <button
        type="submit"
        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
      >
        <span className="text-lg">⏻</span>
        Log out
      </button>
    </form>
  )
}

export function DashboardNav({ logoutAction }: { logoutAction?: () => void }) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      {/* Mobile header */}
      <div className="fixed left-0 right-0 top-0 z-40 flex items-center border-b border-gray-200 bg-white px-4 py-3 md:hidden">
        <button
          type="button"
          className="-ml-2 mr-2 inline-flex h-10 w-10 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          onClick={() => setMobileOpen(true)}
          aria-label="Open navigation"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
        <Link href="/dashboard">
          <Logo size="sm" />
        </Link>
      </div>

      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={clsx(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-gray-200 bg-white transition-transform duration-300 md:hidden',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
          <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
            <Logo size="sm" />
          </Link>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            onClick={() => setMobileOpen(false)}
            aria-label="Close navigation"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4" onClick={() => setMobileOpen(false)}>
          <NavItems pathname={pathname} />
        </nav>
        {logoutAction && (
          <div className="border-t border-gray-200 px-3 py-3">
            <LogoutButton action={logoutAction} />
          </div>
        )}
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:border-r md:border-gray-200 md:bg-white">
        <div className="flex items-center border-b border-gray-200 px-6 py-4">
          <Link href="/dashboard">
            <Logo size="sm" />
          </Link>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          <NavItems pathname={pathname} />
        </nav>

        {logoutAction && (
          <div className="border-t border-gray-200 px-3 py-3">
            <LogoutButton action={logoutAction} />
          </div>
        )}
      </aside>
    </>
  )
}
