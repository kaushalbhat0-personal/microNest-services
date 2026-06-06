import Link from 'next/link'

type UsageBarProps = {
  label: string
  current: number
  limit: number | null
}

export function UsageBar({ label, current, limit }: UsageBarProps) {
  if (limit === null) return null

  const percentage = Math.min(Math.round((current / limit) * 100), 100)
  const isNearLimit = percentage >= 80
  const isAtLimit = percentage >= 100

  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-gray-700">{label}</span>
        <span className={isAtLimit ? 'font-semibold text-red-600' : isNearLimit ? 'font-medium text-amber-600' : 'text-gray-500'}>
          {current} / {limit}
        </span>
      </div>
      <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-gray-100">
        <div
          className={`h-full rounded-full transition-all ${
            isAtLimit ? 'bg-red-500' : isNearLimit ? 'bg-amber-500' : 'bg-indigo-500'
          }`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  )
}

type UpgradeBannerProps = {
  planName: string
}

export function UpgradeBanner({ planName }: UpgradeBannerProps) {
  if (planName !== 'starter') return null

  return (
    <div className="rounded-lg border border-indigo-200 bg-indigo-50 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-indigo-900">
            You&apos;re on the Starter plan
          </p>
          <p className="text-xs text-indigo-700">
            Upgrade to Growth for unlimited residents, rooms, and all features.
          </p>
        </div>
        <Link href="/dashboard/settings/subscription">
          <button className="rounded-md bg-indigo-600 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-indigo-700">
            Upgrade
          </button>
        </Link>
      </div>
    </div>
  )
}
