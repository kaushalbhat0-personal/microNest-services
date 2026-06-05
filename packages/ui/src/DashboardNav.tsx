'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'
import { Logo } from './Logo'

const links = [
  { href: '/dashboard', label: 'Dashboard', icon: '◉' },
  { href: '/ecosystems', label: 'Ecosystems', icon: '⊞' },
]

export function DashboardNav() {
  const pathname = usePathname()

  return (
    <aside className="flex h-full w-64 flex-col border-r border-gray-200 bg-white max-md:hidden">
      <div className="flex items-center border-b border-gray-200 px-6 py-4">
        <Link href="/dashboard">
          <Logo size="sm" />
        </Link>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
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
      </nav>

      <div className="border-t border-gray-200 px-3 py-3">
        {/* TODO: Add user menu with avatar, settings, logout */}
      </div>
    </aside>
  )
}
