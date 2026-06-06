'use client'

import { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@micronest/ui'
import { seedDemoData } from '@/lib/staynest/actions'

const STEPS = [
  {
    label: 'Add Rooms',
    desc: 'Define room types, capacity, and rent amount',
    preview: '15 rooms seeded',
  },
  {
    label: 'Add Residents',
    desc: 'Assign tenants to rooms with guardian contacts',
    preview: '30 residents seeded',
  },
  {
    label: 'Track Rent',
    desc: 'Record payments and generate receipts',
    preview: '40 rent records seeded',
  },
  {
    label: 'Log Visitors',
    desc: 'Digital check-in and check-out for guests',
    preview: '20 visitors seeded',
  },
  {
    label: 'Maintenance',
    desc: 'Track repair requests from open to resolved',
    preview: '10 requests seeded',
  },
  {
    label: 'Notifications',
    desc: 'Automated WhatsApp alerts for residents',
    preview: 'Templates ready',
  },
]

export function DemoContent() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSeed = useCallback(async () => {
    setLoading(true)
    setError(null)
    const result = await seedDemoData()
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    } else if (result?.success) {
      router.refresh()
    }
  }, [router])

  return (
    <div className="flex flex-col items-center py-12">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-amber-100">
            <svg className="h-7 w-7 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900">
            Welcome to StayNest
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-gray-500">
            Your property management dashboard is ready. Load demo data to see a fully populated dashboard instantly, or start fresh and build from scratch.
          </p>
        </div>

        {/* Action cards */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2">
          <button
            onClick={handleSeed}
            disabled={loading}
            className="group relative flex flex-col items-center rounded-xl border-2 border-amber-200 bg-amber-50/50 p-6 text-center transition-all hover:border-amber-300 hover:bg-amber-50 hover:shadow-sm disabled:opacity-50"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-100">
              <svg className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />
              </svg>
            </div>
            <h3 className="mt-3 text-sm font-semibold text-gray-900">
              Explore with Demo Data
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-gray-500">
              Populate your dashboard with sample data instantly. See rooms, residents, rent records, visitors, and more — pre-configured and ready to explore.
            </p>
            <span className="mt-3 inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-medium text-amber-700">
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              60-second setup
            </span>
          </button>

          <button
            onClick={() => router.push('/dashboard/staynest/rooms')}
            className="group flex flex-col items-center rounded-xl border-2 border-gray-200 bg-white p-6 text-center transition-all hover:border-gray-300 hover:shadow-sm"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100">
              <svg className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
              </svg>
            </div>
            <h3 className="mt-3 text-sm font-semibold text-gray-900">
              Start Empty
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-gray-500">
              Begin with a clean slate. Add rooms, residents, and records at your own pace. Best if you have your data ready to enter.
            </p>
            <span className="mt-3 inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-[10px] font-medium text-gray-600">
              Start with Rooms
            </span>
          </button>
        </div>

        {/* What gets seeded */}
        <div className="rounded-lg border border-gray-200 bg-white p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
            What you get with demo data
          </p>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {STEPS.map((s) => (
              <div key={s.label} className="rounded-md bg-gray-50 p-2.5 text-center">
                <p className="text-xs font-medium text-gray-900">{s.label}</p>
                <p className="mt-0.5 text-[10px] text-gray-400">{s.preview}</p>
              </div>
            ))}
          </div>
        </div>

        {error && (
          <p className="mt-4 text-sm text-red-600">{error}</p>
        )}

        <p className="mt-4 text-center text-xs text-gray-400">
          Demo data is seeded once per organization. You can only seed when all data is deleted.
        </p>
      </div>
    </div>
  )
}
