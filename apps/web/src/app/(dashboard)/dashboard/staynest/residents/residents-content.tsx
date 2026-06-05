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
import { createResident, updateResident, deactivateResident } from '@/lib/staynest/actions'

const statusVariant: Record<string, 'success' | 'default'> = {
  active: 'success',
  inactive: 'default',
}

const statusLabel: Record<string, string> = {
  active: 'Active',
  inactive: 'Inactive',
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
  guardian_name: '',
  guardian_phone: '',
  room_number: '',
  joining_date: new Date().toISOString().slice(0, 10),
  notes: '',
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
    if (!form.full_name || !form.phone || !form.room_number || !form.joining_date) {
      setError('Full name, phone, room number, and joining date are required.')
      return
    }
    setError(null)
    setLoading(true)

    const formData = new FormData()
    formData.set('full_name', form.full_name)
    formData.set('phone', form.phone)
    formData.set('email', form.email)
    formData.set('gender', form.gender)
    formData.set('guardian_name', form.guardian_name)
    formData.set('guardian_phone', form.guardian_phone)
    formData.set('room_number', form.room_number)
    formData.set('joining_date', form.joining_date)
    formData.set('notes', form.notes)

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
      guardian_name: resident.guardian_name ?? '',
      guardian_phone: resident.guardian_phone ?? '',
      room_number: resident.room_number,
      joining_date: resident.joining_date.slice(0, 10),
      notes: resident.notes ?? '',
    })
    setShowForm(true)
    setError(null)
  }, [])

  const handleDeactivate = useCallback(
    async (id: string) => {
      const result = await deactivateResident(id)
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
    { header: 'Room', accessor: (r) => r.room_number },
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
      header: 'Joining Date',
      hideOnMobile: true,
      accessor: (r) => (
        <span className="text-xs text-gray-500">{formatDate(r.joining_date)}</span>
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
              onClick={() => handleDeactivate(r.id)}
            >
              Deactivate
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
                  Guardian Name
                </label>
                <input
                  type="text"
                  value={form.guardian_name}
                  onChange={(e) => setForm({ ...form, guardian_name: e.target.value })}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Guardian Phone
                </label>
                <input
                  type="text"
                  value={form.guardian_phone}
                  onChange={(e) => setForm({ ...form, guardian_phone: e.target.value })}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Room Number *
                </label>
                <input
                  type="text"
                  required
                  value={form.room_number}
                  onChange={(e) => setForm({ ...form, room_number: e.target.value })}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Joining Date *
                </label>
                <input
                  type="date"
                  required
                  value={form.joining_date}
                  onChange={(e) => setForm({ ...form, joining_date: e.target.value })}
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
                <p>Room {r.room_number} &middot; {r.phone}</p>
                <p>Joined {formatDate(r.joining_date)}</p>
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
                    onClick={() => handleDeactivate(r.id)}
                    className="min-h-[44px] rounded-md bg-gray-50 px-4 text-sm font-medium text-gray-600 hover:bg-gray-100"
                  >
                    Deactivate
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
