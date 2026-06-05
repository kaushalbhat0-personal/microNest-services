import type { DBClient, StayNestMaintenanceRequest } from '../types'

export async function listMaintenanceRequests(
  supabase: DBClient,
  organizationId: string,
  options?: { status?: string; category?: string; priority?: string }
): Promise<StayNestMaintenanceRequest[]> {
  let query = supabase
    .from('staynest_maintenance_requests')
    .select('*')
    .eq('organization_id', organizationId)
    .is('deleted_at', null)

  if (options?.status) query = query.eq('status', options.status)
  if (options?.category) query = query.eq('category', options.category)
  if (options?.priority) query = query.eq('priority', options.priority)

  const { data } = await query.order('created_at', { ascending: false })
  return data ?? []
}

export async function getMaintenanceRequestById(
  supabase: DBClient,
  organizationId: string,
  id: string
): Promise<StayNestMaintenanceRequest | null> {
  const { data } = await supabase
    .from('staynest_maintenance_requests')
    .select('*')
    .eq('id', id)
    .eq('organization_id', organizationId)
    .single()
  return data
}

export async function createMaintenanceRequest(
  supabase: DBClient,
  organizationId: string,
  input: {
    title: string
    description: string
    category: string
    priority?: string
    resident_id?: string | null
    room_id?: string | null
  },
  userId: string
): Promise<StayNestMaintenanceRequest | null> {
  const { data } = await supabase
    .from('staynest_maintenance_requests')
    .insert({
      organization_id: organizationId,
      title: input.title,
      description: input.description,
      category: input.category,
      priority: input.priority ?? 'medium',
      resident_id: input.resident_id ?? null,
      room_id: input.room_id ?? null,
      created_by: userId,
    })
    .select('*')
    .single()
  return data
}

export async function updateMaintenanceRequestStatus(
  supabase: DBClient,
  organizationId: string,
  id: string,
  status: StayNestMaintenanceRequest['status'],
  userId: string
): Promise<StayNestMaintenanceRequest | null> {
  const updates: Record<string, string | null> = { status }

  if (status === 'resolved' || status === 'closed') {
    updates.resolved_at = new Date().toISOString()
    updates.resolved_by = userId
  }

  const { data } = await supabase
    .from('staynest_maintenance_requests')
    .update(updates)
    .eq('id', id)
    .eq('organization_id', organizationId)
    .select('*')
    .single()
  return data
}

export async function assignMaintenanceRequest(
  supabase: DBClient,
  organizationId: string,
  id: string,
  assignedTo: string
): Promise<StayNestMaintenanceRequest | null> {
  const { data } = await supabase
    .from('staynest_maintenance_requests')
    .update({ assigned_to: assignedTo, status: 'assigned' })
    .eq('id', id)
    .eq('organization_id', organizationId)
    .select('*')
    .single()
  return data
}

export async function countMaintenanceRequestsByStatus(
  supabase: DBClient,
  organizationId: string
): Promise<Record<string, number>> {
  const { data } = await supabase
    .from('staynest_maintenance_requests')
    .select('status')
    .eq('organization_id', organizationId)
    .is('deleted_at', null)

  const counts: Record<string, number> = {}
  for (const r of data ?? []) {
    counts[r.status] = (counts[r.status] ?? 0) + 1
  }
  return counts
}
