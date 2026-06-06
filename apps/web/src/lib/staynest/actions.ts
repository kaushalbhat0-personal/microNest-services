'use server'

import { revalidatePath } from 'next/cache'
import { createServerClient } from '@micronest/auth'
import {
  checkResidentLimit,
  checkRoomLimit,
  getProvider,
} from '@micronest/db'
import {
  createVisitor as dbCreateVisitor,
  checkOutVisitor as dbCheckOutVisitor,
  createMaintenanceRequest as dbCreateMaintenanceRequest,
  updateMaintenanceRequestStatus as dbUpdateMaintenanceRequestStatus,
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
  toggleNotificationTemplate,
  createNotificationRule,
  updateNotificationRule,
  deleteNotificationRule,
  retryNotificationLog,
  registerProvider,
  consoleNotificationProvider,
  notificationEngine,
  getNotificationEngineStats,
  regenerateReceipt as dbRegenerateReceipt,
  getAllResidentPaymentSummaries,
  getProviderSettings,
  saveProviderSettings,
  notifyAnnouncement,
  notifyMaintenanceResolved,
  sendPendingNotifications as dbSendPendingNotifications,
  listResidents,
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
      assigned_to: formData.get('assigned_to') as string || null,
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

export async function startWork(id: string) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const orgId = await getOrgId(supabase)
  if (!orgId) return { error: 'No organization found' }

  const req = await dbUpdateMaintenanceRequestStatus(
    supabase, orgId, id, 'in_progress', user.id
  )
  if (!req) return { error: 'Failed to start work.' }

  await createAuditLog(supabase, {
    organization_id: orgId, user_id: user.id, action: 'maintenance.started',
    entity_type: 'staynest_maintenance_request', entity_id: req.id,
  })
  revalidatePath('/dashboard/staynest/maintenance')
  revalidatePath('/dashboard/staynest')
}

export async function resolveRequest(
  _prev: { error?: string | null; success?: boolean },
  formData: FormData
) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated', success: false }

  const orgId = await getOrgId(supabase)
  if (!orgId) return { error: 'No organization found', success: false }

  const id = formData.get('id') as string
  if (!id) return { error: 'Request ID is required.', success: false }

  const req = await dbUpdateMaintenanceRequestStatus(
    supabase, orgId, id, 'resolved', user.id,
    { resolved_notes: formData.get('resolved_notes') as string || null }
  )
  if (!req) return { error: 'Failed to resolve request.', success: false }

  await createAuditLog(supabase, {
    organization_id: orgId, user_id: user.id, action: 'maintenance.resolved',
    entity_type: 'staynest_maintenance_request', entity_id: req.id,
  })

  if (req.resident_id) {
    const { data: resident } = await supabase
      .from('staynest_residents')
      .select('id, full_name, phone')
      .eq('id', req.resident_id)
      .single()

    if (resident?.phone) {
      await notifyMaintenanceResolved(supabase, orgId, {
        id: resident.id,
        full_name: resident.full_name,
        phone: resident.phone,
      }, req.title)
    }
  }

  revalidatePath('/dashboard/staynest/maintenance')
  revalidatePath('/dashboard/staynest')
  return { error: null, success: true }
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

  const limitCheck = await checkResidentLimit(supabase, orgId)
  if (!limitCheck.allowed) {
    return {
      error: `Plan limit reached. You have ${limitCheck.current} ${limitCheck.limitName}s (max ${limitCheck.limit}). ${limitCheck.upgradeLabel}.`,
      success: false,
    }
  }

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

  const limitCheck = await checkRoomLimit(supabase, orgId)
  if (!limitCheck.allowed) {
    return {
      error: `Plan limit reached. You have ${limitCheck.current} ${limitCheck.limitName}s (max ${limitCheck.limit}). ${limitCheck.upgradeLabel}.`,
      success: false,
    }
  }

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

  const residents = await listResidents(supabase, orgId)
  for (const resident of residents.filter(r => r.status === 'active' && r.phone)) {
    await notifyAnnouncement(supabase, orgId, resident.phone!, announcement.title, announcement.message)
  }

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

// ── Notification Center Actions ────────────────────────────────────────────

// Register ConsoleNotificationProvider on first import
registerProvider('whatsapp', consoleNotificationProvider)
registerProvider('email', consoleNotificationProvider)
registerProvider('sms', consoleNotificationProvider)

export async function toggleTemplateAction(
  templateId: string,
  isActive: boolean
) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const orgId = await getOrgId(supabase)
  if (!orgId) return { error: 'No organization found' }

  const result = await toggleNotificationTemplate(supabase, templateId, isActive)
  if (!result) return { error: 'Failed to update template' }

  await createAuditLog(supabase, {
    organization_id: orgId, user_id: user.id,
    action: `notification_template.${isActive ? 'activated' : 'deactivated'}`,
    entity_type: 'staynest_notification_template', entity_id: templateId,
  })
  revalidatePath('/dashboard/staynest/notifications')
  return { error: null }
}

export async function createRuleAction(
  _prev: { error?: string | null; success?: boolean },
  formData: FormData
) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated', success: false }

  const orgId = await getOrgId(supabase)
  if (!orgId) return { error: 'No organization found', success: false }

  const rule = await createNotificationRule(supabase, orgId, {
    name: formData.get('name') as string,
    trigger_event: formData.get('trigger_event') as string,
    trigger_config: formData.get('trigger_config') ? JSON.parse(formData.get('trigger_config') as string) : {},
    template_id: formData.get('template_id') as string || null,
  })
  if (!rule) return { error: 'Failed to create rule.', success: false }

  await createAuditLog(supabase, {
    organization_id: orgId, user_id: user.id, action: 'notification_rule.created',
    entity_type: 'staynest_notification_rule', entity_id: rule.id,
  })
  revalidatePath('/dashboard/staynest/notifications')
  return { error: null, success: true }
}

export async function toggleRuleAction(ruleId: string, isActive: boolean) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const orgId = await getOrgId(supabase)
  if (!orgId) return { error: 'No organization found' }

  const result = await updateNotificationRule(supabase, ruleId, { is_active: isActive })
  if (!result) return { error: 'Failed to update rule' }

  await createAuditLog(supabase, {
    organization_id: orgId, user_id: user.id,
    action: `notification_rule.${isActive ? 'activated' : 'deactivated'}`,
    entity_type: 'staynest_notification_rule', entity_id: ruleId,
  })
  revalidatePath('/dashboard/staynest/notifications')
  return { error: null }
}

export async function deleteRuleAction(ruleId: string) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const orgId = await getOrgId(supabase)
  if (!orgId) return { error: 'No organization found' }

  await deleteNotificationRule(supabase, ruleId)

  await createAuditLog(supabase, {
    organization_id: orgId, user_id: user.id, action: 'notification_rule.deleted',
    entity_type: 'staynest_notification_rule', entity_id: ruleId,
  })
  revalidatePath('/dashboard/staynest/notifications')
  return { error: null }
}

export async function retryNotificationAction(logId: string) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const orgId = await getOrgId(supabase)
  if (!orgId) return { error: 'No organization found' }

  const log = await retryNotificationLog(supabase, logId)
  if (!log) return { error: 'Failed to retry notification' }

  await createAuditLog(supabase, {
    organization_id: orgId, user_id: user.id, action: 'notification.retried',
    entity_type: 'staynest_notification_log', entity_id: logId,
  })
  revalidatePath('/dashboard/staynest/notifications')
  return { error: null }
}

// ── Receipt Actions ────────────────────────────────────────────────────────

export async function regenerateReceiptAction(receiptId: string) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const orgId = await getOrgId(supabase)
  if (!orgId) return { error: 'No organization found' }

  const result = await dbRegenerateReceipt(supabase, orgId, receiptId, user.id)
  if (!result.newReceipt) return { error: 'Failed to regenerate receipt' }

  await createAuditLog(supabase, {
    organization_id: orgId, user_id: user.id, action: 'receipt.regenerated',
    entity_type: 'staynest_receipt', entity_id: result.newReceipt.id,
    metadata: { old_receipt_id: receiptId, new_receipt_number: result.newReceipt.receipt_number },
  })
  revalidatePath('/dashboard/staynest/receipts')
  return { error: null }
}

export async function getAllPaymentSummariesAction() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const orgId = await getOrgId(supabase)
  if (!orgId) return null

  const summaries = await getAllResidentPaymentSummaries(supabase, orgId)
  return Object.fromEntries(summaries)
}

// ── Notification Engine Actions ────────────────────────────────────────────

export async function executeRuleAction(triggerEvent: string) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated', rules_executed: 0, notifications_created: 0, errors: ['Not authenticated'] }

  const orgId = await getOrgId(supabase)
  if (!orgId) return { error: 'No organization found', rules_executed: 0, notifications_created: 0, errors: ['No organization found'] }

  const result = await notificationEngine.executeRule(supabase, orgId, triggerEvent)

  await createAuditLog(supabase, {
    organization_id: orgId, user_id: user.id, action: `notification_rule.executed`,
    entity_type: 'staynest_notification_rule',
    metadata: { trigger_event: triggerEvent, notifications_created: result.notifications_created, errors: result.errors },
  })

  revalidatePath('/dashboard/staynest/notifications')
  return { error: result.errors.length > 0 ? result.errors.join('; ') : null, ...result }
}

export async function executeAllRulesAction() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated', rules_executed: 0, notifications_created: 0, errors: ['Not authenticated'] }

  const orgId = await getOrgId(supabase)
  if (!orgId) return { error: 'No organization found', rules_executed: 0, notifications_created: 0, errors: ['No organization found'] }

  const result = await notificationEngine.executeAllRules(supabase, orgId)

  await createAuditLog(supabase, {
    organization_id: orgId, user_id: user.id, action: 'notification_rules.executed_all',
    entity_type: 'staynest_notification_rule',
    metadata: { rules_executed: result.rules_executed, notifications_created: result.notifications_created, errors: result.errors },
  })

  revalidatePath('/dashboard/staynest/notifications')
  return { error: result.errors.length > 0 ? result.errors.join('; ') : null, ...result }
}

export async function getNotificationStatsAction() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const orgId = await getOrgId(supabase)
  if (!orgId) return null

  return getNotificationEngineStats(supabase, orgId)
}

// ── Provider Settings Actions ─────────────────────────────────────────

export async function getProviderSettingsAction() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const orgId = await getOrgId(supabase)
  if (!orgId) return null

  return getProviderSettings(supabase, orgId)
}

export async function saveProviderAction(
  providerName: string,
  fields: Record<string, string>
) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const orgId = await getOrgId(supabase)
  if (!orgId) return { error: 'No organization found' }

  const currentProviders = await getProviderSettings(supabase, orgId)
  currentProviders[providerName] = fields

  const success = await saveProviderSettings(supabase, orgId, currentProviders)
  if (!success) return { error: 'Failed to save provider settings' }

  await createAuditLog(supabase, {
    organization_id: orgId, user_id: user.id,
    action: `provider_settings.${providerName}.updated`,
    entity_type: 'staynest_notification_provider',
    metadata: { provider: providerName },
  })

  revalidatePath('/dashboard/staynest/notifications')
  return { error: null }
}

export async function disconnectProviderAction(providerName: string) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const orgId = await getOrgId(supabase)
  if (!orgId) return { error: 'No organization found' }

  const currentProviders = await getProviderSettings(supabase, orgId)
  delete currentProviders[providerName]

  const success = await saveProviderSettings(supabase, orgId, currentProviders)
  if (!success) return { error: 'Failed to disconnect provider' }

  await createAuditLog(supabase, {
    organization_id: orgId, user_id: user.id,
    action: `provider_settings.${providerName}.disconnected`,
    entity_type: 'staynest_notification_provider',
    metadata: { provider: providerName },
  })

  revalidatePath('/dashboard/staynest/notifications')
  return { error: null }
}

export async function sendPendingNotificationsAction(): Promise<{ error?: string | null; sent?: number }> {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const orgId = await getOrgId(supabase)
  if (!orgId) return { error: 'No organization found' }

  const sent = await dbSendPendingNotifications(supabase, orgId)
  revalidatePath('/dashboard/staynest/notifications')
  return { error: null, sent }
}

export async function testProviderConnectionAction(
  providerName: string
): Promise<{ error?: string | null; success?: boolean }> {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const orgId = await getOrgId(supabase)
  if (!orgId) return { error: 'No organization found' }

  const providerSettings = await getProviderSettings(supabase, orgId)
  const credentials = providerSettings[providerName]
  if (!credentials) return { error: 'No credentials saved for this provider' }

  try {
    const handler = getProvider(providerName)
    if (!handler) return { error: `Unknown provider: ${providerName}` }

    const result = await handler.validateConnection(credentials)
    if (result.success) {
      await createAuditLog(supabase, {
        organization_id: orgId, user_id: user.id,
        action: `provider.${providerName}.connection_tested`,
        entity_type: 'staynest_notification_provider',
        metadata: { provider: providerName, result: 'success' },
      })
      return { error: null, success: true }
    }
    return { error: result.error ?? 'Connection test failed' }
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Failed to test connection' }
  }
}

export async function sendTestMessageAction(
  providerName: string,
  phone: string
): Promise<{ error?: string | null; success?: boolean; providerMessageId?: string }> {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const orgId = await getOrgId(supabase)
  if (!orgId) return { error: 'No organization found' }

  if (!phone?.trim()) return { error: 'Phone number is required' }

  const providerSettings = await getProviderSettings(supabase, orgId)
  const credentials = providerSettings[providerName]
  if (!credentials) return { error: 'No credentials saved for this provider' }

  try {
    const handler = getProvider(providerName)
    if (!handler) return { error: `Unknown provider: ${providerName}` }

    const testMessage = 'This is a test message from StayNest. Your WhatsApp provider is configured correctly.'
    const result = await handler.sendTestMessage(credentials, phone.trim(), testMessage)

    await supabase.from('staynest_notification_logs').insert({
      organization_id: orgId,
      template_id: null,
      event: 'test_message',
      channel: 'whatsapp',
      recipient: phone.trim(),
      rendered_message: testMessage,
      status: result.success ? 'sent' : 'failed',
      error_message: result.error ?? null,
      sent_at: result.success ? new Date().toISOString() : null,
      provider_message_id: result.providerMessageId ?? null,
    })

    if (result.success) {
      return { error: null, success: true, providerMessageId: result.providerMessageId }
    }
    return { error: result.error ?? 'Failed to send test message' }
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Failed to send test message' }
  }
}

export async function activateProviderAction(
  providerName: string
): Promise<{ error?: string | null; success?: boolean }> {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const orgId = await getOrgId(supabase)
  if (!orgId) return { error: 'No organization found' }

  const providerSettings = await getProviderSettings(supabase, orgId)
  const credentials = providerSettings[providerName]
  if (!credentials) return { error: 'No credentials saved for this provider. Save credentials first.' }

  // Deactivate all other providers, activate this one
  for (const name of Object.keys(providerSettings)) {
    if (name === providerName) {
      providerSettings[name] = { ...providerSettings[name], activated: 'true' }
    } else {
      providerSettings[name] = { ...providerSettings[name], activated: 'false' }
    }
  }

  const success = await saveProviderSettings(supabase, orgId, providerSettings)
  if (!success) return { error: 'Failed to activate provider' }

  await createAuditLog(supabase, {
    organization_id: orgId, user_id: user.id,
    action: `provider.${providerName}.activated`,
    entity_type: 'staynest_notification_provider',
    metadata: { provider: providerName },
  })

  revalidatePath('/dashboard/staynest/notifications')
  return { error: null, success: true }
}
