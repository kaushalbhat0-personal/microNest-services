import type { Metadata } from 'next'
import { createServerClient } from '@micronest/auth'
import {
  getUserOrganizations,
  listRentRecords,
  listResidents,
  listRooms,
  getRevenueStats,
} from '@micronest/db'
import { RentContent } from './rent-content'

export const metadata: Metadata = {
  title: 'Rent Management',
}

export default async function RentPage() {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return (
      <RentContent
        initialRecords={[]}
        residents={[]}
        rooms={[]}
        organizationId={null}
        stats={{ monthlyRevenue: 0, pendingRevenue: 0, overdueRevenue: 0, collectionRate: 0, totalCollected: 0, totalDue: 0 }}
      />
    )
  }

  const orgs = await getUserOrganizations(supabase, user.id)

  if (orgs.length === 0) {
    return (
      <RentContent
        initialRecords={[]}
        residents={[]}
        rooms={[]}
        organizationId={null}
        stats={{ monthlyRevenue: 0, pendingRevenue: 0, overdueRevenue: 0, collectionRate: 0, totalCollected: 0, totalDue: 0 }}
      />
    )
  }

  const orgId = orgs[0].id

  const [records, residents, rooms, stats] = await Promise.all([
    listRentRecords(supabase, orgId),
    listResidents(supabase, orgId),
    listRooms(supabase, orgId),
    getRevenueStats(supabase, orgId),
  ])

  return (
    <RentContent
      initialRecords={records}
      residents={residents}
      rooms={rooms}
      organizationId={orgId}
      stats={stats}
    />
  )
}
