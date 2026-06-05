'use server'

import { createServerClient } from '@micronest/auth'
import {
  exportResidentsCSV,
  exportRentRecordsCSV,
  exportMaintenanceCSV,
  exportVisitorsCSV,
} from '@micronest/db'

async function getOrgId(supabase: Awaited<ReturnType<typeof createServerClient>>) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data } = await supabase
    .from('organization_members')
    .select('organization_id')
    .eq('user_id', user.id)
    .limit(1)
    .single()
  return data?.organization_id ?? null
}

export async function exportCSV(
  type: 'residents' | 'rent' | 'maintenance' | 'visitors'
): Promise<{ csv?: string; error?: string }> {
  const supabase = await createServerClient()

  const orgId = await getOrgId(supabase)
  if (!orgId) return { error: 'Not authenticated or no organization' }

  try {
    let csv = ''
    switch (type) {
      case 'residents':
        csv = await exportResidentsCSV(supabase, orgId)
        break
      case 'rent':
        csv = await exportRentRecordsCSV(supabase, orgId)
        break
      case 'maintenance':
        csv = await exportMaintenanceCSV(supabase, orgId)
        break
      case 'visitors':
        csv = await exportVisitorsCSV(supabase, orgId)
        break
    }
    return { csv }
  } catch {
    return { error: 'Failed to generate CSV.' }
  }
}
