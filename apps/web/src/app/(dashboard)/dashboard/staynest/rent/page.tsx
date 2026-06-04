import type { Metadata } from 'next'
import { createServerClient } from '@micronest/auth'
import {
  getUserOrganizations,
  listRentRecords,
  listResidents,
  listRooms,
  countPendingRent,
  countCollectedRent,
  countOverdueRent,
  countPendingRecords,
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
        totalDue={0}
        collected={0}
        overdue={0}
        pendingCount={0}
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
        totalDue={0}
        collected={0}
        overdue={0}
        pendingCount={0}
      />
    )
  }

  const orgId = orgs[0].id

  const [records, residents, rooms, pendingRent, collected, overdueAmt, pendingRecs] =
    await Promise.all([
      listRentRecords(supabase, orgId),
      listResidents(supabase, orgId),
      listRooms(supabase, orgId),
      countPendingRent(supabase, orgId),
      countCollectedRent(supabase, orgId),
      countOverdueRent(supabase, orgId),
      countPendingRecords(supabase, orgId),
    ])

  const totalDue = pendingRent + overdueAmt

  return (
    <RentContent
      initialRecords={records}
      residents={residents}
      rooms={rooms}
      organizationId={orgId}
      totalDue={totalDue}
      collected={collected}
      overdue={overdueAmt}
      pendingCount={pendingRecs}
    />
  )
}
