import type { DBClient } from '../types'

export interface StayNestAnalytics {
  occupancy: {
    total_rooms: number
    occupied_beds: number
    vacant_beds: number
    total_capacity: number
    occupancy_percentage: number
  }
  revenue: {
    expected_revenue: number
    collected_revenue: number
    pending_revenue: number
    overdue_revenue: number
  }
  residents: {
    active: number
    notice_period: number
    checked_out: number
    total: number
  }
  maintenance: {
    open: number
    assigned: number
    in_progress: number
    resolved: number
    closed: number
    total: number
  }
  visitors: {
    today: number
    week: number
    month: number
    total: number
  }
  revenueTrend: { month: string; expected: number; collected: number }[]
  occupancyTrend: { month: string; occupied: number; total: number }[]
}

export async function getStayNestAnalytics(
  supabase: DBClient,
  organizationId: string
): Promise<StayNestAnalytics> {
  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()
  const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  const currentMonth = now.getMonth() + 1
  const currentYear = now.getFullYear()

  // Run all queries in parallel
  const [
    roomsRes,
    residentsRes,
    maintenanceRes,
    visitorsRes,
    rentRes,
    revenueTrendData,
  ] = await Promise.all([
    supabase
      .from('staynest_rooms')
      .select('capacity, occupied_beds, status')
      .eq('organization_id', organizationId)
      .is('deleted_at', null),

    supabase
      .from('staynest_residents')
      .select('status')
      .eq('organization_id', organizationId)
      .is('deleted_at', null),

    supabase
      .from('staynest_maintenance_requests')
      .select('status')
      .eq('organization_id', organizationId)
      .is('deleted_at', null),

    supabase
      .from('staynest_visitors')
      .select('check_in_at')
      .eq('organization_id', organizationId)
      .is('deleted_at', null),

    supabase
      .from('staynest_rent_records')
      .select('status, rent_amount, paid_amount, amount, billing_month, billing_year')
      .eq('organization_id', organizationId),

    getRevenueTrend(supabase, organizationId),
  ])

  const rooms = roomsRes.data ?? []
  const residents = residentsRes.data ?? []
  const maintenance = maintenanceRes.data ?? []
  const visitors = visitorsRes.data ?? []
  const rentRecords = rentRes.data ?? []

  // ── Occupancy ──
  const totalRooms = rooms.length
  const totalCapacity = rooms.reduce((s, r) => s + r.capacity, 0)
  const occupiedBeds = rooms.reduce((s, r) => s + r.occupied_beds, 0)
  const vacantBeds = totalCapacity - occupiedBeds
  const occupancyPercentage = totalCapacity > 0
    ? Math.round((occupiedBeds / totalCapacity) * 100)
    : 0

  // ── Residents ──
  const activeResidents = residents.filter((r) => r.status === 'active').length
  const noticePeriod = residents.filter((r) => r.status === 'notice_period').length
  const checkedOut = residents.filter((r) => r.status === 'checked_out').length

  // ── Maintenance ──
  const openMaint = maintenance.filter((r) => r.status === 'open').length
  const assignedMaint = maintenance.filter((r) => r.status === 'assigned').length
  const inProgressMaint = maintenance.filter((r) => r.status === 'in_progress').length
  const resolvedMaint = maintenance.filter((r) => r.status === 'resolved').length
  const closedMaint = maintenance.filter((r) => r.status === 'closed').length

  // ── Visitors ──
  const visitorsToday = visitors.filter(
    (v) => v.check_in_at >= todayStart
  ).length
  const visitorsWeek = visitors.filter(
    (v) => v.check_in_at >= weekStart
  ).length
  const visitorsMonth = visitors.filter(
    (v) => v.check_in_at >= monthStart
  ).length

  // ── Revenue ──
  const monthlyRecords = rentRecords.filter(
    (r) => r.billing_month === currentMonth && r.billing_year === currentYear
  )
  const expectedRevenue = monthlyRecords.reduce((s, r) => s + r.rent_amount, 0)
  const collectedRevenue = monthlyRecords
    .filter((r) => r.status === 'paid')
    .reduce((s, r) => s + (r.paid_amount ?? 0), 0)
  const pendingRevenue = monthlyRecords
    .filter((r) => r.status === 'pending' || r.status === 'partially_paid')
    .reduce((s, r) => s + r.amount, 0)
  const overdueRevenue = monthlyRecords
    .filter((r) => r.status === 'overdue')
    .reduce((s, r) => s + r.amount, 0)

  // Occupancy trend (last 6 months)
  const occupancyTrend = buildOccupancyTrend(supabase, organizationId)

  return {
    occupancy: {
      total_rooms: totalRooms,
      occupied_beds: occupiedBeds,
      vacant_beds: vacantBeds,
      total_capacity: totalCapacity,
      occupancy_percentage: occupancyPercentage,
    },
    revenue: {
      expected_revenue: expectedRevenue,
      collected_revenue: collectedRevenue,
      pending_revenue: pendingRevenue,
      overdue_revenue: overdueRevenue,
    },
    residents: {
      active: activeResidents,
      notice_period: noticePeriod,
      checked_out: checkedOut,
      total: residents.length,
    },
    maintenance: {
      open: openMaint,
      assigned: assignedMaint,
      in_progress: inProgressMaint,
      resolved: resolvedMaint,
      closed: closedMaint,
      total: maintenance.length,
    },
    visitors: {
      today: visitorsToday,
      week: visitorsWeek,
      month: visitorsMonth,
      total: visitors.length,
    },
    revenueTrend: await revenueTrendData,
    occupancyTrend: await occupancyTrend,
  }
}

export async function getRevenueTrend(
  supabase: DBClient,
  organizationId: string,
  limitMonths = 6
): Promise<{ month: string; expected: number; collected: number }[]> {
  const now = new Date()
  const result: { month: string; expected: number; collected: number }[] = []

  for (let i = limitMonths - 1; i >= 0; i--) {
    let m = now.getMonth() + 1 - i
    let y = now.getFullYear()
    if (m <= 0) { m += 12; y -= 1 }

    const { data } = await supabase
      .from('staynest_rent_records')
      .select('status, rent_amount, paid_amount')
      .eq('organization_id', organizationId)
      .eq('billing_month', m)
      .eq('billing_year', y)

    const records = data ?? []
    const expected = records.reduce((s, r) => s + r.rent_amount, 0)
    const collected = records
      .filter((r) => r.status === 'paid')
      .reduce((s, r) => s + (r.paid_amount ?? 0), 0)

    const label = new Date(y, m - 1).toLocaleDateString('en-IN', {
      month: 'short', year: '2-digit',
    })
    result.push({ month: label, expected, collected })
  }

  return result
}

export async function buildOccupancyTrend(
  supabase: DBClient,
  organizationId: string
): Promise<{ month: string; occupied: number; total: number }[]> {
  const { data: rooms } = await supabase
    .from('staynest_rooms')
    .select('capacity, occupied_beds')
    .eq('organization_id', organizationId)
    .is('deleted_at', null)

  const totalCapacity = (rooms ?? []).reduce((s, r) => s + r.capacity, 0)
  const occupied = (rooms ?? []).reduce((s, r) => s + r.occupied_beds, 0)

  const now = new Date()
  const result: { month: string; occupied: number; total: number }[] = []

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const label = d.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' })
    // Current occupancy is the same for recent months (no historical tracking yet)
    result.push({ month: label, occupied, total: totalCapacity })
  }

  return result
}

export async function getMaintenanceTrend(
  supabase: DBClient,
  organizationId: string,
  limitMonths = 6
): Promise<{ month: string; open: number; resolved: number }[]> {
  const now = new Date()
  const result: { month: string; open: number; resolved: number }[] = []

  for (let i = limitMonths - 1; i >= 0; i--) {
    let m = now.getMonth() + 1 - i
    let y = now.getFullYear()
    if (m <= 0) { m += 12; y -= 1 }

    const startOfMonth = new Date(y, m - 1, 1).toISOString()
    const endOfMonth = new Date(y, m, 0, 23, 59, 59).toISOString()

    const { data } = await supabase
      .from('staynest_maintenance_requests')
      .select('status, created_at')
      .eq('organization_id', organizationId)
      .is('deleted_at', null)
      .gte('created_at', startOfMonth)
      .lte('created_at', endOfMonth)

    const records = data ?? []
    const open = records.filter((r) => r.status === 'open' || r.status === 'assigned' || r.status === 'in_progress').length
    const resolved = records.filter((r) => r.status === 'resolved' || r.status === 'closed').length

    const label = new Date(y, m - 1).toLocaleDateString('en-IN', {
      month: 'short', year: '2-digit',
    })
    result.push({ month: label, open, resolved })
  }

  return result
}
