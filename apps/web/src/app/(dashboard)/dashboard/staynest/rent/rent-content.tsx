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
import type { StayNestRentRecord, StayNestResident, StayNestRoom } from '@micronest/db'
import { createRentRecord, markRentPaid } from '@/lib/staynest/actions'

type Tab = 'all' | 'pending' | 'paid' | 'overdue'

const tabs: { key: Tab; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'paid', label: 'Paid' },
  { key: 'overdue', label: 'Overdue' },
]

const statusVariant: Record<string, 'info' | 'success' | 'warning'> = {
  pending: 'info',
  paid: 'success',
  overdue: 'warning',
}

const statusLabel: Record<string, string> = {
  pending: 'Pending',
  paid: 'Paid',
  overdue: 'Overdue',
}

const paymentMethodLabel: Record<string, string> = {
  cash: 'Cash',
  upi: 'UPI',
  bank_transfer: 'Bank Transfer',
  other: 'Other',
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

const emptyForm = {
  resident_id: '',
  room_id: '',
  billing_month: new Date().getMonth() + 1,
  billing_year: new Date().getFullYear(),
  amount: 0,
  due_date: '',
  notes: '',
}

export function RentContent({
  initialRecords,
  residents,
  rooms,
  organizationId,
  totalDue,
  collected,
  overdue,
  pendingCount,
}: {
  initialRecords: StayNestRentRecord[]
  residents: StayNestResident[]
  rooms: StayNestRoom[]
  organizationId: string | null
  totalDue: number
  collected: number
  overdue: number
  pendingCount: number
}) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<Tab>('all')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const resetForm = useCallback(() => {
    setForm(emptyForm)
    setError(null)
  }, [])

  const residentMap = new Map(residents.map((r) => [r.id, r]))
  const roomMap = new Map(rooms.map((r) => [r.id, r]))

  const filteredRecords =
    activeTab === 'all'
      ? initialRecords
      : initialRecords.filter((r) => r.status === activeTab)

  const handleCreate = useCallback(async () => {
    if (!form.resident_id || !form.due_date || !form.amount) {
      setError('Resident, amount, and due date are required.')
      return
    }
    setError(null)
    setLoading(true)

    const formData = new FormData()
    formData.set('resident_id', form.resident_id)
    formData.set('room_id', form.room_id)
    formData.set('billing_month', String(form.billing_month))
    formData.set('billing_year', String(form.billing_year))
    formData.set('amount', String(form.amount))
    formData.set('due_date', form.due_date)
    formData.set('notes', form.notes)

    const result = await createRentRecord({ error: null, success: false }, formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    } else {
      resetForm()
      setShowForm(false)
      setLoading(false)
      router.refresh()
    }
  }, [form, resetForm, router])

  const handleMarkPaid = useCallback(
    async (id: string) => {
      const method = prompt('Payment method (cash / upi / bank_transfer / other):')
      if (!method) return
      if (!['cash', 'upi', 'bank_transfer', 'other'].includes(method)) {
        setError('Invalid payment method.')
        return
      }
      const result = await markRentPaid(id, method as 'cash' | 'upi' | 'bank_transfer' | 'other')
      if (result?.error) {
        setError(result.error)
      } else {
        router.refresh()
      }
    },
    [router]
  )

  const columns: Column<StayNestRentRecord>[] = [
    {
      header: 'Resident',
      accessor: (r) => {
        const resident = residentMap.get(r.resident_id)
        return (
          <span className="text-sm text-gray-900">
            {resident?.full_name ?? 'Unknown'}
          </span>
        )
      },
    },
    {
      header: 'Room',
      accessor: (r) => {
        if (!r.room_id) return <span className="text-sm text-gray-400">—</span>
        const room = roomMap.get(r.room_id)
        return (
          <span className="font-mono text-sm">
            {room?.room_number ?? '—'}
          </span>
        )
      },
    },
    {
      header: 'Amount',
      accessor: (r) => (
        <span className="text-sm tabular-nums">{formatCurrency(r.amount)}</span>
      ),
    },
    {
      header: 'Due Date',
      accessor: (r) => (
        <span className="text-xs text-gray-500">{formatDate(r.due_date)}</span>
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
      accessor: (r) => (
        <div className="flex gap-2">
          {r.status === 'pending' || r.status === 'overdue' ? (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleMarkPaid(r.id)}
            >
              Mark Paid
            </Button>
          ) : (
            <span className="text-xs text-gray-400">
              {r.paid_at ? formatDate(r.paid_at) : ''}
            </span>
          )}
        </div>
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        title="Rent Management"
        description="Track rent payments and due amounts."
        actions={
          <Button onClick={() => { setShowForm(!showForm); if (showForm) resetForm() }}>
            {showForm ? 'Cancel' : 'Create Rent Record'}
          </Button>
        }
      />

      {/* Tabs */}
      <div className="mb-6 flex gap-1 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? 'border-b-2 border-amber-600 text-amber-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Metrics */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardBody>
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
              Total Due
            </p>
            <p className="mt-1 text-2xl font-bold text-gray-900">
              {formatCurrency(totalDue)}
            </p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
              Collected
            </p>
            <p className="mt-1 text-2xl font-bold text-green-600">
              {formatCurrency(collected)}
            </p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
              Overdue
            </p>
            <p className="mt-1 text-2xl font-bold text-red-600">
              {formatCurrency(overdue)}
            </p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
              Pending
            </p>
            <p className="mt-1 text-2xl font-bold text-amber-600">
              {pendingCount}
            </p>
            <p className="mt-1 text-xs text-gray-500">Records</p>
          </CardBody>
        </Card>
      </div>

      {/* Create form */}
      {showForm && (
        <Card className="mb-6 border-amber-200">
          <CardBody>
            <h3 className="mb-4 text-sm font-semibold text-gray-900">
              New Rent Record
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Resident *
                </label>
                <select
                  value={form.resident_id}
                  onChange={(e) => setForm({ ...form, resident_id: e.target.value })}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                >
                  <option value="">Select resident</option>
                  {residents.filter((r) => r.status === 'active').map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.full_name} — {r.room_number}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Room
                </label>
                <select
                  value={form.room_id}
                  onChange={(e) => setForm({ ...form, room_id: e.target.value })}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                >
                  <option value="">No room</option>
                  {rooms.filter((r) => r.status === 'active').map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.room_number} ({r.room_type ?? '—'})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Amount (₹) *
                </label>
                <input
                  type="number"
                  min={0}
                  required
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: parseInt(e.target.value) || 0 })}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Due Date *
                </label>
                <input
                  type="date"
                  required
                  value={form.due_date}
                  onChange={(e) => setForm({ ...form, due_date: e.target.value })}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Billing Month
                </label>
                <select
                  value={form.billing_month}
                  onChange={(e) => setForm({ ...form, billing_month: parseInt(e.target.value) })}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                >
                  {monthNames.map((name, i) => (
                    <option key={i + 1} value={i + 1}>{name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Billing Year
                </label>
                <input
                  type="number"
                  min={2020}
                  max={2100}
                  value={form.billing_year}
                  onChange={(e) => setForm({ ...form, billing_year: parseInt(e.target.value) || new Date().getFullYear() })}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Notes
                </label>
                <textarea
                  rows={2}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>

            {error && (
              <p className="mt-3 text-sm text-red-600">{error}</p>
            )}

            <div className="mt-4 flex justify-end gap-3">
              <Button variant="ghost" onClick={() => { setShowForm(false); resetForm() }}>
                Cancel
              </Button>
              <Button loading={loading} onClick={handleCreate}>
                Create Rent Record
              </Button>
            </div>
          </CardBody>
        </Card>
      )}

      {filteredRecords.length === 0 ? (
        <EmptyState
          title={
            activeTab === 'all'
              ? 'No rent records yet'
              : `No ${activeTab} records`
          }
          description={
            activeTab === 'all'
              ? 'Create your first rent record to get started.'
              : 'No records match this filter.'
          }
          action={
            activeTab === 'all'
              ? { label: 'Create Rent Record', onClick: () => setShowForm(true) }
              : undefined
          }
        />
      ) : (
        <Table
          columns={columns}
          data={filteredRecords}
          keyExtractor={(r) => r.id}
        />
      )}
    </div>
  )
}
