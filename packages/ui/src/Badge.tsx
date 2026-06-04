import clsx from 'clsx'

type BadgeProps = {
  children: React.ReactNode
  variant?: 'default' | 'indigo'
  className?: string
}

export function Badge({
  children,
  variant = 'default',
  className,
}: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        variant === 'indigo' && 'bg-indigo-100 text-indigo-700',
        variant === 'default' && 'bg-gray-100 text-gray-700',
        className
      )}
    >
      {children}
    </span>
  )
}
