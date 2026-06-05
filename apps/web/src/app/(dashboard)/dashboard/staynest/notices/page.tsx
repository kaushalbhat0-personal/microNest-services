import type { Metadata } from 'next'
import { createServerClient } from '@micronest/auth'
import { getUserOrganizations, listNotices } from '@micronest/db'
import { NoticesContent } from './notices-content'

export const metadata: Metadata = {
  title: 'Notices',
}

export default async function NoticesPage() {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return <NoticesContent initialNotices={[]} organizationId={null} />
  }

  const orgs = await getUserOrganizations(supabase, user.id)

  if (orgs.length === 0) {
    return <NoticesContent initialNotices={[]} organizationId={null} />
  }

  const orgId = orgs[0].id
  const notices = await listNotices(supabase, orgId)

  return <NoticesContent initialNotices={notices} organizationId={orgId} />
}
