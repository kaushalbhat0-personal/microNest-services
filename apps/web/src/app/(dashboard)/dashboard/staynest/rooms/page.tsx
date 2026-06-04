import type { Metadata } from 'next'
import { createServerClient } from '@micronest/auth'
import { getUserOrganizations, listRooms } from '@micronest/db'
import { RoomsContent } from './rooms-content'

export const metadata: Metadata = {
  title: 'Rooms',
}

export default async function RoomsPage() {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return <RoomsContent initialRooms={[]} organizationId={null} />
  }

  const orgs = await getUserOrganizations(supabase, user.id)

  if (orgs.length === 0) {
    return <RoomsContent initialRooms={[]} organizationId={null} />
  }

  const orgId = orgs[0].id
  const rooms = await listRooms(supabase, orgId)

  return <RoomsContent initialRooms={rooms} organizationId={orgId} />
}
