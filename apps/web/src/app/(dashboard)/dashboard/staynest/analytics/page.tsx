import type { Metadata } from 'next'
import { createServerClient } from '@micronest/auth'
import { getUserOrganizations, getStayNestAnalytics } from '@micronest/db'
import { AnalyticsContent } from './analytics-content'

export const metadata: Metadata = {
  title: 'Analytics',
}

export default async function AnalyticsPage() {
  const supabase = await createServerClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return <AnalyticsContent analytics={null} />

  const orgs = await getUserOrganizations(supabase, user.id)
  if (orgs.length === 0) return <AnalyticsContent analytics={null} />

  const analytics = await getStayNestAnalytics(supabase, orgs[0].id)

  return <AnalyticsContent analytics={analytics} />
}
