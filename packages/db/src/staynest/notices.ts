import type { DBClient, StayNestNotice } from '../types'

export async function listNotices(
  supabase: DBClient,
  organizationId: string
): Promise<StayNestNotice[]> {
  const { data } = await supabase
    .from('staynest_notices')
    .select('*')
    .eq('organization_id', organizationId)
    .order('created_at', { ascending: false })
  return data ?? []
}

export async function getNoticeById(
  supabase: DBClient,
  organizationId: string,
  id: string
): Promise<StayNestNotice | null> {
  const { data } = await supabase
    .from('staynest_notices')
    .select('*')
    .eq('id', id)
    .eq('organization_id', organizationId)
    .single()
  return data
}

export async function createNotice(
  supabase: DBClient,
  organizationId: string,
  input: {
    title: string
    content: string
  },
  userId: string
): Promise<StayNestNotice | null> {
  const { data } = await supabase
    .from('staynest_notices')
    .insert({
      organization_id: organizationId,
      title: input.title,
      content: input.content,
      created_by: userId,
    })
    .select('*')
    .single()
  return data
}

export async function updateNotice(
  supabase: DBClient,
  organizationId: string,
  id: string,
  input: {
    title: string
    content: string
  }
): Promise<StayNestNotice | null> {
  const { data } = await supabase
    .from('staynest_notices')
    .update({
      title: input.title,
      content: input.content,
    })
    .eq('id', id)
    .eq('organization_id', organizationId)
    .select('*')
    .single()
  return data
}

export async function publishNotice(
  supabase: DBClient,
  organizationId: string,
  id: string
): Promise<StayNestNotice | null> {
  const { data } = await supabase
    .from('staynest_notices')
    .update({
      status: 'published',
      published_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('organization_id', organizationId)
    .select('*')
    .single()
  return data
}

export async function archiveNotice(
  supabase: DBClient,
  organizationId: string,
  id: string
): Promise<StayNestNotice | null> {
  const { data } = await supabase
    .from('staynest_notices')
    .update({ status: 'archived' })
    .eq('id', id)
    .eq('organization_id', organizationId)
    .select('*')
    .single()
  return data
}

export async function countPublishedNotices(
  supabase: DBClient,
  organizationId: string
): Promise<number> {
  const { data } = await supabase
    .from('staynest_notices')
    .select('id', { count: 'exact', head: true })
    .eq('organization_id', organizationId)
    .eq('status', 'published')

  return data?.length ?? 0
}
