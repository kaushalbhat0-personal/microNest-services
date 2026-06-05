'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  PageHeader,
  Table,
  EmptyState,
  StatusBadge,
  Button,
  Card,
  CardBody,
} from '@micronest/ui'
import type { Column } from '@micronest/ui'
import type { StayNestMaintenanceRequest } from '@micronest/db'
import { createMaintenanceRequest, updateMaintenanceStatus, assignMaintenanceRequest } from '@/lib/staynest/actions'

const priorityVariant: Record<string, 'info' | 'warning' | 'danger'> = {
  low: 'info',
  medium: 'warning',
  high: 'danger',
  urgent: 'danger',
}

const statusVariant: Record<string, 'info' | 'warning' | 'success' | 'default'> = {
  open: 'info',
  assigned: 'warning',
  in_progress: 'warning',
  resolved: 'success',
  closed: 'default',
}

const priorityLabel: Record<string, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent',
}

const statusLabel: Record<string, string> = {
  open: 'Open',
  assigned: 'Assigned',
  in_progress: 'In Progress',
  resolved: 'Resolved',
  closed: 'Closed',
}

const categoryLabel: Record<string, string> = {
  electrical: 'Electrical',
  plumbing: 'Plumbing',
  furniture: 'Furniture',
  internet: 'Internet',
  cleaning: 'Cleaning',
  other: 'Other',
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
  })
}

const emptyForm = {
  title: '',
  description: '',
  category: 'other' as const,
  priority: 'medium' as const,
}

export function ComplaintsContent({
  initialComplaints,
  organizationId,
}: {
  initialComplaints: StayNestMaintenanceRequest[]
  organizationId: string | null
}) {
  const router = useRouter()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleAddRequest = useCallback(async () => {
    if (!form.title || !form.description) return
    setError(null)
    setLoading(true)

    const formData = new FormData()
    formData.set('title', form.title)
    formData.set('description', form.description)
    formData.set('category', form.category)
    formData.set('priority', form.priority)

    const result = await createMaintenanceRequest({ error: null, success: false }, formData)

    if (result?.error) {
      setError(result.error)
      setLoading(false)
    } else {
      setForm(emptyForm)
      setShowForm(false)
      setLoading(false)
      router.refresh()
    }
  }, [form, router])

  const handleUpdateStatus = useCallback(
    async (id: string, status: 'open' | 'assigned' | 'in_progress' | 'resolved' | 'closed') => {
      const result = await updateMaintenanceStatus(id, status)
      if (result?.error) {
        setError(result.error)
      } else {
        router.refresh()
      }
    },
    [router]
  )

  function renderActions(req: StayNestMaintenanceRequest) {
    if (req.status === 'resolved' || req.status === 'closed') return null

    return (
      <div className="flex gap-2">
        {req.status === 'open' && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleUpdateStatus(req.id, 'assigned')}
          >
            Assign
          </Button>
        )}
        {req.status === 'assigned' && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleUpdateStatus(req.id, 'in_progress')}
          >
            Start
          </Button>
        )}
        {(req.status === 'assigned' || req.status === 'in_progress') && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleUpdateStatus(req.id, 'resolved')}
          >
            Resolve
          </Button>
        )}
      </div>
    )
  }

  const columns: Column<StayNestMaintenanceRequest>[] = [
    { header: 'Title', accessor: (r) => r.title },
    { header: 'Category', accessor: (r) => categoryLabel[r.category] ?? r.category, hideOnMobile: true },
    {
      header: 'Date',
      hideOnMobile: true,
      accessor: (r) => (
        <span className="text-xs text-gray-500">{formatDate(r.created_at)}</span>
      ),
    },
    {
      header: 'Priority',
      accessor: (r) => (
        <StatusBadge variant={priorityVariant[r.priority]}>
          {priorityLabel[r.priority]}
        </StatusBadge>
      ),
    },
    {
      header: 'Status',
      accessor: (r) => (
        <StatusBadge variant={statusVariant[r.status]}>
          {statusLabel[r.status]}
        </StatusBadge>
      ),
    },
    {
      header: '',
      accessor: (r) => renderActions(r),
    },
  ]

  return (
    <div>
      <PageHeader
        title="Maintenance Requests"
        description="Track and resolve maintenance issues."
        actions={
          <Button onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : 'New Request'}
          </Button>
        }
      />

      {showForm && (
        <Card className="mb-6 border-amber-200">
          <CardBody>
            <h3 className="mb-4 text-sm font-semibold text-gray-900">
              New Maintenance Request
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  rows={3}
                  required
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Category
                </label>
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value as any })
                  }
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                >
                  <option value="electrical">Electrical</option>
                  <option value="plumbing">Plumbing</option>
                  <option value="furniture">Furniture</option>
                  <option value="internet">Internet</option>
                  <option value="cleaning">Cleaning</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Priority
                </label>
                <select
                  value={form.priority}
                  onChange={(e) =>
                    setForm({ ...form, priority: e.target.value as any })
                  }
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>

            {error && (
              <p className="mt-3 text-sm text-red-600">{error}</p>
            )}

            <div className="mt-4 flex justify-end gap-3">
              <Button
                variant="ghost"
                onClick={() => {
                  setShowForm(false)
                  setForm(emptyForm)
                  setError(null)
                }}
              >
                Cancel
              </Button>
              <Button loading={loading} onClick={handleAddRequest}>
                Create Request
              </Button>
            </div>
          </CardBody>
        </Card>
      )}

      {initialComplaints.length === 0 ? (
        <EmptyState
          title="No maintenance requests"
          description="New requests will appear here."
          action={{
            label: 'New Request',
            onClick: () => setShowForm(true),
          }}
        />
      ) : (
        <Table
          columns={columns}
          data={initialComplaints}
          keyExtractor={(r) => r.id}
          renderCard={(r) => (
            <div>
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{r.title}</p>
                  <p className="mt-0.5 text-sm text-gray-500">
                    {categoryLabel[r.category] ?? r.category}
                  </p>
                </div>
                <StatusBadge variant={priorityVariant[r.priority]}>
                  {priorityLabel[r.priority]}
                </StatusBadge>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <StatusBadge variant={statusVariant[r.status]}>
                  {statusLabel[r.status]}
                </StatusBadge>
                <span className="text-xs text-gray-400">{formatDate(r.created_at)}</span>
              </div>
              {(r.status === 'open' || r.status === 'assigned' || r.status === 'in_progress') && (
                <div className="mt-3 flex gap-2">
                  {r.status === 'open' && (
                    <button
                      onClick={() => handleUpdateStatus(r.id, 'assigned')}
                      className="min-h-[44px] rounded-md bg-amber-50 px-4 text-sm font-medium text-amber-700 hover:bg-amber-100"
                    >
                      Assign
                    </button>
                  )}
                  {r.status === 'assigned' && (
                    <button
                      onClick={() => handleUpdateStatus(r.id, 'in_progress')}
                      className="min-h-[44px] rounded-md bg-blue-50 px-4 text-sm font-medium text-blue-700 hover:bg-blue-100"
                    >
                      Start
                    </button>
                  )}
                  {(r.status === 'assigned' || r.status === 'in_progress') && (
                    <button
                      onClick={() => handleUpdateStatus(r.id, 'resolved')}
                      className="min-h-[44px] rounded-md bg-green-50 px-4 text-sm font-medium text-green-700 hover:bg-green-100"
                    >
                      Resolve
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        />
      )}
    </div>
  )
}
