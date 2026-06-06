'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  PageHeader,
  Card,
  CardBody,
  CardHeader,
  Button,
  StatusBadge,
  CountUp,
} from '@micronest/ui'
import type { NotificationEngineStats } from '@micronest/db'
import {
  executeRuleAction,
  executeAllRulesAction,
} from '@/lib/staynest/actions'

const EVENT_LABELS: Record<string, string> = {
  rent_due: 'Rent Due Reminder',
  rent_overdue: 'Rent Overdue Reminder',
  announcement_created: 'Announcement Broadcast',
  maintenance_resolved: 'Maintenance Resolved',
}

const TRIGGER_EVENTS = ['rent_due', 'rent_overdue', 'maintenance_resolved', 'announcement_created'] as const

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function ExecutionContent({
  stats,
  organizationId,
}: {
  stats: NotificationEngineStats | null
  organizationId: string | null
}) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)
  const [result, setResult] = useState<string | null>(null)
  const [resultType, setResultType] = useState<'success' | 'error'>('success')

  const currentStats = stats ?? {
    total_sent: 0,
    total_pending: 0,
    total_failed: 0,
    total_logs: 0,
    success_rate: 0,
    by_event: {},
    last_execution: null,
  }

  const handleExecuteRule = useCallback(async (triggerEvent: string) => {
    setLoading(triggerEvent)
    setResult(null)

    const res = await executeRuleAction(triggerEvent)

    if (res.error) {
      setResultType('error')
      setResult(res.error)
    } else {
      setResultType('success')
      setResult(`Rule executed. ${res.notifications_created} notification(s) created.`)
    }
    setLoading(null)
    router.refresh()
  }, [router])

  const handleExecuteAll = useCallback(async () => {
    setLoading('all')
    setResult(null)

    const res = await executeAllRulesAction()

    if (res.error) {
      setResultType('error')
      setResult(res.error)
    } else {
      setResultType('success')
      setResult(`All rules executed. ${res.rules_executed} rules, ${res.notifications_created} notification(s) created.`)
    }
    setLoading(null)
    router.refresh()
  }, [router])

  return (
    <div>
      <PageHeader
        title="Notification Execution"
        description="Manually trigger notification rules and monitor execution"
        actions={
          organizationId ? (
            <Button
              onClick={handleExecuteAll}
              loading={loading === 'all'}
              disabled={!organizationId}
            >
              Execute All Rules
            </Button>
          ) : undefined
        }
      />

      {result && (
        <div
          className={`mb-4 rounded-lg border p-3 text-sm ${
            resultType === 'success'
              ? 'border-green-200 bg-green-50 text-green-700'
              : 'border-red-200 bg-red-50 text-red-700'
          }`}
        >
          {result}
        </div>
      )}

      {!organizationId ? (
        <Card>
          <CardBody>
            <p className="text-sm text-gray-500">Sign in to access the Notification Execution Dashboard.</p>
          </CardBody>
        </Card>
      ) : (
        <>
          <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card padding="md">
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Sent (7d)</p>
              <p className="mt-1 text-2xl font-bold text-green-700">
                <CountUp end={currentStats.total_sent} />
              </p>
            </Card>
            <Card padding="md">
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Pending</p>
              <p className="mt-1 text-2xl font-bold text-amber-600">
                <CountUp end={currentStats.total_pending} />
              </p>
            </Card>
            <Card padding="md">
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Failed</p>
              <p className="mt-1 text-2xl font-bold text-red-600">
                <CountUp end={currentStats.total_failed} />
              </p>
            </Card>
            <Card padding="md">
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Success Rate</p>
              <p className={`mt-1 text-2xl font-bold ${currentStats.success_rate >= 80 ? 'text-green-700' : currentStats.success_rate >= 50 ? 'text-amber-600' : 'text-red-600'}`}>
                {currentStats.success_rate}%
              </p>
            </Card>
          </div>

          {currentStats.last_execution && (
            <p className="mb-4 text-xs text-gray-400">
              Last activity: {formatDate(currentStats.last_execution)}
            </p>
          )}

          <h3 className="mb-3 text-sm font-semibold text-gray-900">Manual Triggers</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {TRIGGER_EVENTS.map((event) => {
              const eventStats = currentStats.by_event[event] ?? { sent: 0, pending: 0, failed: 0 }
              return (
                <Card key={event} padding="md">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900">
                        {EVENT_LABELS[event] ?? event}
                      </h4>
                      <div className="mt-1 flex flex-wrap gap-2 text-xs text-gray-500">
                        <span className="text-green-600">{eventStats.sent} sent</span>
                        <span className="text-amber-600">{eventStats.pending} pending</span>
                        <span className="text-red-600">{eventStats.failed} failed</span>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleExecuteRule(event)}
                      loading={loading === event}
                    >
                      Run
                    </Button>
                  </div>
                </Card>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
