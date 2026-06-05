import type { DBClient, StayNestRentRecord } from '../types'

export async function listRentRecords(
  supabase: DBClient,
  organizationId: string,
  status?: 'pending' | 'paid' | 'overdue'
): Promise<StayNestRentRecord[]> {
  let query = supabase
    .from('staynest_rent_records')
    .select('*')
    .eq('organization_id', organizationId)
    .order('due_date', { ascending: false })

  if (status) {
    query = query.eq('status', status)
  }

  const { data } = await query
  return data ?? []
}

export async function getRentRecordById(
  supabase: DBClient,
  organizationId: string,
  id: string
): Promise<StayNestRentRecord | null> {
  const { data } = await supabase
    .from('staynest_rent_records')
    .select('*')
    .eq('id', id)
    .eq('organization_id', organizationId)
    .single()
  return data
}

export async function createRentRecord(
  supabase: DBClient,
  organizationId: string,
  input: {
    resident_id: string
    room_id?: string | null
    billing_month: number
    billing_year: number
    amount: number
    due_date: string
    notes?: string | null
  },
  userId: string
): Promise<StayNestRentRecord | null> {
  const { data } = await supabase
    .from('staynest_rent_records')
    .insert({
      organization_id: organizationId,
      resident_id: input.resident_id,
      room_id: input.room_id ?? null,
      billing_month: input.billing_month,
      billing_year: input.billing_year,
      amount: input.amount,
      due_date: input.due_date,
      notes: input.notes ?? null,
      created_by: userId,
    })
    .select('*')
    .single()
  return data
}

export async function markRentPaid(
  supabase: DBClient,
  organizationId: string,
  id: string,
  paymentMethod: 'cash' | 'upi' | 'bank_transfer' | 'other'
): Promise<StayNestRentRecord | null> {
  const { data } = await supabase
    .from('staynest_rent_records')
    .update({
      status: 'paid',
      paid_at: new Date().toISOString(),
      payment_method: paymentMethod,
    })
    .eq('id', id)
    .eq('organization_id', organizationId)
    .select('*')
    .single()
  return data
}

export async function countPendingRent(
  supabase: DBClient,
  organizationId: string
): Promise<number> {
  const { data } = await supabase
    .from('staynest_rent_records')
    .select('amount')
    .eq('organization_id', organizationId)
    .eq('status', 'pending')

  return (data ?? []).reduce((sum, r) => sum + r.amount, 0)
}

export async function countCollectedRent(
  supabase: DBClient,
  organizationId: string
): Promise<number> {
  const { data } = await supabase
    .from('staynest_rent_records')
    .select('amount')
    .eq('organization_id', organizationId)
    .eq('status', 'paid')

  return (data ?? []).reduce((sum, r) => sum + r.amount, 0)
}

export async function countOverdueRent(
  supabase: DBClient,
  organizationId: string
): Promise<number> {
  const { data } = await supabase
    .from('staynest_rent_records')
    .select('amount')
    .eq('organization_id', organizationId)
    .eq('status', 'overdue')

  return (data ?? []).reduce((sum, r) => sum + r.amount, 0)
}

export async function countPendingRecords(
  supabase: DBClient,
  organizationId: string
): Promise<number> {
  const { data } = await supabase
    .from('staynest_rent_records')
    .select('id', { count: 'exact', head: true })
    .eq('organization_id', organizationId)
    .eq('status', 'pending')

  return data?.length ?? 0
}
