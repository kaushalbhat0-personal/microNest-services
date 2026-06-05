'use server'

import { revalidatePath } from 'next/cache'
import { createServerClient } from '@micronest/auth'
import {
  createVisitor as dbCreateVisitor,
  checkOutVisitor as dbCheckOutVisitor,
  createMaintenanceRequest as dbCreateMaintenanceRequest,
  updateMaintenanceRequestStatus as dbUpdateMaintenanceRequestStatus,
  assignMaintenanceRequest as dbAssignMaintenanceRequest,
  createResident as dbCreateResident,
  updateResident as dbUpdateResident,
  checkoutResident as dbCheckoutResident,
  createRoom as dbCreateRoom,
  updateRoom as dbUpdateRoom,
  softDeleteRoom as dbSoftDeleteRoom,
  createRentRecord as dbCreateRentRecord,
  markRentPaid as dbMarkRentPaid,
  generateRentForMonth as dbGenerateRentForMonth,
  recordPayment as dbRecordPayment,
  createAnnouncement as dbCreateAnnouncement,
  updateAnnouncement as dbUpdateAnnouncement,
  deleteAnnouncement as dbDeleteAnnouncement,
  updateRoomOccupancy,
  createAuditLog,
  isOrganizationEmpty,
  seedDemoData as dbSeedDemoData,
} from '@micronest/db'

async function getOrgId(supabase: ReturnType<typeof createServerClient> extends Promise<infer T> ? T : never) {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null
  const { data } = await supabase
    .from('organization_members')
    .select('organization_id')
    .eq('user_id', user.id)
    .limit(1)
    .single()
  return data?.organization_id ?? null
}

export async function createVisitor(
  _prev: { error?: string | null; success?: boolean },
  formData: FormData
) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated', success: false }

  const orgId = await getOrgId(supabase)
  if (!orgId) return { error: 'No organization found', success: false }

  const visitor = await dbCreateVisitor(
    supabase, orgId,
    {
      visitor_name: formData.get('visitor_name') as string,
      phone: formData.get('phone') as string,
      purpose: formData.get('purpose') as string,
      resident_id: formData.get('resident_id') as string || null,
      notes: formData.get('notes') as string || null,
    },
    user.id
  )
  if (!visitor) return { error: 'Failed to log visitor.', success: false }

  await createAuditLog(supabase, {
    organization_id: orgId, user_id: user.id, action: 'visitor.created',
    entity_type: 'staynest_visitor', entity_id: visitor.id,
  })
  revalidatePath('/dashboard/staynest/visitors')
  revalidatePath('/dashboard/staynest')
  return { error: null, success: true }
}

export async function checkOutVisitor(id: string) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const orgId = await getOrgId(supabase)
  if (!orgId) return { error: 'No organization found' }

  const visitor = await dbCheckOutVisitor(supabase, orgId, id)
  if (!visitor) return { error: 'Failed to check out visitor.' }

  await createAuditLog(supabase, {
    organization_id: orgId, user_id: user.id, action: 'visitor.checked_out',
    entity_type: 'staynest_visitor', entity_id: visitor.id,
  })
  revalidatePath('/dashboard/staynest/visitors')
  revalidatePath('/dashboard/staynest')
}

export async function createMaintenanceRequest(
  _prev: { error?: string | null; success?: boolean },
  formData: FormData
) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated', success: false }

  const orgId = await getOrgId(supabase)
  if (!orgId) return { error: 'No organization found', success: false }

  const req = await dbCreateMaintenanceRequest(
    supabase, orgId,
    {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      category: formData.get('category') as string,
      priority: formData.get('priority') as string || undefined,
      resident_id: formData.get('resident_id') as string || null,
      room_id: formData.get('room_id') as string || null,
    },
    user.id
  )
  if (!req) return { error: 'Failed to create request.', success: false }

  await createAuditLog(supabase, {
    organization_id: orgId, user_id: user.id, action: 'maintenance.created',
    entity_type: 'staynest_maintenance_request', entity_id: req.id,
  })
  revalidatePath('/dashboard/staynest/maintenance')
  revalidatePath('/dashboard/staynest')
  return { error: null, success: true }
}

export async function updateMaintenanceStatus(id: string, status: string) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const orgId = await getOrgId(supabase)
  if (!orgId) return { error: 'No organization found' }

  const req = await dbUpdateMaintenanceRequestStatus(
    supabase, orgId, id, status as any, user.id
  )
  if (!req) return { error: 'Failed to update status.' }

  await createAuditLog(supabase, {
    organization_id: orgId, user_id: user.id, action: 'maintenance.updated',
    entity_type: 'staynest_maintenance_request', entity_id: req.id,
    metadata: { status },
  })
  revalidatePath('/dashboard/staynest/maintenance')
  revalidatePath('/dashboard/staynest')
}

export async function assignMaintenanceRequest(id: string, assignedTo: string) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const orgId = await getOrgId(supabase)
  if (!orgId) return { error: 'No organization found' }

  const req = await dbAssignMaintenanceRequest(supabase, orgId, id, assignedTo)
  if (!req) return { error: 'Failed to assign request.' }

  await createAuditLog(supabase, {
    organization_id: orgId, user_id: user.id, action: 'maintenance.assigned',
    entity_type: 'staynest_maintenance_request', entity_id: req.id,
    metadata: { assigned_to: assignedTo },
  })
  revalidatePath('/dashboard/staynest/maintenance')
  revalidatePath('/dashboard/staynest')
}

export async function createResident(
  _prev: { error?: string | null; success?: boolean },
  formData: FormData
) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated', success: false }

  const orgId = await getOrgId(supabase)
  if (!orgId) return { error: 'No organization found', success: false }

  const resident = await dbCreateResident(
    supabase, orgId,
    {
      full_name: formData.get('full_name') as string,
      phone: formData.get('phone') as string,
      email: formData.get('email') as string || null,
      gender: formData.get('gender') as string || null,
      emergency_contact_name: formData.get('emergency_contact_name') as string || null,
      emergency_contact_phone: formData.get('emergency_contact_phone') as string || null,
      id_proof_type: formData.get('id_proof_type') as string || null,
      id_proof_number: formData.get('id_proof_number') as string || null,
      room_id: formData.get('room_id') as string || null,
      bed_number: parseInt(formData.get('bed_number') as string) || null,
      check_in_date: formData.get('check_in_date') as string,
    },
    user.id
  )

  if (!resident) return { error: 'Failed to create resident.', success: false }

  if (resident.room_id) {
    await updateRoomOccupancy(supabase, orgId, resident.room_id)
  }

  await createAuditLog(supabase, {
    organization_id: orgId, user_id: user.id, action: 'resident.created',
    entity_type: 'staynest_resident', entity_id: resident.id,
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
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated', success: false }

  const orgId = await getOrgId(supabase)
  if (!orgId) return { error: 'No organization found', success: false }

  const id = formData.get('id') as string
  if (!id) return { error: 'Resident ID is required.', success: false }

  const resident = await dbUpdateResident(supabase, orgId, id, {
    full_name: formData.get('full_name') as string,
    phone: formData.get('phone') as string,
    email: formData.get('email') as string || null,
    gender: formData.get('gender') as string || null,
    emergency_contact_name: formData.get('emergency_contact_name') as string || null,
    emergency_contact_phone: formData.get('emergency_contact_phone') as string || null,
    id_proof_type: formData.get('id_proof_type') as string || null,
    id_proof_number: formData.get('id_proof_number') as string || null,
    room_id: formData.get('room_id') as string || null,
    bed_number: parseInt(formData.get('bed_number') as string) || null,
    check_in_date: formData.get('check_in_date') as string,
  })

  if (!resident) return { error: 'Failed to update resident.', success: false }

  if (resident.room_id) {
    await updateRoomOccupancy(supabase, orgId, resident.room_id)
  }

  await createAuditLog(supabase, {
    organization_id: orgId, user_id: user.id, action: 'resident.updated',
    entity_type: 'staynest_resident', entity_id: resident.id,
  })
  revalidatePath('/dashboard/staynest/residents')
  revalidatePath('/dashboard/staynest')
  return { error: null, success: true }
}

export async function checkoutResident(id: string) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const orgId = await getOrgId(supabase)
  if (!orgId) return { error: 'No organization found' }

  const resident = await dbCheckoutResident(supabase, orgId, id)
  if (!resident) return { error: 'Failed to check out resident.' }

  if (resident.room_id) {
    await updateRoomOccupancy(supabase, orgId, resident.room_id)
  }

  await createAuditLog(supabase, {
    organization_id: orgId, user_id: user.id, action: 'resident.checked_out',
    entity_type: 'staynest_resident', entity_id: resident.id,
  })
  revalidatePath('/dashboard/staynest/residents')
  revalidatePath('/dashboard/staynest')
}

export async function createRoom(
  _prev: { error?: string | null; success?: boolean },
  formData: FormData
) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated', success: false }

  const orgId = await getOrgId(supabase)
  if (!orgId) return { error: 'No organization found', success: false }

  const room = await dbCreateRoom(supabase, orgId, {
    room_number: formData.get('room_number') as string,
    floor: parseInt(formData.get('floor') as string) || null,
    capacity: parseInt(formData.get('capacity') as string) || 1,
    rent_per_bed: parseInt(formData.get('rent_per_bed') as string) || 0,
  }, user.id)

  if (!room) return { error: 'Failed to create room.', success: false }

  await createAuditLog(supabase, {
    organization_id: orgId, user_id: user.id, action: 'room.created',
    entity_type: 'staynest_room', entity_id: room.id,
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
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated', success: false }

  const orgId = await getOrgId(supabase)
  if (!orgId) return { error: 'No organization found', success: false }

  const id = formData.get('id') as string
  if (!id) return { error: 'Room ID is required.', success: false }

  const room = await dbUpdateRoom(supabase, orgId, id, {
    room_number: formData.get('room_number') as string,
    floor: parseInt(formData.get('floor') as string) || null,
    capacity: parseInt(formData.get('capacity') as string) || 1,
    rent_per_bed: parseInt(formData.get('rent_per_bed') as string) || 0,
    status: formData.get('status') as string || undefined,
  })

  if (!room) return { error: 'Failed to update room.', success: false }

  await createAuditLog(supabase, {
    organization_id: orgId, user_id: user.id, action: 'room.updated',
    entity_type: 'staynest_room', entity_id: room.id,
  })
  revalidatePath('/dashboard/staynest/rooms')
  revalidatePath('/dashboard/staynest')
  return { error: null, success: true }
}

export async function deleteRoom(id: string) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const orgId = await getOrgId(supabase)
  if (!orgId) return { error: 'No organization found' }

  await dbSoftDeleteRoom(supabase, orgId, id)

  await createAuditLog(supabase, {
    organization_id: orgId, user_id: user.id, action: 'room.deleted',
    entity_type: 'staynest_room', entity_id: id,
  })
  revalidatePath('/dashboard/staynest/rooms')
  revalidatePath('/dashboard/staynest')
}

export async function createRentRecord(
  _prev: { error?: string | null; success?: boolean },
  formData: FormData
) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated', success: false }

  const orgId = await getOrgId(supabase)
  if (!orgId) return { error: 'No organization found', success: false }

  const rentAmount = parseInt(formData.get('amount') as string) || 0
  const record = await dbCreateRentRecord(supabase, orgId, {
    resident_id: formData.get('resident_id') as string,
    room_id: formData.get('room_id') as string || null,
    billing_month: parseInt(formData.get('billing_month') as string) || new Date().getMonth() + 1,
    billing_year: parseInt(formData.get('billing_year') as string) || new Date().getFullYear(),
    rent_amount: rentAmount,
    due_date: formData.get('due_date') as string,
    notes: formData.get('notes') as string || null,
  }, user.id)

  if (!record) return { error: 'Failed to create rent record.', success: false }

  await createAuditLog(supabase, {
    organization_id: orgId, user_id: user.id, action: 'rent.created',
    entity_type: 'staynest_rent_record', entity_id: record.id,
  })
  revalidatePath('/dashboard/staynest/rent')
  revalidatePath('/dashboard/staynest')
  return { error: null, success: true }
}

export async function generateRent(
  _prev: { error?: string | null; success?: boolean },
  formData: FormData
) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated', success: false }

  const orgId = await getOrgId(supabase)
  if (!orgId) return { error: 'No organization found', success: false }

  const month = parseInt(formData.get('month') as string) || new Date().getMonth() + 1
  const year = parseInt(formData.get('year') as string) || new Date().getFullYear()

  const result = await dbGenerateRentForMonth(supabase, orgId, month, year, user.id)

  if (result.errors.length > 0) {
    return { error: result.errors.join('. '), success: false }
  }

  await createAuditLog(supabase, {
    organization_id: orgId, user_id: user.id, action: 'rent.generated',
    entity_type: 'staynest_rent_record',
    entity_id: orgId,
    metadata: { month, year, count: result.created },
  })
  revalidatePath('/dashboard/staynest/rent')
  revalidatePath('/dashboard/staynest')
  return { error: null, success: true }
}

export async function recordPaymentAction(
  _prev: { error?: string | null; success?: boolean; receipt?: any },
  formData: FormData
) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated', success: false }

  const orgId = await getOrgId(supabase)
  if (!orgId) return { error: 'No organization found', success: false }

  const amount = parseInt(formData.get('amount') as string) || 0
  if (amount <= 0) return { error: 'Invalid payment amount.', success: false }

  const paymentMethod = formData.get('payment_method') as 'cash' | 'upi' | 'bank_transfer' | 'other'
  if (!['cash', 'upi', 'bank_transfer', 'other'].includes(paymentMethod)) {
    return { error: 'Invalid payment method.', success: false }
  }

  const result = await dbRecordPayment(supabase, orgId, {
    rent_record_id: formData.get('rent_record_id') as string,
    amount,
    payment_method: paymentMethod,
    payment_date: (formData.get('payment_date') as string) || undefined,
    notes: (formData.get('notes') as string) || null,
  }, user.id)

  if (result.error) return { error: result.error, success: false }

  await createAuditLog(supabase, {
    organization_id: orgId, user_id: user.id, action: 'rent.payment_recorded',
    entity_type: 'staynest_rent_record',
    entity_id: formData.get('rent_record_id') as string,
    metadata: { amount, payment_method: paymentMethod, receipt_number: result.receipt?.receipt_number },
  })
  revalidatePath('/dashboard/staynest/rent')
  revalidatePath('/dashboard/staynest')
  return { error: null, success: true, receipt: result.receipt }
}

export async function createAnnouncement(
  _prev: { error?: string | null; success?: boolean },
  formData: FormData
) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated', success: false }

  const orgId = await getOrgId(supabase)
  if (!orgId) return { error: 'No organization found', success: false }

  const announcement = await dbCreateAnnouncement(supabase, orgId, {
    title: formData.get('title') as string,
    message: formData.get('message') as string,
    priority: formData.get('priority') as string || undefined,
    publish_date: formData.get('publish_date') as string || undefined,
    expiry_date: formData.get('expiry_date') as string || null,
  }, user.id)

  if (!announcement) return { error: 'Failed to create announcement.', success: false }

  await createAuditLog(supabase, {
    organization_id: orgId, user_id: user.id, action: 'announcement.created',
    entity_type: 'staynest_announcement', entity_id: announcement.id,
  })
  revalidatePath('/dashboard/staynest/announcements')
  revalidatePath('/dashboard/staynest')
  return { error: null, success: true }
}

export async function updateAnnouncement(
  _prev: { error?: string | null; success?: boolean },
  formData: FormData
) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated', success: false }

  const orgId = await getOrgId(supabase)
  if (!orgId) return { error: 'No organization found', success: false }

  const id = formData.get('id') as string
  if (!id) return { error: 'Announcement ID is required.', success: false }

  const announcement = await dbUpdateAnnouncement(supabase, orgId, id, {
    title: formData.get('title') as string,
    message: formData.get('message') as string,
    priority: formData.get('priority') as string || undefined,
    publish_date: formData.get('publish_date') as string || undefined,
    expiry_date: formData.get('expiry_date') as string || null,
  })

  if (!announcement) return { error: 'Failed to update announcement.', success: false }

  await createAuditLog(supabase, {
    organization_id: orgId, user_id: user.id, action: 'announcement.updated',
    entity_type: 'staynest_announcement', entity_id: announcement.id,
  })
  revalidatePath('/dashboard/staynest/announcements')
  revalidatePath('/dashboard/staynest')
  return { error: null, success: true }
}

export async function deleteAnnouncement(id: string) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const orgId = await getOrgId(supabase)
  if (!orgId) return { error: 'No organization found' }

  await dbDeleteAnnouncement(supabase, orgId, id)

  await createAuditLog(supabase, {
    organization_id: orgId, user_id: user.id, action: 'announcement.deleted',
    entity_type: 'staynest_announcement', entity_id: id,
  })
  revalidatePath('/dashboard/staynest/announcements')
  revalidatePath('/dashboard/staynest')
}

export async function markRentPaid(id: string, paymentMethod: 'cash' | 'upi' | 'bank_transfer' | 'other') {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const orgId = await getOrgId(supabase)
  if (!orgId) return { error: 'No organization found' }

  await dbMarkRentPaid(supabase, orgId, id, paymentMethod)

  await createAuditLog(supabase, {
    organization_id: orgId, user_id: user.id, action: 'rent.marked_paid',
    entity_type: 'staynest_rent_record', entity_id: id,
  })
  revalidatePath('/dashboard/staynest/rent')
  revalidatePath('/dashboard/staynest')
}

export async function seedDemoData() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { data } = await supabase
    .from('organization_members')
    .select('organization_id')
    .eq('user_id', user.id)
    .limit(1)
    .single()

  if (!data) return { error: 'No organization found' }

  const empty = await isOrganizationEmpty(supabase, data.organization_id)
  if (!empty) return { error: 'Organization already has data. Demo data can only be seeded on an empty organization.' }

  try {
    await dbSeedDemoData(supabase, data.organization_id, user.id)
  } catch {
    return { error: 'Failed to seed demo data. Please try again.' }
  }

  await createAuditLog(supabase, {
    organization_id: data.organization_id, user_id: user.id,
    action: 'demo.seeded', entity_type: 'organization',
    entity_id: data.organization_id,
    metadata: { note: 'Demo data seeded for StayNest' },
  })

  revalidatePath('/dashboard/staynest')
  return { error: null, success: true }
}
