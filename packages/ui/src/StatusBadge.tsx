import clsx from 'clsx'

const variants = {
  success: 'bg-green-100 text-green-700 ring-1 ring-inset ring-green-600/10',
  warning: 'bg-amber-100 text-amber-700 ring-1 ring-inset ring-amber-600/10',
  danger: 'bg-red-100 text-red-700 ring-1 ring-inset ring-red-600/10',
  info: 'bg-blue-100 text-blue-700 ring-1 ring-inset ring-blue-600/10',
  default: 'bg-gray-100 text-gray-700 ring-1 ring-inset ring-gray-600/10',
} as const

export type StatusVariant = keyof typeof variants

export function StatusBadge({
  children,
  variant = 'default',
  className,
}: {
  children: React.ReactNode
  variant?: StatusVariant
  className?: string
}) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
