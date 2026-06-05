import clsx from 'clsx'

type SkeletonProps = {
  className?: string
  count?: number
}

export function Skeleton({ className, count = 1 }: SkeletonProps) {
  const base = 'animate-pulse rounded bg-gray-200'

  if (count === 1) {
    return <div className={clsx(base, className)} />
  }

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={clsx(base, className)} />
      ))}
    </>
  )
}
