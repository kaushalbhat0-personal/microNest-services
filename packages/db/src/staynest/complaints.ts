import type { DBClient, StayNestComplaint } from '../types'

export async function listComplaints(
  supabase: DBClient,
  organizationId: string
): Promise<StayNestComplaint[]> {
  const { data } = await supabase
    .from('staynest_complaints')
    .select('*')
    .eq('organization_id', organizationId)
    .order('created_at', { ascending: false }) as unknown as { data: StayNestComplaint[] | null; error: unknown }
  return data ?? []
}

export async function getComplaintById(
  supabase: DBClient,
  organizationId: string,
  id: string
): Promise<StayNestComplaint | null> {
  const { data } = await supabase
    .from('staynest_complaints')
    .select('*')
    .eq('id', id)
    .eq('organization_id', organizationId)
    .single() as unknown as { data: StayNestComplaint | null; error: unknown }
  return data
}

export async function createComplaint(
  supabase: DBClient,
  organizationId: string,
  input: {
    title: string
    description: string
    raised_by: string
    room_number: string
    priority: 'low' | 'medium' | 'high'
  },
  userId: string
): Promise<StayNestComplaint | null> {
  const { data } = await supabase
    .from('staynest_complaints')
    .insert({
      organization_id: organizationId,
      title: input.title,
      description: input.description,
      raised_by: input.raised_by,
      room_number: input.room_number,
      priority: input.priority,
      created_by: userId,
    })
    .select('*')
    .single() as unknown as { data: StayNestComplaint | null; error: unknown }
  return data
}

export async function updateComplaintStatus(
  supabase: DBClient,
  organizationId: string,
  id: string,
  status: StayNestComplaint['status'],
  userId: string
): Promise<StayNestComplaint | null> {
  const updates: Record<string, string | null> = {
    status,
  }

  if (status === 'resolved') {
    updates.resolved_at = new Date().toISOString()
    updates.resolved_by = userId
  }

  const { data } = await supabase
    .from('staynest_complaints')
    .update(updates)
    .eq('id', id)
    .eq('organization_id', organizationId)
    .select('*')
    .single() as unknown as { data: StayNestComplaint | null; error: unknown }
  return data
}

export async function countComplaintsByStatus(
  supabase: DBClient,
  organizationId: string
): Promise<{ open: number; inProgress: number; resolved: number }> {
  const { data } = await supabase
    .from('staynest_complaints')
    .select('status')
    .eq('organization_id', organizationId) as unknown as { data: { status: string }[] | null; error: unknown }

  const open = (data ?? []).filter((c) => c.status === 'open').length
  const inProgress = (data ?? []).filter((c) => c.status === 'in-progress').length
  const resolved = (data ?? []).filter((c) => c.status === 'resolved').length

  return { open, inProgress, resolved }
}
