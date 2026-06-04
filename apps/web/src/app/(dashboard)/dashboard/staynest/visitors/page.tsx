import type { Metadata } from 'next'
import { createServerClient } from '@micronest/auth'
import { getUserOrganizations, listVisitors } from '@micronest/db'
import { VisitorsContent } from './visitors-content'

export const metadata: Metadata = {
  title: 'Visitor Log',
}

export default async function VisitorLogPage() {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return <VisitorsContent initialVisitors={[]} organizationId={null} />
  }

  const orgs = await getUserOrganizations(supabase, user.id)

  if (orgs.length === 0) {
    return <VisitorsContent initialVisitors={[]} organizationId={null} />
  }

  const orgId = orgs[0].id
  const visitors = await listVisitors(supabase, orgId)

  return <VisitorsContent initialVisitors={visitors} organizationId={orgId} />
}
