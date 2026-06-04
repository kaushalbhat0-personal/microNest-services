'use client'

import Link from 'next/link'
import clsx from 'clsx'

type EcosystemStatus = 'active' | 'coming-soon'

type EcosystemCardProps = {
  name: string
  description: string
  tagline: string
  href: string
  status: EcosystemStatus
  toolCount: number
  color: string
  icon: string
}

type ColorClasses = {
  border: string
  hoverBorder: string
  accent: string
  iconBg: string
  iconText: string
  tagBg: string
  tagText: string
  shadow: string
}

const colorStyles: Record<string, ColorClasses> = {
  amber: {
    border: 'border-amber-200',
    hoverBorder: 'hover:border-amber-300',
    accent: 'bg-amber-500',
    iconBg: 'bg-amber-100',
    iconText: 'text-amber-700',
    tagBg: 'bg-amber-100',
    tagText: 'text-amber-700',
    shadow: 'hover:shadow-amber-100/50',
  },
  teal: {
    border: 'border-teal-200',
    hoverBorder: 'hover:border-teal-300',
    accent: 'bg-teal-500',
    iconBg: 'bg-teal-100',
    iconText: 'text-teal-700',
    tagBg: 'bg-teal-100',
    tagText: 'text-teal-700',
    shadow: 'hover:shadow-teal-100/50',
  },
  blue: {
    border: 'border-blue-200',
    hoverBorder: 'hover:border-blue-300',
    accent: 'bg-blue-500',
    iconBg: 'bg-blue-100',
    iconText: 'text-blue-700',
    tagBg: 'bg-blue-100',
    tagText: 'text-blue-700',
    shadow: 'hover:shadow-blue-100/50',
  },
  purple: {
    border: 'border-purple-200',
    hoverBorder: 'hover:border-purple-300',
    accent: 'bg-purple-500',
    iconBg: 'bg-purple-100',
    iconText: 'text-purple-700',
    tagBg: 'bg-purple-100',
    tagText: 'text-purple-700',
    shadow: 'hover:shadow-purple-100/50',
  },
}

export function EcosystemCard({
  name,
  description,
  tagline,
  href,
  status,
  toolCount,
  color,
  icon,
}: EcosystemCardProps) {
  const c = colorStyles[color] ?? colorStyles.blue
  const isComingSoon = status === 'coming-soon'

  const card = (
    <div
      className={clsx(
        'group relative flex h-full flex-col overflow-hidden rounded-xl border bg-white shadow-sm transition-all duration-300',
        c.border,
        !isComingSoon && `${c.hoverBorder} ${c.shadow} hover:-translate-y-1 hover:shadow-lg`,
        isComingSoon && 'opacity-75'
      )}
    >
      {/* Top accent bar */}
      <div className={clsx('h-1 w-full shrink-0', c.accent)} />

      <div className="flex flex-1 flex-col p-6">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={clsx(
                'flex h-10 w-10 items-center justify-center rounded-lg text-sm font-bold',
                c.iconBg,
                c.iconText
              )}
            >
              {icon}
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900">
                {name}
              </h3>
              <p className="text-xs text-gray-500">{tagline}</p>
            </div>
          </div>

          {isComingSoon ? (
            <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-600/10">
              Coming Soon
            </span>
          ) : (
            <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/10">
              Active
            </span>
          )}
        </div>

        {/* Description */}
        <p className="mt-4 flex-1 text-sm leading-relaxed text-gray-600">
          {description}
        </p>

        {/* Footer */}
        <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4">
          <span className="text-xs text-gray-400">
            {isComingSoon
              ? 'Tools coming soon'
              : `${toolCount} tool${toolCount !== 1 ? 's' : ''} available`}
          </span>

          {!isComingSoon && (
            <span
              className={clsx(
                'text-sm font-medium transition-colors',
                c.tagText
              )}
            >
              Explore &rarr;
            </span>
          )}
        </div>
      </div>
    </div>
  )

  if (isComingSoon) {
    return <div className="cursor-default">{card}</div>
  }

  return (
    <Link href={href} className="block">
      {card}
    </Link>
  )
}
