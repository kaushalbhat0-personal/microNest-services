import type { DBClient, NotificationEngineStats } from '../types'
import { dispatchNotification, sendSingleNotification } from './notifications'
import { listNotificationRules } from './notifications'

export interface ExecutionResult {
  rules_executed: number
  notifications_created: number
  errors: string[]
}

interface Recipient {
  id: string
  full_name: string
  phone: string
  variables: Record<string, string | number>
}

export class NotificationEngine {
  async executeAllRules(supabase: DBClient, organizationId: string): Promise<ExecutionResult> {
    const rules = await listNotificationRules(supabase, organizationId)
    const activeRules = rules.filter((r) => r.is_active)

    if (activeRules.length === 0) {
      return { rules_executed: 0, notifications_created: 0, errors: [] }
    }

    let totalCreated = 0
    const errors: string[] = []

    for (const rule of activeRules) {
      try {
        const result = await this.executeRule(supabase, organizationId, rule.trigger_event)
        totalCreated += result.notifications_created
        errors.push(...result.errors)
      } catch (e) {
        errors.push(`Rule ${rule.name} (${rule.trigger_event}): ${e instanceof Error ? e.message : 'Unknown error'}`)
      }
    }

    return { rules_executed: activeRules.length, notifications_created: totalCreated, errors }
  }

  async executeRule(supabase: DBClient, organizationId: string, triggerEvent: string): Promise<ExecutionResult> {
    const recipients = await this.findEligibleRecipients(supabase, organizationId, triggerEvent)

    if (recipients.length === 0) {
      return { rules_executed: 1, notifications_created: 0, errors: [] }
    }

    const errors: string[] = []
    let created = 0

    for (const recipient of recipients) {
      try {
        const log = await dispatchNotification(supabase, {
          organizationId,
          event: triggerEvent,
          channel: 'whatsapp',
          recipient: recipient.phone,
          variables: recipient.variables,
        })

        if (log) {
          created++
          await sendSingleNotification(supabase, organizationId, log)
        }
      } catch (e) {
        errors.push(`Recipient ${recipient.full_name}: ${e instanceof Error ? e.message : 'Unknown error'}`)
      }
    }

    return { rules_executed: 1, notifications_created: created, errors }
  }

  private async findEligibleRecipients(
    supabase: DBClient,
    organizationId: string,
    triggerEvent: string
  ): Promise<Recipient[]> {
    switch (triggerEvent) {
      case 'rent_due':
        return this.findRentDueRecipients(supabase, organizationId)
      case 'rent_overdue':
        return this.findRentOverdueRecipients(supabase, organizationId)
      case 'maintenance_resolved':
        return this.findMaintenanceResolvedRecipients(supabase, organizationId)
      case 'announcement_created':
        return this.findAnnouncementRecipients(supabase, organizationId)
      default:
        return []
    }
  }

  private async findRentDueRecipients(
    supabase: DBClient,
    organizationId: string
  ): Promise<Recipient[]> {
    const now = new Date()
    const currentMonth = now.getMonth() + 1
    const currentYear = now.getFullYear()

    const { data: records } = await supabase
      .from('staynest_rent_records')
      .select('resident_id, rent_amount, due_date, billing_month, billing_year')
      .eq('organization_id', organizationId)
      .eq('billing_month', currentMonth)
      .eq('billing_year', currentYear)
      .in('status', ['pending', 'overdue'])

    if (!records || records.length === 0) return []

    const residentIds = records.map((r) => r.resident_id)

    const { data: residents } = await supabase
      .from('staynest_residents')
      .select('id, full_name, phone')
      .eq('organization_id', organizationId)
      .in('id', residentIds)
      .eq('status', 'active')

    if (!residents) return []

    const residentMap = new Map(residents.map((r) => [r.id, r]))

    const recipients: Recipient[] = []
    for (const record of records) {
      const resident = residentMap.get(record.resident_id)
      if (!resident) continue
      const month = new Date(record.billing_year, record.billing_month - 1).toLocaleDateString('en-IN', { month: 'long' })
      recipients.push({
        id: resident.id,
        full_name: resident.full_name,
        phone: resident.phone,
        variables: {
          resident_name: resident.full_name,
          rent_amount: record.rent_amount,
          month,
          year: String(record.billing_year),
          due_date: new Date(record.due_date).toLocaleDateString('en-IN'),
        },
      })
    }
    return recipients
  }

  private async findRentOverdueRecipients(
    supabase: DBClient,
    organizationId: string
  ): Promise<Recipient[]> {
    const { data: records } = await supabase
      .from('staynest_rent_records')
      .select('resident_id, amount, late_fee, billing_month, billing_year')
      .eq('organization_id', organizationId)
      .eq('status', 'overdue')

    if (!records || records.length === 0) return []

    const residentIds = records.map((r) => r.resident_id)

    const { data: residents } = await supabase
      .from('staynest_residents')
      .select('id, full_name, phone')
      .eq('organization_id', organizationId)
      .in('id', residentIds)

    if (!residents) return []

    const residentMap = new Map(residents.map((r) => [r.id, r]))

    const recipients: Recipient[] = []
    for (const record of records) {
      const resident = residentMap.get(record.resident_id)
      if (!resident) continue
      const month = new Date(record.billing_year, record.billing_month - 1).toLocaleDateString('en-IN', { month: 'long' })
      recipients.push({
        id: resident.id,
        full_name: resident.full_name,
        phone: resident.phone,
        variables: {
          resident_name: resident.full_name,
          amount: record.amount,
          month,
          year: String(record.billing_year),
          late_fee: record.late_fee,
          total_due: record.amount,
        },
      })
    }
    return recipients
  }

  private async findMaintenanceResolvedRecipients(
    supabase: DBClient,
    organizationId: string
  ): Promise<Recipient[]> {
    const { data: requests } = await supabase
      .from('staynest_maintenance_requests')
      .select('id, title, resident_id')
      .eq('organization_id', organizationId)
      .eq('status', 'resolved')
      .not('resident_id', 'is', null)

    if (!requests || requests.length === 0) return []

    const residentIds = [...new Set(requests.map((r) => r.resident_id) as string[])]

    const { data: residents } = await supabase
      .from('staynest_residents')
      .select('id, full_name, phone')
      .eq('organization_id', organizationId)
      .in('id', residentIds)

    if (!residents) return []

    const residentMap = new Map(residents.map((r) => [r.id, r]))

    const recipients: Recipient[] = []
    for (const req of requests) {
      const resident = residentMap.get(req.resident_id!)
      if (!resident) continue
      recipients.push({
        id: resident.id,
        full_name: resident.full_name,
        phone: resident.phone,
        variables: {
          resident_name: resident.full_name,
          title: req.title,
        },
      })
    }
    return recipients
  }

  private async findAnnouncementRecipients(
    supabase: DBClient,
    organizationId: string
  ): Promise<Recipient[]> {
    const { data: residents } = await supabase
      .from('staynest_residents')
      .select('id, full_name, phone')
      .eq('organization_id', organizationId)
      .eq('status', 'active')

    if (!residents || residents.length === 0) return []

    return residents.map((resident) => ({
      id: resident.id,
      full_name: resident.full_name,
      phone: resident.phone,
      variables: {
        resident_name: resident.full_name,
        title: 'Notification',
        message: 'You have a new announcement from your accommodation.',
      },
    }))
  }
}

// ── Stats Query ────────────────────────────────────────────────────────────

export async function getNotificationEngineStats(
  supabase: DBClient,
  organizationId: string,
  limitDays = 7
): Promise<NotificationEngineStats> {
  const since = new Date(Date.now() - limitDays * 24 * 60 * 60 * 1000).toISOString()

  const { data: logs } = await supabase
    .from('staynest_notification_logs')
    .select('status, event, created_at')
    .eq('organization_id', organizationId)
    .gte('created_at', since)
    .order('created_at', { ascending: false })

  if (!logs || logs.length === 0) {
    return {
      total_sent: 0,
      total_pending: 0,
      total_failed: 0,
      total_logs: 0,
      success_rate: 0,
      by_event: {},
      last_execution: null,
    }
  }

  const byEvent: Record<string, { sent: number; pending: number; failed: number }> = {}

  for (const log of logs) {
    if (!byEvent[log.event]) {
      byEvent[log.event] = { sent: 0, pending: 0, failed: 0 }
    }
    if (log.status === 'sent') byEvent[log.event].sent++
    else if (log.status === 'pending') byEvent[log.event].pending++
    else if (log.status === 'failed') byEvent[log.event].failed++
  }

  const totalSent = logs.filter((l) => l.status === 'sent').length
  const totalPending = logs.filter((l) => l.status === 'pending').length
  const totalFailed = logs.filter((l) => l.status === 'failed').length
  const totalNonPending = totalSent + totalFailed
  const successRate = totalNonPending > 0 ? Math.round((totalSent / totalNonPending) * 100) : 0

  return {
    total_sent: totalSent,
    total_pending: totalPending,
    total_failed: totalFailed,
    total_logs: logs.length,
    success_rate: successRate,
    by_event: byEvent,
    last_execution: logs[0]?.created_at ?? null,
  }
}

export const notificationEngine = new NotificationEngine()
