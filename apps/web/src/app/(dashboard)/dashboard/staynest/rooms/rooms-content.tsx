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
import { createRoom, updateRoom, deleteRoom } from '@/lib/staynest/actions'

const statusVariant: Record<string, 'success' | 'warning' | 'default'> = {
  available: 'success',
  partially_occupied: 'warning',
  full: 'default',
  maintenance: 'warning',
}

const statusLabel: Record<string, string> = {
  available: 'Available',
  partially_occupied: 'Partial',
  full: 'Full',
  maintenance: 'Maintenance',
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
  floor: 0,
  capacity: 1,
  rent_per_bed: 0,
  status: 'available' as 'available' | 'partially_occupied' | 'full' | 'maintenance',
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
    formData.set('floor', String(form.floor))
    formData.set('capacity', String(form.capacity))
    formData.set('rent_per_bed', String(form.rent_per_bed))

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
      floor: room.floor ?? 0,
      capacity: room.capacity,
      rent_per_bed: room.rent_per_bed,
      status: room.status,
    })
    setShowForm(true)
    setError(null)
  }, [])

  const handleDelete = useCallback(
    async (id: string) => {
      const result = await deleteRoom(id)
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
      header: 'Floor',
      hideOnMobile: true,
      accessor: (r) =>
        r.floor != null ? (
          <span className="text-sm text-gray-600">Floor {r.floor}</span>
        ) : (
          <span className="text-sm text-gray-400">—</span>
        ),
    },
    {
      header: 'Beds',
      accessor: (r) => (
        <span className="text-sm">
          {r.occupied_beds}<span className="text-gray-400">/{r.capacity}</span>
        </span>
      ),
    },
    {
      header: 'Rent/Bed',
      accessor: (r) => <span className="text-sm tabular-nums">{formatCurrency(r.rent_per_bed)}</span>,
    },
    {
      header: 'Status',
      accessor: (r) => (
        <StatusBadge variant={statusVariant[r.status] ?? 'default'}>
          {statusLabel[r.status] ?? r.status}
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
          {r.occupied_beds === 0 && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleDelete(r.id)}
            >
              Delete
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
                  Floor
                </label>
                <input
                  type="number"
                  min={0}
                  value={form.floor}
                  onChange={(e) => setForm({ ...form, floor: parseInt(e.target.value) || 0 })}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Capacity (beds) *
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
                  Rent per Bed (₹) *
                </label>
                <input
                  type="number"
                  min={0}
                  required
                  value={form.rent_per_bed}
                  onChange={(e) => setForm({ ...form, rent_per_bed: parseInt(e.target.value) || 0 })}
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
                    onChange={(e) => setForm({ ...form, status: e.target.value as any })}
                    className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                  >
                    <option value="available">Available</option>
                    <option value="partially_occupied">Partially Occupied</option>
                    <option value="full">Full</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>
              )}
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
          renderCard={(r) => (
            <div>
              <div className="flex items-center justify-between">
                <p className="font-mono font-medium text-gray-900">Room {r.room_number}</p>
                <StatusBadge variant={statusVariant[r.status] ?? 'default'}>
                  {statusLabel[r.status] ?? r.status}
                </StatusBadge>
              </div>
              <div className="mt-2 space-y-1 text-sm text-gray-500">
                <p>{r.floor != null ? `Floor ${r.floor}` : '—'} &middot; {r.occupied_beds}/{r.capacity} beds</p>
                <p className="font-medium text-gray-700">{formatCurrency(r.rent_per_bed)}/bed</p>
              </div>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => handleEdit(r)}
                  className="min-h-[44px] rounded-md bg-indigo-50 px-4 text-sm font-medium text-indigo-700 hover:bg-indigo-100"
                >
                  Edit
                </button>
                {r.occupied_beds === 0 && (
                  <button
                    onClick={() => handleDelete(r.id)}
                    className="min-h-[44px] rounded-md bg-red-50 px-4 text-sm font-medium text-red-600 hover:bg-red-100"
                  >
                    Delete
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
