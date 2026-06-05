import type { DBClient, StayNestResident, StayNestRoom, StayNestMaintenanceRequest, StayNestVisitor } from '../types'

export interface GlobalSearchResult {
  residents: (Pick<StayNestResident, 'id' | 'full_name' | 'phone' | 'status' | 'room_id'>)[]
  rooms: (Pick<StayNestRoom, 'id' | 'room_number' | 'floor' | 'status'>)[]
  maintenance: (Pick<StayNestMaintenanceRequest, 'id' | 'title' | 'status' | 'priority'>)[]
  visitors: (Pick<StayNestVisitor, 'id' | 'name' | 'phone' | 'purpose' | 'status'>)[]
}

export async function globalSearch(
  supabase: DBClient,
  organizationId: string,
  query: string
): Promise<GlobalSearchResult> {
  const searchTerm = `%${query}%`

  const [residentsRes, roomsRes, maintenanceRes, visitorsRes] = await Promise.all([
    supabase
      .from('staynest_residents')
      .select('id, full_name, phone, status, room_id')
      .eq('organization_id', organizationId)
      .is('deleted_at', null)
      .or(`full_name.ilike.${searchTerm},phone.ilike.${searchTerm}`)
      .limit(10),

    supabase
      .from('staynest_rooms')
      .select('id, room_number, floor, status')
      .eq('organization_id', organizationId)
      .is('deleted_at', null)
      .or(`room_number.ilike.${searchTerm},status.ilike.${searchTerm}`)
      .limit(10),

    supabase
      .from('staynest_maintenance_requests')
      .select('id, title, status, priority')
      .eq('organization_id', organizationId)
      .is('deleted_at', null)
      .or(`title.ilike.${searchTerm},description.ilike.${searchTerm},status.ilike.${searchTerm}`)
      .limit(10),

    supabase
      .from('staynest_visitors')
      .select('id, name, phone, purpose, status')
      .eq('organization_id', organizationId)
      .is('deleted_at', null)
      .or(`name.ilike.${searchTerm},phone.ilike.${searchTerm},purpose.ilike.${searchTerm}`)
      .limit(10),
  ])

  return {
    residents: (residentsRes.data ?? []) as any,
    rooms: (roomsRes.data ?? []) as any,
    maintenance: (maintenanceRes.data ?? []) as any,
    visitors: (visitorsRes.data ?? []) as any,
  }
}
