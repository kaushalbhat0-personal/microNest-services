'use client'

import { useState } from 'react'
import {
  PageHeader,
  Table,
  StatusBadge,
  Button,
} from '@micronest/ui'
import type { Column } from '@micronest/ui'
import type { RentEntry, RentStatus } from '@/lib/staynest/data'
import { RENT_PLACEHOLDERS } from '@/lib/staynest/data'

const statusVariant: Record<RentStatus, 'success' | 'warning' | 'danger'> = {
  paid: 'success',
  pending: 'warning',
  overdue: 'danger',
}

const statusLabel: Record<RentStatus, string> = {
  paid: 'Paid',
  pending: 'Pending',
  overdue: 'Overdue',
}

const filters = [
  { value: 'all' as const, label: 'All' },
  { value: 'pending' as const, label: 'Pending' },
  { value: 'overdue' as const, label: 'Overdue' },
  { value: 'paid' as const, label: 'Paid' },
]

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
  })
}

export default function RentReminderPage() {
  const [rents, setRents] = useState<RentEntry[]>(RENT_PLACEHOLDERS)
  const [filter, setFilter] = useState<string>('all')

  const filtered =
    filter === 'all' ? rents : rents.filter((r) => r.status === filter)

  function handleMarkPaid(id: string) {
    setRents(
      rents.map((r) =>
        r.id === id
          ? {
              ...r,
              status: 'paid' as const,
              paidDate: new Date().toISOString().slice(0, 10),
            }
          : r
      )
    )
  }

  const columns: Column<RentEntry>[] = [
    { header: 'Tenant', accessor: (r) => r.tenantName },
    { header: 'Room', accessor: (r) => r.roomNumber, hideOnMobile: true },
    {
      header: 'Amount',
      accessor: (r) => (
        <span className="font-medium">
          ₹{r.amount.toLocaleString()}
        </span>
      ),
    },
    {
      header: 'Due Date',
      hideOnMobile: true,
      accessor: (r) => (
        <span className="text-xs text-gray-500">
          {formatDate(r.dueDate)}
        </span>
      ),
    },
    {
      header: 'Month',
      hideOnMobile: true,
      accessor: (r) => (
        <span className="text-xs text-gray-500">{r.month}</span>
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
      accessor: (r) =>
        r.status !== 'paid' ? (
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleMarkPaid(r.id)}
          >
            Mark Paid
          </Button>
        ) : (
          <span className="text-xs text-gray-400">
            {r.paidDate ? formatDate(r.paidDate) : ''}
          </span>
        ),
    },
  ]

  const totalPending = rents
    .filter((r) => r.status !== 'paid')
    .reduce((sum, r) => sum + r.amount, 0)

  return (
    <div>
      <PageHeader
        title="Rent Reminder"
        description="Track rent payments and send reminders."
      />

      {/* Summary bar */}
      <div className="mb-6 flex flex-wrap gap-4">
        <div className="rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm">
          <p className="text-xs font-medium text-gray-500">Total Rent</p>
          <p className="text-lg font-bold text-gray-900">
            ₹{rents.reduce((s, r) => s + r.amount, 0).toLocaleString()}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm">
          <p className="text-xs font-medium text-gray-500">Collected</p>
          <p className="text-lg font-bold text-green-600">
            ₹
            {rents
              .filter((r) => r.status === 'paid')
              .reduce((s, r) => s + r.amount, 0)
              .toLocaleString()}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm">
          <p className="text-xs font-medium text-gray-500">Pending</p>
          <p className="text-lg font-bold text-amber-600">
            ₹{totalPending.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="mb-4 flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`min-h-[44px] rounded-lg px-4 text-sm font-medium transition-colors ${
              filter === f.value
                ? 'bg-amber-100 text-amber-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 px-6 py-12 text-center">
          <h3 className="text-sm font-semibold text-gray-900">
            No rent entries found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {filter === 'paid'
              ? 'No paid entries yet.'
              : filter === 'pending'
                ? 'No pending payments.'
                : filter === 'overdue'
                  ? 'No overdue payments.'
                  : 'Add tenants to start tracking rent.'}
          </p>
        </div>
      ) : (
        <Table
          columns={columns}
          data={filtered}
          keyExtractor={(r) => r.id}
          renderCard={(r) => (
            <div>
              <div className="flex items-center justify-between">
                <p className="font-medium text-gray-900">{r.tenantName}</p>
                <StatusBadge variant={statusVariant[r.status]}>
                  {statusLabel[r.status]}
                </StatusBadge>
              </div>
              <div className="mt-2 space-y-1 text-sm text-gray-500">
                <p className="font-medium text-gray-700">₹{r.amount.toLocaleString()}</p>
                <p>Room {r.roomNumber} &middot; Due {formatDate(r.dueDate)}</p>
                <p>{r.month}</p>
              </div>
              {r.status !== 'paid' && (
                <div className="mt-3">
                  <button
                    onClick={() => handleMarkPaid(r.id)}
                    className="min-h-[44px] w-full rounded-md bg-green-50 px-4 text-sm font-medium text-green-700 hover:bg-green-100"
                  >
                    Mark Paid
                  </button>
                </div>
              )}
              {r.status === 'paid' && r.paidDate && (
                <p className="mt-2 text-xs text-gray-400">Paid {formatDate(r.paidDate)}</p>
              )}
            </div>
          )}
        />
      )}
    </div>
  )
}
