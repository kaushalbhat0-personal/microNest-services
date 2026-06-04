import type { Metadata } from 'next'
import { createServerClient } from '@micronest/auth'
import { getUserOrganizations, listResidents } from '@micronest/db'
import { ResidentsContent } from './residents-content'

export const metadata: Metadata = {
  title: 'Residents',
}

export default async function ResidentsPage() {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return <ResidentsContent initialResidents={[]} organizationId={null} />
  }

  const orgs = await getUserOrganizations(supabase, user.id)

  if (orgs.length === 0) {
    return <ResidentsContent initialResidents={[]} organizationId={null} />
  }

  const orgId = orgs[0].id
  const residents = await listResidents(supabase, orgId)

  return <ResidentsContent initialResidents={residents} organizationId={orgId} />
}
