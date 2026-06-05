import type { Metadata } from 'next'
import Link from 'next/link'
import { Card, CardBody, StatusBadge, CountUp, FadeIn } from '@micronest/ui'
import { createServerClient } from '@micronest/auth'
import { getUserOrganizations, isOrganizationEmpty, listVisitors, listMaintenanceRequests, countMaintenanceRequestsByStatus, countResidentsByStatus, listRooms, getRevenueStats, listActiveAnnouncements } from '@micronest/db'
import { DemoContent } from './demo-content'

export const metadata: Metadata = {
  title: 'StayNest',
}

const statusVariant: Record<string, 'info' | 'success'> = {
  'checked-in': 'info',
  'checked-out': 'success',
}

const complaintVariant: Record<string, 'info' | 'warning' | 'success' | 'default'> = {
  open: 'info',
  assigned: 'warning',
  in_progress: 'warning',
  resolved: 'success',
  closed: 'default',
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
  })
}

export default async function StayNestOverviewPage() {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  let isEmpty = true
  let orgId: string | null = null

  if (user) {
    const orgs = await getUserOrganizations(supabase, user.id)
    if (orgs.length > 0) {
      orgId = orgs[0].id
      isEmpty = await isOrganizationEmpty(supabase, orgId)
    }
  }

  if (isEmpty && orgId) {
    return <DemoContent />
  }

  let recentVisitors: { id: string; name: string; room_number: string; purpose: string; status: string; check_in_at: string }[] = []
  let recentComplaints: { id: string; title: string; status: string; created_at: string }[] = []
  let openComplaintsCount = 0
  let activeResidentsCount = 0
  let totalRooms = 0
  let totalCapacity = 0
  let totalOccupied = 0
  let rentStats = { monthlyRevenue: 0, pendingRevenue: 0, overdueRevenue: 0, collectionRate: 0, totalCollected: 0, totalDue: 0 }
  let publishedNoticesCount = 0
  let visitorsTodayCount = 0

  if (user && orgId) {
    const allVisitors = await listVisitors(supabase, orgId)
    recentVisitors = allVisitors.slice(0, 3)

    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)
    visitorsTodayCount = allVisitors.filter(
      (v) => new Date(v.check_in_at) >= todayStart
    ).length

    const allComplaints = await listMaintenanceRequests(supabase, orgId)
    recentComplaints = allComplaints.slice(0, 3)

    const complaintCounts = await countMaintenanceRequestsByStatus(supabase, orgId)
    openComplaintsCount = complaintCounts.open

    const residentCounts = await countResidentsByStatus(supabase, orgId)
    activeResidentsCount = residentCounts.active

    const rooms = await listRooms(supabase, orgId)
    totalRooms = rooms.length
    totalCapacity = rooms.reduce((sum, r) => sum + r.capacity, 0)
    totalOccupied = rooms.reduce((sum, r) => sum + r.occupied_beds, 0)

    const [stats, activeAnnouncements] = await Promise.all([
      getRevenueStats(supabase, orgId),
      listActiveAnnouncements(supabase, orgId),
    ])
    rentStats = stats
    publishedNoticesCount = activeAnnouncements.length
  }

  const availableRooms = totalRooms - totalOccupied

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">StayNest Overview</h1>
        <p className="mt-1 text-sm text-gray-500">
          Your PG control center — everything at a glance.
        </p>
      </div>

      {/* Stats grid — Two rows of 4 */}
      <FadeIn>
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardBody>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                Residents
              </p>
              <p className="mt-1 text-2xl font-bold text-green-600">
                <CountUp end={activeResidentsCount} />
              </p>
              <p className="mt-1 text-xs text-gray-500">Active residents</p>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                Rooms
              </p>
              <p className="mt-1 text-2xl font-bold text-gray-900">
                <CountUp end={totalRooms} />
              </p>
              <p className="mt-1 text-xs text-gray-500">
                <CountUp end={totalOccupied} /> occupied &middot; <CountUp end={availableRooms} /> available
              </p>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                Monthly Revenue
              </p>
              <p className="mt-1 text-2xl font-bold text-green-600">
                ₹<CountUp end={rentStats.monthlyRevenue} />
              </p>
              <p className="mt-1 text-xs text-gray-500">Collected this month</p>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                Pending Revenue
              </p>
              <p className="mt-1 text-2xl font-bold text-amber-600">
                ₹<CountUp end={rentStats.pendingRevenue} />
              </p>
              <p className="mt-1 text-xs text-gray-500">Awaiting collection</p>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                Overdue Revenue
              </p>
              <p className="mt-1 text-2xl font-bold text-red-600">
                ₹<CountUp end={rentStats.overdueRevenue} />
              </p>
              <p className="mt-1 text-xs text-gray-500">Needs immediate action</p>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                Collection Rate
              </p>
              <p className="mt-1 text-2xl font-bold text-blue-600">
                <CountUp end={rentStats.collectionRate} />%
              </p>
              <p className="mt-1 text-xs text-gray-500">Overall collection</p>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                Open Maintenance
              </p>
              <p className="mt-1 text-2xl font-bold text-amber-600">
                <CountUp end={openComplaintsCount} />
              </p>
              <p className="mt-1 text-xs text-gray-500">Require attention</p>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                Visitors Today
              </p>
              <p className="mt-1 text-2xl font-bold text-blue-600">
                <CountUp end={visitorsTodayCount} />
              </p>
              <p className="mt-1 text-xs text-gray-500">Logged entries today</p>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                Published Notices
              </p>
              <p className="mt-1 text-2xl font-bold text-purple-600">
                <CountUp end={publishedNoticesCount} />
              </p>
              <p className="mt-1 text-xs text-gray-500">Active announcements</p>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                Total Collected
              </p>
              <p className="mt-1 text-2xl font-bold text-green-600">
                ₹<CountUp end={rentStats.totalCollected} />
              </p>
              <p className="mt-1 text-xs text-gray-500">Lifetime collections</p>
            </CardBody>
          </Card>
        </div>
      </FadeIn>

      {/* Recent Visitors + Recent Complaints */}
      <FadeIn delay={50}>
      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        {/* Recent Visitors */}
        <Card padding="none">
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
            <h3 className="text-sm font-semibold text-gray-900">
              Recent Visitors
            </h3>
            <Link
              href="/dashboard/staynest/visitors"
              className="text-xs font-medium text-amber-600 hover:text-amber-500"
            >
              View all
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {recentVisitors.length === 0 ? (
              <p className="px-4 py-6 text-center text-sm text-gray-400">
                No visitors logged yet.
              </p>
            ) : (
              recentVisitors.map((visitor) => (
                <div
                  key={visitor.id}
                  className="flex items-center justify-between px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {visitor.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      Room {visitor.room_number} &middot; {visitor.purpose}
                    </p>
                  </div>
                  <div className="text-right">
                    <StatusBadge
                      variant={statusVariant[visitor.status]}
                    >
                      {visitor.status === 'checked-in'
                        ? 'Checked In'
                        : 'Checked Out'}
                    </StatusBadge>
                    <p className="mt-0.5 text-xs text-gray-400">
                      {formatDate(visitor.check_in_at)} {formatTime(visitor.check_in_at)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Recent Complaints */}
        <Card padding="none">
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
            <h3 className="text-sm font-semibold text-gray-900">
              Recent Maintenance
            </h3>
            <Link
              href="/dashboard/staynest/complaints"
              className="text-xs font-medium text-amber-600 hover:text-amber-500"
            >
              View all
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {recentComplaints.length === 0 ? (
              <p className="px-4 py-6 text-center text-sm text-gray-400">
                No complaints yet.
              </p>
            ) : (
              recentComplaints.map((complaint) => (
                <div
                  key={complaint.id}
                  className="flex items-center justify-between px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {complaint.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      Status: {complaint.status}
                    </p>
                  </div>
                  <div className="text-right">
                    <StatusBadge
                      variant={complaintVariant[complaint.status] ?? 'default'}
                    >
                      {complaint.status.charAt(0).toUpperCase() +
                        complaint.status.slice(1)}
                    </StatusBadge>
                    <p className="mt-0.5 text-xs text-gray-400">
                      {formatDate(complaint.created_at)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
      </FadeIn>

      {/* Quick actions */}
      <FadeIn delay={100}>
      <div className="flex flex-wrap gap-3">
        <Link
          href="/dashboard/staynest/residents"
          className="min-h-[44px] inline-flex items-center rounded-lg border border-gray-200 bg-white px-5 py-3 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
        >
          ← Manage residents
        </Link>
        <Link
          href="/dashboard/staynest/visitors"
          className="min-h-[44px] inline-flex items-center rounded-lg border border-gray-200 bg-white px-5 py-3 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
        >
          ← Log a visitor
        </Link>
        <Link
          href="/dashboard/staynest/complaints"
          className="min-h-[44px] inline-flex items-center rounded-lg border border-gray-200 bg-white px-5 py-3 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
        >
          ← Raise request
        </Link>
          <Link
            href="/dashboard/staynest/rent"
            className="min-h-[44px] inline-flex items-center rounded-lg border border-gray-200 bg-white px-5 py-3 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
          >
            ← Check rent status
          </Link>
          <Link
            href="/dashboard/staynest/notices"
            className="min-h-[44px] inline-flex items-center rounded-lg border border-gray-200 bg-white px-5 py-3 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
          >
            ← View announcements
          </Link>
        </div>
      </FadeIn>
    </div>
  )
}
