import type { DBClient, StayNestNotificationLog, StayNestNotificationTemplate } from '../types'

// ── Template Rendering ─────────────────────────────────────────────────────

function renderTemplate(template: string, variables: Record<string, string | number>): string {
  let result = template
  for (const [key, value] of Object.entries(variables)) {
    result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), String(value))
  }
  return result
}

// ── Provider-Agnostic Dispatch ─────────────────────────────────────────────

export async function dispatchNotification(
  supabase: DBClient,
  input: {
    organizationId: string
    event: string
    channel: string
    recipient: string
    variables: Record<string, string | number>
    userId?: string
  }
): Promise<StayNestNotificationLog | null> {
  // Find matching active template
  const { data: templates } = await supabase
    .from('staynest_notification_templates')
    .select('*')
    .eq('event', input.event)
    .eq('channel', input.channel)
    .eq('is_active', true)
    .or(`organization_id.eq.${input.organizationId},organization_id.is.null`)
    .order('organization_id', { ascending: false, nullsFirst: false })
    .limit(1)

  const template = (templates ?? [])[0] ?? null
  const renderedMessage = template
    ? renderTemplate(template.template_text, input.variables)
    : `[${input.event}] Notification for ${input.recipient}`

  const { data: log } = await supabase
    .from('staynest_notification_logs')
    .insert({
      organization_id: input.organizationId,
      template_id: template?.id ?? null,
      event: input.event,
      channel: input.channel,
      recipient: input.recipient,
      rendered_message: renderedMessage,
      status: 'pending',
    })
    .select('*')
    .single()

  return log
}

// ── Event Helpers ──────────────────────────────────────────────────────────

export async function notifyRentDue(
  supabase: DBClient,
  organizationId: string,
  resident: { id: string; full_name: string; phone: string },
  record: { rent_amount: number; due_date: string; billing_month: number; billing_year: number }
) {
  const month = new Date(record.billing_year, record.billing_month - 1).toLocaleDateString('en-IN', { month: 'long' })

  return dispatchNotification(supabase, {
    organizationId,
    event: 'rent_due',
    channel: 'whatsapp',
    recipient: resident.phone,
    variables: {
      resident_name: resident.full_name,
      rent_amount: record.rent_amount,
      month,
      year: String(record.billing_year),
      due_date: new Date(record.due_date).toLocaleDateString('en-IN'),
    },
  })
}

export async function notifyRentOverdue(
  supabase: DBClient,
  organizationId: string,
  resident: { id: string; full_name: string; phone: string },
  record: { amount: number; late_fee: number; billing_month: number; billing_year: number }
) {
  const month = new Date(record.billing_year, record.billing_month - 1).toLocaleDateString('en-IN', { month: 'long' })

  return dispatchNotification(supabase, {
    organizationId,
    event: 'rent_overdue',
    channel: 'whatsapp',
    recipient: resident.phone,
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

export async function notifyMaintenanceResolved(
  supabase: DBClient,
  organizationId: string,
  resident: { id: string; full_name: string; phone: string },
  title: string
) {
  return dispatchNotification(supabase, {
    organizationId,
    event: 'maintenance_resolved',
    channel: 'whatsapp',
    recipient: resident.phone,
    variables: {
      resident_name: resident.full_name,
      title,
    },
  })
}

export async function notifyAnnouncement(
  supabase: DBClient,
  organizationId: string,
  recipient: string,
  title: string,
  message: string
) {
  return dispatchNotification(supabase, {
    organizationId,
    event: 'announcement_created',
    channel: 'whatsapp',
    recipient,
    variables: { title, message },
  })
}

// ── Provider Registry (extensible) ─────────────────────────────────────────

export type NotificationProvider = (
  log: StayNestNotificationLog
) => Promise<{ success: boolean; error?: string }>

const providers = new Map<string, NotificationProvider>()

export function registerProvider(channel: string, handler: NotificationProvider) {
  providers.set(channel, handler)
}

export async function sendPendingNotifications(
  supabase: DBClient,
  organizationId: string
): Promise<number> {
  const { data: pending } = await supabase
    .from('staynest_notification_logs')
    .select('*')
    .eq('organization_id', organizationId)
    .eq('status', 'pending')
    .limit(50)

  if (!pending || pending.length === 0) return 0

  let sent = 0
  for (const log of pending) {
    const provider = providers.get(log.channel)
    if (!provider) {
      await supabase
        .from('staynest_notification_logs')
        .update({ status: 'failed', error_message: `No provider for channel: ${log.channel}` })
        .eq('id', log.id)
      continue
    }

    const result = await provider(log)
    await supabase
      .from('staynest_notification_logs')
      .update({
        status: result.success ? 'sent' : 'failed',
        error_message: result.error ?? null,
        sent_at: result.success ? new Date().toISOString() : null,
      })
      .eq('id', log.id)

    if (result.success) sent++
  }

  return sent
}

// ── Query Helpers ──────────────────────────────────────────────────────────

export async function listNotificationLogs(
  supabase: DBClient,
  organizationId: string,
  limit = 50
): Promise<StayNestNotificationLog[]> {
  const { data } = await supabase
    .from('staynest_notification_logs')
    .select('*')
    .eq('organization_id', organizationId)
    .order('created_at', { ascending: false })
    .limit(limit)

  return data ?? []
}

export async function listNotificationTemplates(
  supabase: DBClient,
  organizationId: string
): Promise<StayNestNotificationTemplate[]> {
  const { data } = await supabase
    .from('staynest_notification_templates')
    .select('*')
    .or(`organization_id.eq.${organizationId},organization_id.is.null`)
    .order('event')

  return data ?? []
}
