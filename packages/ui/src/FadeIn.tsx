'use client'

import { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'

type FadeInProps = {
  children: React.ReactNode
  className?: string
  as?: 'div' | 'section' | 'article'
  delay?: number
}

export function FadeIn({
  children,
  className,
  as: Tag = 'div',
  delay = 0,
}: FadeInProps) {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  return (
    <Tag
      ref={ref}
      className={clsx(
        'transition-all duration-300',
        visible ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-0',
        className
      )}
    >
      {children}
    </Tag>
  )
}
