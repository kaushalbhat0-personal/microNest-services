import type { Metadata } from 'next'
import { createServerClient } from '@micronest/auth'
import { getUserOrganizations, listNotificationTemplates, listNotificationLogs, listNotificationRules } from '@micronest/db'
import { NotificationsContent } from './notifications-content'

export const metadata: Metadata = {
  title: 'Notification Center',
}

export default async function NotificationsPage() {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return <NotificationsContent templates={[]} logs={[]} rules={[]} organizationId={null} />
  }

  const orgs = await getUserOrganizations(supabase, user.id)

  if (orgs.length === 0) {
    return <NotificationsContent templates={[]} logs={[]} rules={[]} organizationId={null} />
  }

  const orgId = orgs[0].id

  const [templates, logs, rules] = await Promise.all([
    listNotificationTemplates(supabase, orgId),
    listNotificationLogs(supabase, orgId),
    listNotificationRules(supabase, orgId),
  ])

  return <NotificationsContent templates={templates} logs={logs} rules={rules} organizationId={orgId} />
}
