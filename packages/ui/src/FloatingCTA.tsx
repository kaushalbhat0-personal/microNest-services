'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function FloatingCTA() {
  const [show, setShow] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => {
      setShow(window.scrollY > window.innerHeight * 0.8)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const check = () => {
      setDrawerOpen('mobileDrawerOpen' in document.documentElement.dataset)
    }
    check()
    const observer = new MutationObserver(check)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-mobile-drawer-open'] })
    return () => observer.disconnect()
  }, [])

  const ctaText =
    pathname === '/ecosystems/staynest' || pathname.startsWith('/ecosystems/staynest')
      ? 'Start Free — No Credit Card'
      : 'Create Free Account'

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-40 border-t border-border-light bg-white shadow-lg transition-transform duration-300 md:hidden ${
        show && !drawerOpen ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-lavender text-xs font-bold text-white">M</div>
          <div>
            <p className="text-xs font-medium text-gray-500">MicroNest</p>
            <p className="text-sm font-semibold text-charcoal">Free plan available</p>
          </div>
        </div>
        <Link href="/signup">
          <button className="min-h-[48px] rounded-full bg-charcoal px-6 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-charcoal/90 active:scale-[0.97]">
            {ctaText}
          </button>
        </Link>
      </div>
    </div>
  )
}
