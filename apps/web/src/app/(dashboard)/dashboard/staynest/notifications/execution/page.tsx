import type { Metadata } from 'next'
import { createServerClient } from '@micronest/auth'
import { getUserOrganizations, getNotificationEngineStats } from '@micronest/db'
import { ExecutionContent } from './execution-content'

export const metadata: Metadata = {
  title: 'Notification Execution',
}

export default async function ExecutionPage() {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return <ExecutionContent stats={null} organizationId={null} />
  }

  const orgs = await getUserOrganizations(supabase, user.id)

  if (orgs.length === 0) {
    return <ExecutionContent stats={null} organizationId={null} />
  }

  const orgId = orgs[0].id
  const stats = await getNotificationEngineStats(supabase, orgId)

  return <ExecutionContent stats={stats} organizationId={orgId} />
}
