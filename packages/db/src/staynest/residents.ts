import type { DBClient, StayNestResident } from '../types'

export async function listResidents(
  supabase: DBClient,
  organizationId: string,
  options?: { status?: string; search?: string }
): Promise<StayNestResident[]> {
  let query = supabase
    .from('staynest_residents')
    .select('*')
    .eq('organization_id', organizationId)
    .is('deleted_at', null)

  if (options?.status) {
    query = query.eq('status', options.status)
  }

  if (options?.search) {
    query = query.or(
      `full_name.ilike.%${options.search}%,phone.ilike.%${options.search}%`
    )
  }

  const { data } = await query.order('full_name', { ascending: true })
  return data ?? []
}

export async function getResidentById(
  supabase: DBClient,
  organizationId: string,
  id: string
): Promise<StayNestResident | null> {
  const { data } = await supabase
    .from('staynest_residents')
    .select('*')
    .eq('id', id)
    .eq('organization_id', organizationId)
    .single()
  return data
}

export async function createResident(
  supabase: DBClient,
  organizationId: string,
  input: {
    full_name: string
    phone: string
    email?: string | null
    gender?: string | null
    emergency_contact_name?: string | null
    emergency_contact_phone?: string | null
    id_proof_type?: string | null
    id_proof_number?: string | null
    room_id?: string | null
    bed_number?: number | null
    check_in_date: string
  },
  userId: string
): Promise<StayNestResident | null> {
  const { data } = await supabase
    .from('staynest_residents')
    .insert({
      organization_id: organizationId,
      full_name: input.full_name,
      phone: input.phone,
      email: input.email ?? null,
      gender: input.gender ?? null,
      emergency_contact_name: input.emergency_contact_name ?? null,
      emergency_contact_phone: input.emergency_contact_phone ?? null,
      id_proof_type: input.id_proof_type ?? null,
      id_proof_number: input.id_proof_number ?? null,
      room_id: input.room_id ?? null,
      bed_number: input.bed_number ?? null,
      check_in_date: input.check_in_date,
      created_by: userId,
    })
    .select('*')
    .single()
  return data
}

export async function updateResident(
  supabase: DBClient,
  organizationId: string,
  id: string,
  input: Partial<{
    full_name: string
    phone: string
    email: string | null
    gender: string | null
    emergency_contact_name: string | null
    emergency_contact_phone: string | null
    id_proof_type: string | null
    id_proof_number: string | null
    room_id: string | null
    bed_number: number | null
    check_in_date: string
    status: string
    check_out_date: string | null
  }>
): Promise<StayNestResident | null> {
  const { data } = await supabase
    .from('staynest_residents')
    .update(input)
    .eq('id', id)
    .eq('organization_id', organizationId)
    .select('*')
    .single()
  return data
}

export async function checkoutResident(
  supabase: DBClient,
  organizationId: string,
  id: string
): Promise<StayNestResident | null> {
  const { data } = await supabase
    .from('staynest_residents')
    .update({
      status: 'checked_out',
      check_out_date: new Date().toISOString().slice(0, 10),
    })
    .eq('id', id)
    .eq('organization_id', organizationId)
    .select('*')
    .single()
  return data
}

export async function softDeleteResident(
  supabase: DBClient,
  organizationId: string,
  id: string
): Promise<StayNestResident | null> {
  const { data } = await supabase
    .from('staynest_residents')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id)
    .eq('organization_id', organizationId)
    .select('*')
    .single()
  return data
}

export async function countResidentsByStatus(
  supabase: DBClient,
  organizationId: string
): Promise<{ active: number; notice_period: number; checked_out: number }> {
  const { data } = await supabase
    .from('staynest_residents')
    .select('status')
    .eq('organization_id', organizationId)
    .is('deleted_at', null)

  const counts = { active: 0, notice_period: 0, checked_out: 0 }
  for (const r of data ?? []) {
    if (r.status === 'active') counts.active++
    else if (r.status === 'notice_period') counts.notice_period++
    else if (r.status === 'checked_out') counts.checked_out++
  }
  return counts
}
