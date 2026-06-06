'use client'

import Link from 'next/link'

export function FloatingCTA() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border-light bg-white shadow-lg md:hidden">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-lavender text-[10px] font-bold text-white">M</div>
          <div>
            <p className="text-xs font-medium text-gray-500">MicroNest</p>
            <p className="text-sm font-semibold text-charcoal">Free plan available</p>
          </div>
        </div>
        <Link href="/signup">
          <button className="min-h-[44px] rounded-full bg-charcoal px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-charcoal/90 active:scale-[0.97]">
            Create Free Account
          </button>
        </Link>
      </div>
    </div>
  )
}
