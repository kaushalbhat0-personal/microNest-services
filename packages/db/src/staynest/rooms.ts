import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database, StayNestRoom } from '../types'

type DBClient = SupabaseClient<Database>

export async function listRooms(
  supabase: DBClient,
  organizationId: string
): Promise<StayNestRoom[]> {
  const { data } = await supabase
    .from('staynest_rooms')
    .select('*')
    .eq('organization_id', organizationId)
    .order('room_number', { ascending: true })
  return data ?? []
}

export async function getRoomById(
  supabase: DBClient,
  organizationId: string,
  id: string
): Promise<StayNestRoom | null> {
  const { data } = await supabase
    .from('staynest_rooms')
    .select('*')
    .eq('id', id)
    .eq('organization_id', organizationId)
    .single()
  return data
}

export async function createRoom(
  supabase: DBClient,
  organizationId: string,
  input: {
    room_number: string
    room_type?: string | null
    capacity: number
    occupied_count?: number
    monthly_rent: number
    notes?: string | null
  },
  userId: string
): Promise<StayNestRoom | null> {
  const { data } = await supabase
    .from('staynest_rooms')
    .insert({
      organization_id: organizationId,
      room_number: input.room_number,
      room_type: input.room_type ?? null,
      capacity: input.capacity,
      occupied_count: input.occupied_count ?? 0,
      monthly_rent: input.monthly_rent,
      notes: input.notes ?? null,
      created_by: userId,
    })
    .select('*')
    .single()
  return data
}

export async function updateRoom(
  supabase: DBClient,
  organizationId: string,
  id: string,
  input: {
    room_number: string
    room_type?: string | null
    capacity: number
    occupied_count?: number
    monthly_rent: number
    status?: 'active' | 'inactive' | 'maintenance'
    notes?: string | null
  }
): Promise<StayNestRoom | null> {
  const updates: Record<string, unknown> = {
    room_number: input.room_number,
    room_type: input.room_type ?? null,
    capacity: input.capacity,
    occupied_count: input.occupied_count ?? 0,
    monthly_rent: input.monthly_rent,
    notes: input.notes ?? null,
  }
  if (input.status) updates.status = input.status

  const { data } = await supabase
    .from('staynest_rooms')
    .update(updates)
    .eq('id', id)
    .eq('organization_id', organizationId)
    .select('*')
    .single()
  return data
}

export async function deactivateRoom(
  supabase: DBClient,
  organizationId: string,
  id: string
): Promise<StayNestRoom | null> {
  const { data } = await supabase
    .from('staynest_rooms')
    .update({ status: 'inactive' })
    .eq('id', id)
    .eq('organization_id', organizationId)
    .select('*')
    .single()
  return data
}

export async function countRoomsByStatus(
  supabase: DBClient,
  organizationId: string
): Promise<{ active: number; inactive: number; maintenance: number }> {
  const { data } = await supabase
    .from('staynest_rooms')
    .select('status')
    .eq('organization_id', organizationId)

  const active = (data ?? []).filter((r) => r.status === 'active').length
  const inactive = (data ?? []).filter((r) => r.status === 'inactive').length
  const maintenance = (data ?? []).filter((r) => r.status === 'maintenance').length

  return { active, inactive, maintenance }
}
