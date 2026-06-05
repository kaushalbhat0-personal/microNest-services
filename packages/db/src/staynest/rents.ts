import type { DBClient, StayNestRentRecord, StayNestReceipt } from '../types'

export async function listRentRecords(
  supabase: DBClient,
  organizationId: string,
  options?: { status?: string; month?: number; year?: number }
): Promise<StayNestRentRecord[]> {
  let query = supabase
    .from('staynest_rent_records')
    .select('*')
    .eq('organization_id', organizationId)
    .order('created_at', { ascending: false })

  if (options?.status) query = query.eq('status', options.status)
  if (options?.month) query = query.eq('billing_month', options.month)
  if (options?.year) query = query.eq('billing_year', options.year)

  const { data } = await query
  return data ?? []
}

export async function getRentRecordById(
  supabase: DBClient,
  organizationId: string,
  id: string
): Promise<StayNestRentRecord | null> {
  const { data } = await supabase
    .from('staynest_rent_records')
    .select('*')
    .eq('id', id)
    .eq('organization_id', organizationId)
    .single()
  return data
}

export async function generateRentForMonth(
  supabase: DBClient,
  organizationId: string,
  month: number,
  year: number,
  userId: string
): Promise<{ created: number; skipped: number; errors: string[] }> {
  const result = { created: 0, skipped: 0, errors: [] as string[] }

  // Fetch org rent settings
  const { data: org } = await supabase
    .from('organizations')
    .select('rent_due_day, late_fee_type, late_fee_amount, late_fee_grace_period')
    .eq('id', organizationId)
    .single()

  if (!org) {
    result.errors.push('Organization not found')
    return result
  }

  // Fetch active residents
  const { data: residents } = await supabase
    .from('staynest_residents')
    .select('id, full_name, room_id, status')
    .eq('organization_id', organizationId)
    .eq('status', 'active')

  if (!residents || residents.length === 0) {
    result.skipped = 0
    return result
  }

  // Fetch rooms for rent amount
  const { data: rooms } = await supabase
    .from('staynest_rooms')
    .select('id, rent_per_bed')
    .eq('organization_id', organizationId)

  const roomRentMap = new Map((rooms ?? []).map((r) => [r.id, r.rent_per_bed]))

  // Check existing records for this month to prevent duplicates
  const { data: existing } = await supabase
    .from('staynest_rent_records')
    .select('resident_id')
    .eq('organization_id', organizationId)
    .eq('billing_month', month)
    .eq('billing_year', year)

  const existingResidentIds = new Set((existing ?? []).map((r) => r.resident_id))

  const dueDate = new Date(year, month - 1, org.rent_due_day)
  const inserts: {
    organization_id: string
    resident_id: string
    room_id: string | null
    billing_month: number
    billing_year: number
    rent_amount: number
    amount: number
    late_fee: number
    paid_amount: number
    due_date: string
    status: 'pending'
    notes: string | null
    created_by: string
  }[] = []

  for (const resident of residents) {
    if (existingResidentIds.has(resident.id)) {
      result.skipped++
      continue
    }

    const rentAmount = resident.room_id ? (roomRentMap.get(resident.room_id) ?? 0) : 0
    if (rentAmount <= 0) {
      result.errors.push(`No rent configured for resident ${resident.full_name}`)
      continue
    }

    inserts.push({
      organization_id: organizationId,
      resident_id: resident.id,
      room_id: resident.room_id,
      billing_month: month,
      billing_year: year,
      rent_amount: rentAmount,
      amount: rentAmount,
      late_fee: 0,
      paid_amount: 0,
      due_date: dueDate.toISOString(),
      status: 'pending',
      notes: null,
      created_by: userId,
    })
  }

  if (inserts.length > 0) {
    const { error } = await supabase
      .from('staynest_rent_records')
      .insert(inserts)

    if (error) {
      result.errors.push(error.message)
    } else {
      result.created = inserts.length
    }
  }

  return result
}

export async function recordPayment(
  supabase: DBClient,
  organizationId: string,
  input: {
    rent_record_id: string
    amount: number
    payment_method: 'cash' | 'upi' | 'bank_transfer' | 'other'
    payment_date?: string
    notes?: string | null
  },
  userId: string
): Promise<{ receipt: StayNestReceipt | null; record: StayNestRentRecord | null; error?: string }> {
  const record = await getRentRecordById(supabase, organizationId, input.rent_record_id)
  if (!record) return { receipt: null, record: null, error: 'Rent record not found' }

  if (record.status === 'paid') return { receipt: null, record: null, error: 'Already paid' }

  const prevPaid = record.paid_amount
  const newPaid = prevPaid + input.amount
  const totalDue = record.amount

  let newStatus: 'paid' | 'partially_paid' | 'overdue' | 'pending'
  if (newPaid >= totalDue) {
    newStatus = 'paid'
  } else {
    newStatus = new Date(record.due_date) < new Date() ? 'overdue' : 'pending'
  }

  const paymentDate = input.payment_date ?? new Date().toISOString()

  // Generate receipt number via DB function
  const { data: receiptNum } = await supabase
    .rpc('generate_receipt_number', { org_id: organizationId })

  const receiptNumber: string = receiptNum ?? `RCP-${Date.now()}`

  // Update the rent record
  const { data: updated } = await supabase
    .from('staynest_rent_records')
    .update({
      paid_amount: newPaid,
      status: newStatus,
      payment_method: input.payment_method,
      payment_date: paymentDate,
      receipt_number: receiptNumber,
      notes: input.notes ?? record.notes,
    })
    .eq('id', input.rent_record_id)
    .eq('organization_id', organizationId)
    .select('*')
    .single()

  if (!updated) return { receipt: null, record: null, error: 'Failed to update record' }

  // Create receipt
  const { data: receipt } = await supabase
    .from('staynest_receipts')
    .insert({
      organization_id: organizationId,
      rent_record_id: input.rent_record_id,
      receipt_number: receiptNumber,
      amount_paid: input.amount,
      payment_method: input.payment_method,
      payment_date: paymentDate,
      notes: input.notes ?? null,
      created_by: userId,
    })
    .select('*')
    .single()

  return { receipt, record: updated }
}

export async function getReceipts(
  supabase: DBClient,
  organizationId: string,
  rentRecordId?: string
): Promise<StayNestReceipt[]> {
  let query = supabase
    .from('staynest_receipts')
    .select('*')
    .eq('organization_id', organizationId)
    .order('created_at', { ascending: false })

  if (rentRecordId) query = query.eq('rent_record_id', rentRecordId)

  const { data } = await query
  return data ?? []
}

export async function calculateAndApplyLateFees(
  supabase: DBClient,
  organizationId: string
): Promise<number> {
  const { data: org } = await supabase
    .from('organizations')
    .select('late_fee_type, late_fee_amount, late_fee_grace_period')
    .eq('id', organizationId)
    .single()

  if (!org) return 0

  const { data: overdueRecords } = await supabase
    .from('staynest_rent_records')
    .select('id, due_date, rent_amount, late_fee, status')
    .eq('organization_id', organizationId)
    .in('status', ['pending', 'partially_paid'])
    .lt('due_date', new Date().toISOString())

  if (!overdueRecords || overdueRecords.length === 0) return 0

  let updatedCount = 0

  for (const rec of overdueRecords) {
    const daysOverdue = Math.floor(
      (Date.now() - new Date(rec.due_date).getTime()) / (1000 * 60 * 60 * 24)
    )
    const graceDays = org.late_fee_grace_period
    if (daysOverdue <= graceDays) continue

    let calculatedFee: number
    if (org.late_fee_type === 'fixed') {
      calculatedFee = org.late_fee_amount
    } else {
      calculatedFee = org.late_fee_amount * (daysOverdue - graceDays)
    }

    if (calculatedFee !== rec.late_fee) {
      const { error } = await supabase
        .from('staynest_rent_records')
        .update({
          late_fee: calculatedFee,
          amount: rec.rent_amount + calculatedFee,
          status: rec.status === 'pending' ? 'overdue' : 'partially_paid',
        })
        .eq('id', rec.id)
        .eq('organization_id', organizationId)

      if (!error) updatedCount++
    }
  }

  return updatedCount
}

export async function getRevenueStats(
  supabase: DBClient,
  organizationId: string,
  month?: number,
  year?: number
): Promise<{
  monthlyRevenue: number
  pendingRevenue: number
  overdueRevenue: number
  collectionRate: number
  totalCollected: number
  totalDue: number
}> {
  const now = new Date()
  const targetMonth = month ?? now.getMonth() + 1
  const targetYear = year ?? now.getFullYear()

  const { data: allRecords } = await supabase
    .from('staynest_rent_records')
    .select('status, paid_amount, amount')
    .eq('organization_id', organizationId)

  const monthlyRecords = (allRecords ?? []).filter(
    (r) => r.status === 'paid'
  )

  const monthlyRevenue = monthlyRecords.reduce((s, r) => s + (r.paid_amount || 0), 0)

  const pendingRecords = (allRecords ?? []).filter((r) => r.status === 'pending')
  const pendingRevenue = pendingRecords.reduce((s, r) => s + r.amount, 0)

  const overdueRecords = (allRecords ?? []).filter((r) => r.status === 'overdue')
  const overdueRevenue = overdueRecords.reduce((s, r) => s + r.amount, 0)

  const totalDue = pendingRevenue + overdueRevenue
  const totalCollected = monthlyRevenue
  const collectionRate = totalDue > 0
    ? Math.round((totalCollected / (totalDue + totalCollected)) * 100)
    : 0

  return {
    monthlyRevenue,
    pendingRevenue,
    overdueRevenue,
    collectionRate,
    totalCollected,
    totalDue,
  }
}

export async function listRecurringRevenue(
  supabase: DBClient,
  organizationId: string,
  limitMonths: number = 6
): Promise<{ month: string; revenue: number; pending: number }[]> {
  const now = new Date()
  const result: { month: string; revenue: number; pending: number }[] = []

  for (let i = limitMonths - 1; i >= 0; i--) {
    let m = now.getMonth() + 1 - i
    let y = now.getFullYear()
    if (m <= 0) { m += 12; y -= 1 }

    const { data } = await supabase
      .from('staynest_rent_records')
      .select('status, paid_amount, amount')
      .eq('organization_id', organizationId)
      .eq('billing_month', m)
      .eq('billing_year', y)

    const records = data ?? []
    const revenue = records
      .filter((r) => r.status === 'paid')
      .reduce((s, r) => s + (r.paid_amount || 0), 0)
    const pending = records
      .filter((r) => r.status !== 'paid')
      .reduce((s, r) => s + r.amount, 0)

    const label = new Date(y, m - 1).toLocaleDateString('en-IN', {
      month: 'short', year: '2-digit',
    })
    result.push({ month: label, revenue, pending })
  }

  return result
}

export async function createRentRecord(
  supabase: DBClient,
  organizationId: string,
  input: {
    resident_id: string
    room_id?: string | null
    billing_month: number
    billing_year: number
    rent_amount: number
    due_date: string
    notes?: string | null
  },
  userId: string
): Promise<StayNestRentRecord | null> {
  const { data } = await supabase
    .from('staynest_rent_records')
    .insert({
      organization_id: organizationId,
      resident_id: input.resident_id,
      room_id: input.room_id ?? null,
      billing_month: input.billing_month,
      billing_year: input.billing_year,
      rent_amount: input.rent_amount,
      amount: input.rent_amount,
      late_fee: 0,
      paid_amount: 0,
      due_date: input.due_date,
      notes: input.notes ?? null,
      created_by: userId,
    })
    .select('*')
    .single()
  return data
}

export async function markRentPaid(
  supabase: DBClient,
  organizationId: string,
  id: string,
  paymentMethod: 'cash' | 'upi' | 'bank_transfer' | 'other'
): Promise<StayNestRentRecord | null> {
  const result = await recordPayment(supabase, organizationId, {
    rent_record_id: id,
    amount: (await getRentRecordById(supabase, organizationId, id))?.amount ?? 0,
    payment_method: paymentMethod,
  }, 'system')
  return result.record
}

export async function countPendingRent(
  supabase: DBClient,
  organizationId: string
): Promise<number> {
  const { data } = await supabase
    .from('staynest_rent_records')
    .select('amount')
    .eq('organization_id', organizationId)
    .eq('status', 'pending')

  return (data ?? []).reduce((sum, r) => sum + r.amount, 0)
}

export async function countCollectedRent(
  supabase: DBClient,
  organizationId: string
): Promise<number> {
  const { data } = await supabase
    .from('staynest_rent_records')
    .select('paid_amount')
    .eq('organization_id', organizationId)
    .eq('status', 'paid')

  return (data ?? []).reduce((sum, r) => sum + (r.paid_amount ?? 0), 0)
}

export async function countOverdueRent(
  supabase: DBClient,
  organizationId: string
): Promise<number> {
  const { data } = await supabase
    .from('staynest_rent_records')
    .select('amount')
    .eq('organization_id', organizationId)
    .eq('status', 'overdue')

  return (data ?? []).reduce((sum, r) => sum + r.amount, 0)
}

export async function countPendingRecords(
  supabase: DBClient,
  organizationId: string
): Promise<number> {
  const { data } = await supabase
    .from('staynest_rent_records')
    .select('id', { count: 'exact', head: true })
    .eq('organization_id', organizationId)
    .eq('status', 'pending')

  return data?.length ?? 0
}
