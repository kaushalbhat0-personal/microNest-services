import type { DBClient } from '../types'

function escapeCSV(val: unknown): string {
  const str = String(val ?? '')
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

function rowsToCSV(headers: string[], rows: string[][]): string {
  const headerLine = headers.map(escapeCSV).join(',')
  const dataLines = rows.map((r) => r.map(escapeCSV).join(','))
  return [headerLine, ...dataLines].join('\r\n')
}

export async function exportResidentsCSV(
  supabase: DBClient,
  organizationId: string
): Promise<string> {
  const { data } = await supabase
    .from('staynest_residents')
    .select('full_name, phone, email, gender, status, room_id, bed_number, check_in_date, check_out_date, emergency_contact_name, emergency_contact_phone, id_proof_type, id_proof_number, created_at')
    .eq('organization_id', organizationId)
    .is('deleted_at', null)
    .order('full_name')

  const rows = (data ?? []).map((r) => [
    r.full_name,
    r.phone,
    r.email ?? '',
    r.gender ?? '',
    r.status,
    r.room_id ?? '',
    String(r.bed_number ?? ''),
    r.check_in_date,
    r.check_out_date ?? '',
    r.emergency_contact_name ?? '',
    r.emergency_contact_phone ?? '',
    r.id_proof_type ?? '',
    r.id_proof_number ?? '',
    r.created_at,
  ])

  return rowsToCSV([
    'Full Name', 'Phone', 'Email', 'Gender', 'Status', 'Room ID', 'Bed Number',
    'Check In Date', 'Check Out Date', 'Emergency Contact', 'Emergency Phone',
    'ID Proof Type', 'ID Proof Number', 'Created At',
  ], rows)
}

export async function exportRentRecordsCSV(
  supabase: DBClient,
  organizationId: string
): Promise<string> {
  const { data } = await supabase
    .from('staynest_rent_records')
    .select('resident_id, room_id, billing_month, billing_year, rent_amount, late_fee, amount, paid_amount, due_date, payment_date, payment_method, status, receipt_number, created_at')
    .eq('organization_id', organizationId)
    .order('billing_year', { ascending: false })
    .order('billing_month', { ascending: false })

  const rows = (data ?? []).map((r) => [
    r.resident_id,
    r.room_id ?? '',
    String(r.billing_month),
    String(r.billing_year),
    String(r.rent_amount),
    String(r.late_fee),
    String(r.amount),
    String(r.paid_amount),
    r.due_date,
    r.payment_date ?? '',
    r.payment_method ?? '',
    r.status,
    r.receipt_number ?? '',
    r.created_at,
  ])

  return rowsToCSV([
    'Resident ID', 'Room ID', 'Month', 'Year', 'Rent Amount', 'Late Fee',
    'Total Amount', 'Paid Amount', 'Due Date', 'Payment Date', 'Payment Method',
    'Status', 'Receipt Number', 'Created At',
  ], rows)
}

export async function exportMaintenanceCSV(
  supabase: DBClient,
  organizationId: string
): Promise<string> {
  const { data } = await supabase
    .from('staynest_maintenance_requests')
    .select('title, description, category, priority, status, resident_id, room_id, assigned_to, created_at, resolved_at, resolved_by')
    .eq('organization_id', organizationId)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  const rows = (data ?? []).map((r) => [
    r.title,
    r.description,
    r.category,
    r.priority,
    r.status,
    r.resident_id ?? '',
    r.room_id ?? '',
    r.assigned_to ?? '',
    r.created_at,
    r.resolved_at ?? '',
    r.resolved_by ?? '',
  ])

  return rowsToCSV([
    'Title', 'Description', 'Category', 'Priority', 'Status',
    'Resident ID', 'Room ID', 'Assigned To', 'Created At', 'Resolved At', 'Resolved By',
  ], rows)
}

export async function exportVisitorsCSV(
  supabase: DBClient,
  organizationId: string
): Promise<string> {
  const { data } = await supabase
    .from('staynest_visitors')
    .select('name, phone, purpose, room_number, resident_id, status, check_in_at, check_out_at, created_at')
    .eq('organization_id', organizationId)
    .is('deleted_at', null)
    .order('check_in_at', { ascending: false })

  const rows = (data ?? []).map((r) => [
    r.name,
    r.phone,
    r.purpose,
    r.room_number,
    r.resident_id ?? '',
    r.status,
    r.check_in_at,
    r.check_out_at ?? '',
    r.created_at,
  ])

  return rowsToCSV([
    'Name', 'Phone', 'Purpose', 'Room Number', 'Resident ID',
    'Status', 'Check In', 'Check Out', 'Created At',
  ], rows)
}
