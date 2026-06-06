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
    assigned_to?: string | null
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
      assigned_to: input.assigned_to ?? null,
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
  userId: string,
  extra?: { assigned_to?: string | null; resolved_notes?: string | null }
): Promise<StayNestMaintenanceRequest | null> {
  const updates: Record<string, string | null | undefined> = { status }

  if (status === 'resolved') {
    updates.resolved_at = new Date().toISOString()
    updates.resolved_by = userId
  }

  if (extra?.assigned_to !== undefined) updates.assigned_to = extra.assigned_to
  if (extra?.resolved_notes !== undefined) updates.resolved_notes = extra.resolved_notes

  const { data } = await supabase
    .from('staynest_maintenance_requests')
    .update(updates)
    .eq('id', id)
    .eq('organization_id', organizationId)
    .select('*')
    .single()
  return data
}

export async function countMaintenanceRequestsByStatus(
  supabase: DBClient,
  organizationId: string
): Promise<{ open: number; inProgress: number; resolved: number; resolvedThisMonth: number }> {
  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

  const { data } = await supabase
    .from('staynest_maintenance_requests')
    .select('status, resolved_at')
    .eq('organization_id', organizationId)
    .is('deleted_at', null)

  let open = 0
  let inProgress = 0
  let resolved = 0
  let resolvedThisMonth = 0

  for (const r of data ?? []) {
    if (r.status === 'open') open++
    else if (r.status === 'in_progress') inProgress++
    else if (r.status === 'resolved') {
      resolved++
      if (r.resolved_at && r.resolved_at >= monthStart) resolvedThisMonth++
    }
  }

  return { open, inProgress, resolved, resolvedThisMonth }
}
