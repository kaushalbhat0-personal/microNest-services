'use client'

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
  },
  indigo: {
    active: 'border-indigo-600 text-indigo-700',
    hover: 'hover:border-gray-300 hover:text-gray-700',
  },
  teal: {
    active: 'border-teal-600 text-teal-700',
    hover: 'hover:border-gray-300 hover:text-gray-700',
  },
} as const

export function TabNav({ tabs, activeColor = 'amber' }: TabNavProps) {
  const pathname = usePathname()
  const colors = activeColors[activeColor]

  return (
    <nav className="flex gap-1 border-b border-gray-200">
      {tabs.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          className={clsx(
            'border-b-2 px-4 py-2.5 text-sm font-medium transition-colors',
            pathname === tab.href
              ? colors.active
              : `border-transparent text-gray-500 ${colors.hover}`
          )}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  )
}
