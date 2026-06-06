import type { DBClient, StayNestReceipt, StayNestReceiptWithDetails, ResidentPaymentSummary } from '../types'

export async function listReceipts(
  supabase: DBClient,
  organizationId: string
): Promise<StayNestReceiptWithDetails[]> {
  const { data: receipts } = await supabase
    .from('staynest_receipts')
    .select('*')
    .eq('organization_id', organizationId)
    .order('created_at', { ascending: false })

  if (!receipts || receipts.length === 0) return []

  const rentRecordIds = [...new Set(receipts.map((r) => r.rent_record_id))]

  const { data: rentRecords } = await supabase
    .from('staynest_rent_records')
    .select('id, billing_month, billing_year, rent_amount, resident_id, room_id')
    .in('id', rentRecordIds)

  const residentIds = [...new Set((rentRecords ?? []).map((rr) => rr.resident_id))]
  const roomIds = [...new Set((rentRecords ?? []).map((rr) => rr.room_id).filter(Boolean) as string[])]

  const [residents, rooms] = await Promise.all([
    supabase
      .from('staynest_residents')
      .select('id, full_name, phone')
      .in('id', residentIds),
    roomIds.length > 0
      ? supabase
          .from('staynest_rooms')
          .select('id, room_number')
          .in('id', roomIds)
      : { data: [] },
  ])

  const residentMap = new Map((residents.data ?? []).map((r) => [r.id, r]))
  const roomMap = new Map((rooms.data ?? []).map((r) => [r.id, r.room_number]))
  const rentMap = new Map((rentRecords ?? []).map((r) => [r.id, r]))

  return receipts.map((receipt) => {
    const rentRecord = rentMap.get(receipt.rent_record_id)
    const resident = rentRecord ? residentMap.get(rentRecord.resident_id) : null
    const roomNumber = rentRecord?.room_id ? (roomMap.get(rentRecord.room_id) ?? null) : null

    return {
      ...receipt,
      resident_name: resident?.full_name ?? 'Unknown',
      resident_phone: resident?.phone ?? '',
      room_number: roomNumber,
      billing_month: rentRecord?.billing_month ?? 0,
      billing_year: rentRecord?.billing_year ?? 0,
      rent_amount: rentRecord?.rent_amount ?? 0,
    }
  })
}

export async function getReceiptById(
  supabase: DBClient,
  organizationId: string,
  receiptId: string
): Promise<StayNestReceiptWithDetails | null> {
  const { data: receipt } = await supabase
    .from('staynest_receipts')
    .select('*')
    .eq('id', receiptId)
    .eq('organization_id', organizationId)
    .single()

  if (!receipt) return null

  const { data: rentRecord } = await supabase
    .from('staynest_rent_records')
    .select('billing_month, billing_year, rent_amount, resident_id, room_id')
    .eq('id', receipt.rent_record_id)
    .single()

  if (!rentRecord) return { ...receipt, resident_name: 'Unknown', resident_phone: '', room_number: null, billing_month: 0, billing_year: 0, rent_amount: 0 }

  const [residentResult, roomResult] = await Promise.all([
    supabase.from('staynest_residents').select('full_name, phone').eq('id', rentRecord.resident_id).single(),
    rentRecord.room_id
      ? supabase.from('staynest_rooms').select('room_number').eq('id', rentRecord.room_id).single()
      : Promise.resolve({ data: null }),
  ])

  return {
    ...receipt,
    resident_name: residentResult.data?.full_name ?? 'Unknown',
    resident_phone: residentResult.data?.phone ?? '',
    room_number: roomResult?.data?.room_number ?? null,
    billing_month: rentRecord.billing_month,
    billing_year: rentRecord.billing_year,
    rent_amount: rentRecord.rent_amount,
  }
}

export async function getReceiptsByResident(
  supabase: DBClient,
  organizationId: string,
  residentId: string
): Promise<StayNestReceiptWithDetails[]> {
  const { data: rentRecords } = await supabase
    .from('staynest_rent_records')
    .select('id, billing_month, billing_year, rent_amount, room_id')
    .eq('organization_id', organizationId)
    .eq('resident_id', residentId)

  if (!rentRecords || rentRecords.length === 0) return []

  const rentRecordIds = rentRecords.map((r) => r.id)

  const { data: receipts } = await supabase
    .from('staynest_receipts')
    .select('*')
    .eq('organization_id', organizationId)
    .in('rent_record_id', rentRecordIds)
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  if (!receipts || receipts.length === 0) return []

  const rentMap = new Map(rentRecords.map((r) => [r.id, r]))

  const roomIds = [...new Set(rentRecords.map((r) => r.room_id).filter(Boolean) as string[])]
  const { data: residents } = await supabase
    .from('staynest_residents')
    .select('full_name, phone')
    .eq('id', residentId)
    .single()

  const roomsResult = roomIds.length > 0
    ? await supabase.from('staynest_rooms').select('id, room_number').in('id', roomIds)
    : { data: [] }
  const roomMap = new Map((roomsResult.data ?? []).map((r) => [r.id, r.room_number]))

  return receipts.map((receipt) => {
    const rentRecord = rentMap.get(receipt.rent_record_id)
    return {
      ...receipt,
      resident_name: residents?.full_name ?? 'Unknown',
      resident_phone: residents?.phone ?? '',
      room_number: rentRecord?.room_id ? (roomMap.get(rentRecord.room_id) ?? null) : null,
      billing_month: rentRecord?.billing_month ?? 0,
      billing_year: rentRecord?.billing_year ?? 0,
      rent_amount: rentRecord?.rent_amount ?? 0,
    }
  })
}

export async function voidReceipt(
  supabase: DBClient,
  receiptId: string,
  reason: string,
  userId: string
): Promise<StayNestReceipt | null> {
  const { data } = await supabase
    .from('staynest_receipts')
    .update({
      status: 'voided',
      void_reason: reason,
      voided_at: new Date().toISOString(),
      voided_by: userId,
    })
    .eq('id', receiptId)
    .select('*')
    .single()

  return data
}

export async function regenerateReceipt(
  supabase: DBClient,
  organizationId: string,
  receiptId: string,
  userId: string
): Promise<{ oldReceipt: StayNestReceipt | null; newReceipt: StayNestReceipt | null }> {
  const { data: oldReceipt } = await supabase
    .from('staynest_receipts')
    .select('*')
    .eq('id', receiptId)
    .eq('organization_id', organizationId)
    .single()

  if (!oldReceipt) return { oldReceipt: null, newReceipt: null }

  await supabase
    .from('staynest_receipts')
    .update({
      status: 'voided',
      void_reason: 'Regenerated',
      voided_at: new Date().toISOString(),
      voided_by: userId,
    })
    .eq('id', receiptId)

  const { data: receiptNum } = await supabase
    .rpc('generate_receipt_number', { org_id: organizationId })

  const receiptNumber: string = receiptNum ?? `RCP-${Date.now()}`

  const { data: newReceipt } = await supabase
    .from('staynest_receipts')
    .insert({
      organization_id: organizationId,
      rent_record_id: oldReceipt.rent_record_id,
      receipt_number: receiptNumber,
      amount_paid: oldReceipt.amount_paid,
      payment_method: oldReceipt.payment_method,
      payment_date: new Date().toISOString(),
      notes: oldReceipt.notes,
      regenerated_from_id: receiptId,
      created_by: userId,
    })
    .select('*')
    .single()

  return { oldReceipt: { ...oldReceipt, status: 'voided' }, newReceipt }
}

export async function getResidentPaymentSummary(
  supabase: DBClient,
  organizationId: string,
  residentId: string
): Promise<ResidentPaymentSummary> {
  const { data: rentRecords } = await supabase
    .from('staynest_rent_records')
    .select('amount, paid_amount, status, payment_date')
    .eq('organization_id', organizationId)
    .eq('resident_id', residentId)

  if (!rentRecords || rentRecords.length === 0) {
    return { total_paid: 0, total_due: 0, outstanding: 0, last_payment: null, last_payment_amount: null }
  }

  const totalDue = rentRecords.reduce((s, r) => s + r.amount, 0)
  const totalPaid = rentRecords.reduce((s, r) => s + (r.paid_amount || 0), 0)

  const paidRecords = rentRecords
    .filter((r) => r.status === 'paid' && r.payment_date)
    .sort((a, b) => new Date(b.payment_date!).getTime() - new Date(a.payment_date!).getTime())

  const lastPayment = paidRecords[0]

  return {
    total_paid: totalPaid,
    total_due: totalDue,
    outstanding: totalDue - totalPaid,
    last_payment: lastPayment?.payment_date ?? null,
    last_payment_amount: lastPayment?.paid_amount ?? null,
  }
}

export async function getAllResidentPaymentSummaries(
  supabase: DBClient,
  organizationId: string
): Promise<Map<string, ResidentPaymentSummary>> {
  const { data: rentRecords } = await supabase
    .from('staynest_rent_records')
    .select('resident_id, amount, paid_amount, status, payment_date')
    .eq('organization_id', organizationId)

  const summaries = new Map<string, ResidentPaymentSummary>()

  if (!rentRecords) return summaries

  const grouped = new Map<string, typeof rentRecords>()
  for (const rec of rentRecords) {
    const existing = grouped.get(rec.resident_id) ?? []
    existing.push(rec)
    grouped.set(rec.resident_id, existing)
  }

  for (const [residentId, records] of grouped) {
    const totalDue = records.reduce((s, r) => s + r.amount, 0)
    const totalPaid = records.reduce((s, r) => s + (r.paid_amount || 0), 0)

    const paidRecords = records
      .filter((r) => r.status === 'paid' && r.payment_date)
      .sort((a, b) => new Date(b.payment_date!).getTime() - new Date(a.payment_date!).getTime())

    const lastPayment = paidRecords[0]

    summaries.set(residentId, {
      total_paid: totalPaid,
      total_due: totalDue,
      outstanding: totalDue - totalPaid,
      last_payment: lastPayment?.payment_date ?? null,
      last_payment_amount: lastPayment?.paid_amount ?? null,
    })
  }

  return summaries
}
