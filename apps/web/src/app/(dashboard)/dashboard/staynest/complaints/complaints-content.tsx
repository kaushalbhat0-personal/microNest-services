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
import type { StayNestComplaint } from '@micronest/db'
import { createComplaint, updateComplaintStatus } from '@/lib/staynest/actions'

const priorityVariant: Record<string, 'info' | 'warning' | 'danger'> = {
  low: 'info',
  medium: 'warning',
  high: 'danger',
}

const statusVariant: Record<string, 'info' | 'warning' | 'success'> = {
  open: 'info',
  'in-progress': 'warning',
  resolved: 'success',
}

const priorityLabel: Record<string, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
}

const statusLabel: Record<string, string> = {
  open: 'Open',
  'in-progress': 'In Progress',
  resolved: 'Resolved',
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
  raised_by: '',
  room_number: '',
  priority: 'medium',
}

export function ComplaintsContent({
  initialComplaints,
  organizationId,
}: {
  initialComplaints: StayNestComplaint[]
  organizationId: string | null
}) {
  const router = useRouter()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleAddComplaint = useCallback(async () => {
    if (!form.title || !form.description || !form.raised_by) return
    setError(null)
    setLoading(true)

    const formData = new FormData()
    formData.set('title', form.title)
    formData.set('description', form.description)
    formData.set('raised_by', form.raised_by)
    formData.set('room_number', form.room_number)
    formData.set('priority', form.priority)

    const result = await createComplaint({ error: null, success: false }, formData)

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
    async (id: string, status: 'open' | 'in-progress' | 'resolved') => {
      const result = await updateComplaintStatus(id, status)
      if (result?.error) {
        setError(result.error)
      } else {
        router.refresh()
      }
    },
    [router]
  )

  function renderActions(complaint: StayNestComplaint) {
    if (complaint.status === 'resolved') return null

    return (
      <div className="flex gap-2">
        {complaint.status === 'open' && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleUpdateStatus(complaint.id, 'in-progress')}
          >
            In Progress
          </Button>
        )}
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleUpdateStatus(complaint.id, 'resolved')}
        >
          Resolve
        </Button>
      </div>
    )
  }

  const columns: Column<StayNestComplaint>[] = [
    { header: 'Title', accessor: (c) => c.title },
    { header: 'Room', accessor: (c) => c.room_number },
    { header: 'Raised By', accessor: (c) => c.raised_by },
    {
      header: 'Date',
      accessor: (c) => (
        <span className="text-xs text-gray-500">{formatDate(c.created_at)}</span>
      ),
    },
    {
      header: 'Priority',
      accessor: (c) => (
        <StatusBadge variant={priorityVariant[c.priority]}>
          {priorityLabel[c.priority]}
        </StatusBadge>
      ),
    },
    {
      header: 'Status',
      accessor: (c) => (
        <StatusBadge variant={statusVariant[c.status]}>
          {statusLabel[c.status]}
        </StatusBadge>
      ),
    },
    {
      header: '',
      accessor: (c) => renderActions(c),
    },
  ]

  return (
    <div>
      <PageHeader
        title="Complaint Tracker"
        description="Track and resolve tenant complaints."
        actions={
          <Button onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : 'Raise Complaint'}
          </Button>
        }
      />

      {showForm && (
        <Card className="mb-6 border-amber-200">
          <CardBody>
            <h3 className="mb-4 text-sm font-semibold text-gray-900">
              New Complaint
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
                  Raised By
                </label>
                <input
                  type="text"
                  required
                  value={form.raised_by}
                  onChange={(e) =>
                    setForm({ ...form, raised_by: e.target.value })
                  }
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Room Number
                </label>
                <input
                  type="text"
                  value={form.room_number}
                  onChange={(e) =>
                    setForm({ ...form, room_number: e.target.value })
                  }
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Priority
                </label>
                <select
                  value={form.priority}
                  onChange={(e) =>
                    setForm({ ...form, priority: e.target.value })
                  }
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
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
              <Button loading={loading} onClick={handleAddComplaint}>
                Raise Complaint
              </Button>
            </div>
          </CardBody>
        </Card>
      )}

      {initialComplaints.length === 0 ? (
        <EmptyState
          title="No complaints yet"
          description="Tenant complaints will appear here."
          action={{
            label: 'Raise Complaint',
            onClick: () => setShowForm(true),
          }}
        />
      ) : (
        <Table
          columns={columns}
          data={initialComplaints}
          keyExtractor={(c) => c.id}
        />
      )}
    </div>
  )
}
