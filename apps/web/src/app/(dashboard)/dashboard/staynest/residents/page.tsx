import type { Metadata } from 'next'
import { createServerClient } from '@micronest/auth'
import { getUserOrganizations, listResidents, getAllResidentPaymentSummaries } from '@micronest/db'
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
    return <ResidentsContent initialResidents={[]} paymentSummaries={{}} organizationId={null} />
  }

  const orgs = await getUserOrganizations(supabase, user.id)

  if (orgs.length === 0) {
    return <ResidentsContent initialResidents={[]} paymentSummaries={{}} organizationId={null} />
  }

  const orgId = orgs[0].id
  const [residents, summariesMap] = await Promise.all([
    listResidents(supabase, orgId),
    getAllResidentPaymentSummaries(supabase, orgId),
  ])

  const paymentSummaries = Object.fromEntries(summariesMap)

  return <ResidentsContent initialResidents={residents} paymentSummaries={paymentSummaries} organizationId={orgId} />
}
