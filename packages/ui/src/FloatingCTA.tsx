'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export function FloatingCTA() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 400)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-40 border-t border-border-light bg-white/95 backdrop-blur-md transition-transform duration-300 md:hidden ${
        scrolled ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="flex items-center justify-between px-4 py-3">
        <div>
          <p className="text-xs font-medium text-gray-500">Start building</p>
          <p className="text-sm font-semibold text-charcoal">Free forever plan available</p>
        </div>
        <Link href="/signup">
          <button className="rounded-full bg-charcoal px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-charcoal/90 active:scale-[0.97]">
            Start Free
          </button>
        </Link>
      </div>
    </div>
  )
}
