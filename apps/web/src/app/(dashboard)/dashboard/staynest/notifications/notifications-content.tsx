'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  PageHeader,
  Card,
  CardBody,
  CardHeader,
  Button,
  EmptyState,
  StatusBadge,
  Badge,
} from '@micronest/ui'
import type {
  StayNestNotificationTemplate,
  StayNestNotificationLog,
  StayNestNotificationRule,
} from '@micronest/db'
import { PROVIDER_DEFINITIONS } from '@micronest/db'
import type { ProviderName, ProviderConfig } from '@micronest/db'
import {
  toggleTemplateAction,
  createRuleAction,
  toggleRuleAction,
  deleteRuleAction,
  retryNotificationAction,
  getProviderSettingsAction,
  saveProviderAction,
  disconnectProviderAction,
  sendPendingNotificationsAction,
  testProviderConnectionAction,
  sendTestMessageAction,
  activateProviderAction,
} from '@/lib/staynest/actions'

const EVENT_LABELS: Record<string, string> = {
  rent_due: 'Rent Due Reminder',
  rent_overdue: 'Rent Overdue Reminder',
  announcement_created: 'Announcement Broadcast',
  maintenance_resolved: 'Maintenance Resolved',
}

const EVENT_COLORS: Record<string, 'success' | 'warning' | 'danger' | 'info'> = {
  rent_due: 'info',
  rent_overdue: 'danger',
  announcement_created: 'warning',
  maintenance_resolved: 'success',
}

const CHANNEL_COLORS: Record<string, string> = {
  whatsapp: 'bg-green-100 text-green-700',
  email: 'bg-blue-100 text-blue-700',
  sms: 'bg-purple-100 text-purple-700',
}

const STATUS_COLORS: Record<string, 'success' | 'warning' | 'danger' | 'default'> = {
  sent: 'success',
  pending: 'warning',
  failed: 'danger',
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

type Tab = 'templates' | 'logs' | 'rules' | 'execution' | 'providers'

export function NotificationsContent({
  templates,
  logs,
  rules,
  organizationId,
}: {
  templates: StayNestNotificationTemplate[]
  logs: StayNestNotificationLog[]
  rules: StayNestNotificationRule[]
  organizationId: string | null
}) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<Tab>('templates')
  const [error, setError] = useState<string | null>(null)

  const [showRuleForm, setShowRuleForm] = useState(false)
  const [ruleForm, setRuleForm] = useState({
    name: '',
    trigger_event: 'rent_due',
    template_id: '',
  })
  const [loading, setLoading] = useState(false)

  const handleToggleTemplate = useCallback(async (id: string, active: boolean) => {
    setError(null)
    const result = await toggleTemplateAction(id, !active)
    if (result?.error) {
      setError(result.error)
    } else {
      router.refresh()
    }
  }, [router])

  const handleToggleRule = useCallback(async (id: string, active: boolean) => {
    setError(null)
    const result = await toggleRuleAction(id, !active)
    if (result?.error) {
      setError(result.error)
    } else {
      router.refresh()
    }
  }, [router])

  const handleDeleteRule = useCallback(async (id: string) => {
    setError(null)
    const result = await deleteRuleAction(id)
    if (result?.error) {
      setError(result.error)
    } else {
      router.refresh()
    }
  }, [router])

  const handleRetryLog = useCallback(async (id: string) => {
    setError(null)
    const result = await retryNotificationAction(id)
    if (result?.error) {
      setError(result.error)
    } else {
      router.refresh()
    }
  }, [router])

  const handleCreateRule = useCallback(async () => {
    if (!ruleForm.name) return
    setError(null)
    setLoading(true)

    const fd = new FormData()
    fd.set('name', ruleForm.name)
    fd.set('trigger_event', ruleForm.trigger_event)
    fd.set('template_id', ruleForm.template_id || '')

    const result = await createRuleAction({ error: null, success: false }, fd)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    } else {
      setRuleForm({ name: '', trigger_event: 'rent_due', template_id: '' })
      setShowRuleForm(false)
      setLoading(false)
      router.refresh()
    }
  }, [ruleForm, router])

  const tabs: { key: Tab; label: string; href?: string }[] = [
    { key: 'templates', label: 'Templates' },
    { key: 'logs', label: 'Logs' },
    { key: 'rules', label: 'Automation Rules' },
    { key: 'execution', label: 'Execution', href: '/dashboard/staynest/notifications/execution' },
    { key: 'providers', label: 'Provider Settings' },
  ]

  return (
    <div>
      <PageHeader
        title="Notification Center"
        description="Manage notification templates, view logs, configure automation rules, and connect WhatsApp providers"
      />

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mb-6 flex gap-1 overflow-x-auto border-b border-gray-200">
        {tabs.map((tab) =>
          tab.href ? (
            <a
              key={tab.key}
              href={tab.href}
              className="min-h-[44px] whitespace-nowrap border-b-2 border-transparent px-4 py-2.5 text-sm font-medium text-gray-500 transition-colors hover:border-gray-300 hover:text-gray-700"
            >
              {tab.label}
            </a>
          ) : (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`min-h-[44px] whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? 'border-amber-600 text-amber-700'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          )
        )}
      </div>

      {activeTab === 'templates' && (
        <TemplatesTab templates={templates} onToggle={handleToggleTemplate} />
      )}
      {activeTab === 'logs' && (
        <LogsTab logs={logs} onRetry={handleRetryLog} />
      )}
      {activeTab === 'rules' && (
        <RulesTab
          rules={rules}
          templates={templates}
          organizationId={organizationId}
          onToggle={handleToggleRule}
          onDelete={handleDeleteRule}
          showForm={showRuleForm}
          setShowForm={setShowRuleForm}
          ruleForm={ruleForm}
          setRuleForm={setRuleForm}
          onCreate={handleCreateRule}
          loading={loading}
        />
      )}
      {activeTab === 'providers' && (
        <ProvidersTab organizationId={organizationId} />
      )}
    </div>
  )
}

function TemplatesTab({
  templates,
  onToggle,
}: {
  templates: StayNestNotificationTemplate[]
  onToggle: (id: string, active: boolean) => void
}) {
  if (templates.length === 0) {
    return (
      <EmptyState
        title="No notification templates"
        description="Templates will appear here once configured."
      />
    )
  }

  return (
    <div className="space-y-3">
      {templates.map((tpl) => (
        <Card key={tpl.id} padding="md">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-sm font-semibold text-gray-900">
                  {EVENT_LABELS[tpl.event] ?? tpl.event}
                </h3>
                <span className={CHANNEL_COLORS[tpl.channel] ?? 'bg-gray-100 text-gray-700 rounded-full px-2.5 py-0.5 text-xs font-medium'}>
                  {tpl.channel}
                </span>
                <StatusBadge variant={tpl.is_active ? 'success' : 'default'}>
                  {tpl.is_active ? 'Active' : 'Inactive'}
                </StatusBadge>
              </div>
              <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                {tpl.template_text}
              </p>
            </div>
            <Button
              variant={tpl.is_active ? 'secondary' : 'primary'}
              size="sm"
              onClick={() => onToggle(tpl.id, tpl.is_active)}
            >
              {tpl.is_active ? 'Deactivate' : 'Activate'}
            </Button>
          </div>
        </Card>
      ))}
    </div>
  )
}

function LogsTab({
  logs,
  onRetry,
}: {
  logs: StayNestNotificationLog[]
  onRetry: (id: string) => void
}) {
  const [sending, setSending] = useState(false)
  const [sendResult, setSendResult] = useState<{ sent: number } | null>(null)

  const handleSendPending = async () => {
    setSending(true)
    setSendResult(null)
    const result = await sendPendingNotificationsAction()
    if (result?.sent !== undefined) {
      setSendResult({ sent: result.sent })
    }
    setSending(false)
  }

  if (logs.length === 0) {
    return (
      <EmptyState
        title="No notification logs"
        description="Logs will appear here once notifications are dispatched."
      />
    )
  }

  const desktop = (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {logs.filter(l => l.status === 'pending').length} pending
        </p>
        <Button size="sm" onClick={handleSendPending} loading={sending}>
          {sending ? 'Sending...' : 'Send Pending'}
        </Button>
      </div>
      {sendResult && (
        <div className="mb-3 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
          Sent {sendResult.sent} notification{sendResult.sent !== 1 ? 's' : ''}
        </div>
      )}
      <div className="hidden overflow-x-auto rounded-lg border border-gray-200 md:block">
        <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Event</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Recipient</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Channel</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Status</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Date</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500" />
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {logs.map((log) => (
            <tr key={log.id} className="hover:bg-gray-50">
              <td className="px-4 py-3 text-sm text-gray-700">
                {EVENT_LABELS[log.event] ?? log.event}
              </td>
              <td className="px-4 py-3 text-sm text-gray-700">{log.recipient}</td>
              <td className="px-4 py-3 text-sm text-gray-700">
                <span className={CHANNEL_COLORS[log.channel] ?? 'bg-gray-100 text-gray-700 rounded-full px-2.5 py-0.5 text-xs font-medium'}>
                  {log.channel}
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-gray-700">
                <StatusBadge variant={STATUS_COLORS[log.status] ?? 'default'}>
                  {log.status}
                </StatusBadge>
              </td>
              <td className="px-4 py-3 text-sm text-gray-500">{formatDate(log.created_at)}</td>
              <td className="px-4 py-3 text-sm">
                {log.status === 'failed' && (
                  <Button variant="ghost" size="sm" onClick={() => onRetry(log.id)}>
                    Retry
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
  )

  const mobile = (
    <div className="space-y-3 md:hidden">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {logs.filter(l => l.status === 'pending').length} pending
        </p>
        <Button size="sm" onClick={handleSendPending} loading={sending}>
          {sending ? 'Sending...' : 'Send Pending'}
        </Button>
      </div>
      {sendResult && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
          Sent {sendResult.sent} notification{sendResult.sent !== 1 ? 's' : ''}
        </div>
      )}
      {logs.map((log) => (
        <Card key={log.id} padding="md">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-sm font-medium text-gray-900">
                {EVENT_LABELS[log.event] ?? log.event}
              </p>
              <p className="mt-0.5 text-xs text-gray-500">{log.recipient}</p>
            </div>
            <StatusBadge variant={STATUS_COLORS[log.status] ?? 'default'}>
              {log.status}
            </StatusBadge>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-500">
            <span className={CHANNEL_COLORS[log.channel] ?? 'bg-gray-100 text-gray-700 rounded-full px-2 py-0.5 text-xs font-medium'}>
              {log.channel}
            </span>
            <span>{formatDate(log.created_at)}</span>
          </div>
          {log.status === 'failed' && (
            <div className="mt-2">
              <Button variant="ghost" size="sm" onClick={() => onRetry(log.id)}>
                Retry
              </Button>
            </div>
          )}
        </Card>
      ))}
    </div>
  )

  return (
    <>
      {desktop}
      {mobile}
    </>
  )
}

function RulesTab({
  rules,
  templates,
  organizationId,
  onToggle,
  onDelete,
  showForm,
  setShowForm,
  ruleForm,
  setRuleForm,
  onCreate,
  loading,
}: {
  rules: StayNestNotificationRule[]
  templates: StayNestNotificationTemplate[]
  organizationId: string | null
  onToggle: (id: string, active: boolean) => void
  onDelete: (id: string) => void
  showForm: boolean
  setShowForm: (v: boolean) => void
  ruleForm: { name: string; trigger_event: string; template_id: string }
  setRuleForm: (v: { name: string; trigger_event: string; template_id: string }) => void
  onCreate: () => void
  loading: boolean
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {rules.length} automation rule{rules.length !== 1 ? 's' : ''}
        </p>
        {organizationId && (
          <Button
            variant={showForm ? 'secondary' : 'primary'}
            size="sm"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Cancel' : 'Add Rule'}
          </Button>
        )}
      </div>

      {showForm && (
        <Card padding="md">
          <CardHeader>
            <h3 className="text-sm font-semibold text-gray-900">New Automation Rule</h3>
          </CardHeader>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-700">Rule Name</label>
              <input
                type="text"
                value={ruleForm.name}
                onChange={(e) => setRuleForm({ ...ruleForm, name: e.target.value })}
                placeholder="e.g. Send Rent Reminder 5 Days Before"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700">Trigger Event</label>
              <select
                value={ruleForm.trigger_event}
                onChange={(e) => setRuleForm({ ...ruleForm, trigger_event: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                {Object.entries(EVENT_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700">Template (optional)</label>
              <select
                value={ruleForm.template_id}
                onChange={(e) => setRuleForm({ ...ruleForm, template_id: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="">Default template</option>
                {templates.map((tpl) => (
                  <option key={tpl.id} value={tpl.id}>
                    {EVENT_LABELS[tpl.event] ?? tpl.event} ({tpl.channel})
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="secondary" size="sm" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
              <Button size="sm" onClick={onCreate} loading={loading} disabled={!ruleForm.name}>
                Create Rule
              </Button>
            </div>
          </div>
        </Card>
      )}

      {rules.length === 0 && !showForm ? (
        <EmptyState
          title="No automation rules"
          description="Create rules to automatically send notifications based on events."
          action={organizationId ? { label: 'Add Rule', onClick: () => setShowForm(true) } : undefined}
        />
      ) : (
        <div className="space-y-3">
          {rules.map((rule) => (
            <Card key={rule.id} padding="md">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-semibold text-gray-900">{rule.name}</h3>
                    <Badge variant={rule.is_active ? 'indigo' : 'default'}>
                      {rule.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                    <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700">
                      {EVENT_LABELS[rule.trigger_event] ?? rule.trigger_event}
                    </span>
                  </div>
                  {rule.template_id && (
                    <p className="mt-1 text-xs text-gray-500">
                      Template: {templates.find((t) => t.id === rule.template_id)?.template_text.slice(0, 60)}...
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant={rule.is_active ? 'secondary' : 'primary'}
                    size="sm"
                    onClick={() => onToggle(rule.id, rule.is_active)}
                  >
                    {rule.is_active ? 'Pause' : 'Activate'}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onDelete(rule.id)}>
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

function ProvidersTab({
  organizationId,
}: {
  organizationId: string | null
}) {
  const router = useRouter()
  const [savedProviders, setSavedProviders] = useState<Record<string, Record<string, string>>>({})
  const [editingProvider, setEditingProvider] = useState<ProviderName | null>(null)
  const [formValues, setFormValues] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)
  const [loaded, setLoaded] = useState(false)
  const [testingProvider, setTestingProvider] = useState<string | null>(null)
  const [testResult, setTestResult] = useState<{ provider: string; success: boolean; error?: string } | null>(null)
  const [sendingTest, setSendingTest] = useState(false)
  const [testPhone, setTestPhone] = useState('')
  const [sendTestResult, setSendTestResult] = useState<{ provider: string; success: boolean; error?: string } | null>(null)
  const [activating, setActivating] = useState<string | null>(null)

  const activeProvider = Object.entries(savedProviders).find(
    ([_, settings]) => settings.activated === 'true'
  )?.[0] ?? null

  useEffect(() => {
    if (!organizationId) return
    getProviderSettingsAction().then((data) => {
      if (data) setSavedProviders(data)
      setLoaded(true)
    }).catch(() => {
      setLocalError('Failed to load provider settings')
      setLoaded(true)
    })
  }, [organizationId])

  const handleEdit = (provider: ProviderConfig) => {
    const existing = savedProviders[provider.name] ?? {}
    setEditingProvider(provider.name)
    setFormValues(existing)
    setLocalError(null)
    setTestResult(null)
    setSendTestResult(null)
  }

  const handleSave = async (providerName: ProviderName) => {
    setSaving(true)
    setLocalError(null)
    const result = await saveProviderAction(providerName, formValues)
    if (result?.error) {
      setLocalError(result.error)
      setSaving(false)
    } else {
      setEditingProvider(null)
      setSaving(false)
      router.refresh()
      getProviderSettingsAction().then((data) => {
        if (data) setSavedProviders(data)
      })
    }
  }

  const handleDisconnect = async (providerName: ProviderName) => {
    setLocalError(null)
    const result = await disconnectProviderAction(providerName)
    if (result?.error) {
      setLocalError(result.error)
    } else {
      setEditingProvider(null)
      setTestResult(null)
      setSendTestResult(null)
      router.refresh()
      getProviderSettingsAction().then((data) => {
        if (data) setSavedProviders(data)
      })
    }
  }

  const handleTestConnection = async (providerName: ProviderName) => {
    setTestingProvider(providerName)
    setLocalError(null)
    setTestResult(null)
    const result = await testProviderConnectionAction(providerName)
    setTestResult({ provider: providerName, success: !result?.error, error: result?.error ?? undefined })
    setTestingProvider(null)
  }

  const handleSendTest = async (providerName: ProviderName) => {
    if (!testPhone.trim()) return
    setSendingTest(true)
    setLocalError(null)
    setSendTestResult(null)
    const result = await sendTestMessageAction(providerName, testPhone.trim())
    setSendTestResult({ provider: providerName, success: !result?.error, error: result?.error ?? undefined })
    setSendingTest(false)
  }

  const handleActivate = async (providerName: ProviderName) => {
    setActivating(providerName)
    setLocalError(null)
    const result = await activateProviderAction(providerName)
    if (result?.error) {
      setLocalError(result.error)
    } else {
      router.refresh()
      getProviderSettingsAction().then((data) => {
        if (data) setSavedProviders(data)
      })
    }
    setActivating(null)
  }

  const handleCancel = () => {
    setEditingProvider(null)
    setFormValues({})
    setLocalError(null)
    setTestResult(null)
    setSendTestResult(null)
  }

  if (!organizationId) {
    return (
      <EmptyState
        title="No organization"
        description="Create an organization to configure WhatsApp providers."
      />
    )
  }

  if (!loaded) {
    return (
      <div className="space-y-4">
        {PROVIDER_DEFINITIONS.map((provider) => (
          <Card key={provider.name} padding="md">
            <div className="animate-pulse space-y-2">
              <div className="h-4 w-32 rounded bg-gray-200" />
              <div className="h-3 w-64 rounded bg-gray-100" />
            </div>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {localError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {localError}
        </div>
      )}

      <div className="rounded-lg border border-amber-100 bg-amber-50 p-4 text-sm text-amber-700">
        <p className="font-medium">Bring Your Own Provider</p>
        <p className="mt-1">
          MicroNest does not provide WhatsApp accounts. Connect your own Interakt or WATI credentials.
          Only one provider can be active at a time.
        </p>
      </div>

      {PROVIDER_DEFINITIONS.map((provider) => {
        const settings = savedProviders[provider.name]
        const isConfigured = !!settings && !!(settings.apiKey || settings.apiSecret)
        const isActive = settings?.activated === 'true'
        const isEditing = editingProvider === provider.name

        let connectionStatus: 'not_configured' | 'configured' | 'active' = 'not_configured'
        if (isActive) connectionStatus = 'active'
        else if (isConfigured) connectionStatus = 'configured'

        const statusBadgeVariant = connectionStatus === 'active' ? 'success' as const : connectionStatus === 'configured' ? 'warning' as const : 'default' as const
        const statusLabel = connectionStatus === 'active' ? 'Active' : connectionStatus === 'configured' ? 'Configured' : 'Not Configured'

        const showTestResult = testResult?.provider === provider.name
        const showSendResult = sendTestResult?.provider === provider.name

        return (
          <Card key={provider.name} padding="md">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base font-semibold text-gray-900">
                    {provider.label}
                  </h3>
                  <StatusBadge variant={statusBadgeVariant}>
                    {statusLabel}
                  </StatusBadge>
                </div>
                <p className="mt-1 text-sm text-gray-600">
                  {provider.description}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {isConfigured && !isEditing && (
                  <>
                    <Button variant="ghost" size="sm" onClick={() => handleDisconnect(provider.name)}>
                      Disconnect
                    </Button>
                    {!isActive && (
                      <Button size="sm" onClick={() => handleActivate(provider.name)} loading={activating === provider.name}>
                        Activate
                      </Button>
                    )}
                  </>
                )}
                <Button
                  variant={isEditing ? 'secondary' : 'primary'}
                  size="sm"
                  onClick={() => isEditing ? handleCancel() : handleEdit(provider)}
                >
                  {isEditing ? 'Cancel' : isConfigured ? 'Edit' : 'Configure'}
                </Button>
              </div>
            </div>

            {showTestResult && (
              <div className={`mt-3 rounded-lg border p-3 text-sm ${testResult!.success ? 'border-green-200 bg-green-50 text-green-700' : 'border-red-200 bg-red-50 text-red-700'}`}>
                {testResult!.success ? 'Connection successful — API credentials are valid.' : `Connection failed: ${testResult!.error}`}
              </div>
            )}

            {showSendResult && (
              <div className={`mt-3 rounded-lg border p-3 text-sm ${sendTestResult!.success ? 'border-green-200 bg-green-50 text-green-700' : 'border-red-200 bg-red-50 text-red-700'}`}>
                {sendTestResult!.success ? 'Test message sent successfully. Check your WhatsApp.' : `Test message failed: ${sendTestResult!.error}`}
              </div>
            )}

            {isConfigured && !isEditing && (
              <div className="mt-4 flex flex-wrap items-end gap-4 border-t border-gray-100 pt-4">
                <div>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleTestConnection(provider.name)}
                    loading={testingProvider === provider.name}
                  >
                    {testingProvider === provider.name ? 'Testing...' : 'Test Connection'}
                  </Button>
                </div>
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Send Test Message
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="tel"
                      value={testPhone}
                      onChange={(e) => setTestPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="block flex-1 rounded-md border border-gray-300 px-3 py-1.5 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                    <Button
                      size="sm"
                      onClick={() => handleSendTest(provider.name)}
                      loading={sendingTest}
                      disabled={!testPhone.trim()}
                    >
                      Send
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {isEditing && (
              <div className="mt-4 space-y-3 border-t border-gray-100 pt-4">
                {provider.fields.map((field) => (
                  <div key={field.key}>
                    <label className="block text-xs font-medium text-gray-700">
                      {field.label}
                      {field.required && <span className="text-red-500">*</span>}
                    </label>
                    {field.type === 'password' || field.type === 'url' || field.type === 'text' ? (
                      <input
                        type={field.type === 'password' ? 'password' : 'text'}
                        value={formValues[field.key] ?? ''}
                        onChange={(e) => setFormValues({ ...formValues, [field.key]: e.target.value })}
                        placeholder={field.placeholder}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    ) : null}
                  </div>
                ))}
                <div className="flex justify-end gap-2">
                  <Button variant="secondary" size="sm" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button size="sm" onClick={() => handleSave(provider.name)} loading={saving}>
                    Save Credentials
                  </Button>
                </div>
              </div>
            )}
          </Card>
        )
      })}
    </div>
  )
}
