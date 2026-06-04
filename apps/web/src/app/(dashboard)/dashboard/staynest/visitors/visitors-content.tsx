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
import type { StayNestVisitor } from '@micronest/db'
import { createVisitor, checkOutVisitor } from '@/lib/staynest/actions'

const statusVariant: Record<string, 'info' | 'success'> = {
  'checked-in': 'info',
  'checked-out': 'success',
}

const statusLabel: Record<string, string> = {
  'checked-in': 'Checked In',
  'checked-out': 'Checked Out',
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
  })
}

const emptyForm = { name: '', phone: '', purpose: '', room_number: '' }

export function VisitorsContent({
  initialVisitors,
  organizationId,
}: {
  initialVisitors: StayNestVisitor[]
  organizationId: string | null
}) {
  const router = useRouter()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleAddVisitor = useCallback(async () => {
    if (!form.name || !form.phone || !form.purpose) return
    setError(null)
    setLoading(true)

    const formData = new FormData()
    formData.set('name', form.name)
    formData.set('phone', form.phone)
    formData.set('purpose', form.purpose)
    formData.set('room_number', form.room_number)

    const result = await createVisitor({ error: null, success: false }, formData)

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

  const handleCheckOut = useCallback(
    async (id: string) => {
      const result = await checkOutVisitor(id)
      if (result?.error) {
        setError(result.error)
      } else {
        router.refresh()
      }
    },
    [router]
  )

  const columns: Column<StayNestVisitor>[] = [
    { header: 'Name', accessor: (v) => v.name },
    { header: 'Phone', accessor: (v) => v.phone },
    { header: 'Room', accessor: (v) => v.room_number },
    { header: 'Purpose', accessor: (v) => v.purpose },
    {
      header: 'Check In',
      accessor: (v) => (
        <span className="text-xs text-gray-500">
          {formatDate(v.check_in_at)} {formatTime(v.check_in_at)}
        </span>
      ),
    },
    {
      header: 'Status',
      accessor: (v) => (
        <StatusBadge variant={statusVariant[v.status]}>
          {statusLabel[v.status]}
        </StatusBadge>
      ),
    },
    {
      header: '',
      accessor: (v) =>
        v.status === 'checked-in' ? (
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleCheckOut(v.id)}
          >
            Check Out
          </Button>
        ) : (
          <span className="text-xs text-gray-400">
            {v.check_out_at
              ? `${formatDate(v.check_out_at)} ${formatTime(v.check_out_at)}`
              : ''}
          </span>
        ),
    },
  ]

  return (
    <div>
      <PageHeader
        title="Visitor Log"
        description="Track everyone who visits your property."
        actions={
          <Button onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : 'Log Visitor'}
          </Button>
        }
      />

      {showForm && (
        <Card className="mb-6 border-amber-200">
          <CardBody>
            <h3 className="mb-4 text-sm font-semibold text-gray-900">
              New Visitor
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Phone
                </label>
                <input
                  type="text"
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Purpose
                </label>
                <input
                  type="text"
                  required
                  value={form.purpose}
                  onChange={(e) =>
                    setForm({ ...form, purpose: e.target.value })
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
              <Button loading={loading} onClick={handleAddVisitor}>
                Log Visitor
              </Button>
            </div>
          </CardBody>
        </Card>
      )}

      {initialVisitors.length === 0 ? (
        <EmptyState
          title="No visitors yet"
          description="Log your first visitor to get started."
          action={{ label: 'Log Visitor', onClick: () => setShowForm(true) }}
        />
      ) : (
        <Table
          columns={columns}
          data={initialVisitors}
          keyExtractor={(v) => v.id}
        />
      )}
    </div>
  )
}
