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
import type { StayNestRoom } from '@micronest/db'
import { createRoom, updateRoom, deactivateRoom } from '@/lib/staynest/actions'

const statusVariant: Record<string, 'success' | 'default' | 'warning'> = {
  active: 'success',
  inactive: 'default',
  maintenance: 'warning',
}

const statusLabel: Record<string, string> = {
  active: 'Active',
  inactive: 'Inactive',
  maintenance: 'Maintenance',
}

const roomTypeLabel: Record<string, string> = {
  single: 'Single',
  double: 'Double',
  triple: 'Triple',
  dorm: 'Dorm',
  other: 'Other',
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

const emptyForm = {
  id: '',
  room_number: '',
  room_type: '',
  capacity: 1,
  occupied_count: 0,
  monthly_rent: 0,
  status: 'active',
  notes: '',
}

export function RoomsContent({
  initialRooms,
  organizationId,
}: {
  initialRooms: StayNestRoom[]
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
    if (!form.room_number) {
      setError('Room number is required.')
      return
    }
    setError(null)
    setLoading(true)

    const formData = new FormData()
    formData.set('room_number', form.room_number)
    formData.set('room_type', form.room_type)
    formData.set('capacity', String(form.capacity))
    formData.set('occupied_count', String(form.occupied_count))
    formData.set('monthly_rent', String(form.monthly_rent))
    formData.set('notes', form.notes)

    if (isEditing) {
      formData.set('id', form.id)
      formData.set('status', form.status)
      const result = await updateRoom({ error: null, success: false }, formData)
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
      const result = await createRoom({ error: null, success: false }, formData)
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

  const handleEdit = useCallback((room: StayNestRoom) => {
    setForm({
      id: room.id,
      room_number: room.room_number,
      room_type: room.room_type ?? '',
      capacity: room.capacity,
      occupied_count: room.occupied_count,
      monthly_rent: room.monthly_rent,
      status: room.status,
      notes: room.notes ?? '',
    })
    setShowForm(true)
    setError(null)
  }, [])

  const handleDeactivate = useCallback(
    async (id: string) => {
      const result = await deactivateRoom(id)
      if (result?.error) {
        setError(result.error)
      } else {
        router.refresh()
      }
    },
    [router]
  )

  const columns: Column<StayNestRoom>[] = [
    { header: 'Room', accessor: (r) => <span className="font-mono text-sm">{r.room_number}</span> },
    {
      header: 'Type',
      accessor: (r) =>
        r.room_type ? (
          <span className="text-sm text-gray-600">{roomTypeLabel[r.room_type] ?? r.room_type}</span>
        ) : (
          <span className="text-sm text-gray-400">—</span>
        ),
    },
    {
      header: 'Capacity',
      accessor: (r) => (
        <span className="text-sm">
          {r.occupied_count}<span className="text-gray-400">/{r.capacity}</span>
        </span>
      ),
    },
    {
      header: 'Monthly Rent',
      accessor: (r) => <span className="text-sm tabular-nums">{formatCurrency(r.monthly_rent)}</span>,
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
        title="Rooms"
        description="Manage your rooms and their details."
        actions={
          <Button
            onClick={() => {
              setShowForm(!showForm)
              if (showForm) resetForm()
            }}
          >
            {showForm ? 'Cancel' : isEditing ? 'Cancel' : 'Add Room'}
          </Button>
        }
      />

      {showForm && (
        <Card className="mb-6 border-amber-200">
          <CardBody>
            <h3 className="mb-4 text-sm font-semibold text-gray-900">
              {isEditing ? 'Edit Room' : 'New Room'}
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
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
                  Room Type
                </label>
                <select
                  value={form.room_type}
                  onChange={(e) => setForm({ ...form, room_type: e.target.value })}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                >
                  <option value="">Select</option>
                  <option value="single">Single</option>
                  <option value="double">Double</option>
                  <option value="triple">Triple</option>
                  <option value="dorm">Dorm</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Capacity *
                </label>
                <input
                  type="number"
                  min={1}
                  required
                  value={form.capacity}
                  onChange={(e) => setForm({ ...form, capacity: parseInt(e.target.value) || 1 })}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Occupied
                </label>
                <input
                  type="number"
                  min={0}
                  value={form.occupied_count}
                  onChange={(e) => setForm({ ...form, occupied_count: parseInt(e.target.value) || 0 })}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Monthly Rent (₹) *
                </label>
                <input
                  type="number"
                  min={0}
                  required
                  value={form.monthly_rent}
                  onChange={(e) => setForm({ ...form, monthly_rent: parseInt(e.target.value) || 0 })}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
              </div>
              {isEditing && (
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>
              )}
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
                {isEditing ? 'Update Room' : 'Add Room'}
              </Button>
            </div>
          </CardBody>
        </Card>
      )}

      {initialRooms.length === 0 ? (
        <EmptyState
          title="No rooms yet"
          description="Add your first room to get started."
          action={{ label: 'Add Room', onClick: () => setShowForm(true) }}
        />
      ) : (
        <Table
          columns={columns}
          data={initialRooms}
          keyExtractor={(r) => r.id}
        />
      )}
    </div>
  )
}
