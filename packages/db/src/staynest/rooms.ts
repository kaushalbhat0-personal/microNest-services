import type { DBClient, StayNestRoom } from '../types'

export async function listRooms(
  supabase: DBClient,
  organizationId: string,
  options?: { status?: string }
): Promise<StayNestRoom[]> {
  let query = supabase
    .from('staynest_rooms')
    .select('*')
    .eq('organization_id', organizationId)
    .is('deleted_at', null)

  if (options?.status) {
    query = query.eq('status', options.status)
  }

  const { data } = await query.order('room_number', { ascending: true })
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
    floor?: number | null
    capacity: number
    rent_per_bed: number
  },
  userId: string
): Promise<StayNestRoom | null> {
  const { data } = await supabase
    .from('staynest_rooms')
    .insert({
      organization_id: organizationId,
      room_number: input.room_number,
      floor: input.floor ?? null,
      capacity: input.capacity,
      rent_per_bed: input.rent_per_bed,
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
  input: Partial<{
    room_number: string
    floor: number | null
    capacity: number
    rent_per_bed: number
    status: string
  }>
): Promise<StayNestRoom | null> {
  const { data } = await supabase
    .from('staynest_rooms')
    .update(input)
    .eq('id', id)
    .eq('organization_id', organizationId)
    .select('*')
    .single()
  return data
}

export async function softDeleteRoom(
  supabase: DBClient,
  organizationId: string,
  id: string
): Promise<StayNestRoom | null> {
  const { data } = await supabase
    .from('staynest_rooms')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id)
    .eq('organization_id', organizationId)
    .select('*')
    .single()
  return data
}

export async function countRoomsByStatus(
  supabase: DBClient,
  organizationId: string
): Promise<{ available: number; partially_occupied: number; full: number; maintenance: number }> {
  const { data } = await supabase
    .from('staynest_rooms')
    .select('status')
    .eq('organization_id', organizationId)
    .is('deleted_at', null)

  const counts = { available: 0, partially_occupied: 0, full: 0, maintenance: 0 }
  for (const r of data ?? []) {
    if (r.status in counts) {
      counts[r.status as keyof typeof counts]++
    }
  }
  return counts
}

export async function getRoomsWithVacancy(
  supabase: DBClient,
  organizationId: string
): Promise<StayNestRoom[]> {
  const { data } = await supabase
    .from('staynest_rooms')
    .select('*')
    .eq('organization_id', organizationId)
    .is('deleted_at', null)
    .lt('occupied_beds', 'capacity' as any)
    .in('status', ['available', 'partially_occupied'])
    .order('room_number', { ascending: true })
  return data ?? []
}

export async function updateRoomOccupancy(
  supabase: DBClient,
  organizationId: string,
  roomId: string
): Promise<void> {
  const { count } = await supabase
    .from('staynest_residents')
    .select('*', { count: 'exact', head: true })
    .eq('organization_id', organizationId)
    .eq('room_id', roomId)
    .eq('status', 'active')
    .is('deleted_at', null)

  const room = await getRoomById(supabase, organizationId, roomId)
  if (!room) return

  const occupied = count ?? 0
  const newStatus = occupied >= room.capacity
    ? 'full'
    : occupied > 0
      ? 'partially_occupied'
      : 'available'

  await supabase
    .from('staynest_rooms')
    .update({ occupied_beds: occupied, status: newStatus })
    .eq('id', roomId)
    .eq('organization_id', organizationId)
}
