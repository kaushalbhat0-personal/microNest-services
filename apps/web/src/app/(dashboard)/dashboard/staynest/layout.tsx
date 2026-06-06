import { TabNav } from '@micronest/ui'

const tabs = [
  { href: '/dashboard/staynest', label: 'Overview' },
  { href: '/dashboard/staynest/rooms', label: 'Rooms' },
  { href: '/dashboard/staynest/residents', label: 'Residents' },
  { href: '/dashboard/staynest/visitors', label: 'Visitors' },
  { href: '/dashboard/staynest/maintenance', label: 'Maintenance' },
  { href: '/dashboard/staynest/rent', label: 'Rent' },
  { href: '/dashboard/staynest/receipts', label: 'Receipts' },
  { href: '/dashboard/staynest/notices', label: 'Announcements' },
  { href: '/dashboard/staynest/notifications', label: 'Notifications' },
  { href: '/dashboard/staynest/analytics', label: 'Analytics' },
  { href: '/dashboard/staynest/feedback', label: 'Feedback' },
  { href: '/dashboard/staynest/search', label: 'Search' },
  { href: '/dashboard/settings', label: 'Settings' },
]

export default function StayNestLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <div className="mb-6">
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-amber-600 text-xs font-bold text-white">
            S
          </div>
          <h2 className="text-sm font-semibold text-gray-900">StayNest</h2>
        </div>
        <TabNav tabs={tabs} />
      </div>
      {children}
    </div>
  )
}
