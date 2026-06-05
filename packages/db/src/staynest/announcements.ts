import type { DBClient, StayNestAnnouncement } from '../types'

export async function listAnnouncements(
  supabase: DBClient,
  organizationId: string
): Promise<StayNestAnnouncement[]> {
  const { data } = await supabase
    .from('staynest_announcements')
    .select('*')
    .eq('organization_id', organizationId)
    .is('deleted_at', null)
    .order('publish_date', { ascending: false })
  return data ?? []
}

export async function getAnnouncementById(
  supabase: DBClient,
  organizationId: string,
  id: string
): Promise<StayNestAnnouncement | null> {
  const { data } = await supabase
    .from('staynest_announcements')
    .select('*')
    .eq('id', id)
    .eq('organization_id', organizationId)
    .single()
  return data
}

export async function createAnnouncement(
  supabase: DBClient,
  organizationId: string,
  input: {
    title: string
    message: string
    priority?: string
    publish_date?: string
    expiry_date?: string | null
  },
  userId: string
): Promise<StayNestAnnouncement | null> {
  const { data } = await supabase
    .from('staynest_announcements')
    .insert({
      organization_id: organizationId,
      title: input.title,
      message: input.message,
      priority: input.priority ?? 'normal',
      publish_date: input.publish_date ?? new Date().toISOString().slice(0, 10),
      expiry_date: input.expiry_date ?? null,
      created_by: userId,
    })
    .select('*')
    .single()
  return data
}

export async function updateAnnouncement(
  supabase: DBClient,
  organizationId: string,
  id: string,
  input: Partial<{
    title: string
    message: string
    priority: string
    publish_date: string
    expiry_date: string | null
  }>
): Promise<StayNestAnnouncement | null> {
  const { data } = await supabase
    .from('staynest_announcements')
    .update(input)
    .eq('id', id)
    .eq('organization_id', organizationId)
    .select('*')
    .single()
  return data
}

export async function deleteAnnouncement(
  supabase: DBClient,
  organizationId: string,
  id: string
): Promise<StayNestAnnouncement | null> {
  const { data } = await supabase
    .from('staynest_announcements')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id)
    .eq('organization_id', organizationId)
    .select('*')
    .single()
  return data
}

export async function listActiveAnnouncements(
  supabase: DBClient,
  organizationId: string
): Promise<StayNestAnnouncement[]> {
  const today = new Date().toISOString().slice(0, 10)
  const { data } = await supabase
    .from('staynest_announcements')
    .select('*')
    .eq('organization_id', organizationId)
    .is('deleted_at', null)
    .lte('publish_date', today)
    .order('publish_date', { ascending: false })
  return (data ?? []).filter(
    (a) => !a.expiry_date || a.expiry_date >= today
  )
}
