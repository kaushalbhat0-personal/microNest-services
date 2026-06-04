import type { Metadata } from 'next'
import Link from 'next/link'
import { Card, CardBody, StatusBadge } from '@micronest/ui'
import { createServerClient } from '@micronest/auth'
import { getUserOrganizations, listVisitors, listComplaints, countComplaintsByStatus, countResidentsByStatus, listRooms } from '@micronest/db'
import { STATS } from '@/lib/staynest/data'

export const metadata: Metadata = {
  title: 'StayNest',
}

const statusVariant: Record<string, 'info' | 'success'> = {
  'checked-in': 'info',
  'checked-out': 'success',
}

const complaintVariant: Record<string, 'info' | 'warning' | 'success'> = {
  open: 'info',
  'in-progress': 'warning',
  resolved: 'success',
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

  let recentVisitors: { id: string; name: string; room_number: string; purpose: string; status: string; check_in_at: string }[] = []
  let recentComplaints: { id: string; title: string; room_number: string; raised_by: string; status: string; created_at: string }[] = []
  let openComplaintsCount = 0
  let activeResidentsCount = 0
  let totalRooms = 0
  let totalCapacity = 0
  let totalOccupied = 0

  if (user) {
    const orgs = await getUserOrganizations(supabase, user.id)
    if (orgs.length > 0) {
      const orgId = orgs[0].id

      const allVisitors = await listVisitors(supabase, orgId)
      recentVisitors = allVisitors.slice(0, 3)

      const allComplaints = await listComplaints(supabase, orgId)
      recentComplaints = allComplaints.slice(0, 3)

      const complaintCounts = await countComplaintsByStatus(supabase, orgId)
      openComplaintsCount = complaintCounts.open

      const residentCounts = await countResidentsByStatus(supabase, orgId)
      activeResidentsCount = residentCounts.active

      const rooms = await listRooms(supabase, orgId)
      totalRooms = rooms.length
      totalCapacity = rooms.reduce((sum, r) => sum + r.capacity, 0)
      totalOccupied = rooms.reduce((sum, r) => sum + r.occupied_count, 0)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">StayNest Overview</h1>
        <p className="mt-1 text-sm text-gray-500">
          At a glance view of your property.
        </p>
      </div>

      {/* Stats grid */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardBody>
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
              Occupancy
            </p>
            <p className="mt-1 text-2xl font-bold text-gray-900">
              {totalOccupied}/{totalCapacity}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              {totalRooms} room{totalRooms !== 1 ? 's' : ''}
            </p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
              Active Residents
            </p>
            <p className="mt-1 text-2xl font-bold text-green-600">
              {activeResidentsCount}
            </p>
            <p className="mt-1 text-xs text-gray-500">Currently staying</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
              Open Complaints
            </p>
            <p className="mt-1 text-2xl font-bold text-amber-600">
              {openComplaintsCount}
            </p>
            <p className="mt-1 text-xs text-gray-500">Require attention</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
              Pending Rent
            </p>
            <p className="mt-1 text-2xl font-bold text-red-600">
              ₹{STATS.pendingRentAmount.toLocaleString()}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              {STATS.pendingRentCount} tenants overdue or pending
            </p>
          </CardBody>
        </Card>
      </div>

      {/* Recent Visitors + Recent Complaints */}
      <div className="grid gap-6 lg:grid-cols-2">
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
              Recent Complaints
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
                      Room {complaint.room_number} &middot;{' '}
                      {complaint.raised_by}
                    </p>
                  </div>
                  <div className="text-right">
                    <StatusBadge
                      variant={complaintVariant[complaint.status]}
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

      {/* Quick actions */}
      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/dashboard/staynest/residents"
          className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
        >
          ← Manage residents
        </Link>
        <Link
          href="/dashboard/staynest/visitors"
          className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
        >
          ← Log a visitor
        </Link>
        <Link
          href="/dashboard/staynest/complaints"
          className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
        >
          ← Raise a complaint
        </Link>
        <Link
          href="/dashboard/staynest/rent-reminder"
          className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
        >
          ← Check rent status
        </Link>
      </div>
    </div>
  )
}
