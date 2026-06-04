import clsx from 'clsx'

type LogoProps = {
  className?: string
  showText?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const sizes = {
  sm: 'h-6',
  md: 'h-8',
  lg: 'h-10',
}

export function Logo({
  className,
  showText = true,
  size = 'md',
}: LogoProps) {
  return (
    <div className={clsx('flex items-center gap-2', className)}>
      <div
        className={clsx(
          'flex items-center justify-center rounded-lg bg-indigo-600 text-white font-bold',
          size === 'sm'
            ? 'h-6 w-6 text-xs'
            : size === 'md'
              ? 'h-8 w-8 text-sm'
              : 'h-10 w-10 text-lg'
        )}
      >
        M
      </div>
      {showText && (
        <span
          className={clsx(
            'font-bold tracking-tight text-gray-900',
            size === 'sm'
              ? 'text-sm'
              : size === 'md'
                ? 'text-lg'
                : 'text-xl'
          )}
        >
          MicroNest
        </span>
      )}
    </div>
  )
}
