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
import { createRentRecord, markRentPaid, generateRent, recordPaymentAction } from '@/lib/staynest/actions'

type Tab = 'all' | 'pending' | 'paid' | 'overdue'

const tabs: { key: Tab; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'paid', label: 'Paid' },
  { key: 'overdue', label: 'Overdue' },
]

const statusVariant: Record<string, 'info' | 'success' | 'warning' | 'default'> = {
  pending: 'info',
  paid: 'success',
  partially_paid: 'warning',
  overdue: 'warning',
}

const statusLabel: Record<string, string> = {
  pending: 'Pending',
  paid: 'Paid',
  partially_paid: 'Partial',
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

export function RentContent({
  initialRecords,
  residents,
  rooms,
  organizationId,
  stats,
}: {
  initialRecords: StayNestRentRecord[]
  residents: StayNestResident[]
  rooms: StayNestRoom[]
  organizationId: string | null
  stats: { monthlyRevenue: number; pendingRevenue: number; overdueRevenue: number; collectionRate: number; totalCollected: number; totalDue: number }
}) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<Tab>('all')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    resident_id: '',
    room_id: '',
    billing_month: new Date().getMonth() + 1,
    billing_year: new Date().getFullYear(),
    rent_amount: 0,
    due_date: '',
    notes: '',
  })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // Generate rent state
  const [showGenerate, setShowGenerate] = useState(false)
  const [genMonth, setGenMonth] = useState(new Date().getMonth() + 1)
  const [genYear, setGenYear] = useState(new Date().getFullYear())
  const [genLoading, setGenLoading] = useState(false)

  // Payment modal state
  const [payModal, setPayModal] = useState<{
    record: StayNestRentRecord
    resident: string
  } | null>(null)
  const [payAmount, setPayAmount] = useState(0)
  const [payMethod, setPayMethod] = useState<'cash' | 'upi' | 'bank_transfer' | 'other'>('cash')
  const [payLoading, setPayLoading] = useState(false)
  const [payReceipt, setPayReceipt] = useState<any>(null)

  const resetForm = useCallback(() => {
    setForm({
      resident_id: '',
      room_id: '',
      billing_month: new Date().getMonth() + 1,
      billing_year: new Date().getFullYear(),
      rent_amount: 0,
      due_date: '',
      notes: '',
    })
    setError(null)
  }, [])

  const residentMap = new Map(residents.map((r) => [r.id, r]))
  const roomMap = new Map(rooms.map((r) => [r.id, r]))

  const filteredRecords =
    activeTab === 'all'
      ? initialRecords
      : initialRecords.filter((r) => r.status === activeTab)

  const handleCreate = useCallback(async () => {
    if (!form.resident_id || !form.due_date || !form.rent_amount) {
      setError('Resident, amount, and due date are required.')
      return
    }
    setError(null)
    setLoading(true)

    const fd = new FormData()
    fd.set('resident_id', form.resident_id)
    fd.set('room_id', form.room_id)
    fd.set('billing_month', String(form.billing_month))
    fd.set('billing_year', String(form.billing_year))
    fd.set('amount', String(form.rent_amount))
    fd.set('due_date', form.due_date)
    fd.set('notes', form.notes)

    const result = await createRentRecord({ error: null, success: false }, fd)
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

  const handleGenerate = useCallback(async () => {
    setError(null)
    setGenLoading(true)

    const fd = new FormData()
    fd.set('month', String(genMonth))
    fd.set('year', String(genYear))

    const result = await generateRent({ error: null, success: false }, fd)
    if (result?.error) {
      setError(result.error)
      setGenLoading(false)
    } else {
      setShowGenerate(false)
      setGenLoading(false)
      router.refresh()
    }
  }, [genMonth, genYear, router])

  const handleOpenPayment = useCallback((record: StayNestRentRecord) => {
    const resident = residentMap.get(record.resident_id)
    setPayModal({
      record,
      resident: resident?.full_name ?? 'Unknown',
    })
    setPayAmount(record.amount - record.paid_amount)
    setPayMethod('cash')
    setPayReceipt(null)
    setError(null)
  }, [residentMap])

  const handleRecordPayment = useCallback(async () => {
    if (!payModal || payAmount <= 0) {
      setError('Invalid payment amount.')
      return
    }
    setError(null)
    setPayLoading(true)

    const fd = new FormData()
    fd.set('rent_record_id', payModal.record.id)
    fd.set('amount', String(payAmount))
    fd.set('payment_method', payMethod)
    fd.set('payment_date', new Date().toISOString())

    const result = await recordPaymentAction({ error: null, success: false }, fd)
    if (result?.error) {
      setError(result.error)
      setPayLoading(false)
    } else {
      setPayReceipt(result.receipt)
      setPayLoading(false)
      setTimeout(() => {
        setPayModal(null)
        setPayReceipt(null)
        router.refresh()
      }, 2000)
    }
  }, [payModal, payAmount, payMethod, router])

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
      header: 'Amount',
      accessor: (r) => (
        <div className="text-sm">
          <span className="tabular-nums">{formatCurrency(r.rent_amount)}</span>
          {r.late_fee > 0 && (
            <span className="ml-1 text-xs text-red-500">+{formatCurrency(r.late_fee)}</span>
          )}
        </div>
      ),
    },
    {
      header: 'Due',
      hideOnMobile: true,
      accessor: (r) => (
        <span className="text-xs text-gray-500">{formatDate(r.due_date)}</span>
      ),
    },
    {
      header: 'Paid',
      accessor: (r) => (
        <span className="text-sm tabular-nums">
          {r.paid_amount > 0 ? formatCurrency(r.paid_amount) : '—'}
        </span>
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
          {(r.status === 'pending' || r.status === 'overdue' || r.status === 'partially_paid') && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleOpenPayment(r)}
            >
              Pay
            </Button>
          )}
          {r.status === 'paid' && r.receipt_number && (
            <span className="text-xs text-gray-400">#{r.receipt_number}</span>
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
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowGenerate(!showGenerate)}>
              {showGenerate ? 'Cancel' : 'Generate Rent'}
            </Button>
            <Button onClick={() => { setShowForm(!showForm); if (showForm) resetForm() }}>
              {showForm ? 'Cancel' : 'Create Record'}
            </Button>
          </div>
        }
      />

      {/* Generate Rent Panel */}
      {showGenerate && (
        <Card className="mb-6 border-blue-200">
          <CardBody>
            <h3 className="mb-4 text-sm font-semibold text-gray-900">
              Generate Rent for Month
            </h3>
            <p className="mb-4 text-xs text-gray-500">
              Creates rent records for all active residents. Skips residents who already have a record for this month.
            </p>
            <div className="flex items-end gap-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700">Month</label>
                <select
                  value={genMonth}
                  onChange={(e) => setGenMonth(parseInt(e.target.value))}
                  className="block rounded-md border border-gray-300 px-3 py-2 text-sm"
                >
                  {monthNames.map((name, i) => (
                    <option key={i + 1} value={i + 1}>{name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700">Year</label>
                <input
                  type="number"
                  value={genYear}
                  onChange={(e) => setGenYear(parseInt(e.target.value))}
                  className="block w-24 rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
              <Button loading={genLoading} onClick={handleGenerate}>
                Generate
              </Button>
            </div>
            {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
          </CardBody>
        </Card>
      )}

      {/* Tabs */}
      <div className="mb-6 flex gap-1 overflow-x-auto border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`min-h-[44px] whitespace-nowrap px-4 text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? 'border-b-2 border-amber-600 text-amber-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Revenue KPIs */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardBody>
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Monthly Revenue</p>
            <p className="mt-1 text-2xl font-bold text-green-600">{formatCurrency(stats.monthlyRevenue)}</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Pending Revenue</p>
            <p className="mt-1 text-2xl font-bold text-amber-600">{formatCurrency(stats.pendingRevenue)}</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Overdue Revenue</p>
            <p className="mt-1 text-2xl font-bold text-red-600">{formatCurrency(stats.overdueRevenue)}</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Collection Rate</p>
            <p className="mt-1 text-2xl font-bold text-blue-600">{stats.collectionRate}%</p>
          </CardBody>
        </Card>
      </div>

      {/* Create form */}
      {showForm && (
        <Card className="mb-6 border-amber-200">
          <CardBody>
            <h3 className="mb-4 text-sm font-semibold text-gray-900">New Rent Record</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Resident *</label>
                <select
                  value={form.resident_id}
                  onChange={(e) => setForm({ ...form, resident_id: e.target.value })}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                >
                  <option value="">Select resident</option>
                  {residents.filter((r) => r.status === 'active' || r.status === 'notice_period').map((r) => (
                    <option key={r.id} value={r.id}>{r.full_name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Room</label>
                <select
                  value={form.room_id}
                  onChange={(e) => setForm({ ...form, room_id: e.target.value })}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                >
                  <option value="">No room</option>
                  {rooms.filter((r) => r.status !== 'maintenance').map((r) => (
                    <option key={r.id} value={r.id}>{r.room_number} ({r.occupied_beds}/{r.capacity})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Rent Amount (₹) *</label>
                <input
                  type="number" min={0} required
                  value={form.rent_amount}
                  onChange={(e) => setForm({ ...form, rent_amount: parseInt(e.target.value) || 0 })}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Due Date *</label>
                <input
                  type="date" required
                  value={form.due_date}
                  onChange={(e) => setForm({ ...form, due_date: e.target.value })}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Billing Month</label>
                <select
                  value={form.billing_month}
                  onChange={(e) => setForm({ ...form, billing_month: parseInt(e.target.value) })}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                >
                  {monthNames.map((name, i) => (
                    <option key={i + 1} value={i + 1}>{name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Billing Year</label>
                <input
                  type="number" min={2020} max={2100}
                  value={form.billing_year}
                  onChange={(e) => setForm({ ...form, billing_year: parseInt(e.target.value) || new Date().getFullYear() })}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium text-gray-700">Notes</label>
                <textarea
                  rows={2}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
            </div>
            {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
            <div className="mt-4 flex justify-end gap-3">
              <Button variant="ghost" onClick={() => { setShowForm(false); resetForm() }}>Cancel</Button>
              <Button loading={loading} onClick={handleCreate}>Create Rent Record</Button>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Payment Modal */}
      {payModal && !payReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <Card className="w-full max-w-md">
            <CardBody>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">Record Payment</h3>
              <p className="mb-4 text-sm text-gray-500">
                {payModal.resident} — Due: {formatCurrency(payModal.record.amount)}
              </p>

              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Amount (₹)</label>
                  <input
                    type="number" min={1}
                    value={payAmount}
                    onChange={(e) => setPayAmount(parseInt(e.target.value) || 0)}
                    className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Payment Method</label>
                  <select
                    value={payMethod}
                    onChange={(e) => setPayMethod(e.target.value as any)}
                    className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  >
                    <option value="cash">Cash</option>
                    <option value="upi">UPI</option>
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <p className="text-xs text-gray-400">
                  Balance after payment: {formatCurrency(Math.max(0, payModal.record.amount - payModal.record.paid_amount - payAmount))}
                </p>
              </div>

              {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

              <div className="mt-4 flex justify-end gap-3">
                <Button variant="ghost" onClick={() => { setPayModal(null); setError(null) }}>Cancel</Button>
                <Button loading={payLoading} onClick={handleRecordPayment}>
                  Pay {formatCurrency(payAmount)}
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      )}

      {/* Payment Success */}
      {payReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <Card className="w-full max-w-sm text-center">
            <CardBody>
              <div className="mb-3 text-4xl">✅</div>
              <h3 className="mb-1 text-lg font-semibold text-green-700">Payment Recorded</h3>
              <p className="text-sm text-gray-500">
                Receipt: {payReceipt.receipt_number}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Amount: {formatCurrency(payReceipt.amount_paid)}
              </p>
              <button
                onClick={() => window.print()}
                className="mt-4 min-h-[44px] rounded-md bg-amber-600 px-6 text-sm font-medium text-white hover:bg-amber-700"
              >
                Print Receipt
              </button>
            </CardBody>
          </Card>
        </div>
      )}

      {filteredRecords.length === 0 ? (
        <EmptyState
          title={activeTab === 'all' ? 'No rent records yet' : `No ${activeTab} records`}
          description={activeTab === 'all' ? 'Generate rent or create the first record.' : 'No records match this filter.'}
          action={activeTab === 'all' ? { label: 'Generate Rent', onClick: () => setShowGenerate(true) } : undefined}
        />
      ) : (
        <Table
          columns={columns}
          data={filteredRecords}
          keyExtractor={(r) => r.id}
          renderCard={(r) => {
            const resident = residentMap.get(r.resident_id)
            return (
              <div>
                <div className="flex items-center justify-between">
                  <p className="font-medium text-gray-900">{resident?.full_name ?? 'Unknown'}</p>
                  <StatusBadge variant={statusVariant[r.status]}>{statusLabel[r.status]}</StatusBadge>
                </div>
                <div className="mt-2 space-y-1 text-sm text-gray-500">
                  <p className="font-medium text-gray-700">
                    {formatCurrency(r.rent_amount)}
                    {r.late_fee > 0 && <span className="ml-1 text-xs text-red-500">+{formatCurrency(r.late_fee)} late fee</span>}
                  </p>
                  <p>Due {formatDate(r.due_date)}</p>
                  {r.paid_amount > 0 && <p>Paid: {formatCurrency(r.paid_amount)}</p>}
                  {r.receipt_number && <p className="text-xs text-gray-400">Receipt: #{r.receipt_number}</p>}
                </div>
                {(r.status === 'pending' || r.status === 'overdue' || r.status === 'partially_paid') && (
                  <div className="mt-3">
                    <button
                      onClick={() => handleOpenPayment(r)}
                      className="min-h-[44px] w-full rounded-md bg-green-50 px-4 text-sm font-medium text-green-700 hover:bg-green-100"
                    >
                      {r.paid_amount > 0 ? `Pay Balance ${formatCurrency(r.amount - r.paid_amount)}` : `Pay ${formatCurrency(r.amount)}`}
                    </button>
                  </div>
                )}
                {r.status === 'paid' && r.payment_date && (
                  <p className="mt-2 text-xs text-gray-400">Paid {formatDate(r.payment_date)}</p>
                )}
              </div>
            )
          }}
        />
      )}
    </div>
  )
}
