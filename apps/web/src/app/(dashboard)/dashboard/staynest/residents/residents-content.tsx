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
import type { StayNestResident } from '@micronest/db'
import { createResident, updateResident, checkoutResident } from '@/lib/staynest/actions'

const statusVariant: Record<string, 'success' | 'warning' | 'default'> = {
  active: 'success',
  notice_period: 'warning',
  checked_out: 'default',
}

const statusLabel: Record<string, string> = {
  active: 'Active',
  notice_period: 'Notice Period',
  checked_out: 'Checked Out',
}

const genderLabel: Record<string, string> = {
  male: 'Male',
  female: 'Female',
  other: 'Other',
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

const emptyForm = {
  id: '',
  full_name: '',
  phone: '',
  email: '',
  gender: '',
  emergency_contact_name: '',
  emergency_contact_phone: '',
  id_proof_type: '',
  id_proof_number: '',
  room_id: '',
  bed_number: 0,
  check_in_date: new Date().toISOString().slice(0, 10),
}

export function ResidentsContent({
  initialResidents,
  organizationId,
}: {
  initialResidents: StayNestResident[]
  organizationId: string | null
}) {
  const router = useRouter()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const isEditing = !!form.id

  const resetForm = useCallback(() => {
    setForm(emptyForm)
    setError(null)
  }, [])

  const handleSave = useCallback(async () => {
    if (!form.full_name || !form.phone || !form.check_in_date) {
      setError('Full name, phone, and check-in date are required.')
      return
    }
    setError(null)
    setLoading(true)

    const formData = new FormData()
    formData.set('full_name', form.full_name)
    formData.set('phone', form.phone)
    formData.set('email', form.email)
    formData.set('gender', form.gender)
    formData.set('emergency_contact_name', form.emergency_contact_name)
    formData.set('emergency_contact_phone', form.emergency_contact_phone)
    formData.set('id_proof_type', form.id_proof_type)
    formData.set('id_proof_number', form.id_proof_number)
    formData.set('room_id', form.room_id)
    formData.set('bed_number', String(form.bed_number))
    formData.set('check_in_date', form.check_in_date)

    if (isEditing) {
      formData.set('id', form.id)
      const result = await updateResident({ error: null, success: false }, formData)
      if (result?.error) {
        setError(result.error)
        setLoading(false)
      } else {
        resetForm()
        setShowForm(false)
        setLoading(false)
        router.refresh()
      }
    } else {
      const result = await createResident({ error: null, success: false }, formData)
      if (result?.error) {
        setError(result.error)
        setLoading(false)
      } else {
        resetForm()
        setShowForm(false)
        setLoading(false)
        router.refresh()
      }
    }
  }, [form, isEditing, resetForm, router])

  const handleEdit = useCallback((resident: StayNestResident) => {
    setForm({
      id: resident.id,
      full_name: resident.full_name,
      phone: resident.phone,
      email: resident.email ?? '',
      gender: resident.gender ?? '',
      emergency_contact_name: resident.emergency_contact_name ?? '',
      emergency_contact_phone: resident.emergency_contact_phone ?? '',
      id_proof_type: resident.id_proof_type ?? '',
      id_proof_number: resident.id_proof_number ?? '',
      room_id: resident.room_id ?? '',
      bed_number: resident.bed_number ?? 0,
      check_in_date: resident.check_in_date.slice(0, 10),
    })
    setShowForm(true)
    setError(null)
  }, [])

  const handleCheckout = useCallback(
    async (id: string) => {
      const result = await checkoutResident(id)
      if (result?.error) {
        setError(result.error)
      } else {
        router.refresh()
      }
    },
    [router]
  )

  const columns: Column<StayNestResident>[] = [
    { header: 'Full Name', accessor: (r) => r.full_name },
    { header: 'Phone', accessor: (r) => r.phone, hideOnMobile: true },
    { header: 'Room', accessor: (r) => r.room_id ?? '—' },
    {
      header: 'Gender',
      hideOnMobile: true,
      accessor: (r) =>
        r.gender ? (
          <span className="text-sm text-gray-600">{genderLabel[r.gender] ?? r.gender}</span>
        ) : (
          <span className="text-sm text-gray-400">—</span>
        ),
    },
    {
      header: 'Check-in',
      hideOnMobile: true,
      accessor: (r) => (
        <span className="text-xs text-gray-500">{formatDate(r.check_in_date)}</span>
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
          <Button size="sm" variant="ghost" onClick={() => handleEdit(r)}>
            Edit
          </Button>
          {r.status === 'active' && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleCheckout(r.id)}
            >
              Checkout
            </Button>
          )}
        </div>
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        title="Residents"
        description="Manage your residents and their details."
        actions={
          <Button
            onClick={() => {
              setShowForm(!showForm)
              if (showForm) resetForm()
            }}
          >
            {showForm ? 'Cancel' : isEditing ? 'Cancel' : 'Add Resident'}
          </Button>
        }
      />

      {showForm && (
        <Card className="mb-6 border-amber-200">
          <CardBody>
            <h3 className="mb-4 text-sm font-semibold text-gray-900">
              {isEditing ? 'Edit Resident' : 'New Resident'}
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={form.full_name}
                  onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Phone *
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
                  Email
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Gender
                </label>
                <select
                  value={form.gender}
                  onChange={(e) => setForm({ ...form, gender: e.target.value })}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Emergency Contact Name
                </label>
                <input
                  type="text"
                  value={form.emergency_contact_name}
                  onChange={(e) => setForm({ ...form, emergency_contact_name: e.target.value })}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Emergency Contact Phone
                </label>
                <input
                  type="text"
                  value={form.emergency_contact_phone}
                  onChange={(e) => setForm({ ...form, emergency_contact_phone: e.target.value })}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  ID Proof Type
                </label>
                <select
                  value={form.id_proof_type}
                  onChange={(e) => setForm({ ...form, id_proof_type: e.target.value })}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                >
                  <option value="">Select</option>
                  <option value="aadhaar">Aadhaar</option>
                  <option value="pan">PAN</option>
                  <option value="voter">Voter ID</option>
                  <option value="driving_license">Driving License</option>
                  <option value="passport">Passport</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  ID Proof Number
                </label>
                <input
                  type="text"
                  value={form.id_proof_number}
                  onChange={(e) => setForm({ ...form, id_proof_number: e.target.value })}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Room ID
                </label>
                <input
                  type="text"
                  value={form.room_id}
                  onChange={(e) => setForm({ ...form, room_id: e.target.value })}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Bed Number
                </label>
                <input
                  type="number"
                  min={0}
                  value={form.bed_number}
                  onChange={(e) => setForm({ ...form, bed_number: parseInt(e.target.value) || 0 })}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Check-in Date *
                </label>
                <input
                  type="date"
                  required
                  value={form.check_in_date}
                  onChange={(e) => setForm({ ...form, check_in_date: e.target.value })}
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
                  resetForm()
                }}
              >
                Cancel
              </Button>
              <Button loading={loading} onClick={handleSave}>
                {isEditing ? 'Update Resident' : 'Add Resident'}
              </Button>
            </div>
          </CardBody>
        </Card>
      )}

      {initialResidents.length === 0 ? (
        <EmptyState
          title="No residents yet"
          description="Add your first resident to get started."
          action={{ label: 'Add Resident', onClick: () => setShowForm(true) }}
        />
      ) : (
        <Table
          columns={columns}
          data={initialResidents}
          keyExtractor={(r) => r.id}
          renderCard={(r) => (
            <div>
              <div className="flex items-center justify-between">
                <p className="font-medium text-gray-900">{r.full_name}</p>
                <StatusBadge variant={statusVariant[r.status]}>
                  {statusLabel[r.status]}
                </StatusBadge>
              </div>
              <div className="mt-2 space-y-1 text-sm text-gray-500">
                <p>Room {r.room_id ?? '—'} &middot; {r.phone}</p>
                <p>Checked in {formatDate(r.check_in_date)}</p>
              </div>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => handleEdit(r)}
                  className="min-h-[44px] rounded-md bg-indigo-50 px-4 text-sm font-medium text-indigo-700 hover:bg-indigo-100"
                >
                  Edit
                </button>
                {r.status === 'active' && (
                  <button
                    onClick={() => handleCheckout(r.id)}
                    className="min-h-[44px] rounded-md bg-amber-50 px-4 text-sm font-medium text-amber-700 hover:bg-amber-100"
                  >
                    Checkout
                  </button>
                )}
              </div>
            </div>
          )}
        />
      )}
    </div>
  )
}
