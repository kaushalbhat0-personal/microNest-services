import type { DBClient, StayNestVisitor } from '../types'

export async function listVisitors(
  supabase: DBClient,
  organizationId: string
): Promise<StayNestVisitor[]> {
  const { data } = await supabase
    .from('staynest_visitors')
    .select('*')
    .eq('organization_id', organizationId)
    .order('check_in_at', { ascending: false })
  return data ?? []
}

export async function getVisitorById(
  supabase: DBClient,
  organizationId: string,
  id: string
): Promise<StayNestVisitor | null> {
  const { data } = await supabase
    .from('staynest_visitors')
    .select('*')
    .eq('id', id)
    .eq('organization_id', organizationId)
    .single()
  return data
}

export async function createVisitor(
  supabase: DBClient,
  organizationId: string,
  input: {
    name: string
    phone: string
    purpose: string
    room_number: string
  },
  userId: string
): Promise<StayNestVisitor | null> {
  const { data } = await supabase
    .from('staynest_visitors')
    .insert({
      organization_id: organizationId,
      name: input.name,
      phone: input.phone,
      purpose: input.purpose,
      room_number: input.room_number,
      created_by: userId,
    })
    .select('*')
    .single()
  return data
}

export async function checkOutVisitor(
  supabase: DBClient,
  organizationId: string,
  id: string,
  userId: string
): Promise<StayNestVisitor | null> {
  const { data } = await supabase
    .from('staynest_visitors')
    .update({
      status: 'checked-out',
      check_out_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('organization_id', organizationId)
    .select('*')
    .single()
  return data
}

export async function countVisitorsByStatus(
  supabase: DBClient,
  organizationId: string
): Promise<{ checkedIn: number; checkedOut: number }> {
  const { data } = await supabase
    .from('staynest_visitors')
    .select('status')
    .eq('organization_id', organizationId)

  const checkedIn = (data ?? []).filter((v) => v.status === 'checked-in').length
  const checkedOut = (data ?? []).filter((v) => v.status === 'checked-out').length

  return { checkedIn, checkedOut }
}
