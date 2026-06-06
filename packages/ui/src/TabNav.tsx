'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'

export type Tab = {
  href: string
  label: string
}

type TabNavProps = {
  tabs: Tab[]
  activeColor?: 'amber' | 'indigo' | 'teal'
}

const activeColors = {
  amber: {
    active: 'border-amber-600 text-amber-700',
    hover: 'hover:border-gray-300 hover:text-gray-700',
    drawerActive: 'bg-amber-50 text-amber-700 border-l-2 border-amber-600',
    drawerHover: 'hover:bg-gray-50 hover:text-gray-900',
  },
  indigo: {
    active: 'border-indigo-600 text-indigo-700',
    hover: 'hover:border-gray-300 hover:text-gray-700',
    drawerActive: 'bg-indigo-50 text-indigo-700 border-l-2 border-indigo-600',
    drawerHover: 'hover:bg-gray-50 hover:text-gray-900',
  },
  teal: {
    active: 'border-teal-600 text-teal-700',
    hover: 'hover:border-gray-300 hover:text-gray-700',
    drawerActive: 'bg-teal-50 text-teal-700 border-l-2 border-teal-600',
    drawerHover: 'hover:bg-gray-50 hover:text-gray-900',
  },
} as const

export function TabNav({ tabs, activeColor = 'amber' }: TabNavProps) {
  const pathname = usePathname()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const colors = activeColors[activeColor]

  useEffect(() => {
    setDrawerOpen(false)
  }, [pathname])

  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [drawerOpen])

  return (
    <>
      {/* Mobile: Hamburger header (below 768px) */}
      <div className="sticky top-0 z-30 -mx-4 -mt-4 border-b border-gray-200 bg-white px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 md:hidden">
        <div className="flex h-12 items-center gap-2">
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open navigation"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
          <span className="text-sm font-medium text-gray-700">
            {tabs.find((t) => t.href === pathname)?.label ?? 'Navigation'}
          </span>
        </div>
      </div>

      {/* Mobile: Backdrop */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* Mobile: Slide drawer */}
      <aside
        className={clsx(
          'fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-gray-200 bg-white shadow-lg transition-transform duration-300 md:hidden',
          drawerOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
          <span className="text-sm font-semibold text-gray-900">StayNest</span>
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
            onClick={() => setDrawerOpen(false)}
            aria-label="Close navigation"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto px-2 py-3">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={clsx(
                  'flex items-center rounded-md px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? colors.drawerActive
                    : `text-gray-600 ${colors.drawerHover}`
                )}
              >
                {tab.label}
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* Desktop: Horizontal tabs (768px and above) */}
      <nav className="hidden gap-1 overflow-x-auto border-b border-gray-200 md:flex">
        {tabs.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className={clsx(
              'min-h-[44px] whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-medium transition-colors',
              pathname === tab.href
                ? colors.active
                : `border-transparent text-gray-500 ${colors.hover}`
            )}
          >
            {tab.label}
          </Link>
        ))}
      </nav>
    </>
  )
}
