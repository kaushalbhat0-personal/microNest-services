import type { Metadata } from 'next'
import { createServerClient } from '@micronest/auth'
import { getUserOrganizations, listMaintenanceRequests, countMaintenanceRequestsByStatus, listResidents, listRooms } from '@micronest/db'
import { MaintenanceContent } from './maintenance-content'

export const metadata: Metadata = {
  title: 'Maintenance Requests',
}

export default async function MaintenancePage() {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return <MaintenanceContent initialRequests={[]} counts={{ open: 0, inProgress: 0, resolved: 0, resolvedThisMonth: 0 }} residents={[]} rooms={[]} organizationId={null} />
  }

  const orgs = await getUserOrganizations(supabase, user.id)

  if (orgs.length === 0) {
    return <MaintenanceContent initialRequests={[]} counts={{ open: 0, inProgress: 0, resolved: 0, resolvedThisMonth: 0 }} residents={[]} rooms={[]} organizationId={null} />
  }

  const orgId = orgs[0].id

  const [requests, counts, residents, rooms] = await Promise.all([
    listMaintenanceRequests(supabase, orgId),
    countMaintenanceRequestsByStatus(supabase, orgId),
    listResidents(supabase, orgId),
    listRooms(supabase, orgId),
  ])

  return <MaintenanceContent initialRequests={requests} counts={counts} residents={residents} rooms={rooms} organizationId={orgId} />
}
