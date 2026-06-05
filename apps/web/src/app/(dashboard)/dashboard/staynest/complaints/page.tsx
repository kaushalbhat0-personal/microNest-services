import type { Metadata } from 'next'
import { createServerClient } from '@micronest/auth'
import { getUserOrganizations, listMaintenanceRequests } from '@micronest/db'
import { ComplaintsContent } from './complaints-content'

export const metadata: Metadata = {
  title: 'Complaint Tracker',
}

export default async function ComplaintsPage() {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return <ComplaintsContent initialComplaints={[]} organizationId={null} />
  }

  const orgs = await getUserOrganizations(supabase, user.id)

  if (orgs.length === 0) {
    return <ComplaintsContent initialComplaints={[]} organizationId={null} />
  }

  const orgId = orgs[0].id
  const complaints = await listMaintenanceRequests(supabase, orgId)

  return <ComplaintsContent initialComplaints={complaints} organizationId={orgId} />
}
