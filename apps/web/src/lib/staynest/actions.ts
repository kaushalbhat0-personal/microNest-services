'use server'

import { revalidatePath } from 'next/cache'
import { createServerClient } from '@micronest/auth'
import {
  createVisitor as dbCreateVisitor,
  checkOutVisitor as dbCheckOutVisitor,
  createComplaint as dbCreateComplaint,
  updateComplaintStatus as dbUpdateComplaintStatus,
  createResident as dbCreateResident,
  updateResident as dbUpdateResident,
  deactivateResident as dbDeactivateResident,
  createRoom as dbCreateRoom,
  updateRoom as dbUpdateRoom,
  deactivateRoom as dbDeactivateRoom,
  createAuditLog,
} from '@micronest/db'

export async function createVisitor(
  _prev: { error?: string | null; success?: boolean },
  formData: FormData
) {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated', success: false }

  const { data: orgs } = await supabase
    .from('organization_members')
    .select('organization_id')
    .eq('user_id', user.id)
    .limit(1)
    .single()

  if (!orgs) return { error: 'No organization found', success: false }

  const name = formData.get('name') as string
  const phone = formData.get('phone') as string
  const purpose = formData.get('purpose') as string
  const roomNumber = formData.get('room_number') as string

  if (!name?.trim() || !phone?.trim() || !purpose?.trim()) {
    return { error: 'Name, phone, and purpose are required.', success: false }
  }

  const visitor = await dbCreateVisitor(
    supabase,
    orgs.organization_id,
    { name, phone, purpose, room_number: roomNumber ?? '' },
    user.id
  )

  if (!visitor) return { error: 'Failed to log visitor.', success: false }

  await createAuditLog(supabase, {
    organization_id: orgs.organization_id,
    user_id: user.id,
    action: 'visitor.created',
    entity_type: 'staynest_visitor',
    entity_id: visitor.id,
  })

  revalidatePath('/dashboard/staynest/visitors')
  revalidatePath('/dashboard/staynest')
  return { error: null, success: true }
}

export async function checkOutVisitor(id: string) {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { data: orgs } = await supabase
    .from('organization_members')
    .select('organization_id')
    .eq('user_id', user.id)
    .limit(1)
    .single()

  if (!orgs) return { error: 'No organization found' }

  const visitor = await dbCheckOutVisitor(supabase, orgs.organization_id, id, user.id)

  if (!visitor) return { error: 'Failed to check out visitor.' }

  await createAuditLog(supabase, {
    organization_id: orgs.organization_id,
    user_id: user.id,
    action: 'visitor.checked_out',
    entity_type: 'staynest_visitor',
    entity_id: id,
  })

  revalidatePath('/dashboard/staynest/visitors')
  revalidatePath('/dashboard/staynest')
}

export async function createComplaint(
  _prev: { error?: string | null; success?: boolean },
  formData: FormData
) {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated', success: false }

  const { data: orgs } = await supabase
    .from('organization_members')
    .select('organization_id')
    .eq('user_id', user.id)
    .limit(1)
    .single()

  if (!orgs) return { error: 'No organization found', success: false }

  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const raisedBy = formData.get('raised_by') as string
  const roomNumber = formData.get('room_number') as string
  const priority = formData.get('priority') as 'low' | 'medium' | 'high'

  if (!title?.trim() || !description?.trim() || !raisedBy?.trim()) {
    return { error: 'Title, description, and raised by are required.', success: false }
  }

  const complaint = await dbCreateComplaint(
    supabase,
    orgs.organization_id,
    { title, description, raised_by: raisedBy, room_number: roomNumber ?? '', priority: priority ?? 'medium' },
    user.id
  )

  if (!complaint) return { error: 'Failed to raise complaint.', success: false }

  await createAuditLog(supabase, {
    organization_id: orgs.organization_id,
    user_id: user.id,
    action: 'complaint.created',
    entity_type: 'staynest_complaint',
    entity_id: complaint.id,
  })

  revalidatePath('/dashboard/staynest/complaints')
  revalidatePath('/dashboard/staynest')
  return { error: null, success: true }
}

export async function updateComplaintStatus(id: string, status: 'open' | 'in-progress' | 'resolved') {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { data: orgs } = await supabase
    .from('organization_members')
    .select('organization_id')
    .eq('user_id', user.id)
    .limit(1)
    .single()

  if (!orgs) return { error: 'No organization found' }

  const complaint = await dbUpdateComplaintStatus(supabase, orgs.organization_id, id, status, user.id)

  if (!complaint) return { error: 'Failed to update complaint status.' }

  const auditAction = status === 'resolved' ? 'complaint.resolved' : 'complaint.status_changed'
  await createAuditLog(supabase, {
    organization_id: orgs.organization_id,
    user_id: user.id,
    action: auditAction,
    entity_type: 'staynest_complaint',
    entity_id: id,
    metadata: { new_status: status },
  })

  revalidatePath('/dashboard/staynest/complaints')
  revalidatePath('/dashboard/staynest')
}

export async function createResident(
  _prev: { error?: string | null; success?: boolean },
  formData: FormData
) {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated', success: false }

  const { data: orgs } = await supabase
    .from('organization_members')
    .select('organization_id')
    .eq('user_id', user.id)
    .limit(1)
    .single()

  if (!orgs) return { error: 'No organization found', success: false }

  const resident = await dbCreateResident(
    supabase,
    orgs.organization_id,
    {
      full_name: formData.get('full_name') as string,
      phone: formData.get('phone') as string,
      email: formData.get('email') as string || null,
      gender: formData.get('gender') as string || null,
      guardian_name: formData.get('guardian_name') as string || null,
      guardian_phone: formData.get('guardian_phone') as string || null,
      room_number: formData.get('room_number') as string,
      joining_date: formData.get('joining_date') as string,
      notes: formData.get('notes') as string || null,
    },
    user.id
  )

  if (!resident) return { error: 'Failed to create resident.', success: false }

  await createAuditLog(supabase, {
    organization_id: orgs.organization_id,
    user_id: user.id,
    action: 'resident.created',
    entity_type: 'staynest_resident',
    entity_id: resident.id,
  })

  revalidatePath('/dashboard/staynest/residents')
  revalidatePath('/dashboard/staynest')
  return { error: null, success: true }
}

export async function updateResident(
  _prev: { error?: string | null; success?: boolean },
  formData: FormData
) {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated', success: false }

  const { data: orgs } = await supabase
    .from('organization_members')
    .select('organization_id')
    .eq('user_id', user.id)
    .limit(1)
    .single()

  if (!orgs) return { error: 'No organization found', success: false }

  const id = formData.get('id') as string
  if (!id) return { error: 'Resident ID is required.', success: false }

  const resident = await dbUpdateResident(
    supabase,
    orgs.organization_id,
    id,
    {
      full_name: formData.get('full_name') as string,
      phone: formData.get('phone') as string,
      email: formData.get('email') as string || null,
      gender: formData.get('gender') as string || null,
      guardian_name: formData.get('guardian_name') as string || null,
      guardian_phone: formData.get('guardian_phone') as string || null,
      room_number: formData.get('room_number') as string,
      joining_date: formData.get('joining_date') as string,
      notes: formData.get('notes') as string || null,
    }
  )

  if (!resident) return { error: 'Failed to update resident.', success: false }

  await createAuditLog(supabase, {
    organization_id: orgs.organization_id,
    user_id: user.id,
    action: 'resident.updated',
    entity_type: 'staynest_resident',
    entity_id: id,
  })

  revalidatePath('/dashboard/staynest/residents')
  revalidatePath('/dashboard/staynest')
  return { error: null, success: true }
}

export async function deactivateResident(id: string) {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { data: orgs } = await supabase
    .from('organization_members')
    .select('organization_id')
    .eq('user_id', user.id)
    .limit(1)
    .single()

  if (!orgs) return { error: 'No organization found' }

  const resident = await dbDeactivateResident(supabase, orgs.organization_id, id)

  if (!resident) return { error: 'Failed to deactivate resident.' }

  await createAuditLog(supabase, {
    organization_id: orgs.organization_id,
    user_id: user.id,
    action: 'resident.deactivated',
    entity_type: 'staynest_resident',
    entity_id: id,
  })

  revalidatePath('/dashboard/staynest/residents')
  revalidatePath('/dashboard/staynest')
}

export async function createRoom(
  _prev: { error?: string | null; success?: boolean },
  formData: FormData
) {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated', success: false }

  const { data: orgs } = await supabase
    .from('organization_members')
    .select('organization_id')
    .eq('user_id', user.id)
    .limit(1)
    .single()

  if (!orgs) return { error: 'No organization found', success: false }

  const room = await dbCreateRoom(
    supabase,
    orgs.organization_id,
    {
      room_number: formData.get('room_number') as string,
      room_type: formData.get('room_type') as string || null,
      capacity: parseInt(formData.get('capacity') as string) || 1,
      occupied_count: parseInt(formData.get('occupied_count') as string) || 0,
      monthly_rent: parseInt(formData.get('monthly_rent') as string) || 0,
      notes: formData.get('notes') as string || null,
    },
    user.id
  )

  if (!room) return { error: 'Failed to create room.', success: false }

  await createAuditLog(supabase, {
    organization_id: orgs.organization_id,
    user_id: user.id,
    action: 'room.created',
    entity_type: 'staynest_room',
    entity_id: room.id,
  })

  revalidatePath('/dashboard/staynest/rooms')
  revalidatePath('/dashboard/staynest')
  return { error: null, success: true }
}

export async function updateRoom(
  _prev: { error?: string | null; success?: boolean },
  formData: FormData
) {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated', success: false }

  const { data: orgs } = await supabase
    .from('organization_members')
    .select('organization_id')
    .eq('user_id', user.id)
    .limit(1)
    .single()

  if (!orgs) return { error: 'No organization found', success: false }

  const id = formData.get('id') as string
  if (!id) return { error: 'Room ID is required.', success: false }

  const room = await dbUpdateRoom(
    supabase,
    orgs.organization_id,
    id,
    {
      room_number: formData.get('room_number') as string,
      room_type: formData.get('room_type') as string || null,
      capacity: parseInt(formData.get('capacity') as string) || 1,
      occupied_count: parseInt(formData.get('occupied_count') as string) || 0,
      monthly_rent: parseInt(formData.get('monthly_rent') as string) || 0,
      status: formData.get('status') as string,
      notes: formData.get('notes') as string || null,
    }
  )

  if (!room) return { error: 'Failed to update room.', success: false }

  await createAuditLog(supabase, {
    organization_id: orgs.organization_id,
    user_id: user.id,
    action: 'room.updated',
    entity_type: 'staynest_room',
    entity_id: id,
  })

  revalidatePath('/dashboard/staynest/rooms')
  revalidatePath('/dashboard/staynest')
  return { error: null, success: true }
}

export async function deactivateRoom(id: string) {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { data: orgs } = await supabase
    .from('organization_members')
    .select('organization_id')
    .eq('user_id', user.id)
    .limit(1)
    .single()

  if (!orgs) return { error: 'No organization found' }

  const room = await dbDeactivateRoom(supabase, orgs.organization_id, id)

  if (!room) return { error: 'Failed to deactivate room.' }

  await createAuditLog(supabase, {
    organization_id: orgs.organization_id,
    user_id: user.id,
    action: 'room.deactivated',
    entity_type: 'staynest_room',
    entity_id: id,
  })

  revalidatePath('/dashboard/staynest/rooms')
  revalidatePath('/dashboard/staynest')
}
