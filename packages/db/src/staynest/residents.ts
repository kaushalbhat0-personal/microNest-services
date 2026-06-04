import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database, StayNestResident } from '../types'

type DBClient = SupabaseClient<Database>

export async function listResidents(
  supabase: DBClient,
  organizationId: string
): Promise<StayNestResident[]> {
  const { data } = await supabase
    .from('staynest_residents')
    .select('*')
    .eq('organization_id', organizationId)
    .order('full_name', { ascending: true })
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
    guardian_name?: string | null
    guardian_phone?: string | null
    room_number: string
    joining_date: string
    notes?: string | null
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
      guardian_name: input.guardian_name ?? null,
      guardian_phone: input.guardian_phone ?? null,
      room_number: input.room_number,
      joining_date: input.joining_date,
      notes: input.notes ?? null,
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
  input: {
    full_name: string
    phone: string
    email?: string | null
    gender?: string | null
    guardian_name?: string | null
    guardian_phone?: string | null
    room_number: string
    joining_date: string
    notes?: string | null
  }
): Promise<StayNestResident | null> {
  const { data } = await supabase
    .from('staynest_residents')
    .update({
      full_name: input.full_name,
      phone: input.phone,
      email: input.email ?? null,
      gender: input.gender ?? null,
      guardian_name: input.guardian_name ?? null,
      guardian_phone: input.guardian_phone ?? null,
      room_number: input.room_number,
      joining_date: input.joining_date,
      notes: input.notes ?? null,
    })
    .eq('id', id)
    .eq('organization_id', organizationId)
    .select('*')
    .single()
  return data
}

export async function deactivateResident(
  supabase: DBClient,
  organizationId: string,
  id: string
): Promise<StayNestResident | null> {
  const { data } = await supabase
    .from('staynest_residents')
    .update({ status: 'inactive' })
    .eq('id', id)
    .eq('organization_id', organizationId)
    .select('*')
    .single()
  return data
}

export async function countResidentsByStatus(
  supabase: DBClient,
  organizationId: string
): Promise<{ active: number; inactive: number }> {
  const { data } = await supabase
    .from('staynest_residents')
    .select('status')
    .eq('organization_id', organizationId)

  const active = (data ?? []).filter((r) => r.status === 'active').length
  const inactive = (data ?? []).filter((r) => r.status === 'inactive').length

  return { active, inactive }
}
