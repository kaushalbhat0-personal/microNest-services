import { TabNav } from '@micronest/ui'

const tabs = [
  { href: '/dashboard/staynest', label: 'Overview' },
  { href: '/dashboard/staynest/rooms', label: 'Rooms' },
  { href: '/dashboard/staynest/residents', label: 'Residents' },
  { href: '/dashboard/staynest/visitors', label: 'Visitor Log' },
  { href: '/dashboard/staynest/complaints', label: 'Complaints' },
  { href: '/dashboard/staynest/rent-reminder', label: 'Rent Reminder' },
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
