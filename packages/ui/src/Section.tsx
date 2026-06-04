import clsx from 'clsx'

type SectionProps = React.ComponentPropsWithoutRef<'section'> & {
  children: React.ReactNode
  className?: string
  background?: 'white' | 'gray' | 'indigo'
}

const backgrounds = {
  white: 'bg-white',
  gray: 'bg-gray-50',
  indigo: 'bg-indigo-600',
}

export function Section({
  children,
  className,
  background = 'white',
  ...props
}: SectionProps) {
  return (
    <section
      className={clsx(
        'py-16 sm:py-24',
        backgrounds[background],
        background === 'indigo' && 'text-white',
        className
      )}
      {...props}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </section>
  )
}
