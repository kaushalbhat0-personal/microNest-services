'use client'

import { useEffect, useRef, useState } from 'react'

type CountUpProps = {
  end: number
  duration?: number
  prefix?: string
  suffix?: string
  className?: string
}

export function CountUp({
  end,
  duration = 600,
  prefix = '',
  suffix = '',
  className,
}: CountUpProps) {
  const [value, setValue] = useState(0)
  const startRef = useRef<number | null>(null)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    if (end === 0) {
      setValue(0)
      return
    }

    startRef.current = null

    const step = (timestamp: number) => {
      if (startRef.current === null) {
        startRef.current = timestamp
      }

      const elapsed = timestamp - startRef.current
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(eased * end))

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step)
      }
    }

    rafRef.current = requestAnimationFrame(step)

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [end, duration])

  return (
    <span className={className}>
      {prefix}
      {value.toLocaleString()}
      {suffix}
    </span>
  )
}
