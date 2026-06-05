'use client'

import { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Card, CardBody } from '@micronest/ui'
import { seedDemoData } from '@/lib/staynest/actions'

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
    <div className="flex flex-col items-center justify-center py-16">
      <Card className="max-w-lg text-center">
        <CardBody>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
            <span className="text-3xl">🏠</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900">
            Welcome to StayNest!
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Your property management dashboard is ready. Start by adding your
            first data, or load demo data to see a fully populated dashboard
            instantly.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button
              variant="primary"
              size="lg"
              loading={loading}
              onClick={handleSeed}
            >
              🚀 Explore with Demo Data
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => router.push('/dashboard/staynest/rooms')}
            >
              Start Empty
            </Button>
          </div>

          {error && (
            <p className="mt-4 text-sm text-red-600">{error}</p>
          )}
        </CardBody>
      </Card>

      <div className="mt-8 grid max-w-2xl gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white p-4 text-center">
          <p className="text-2xl font-bold text-indigo-600">15</p>
          <p className="text-xs text-gray-500">Rooms</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 text-center">
          <p className="text-2xl font-bold text-green-600">30</p>
          <p className="text-xs text-gray-500">Residents</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 text-center">
          <p className="text-2xl font-bold text-amber-600">10</p>
          <p className="text-xs text-gray-500">Complaints</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 text-center">
          <p className="text-2xl font-bold text-red-600">40</p>
          <p className="text-xs text-gray-500">Rent Records</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">20</p>
          <p className="text-xs text-gray-500">Visitors</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 text-center">
          <p className="text-2xl font-bold text-purple-600">5</p>
          <p className="text-xs text-gray-500">Notices</p>
        </div>
      </div>

      <p className="mt-6 text-xs text-gray-400">
        Demo data is seeded once. You can only seed when all data is deleted.
      </p>
    </div>
  )
}
