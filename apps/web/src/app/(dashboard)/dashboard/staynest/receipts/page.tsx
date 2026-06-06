import type { Metadata } from 'next'
import { createServerClient } from '@micronest/auth'
import { getUserOrganizations, listReceipts } from '@micronest/db'
import { ReceiptsContent } from './receipts-content'

export const metadata: Metadata = {
  title: 'Receipts',
}

export default async function ReceiptsPage() {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return <ReceiptsContent receipts={[]} organizationId={null} />
  }

  const orgs = await getUserOrganizations(supabase, user.id)

  if (orgs.length === 0) {
    return <ReceiptsContent receipts={[]} organizationId={null} />
  }

  const orgId = orgs[0].id
  const receipts = await listReceipts(supabase, orgId)

  return <ReceiptsContent receipts={receipts} organizationId={orgId} />
}
