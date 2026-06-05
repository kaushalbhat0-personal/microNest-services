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
import type { StayNestAnnouncement } from '@micronest/db'
import { createAnnouncement, updateAnnouncement, deleteAnnouncement } from '@/lib/staynest/actions'

const priorityVariant: Record<string, 'default' | 'warning' | 'danger'> = {
  normal: 'default',
  important: 'warning',
  urgent: 'danger',
}

const priorityLabel: Record<string, string> = {
  normal: 'Normal',
  important: 'Important',
  urgent: 'Urgent',
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const emptyForm = {
  id: '',
  title: '',
  message: '',
  priority: 'normal' as 'normal' | 'important' | 'urgent',
  publish_date: new Date().toISOString().slice(0, 16),
  expiry_date: '',
}

export function NoticesContent({
  initialNotices,
  organizationId,
}: {
  initialNotices: StayNestAnnouncement[]
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
    if (!form.title || !form.message) {
      setError('Title and message are required.')
      return
    }
    setError(null)
    setLoading(true)

    const formData = new FormData()
    formData.set('title', form.title)
    formData.set('message', form.message)
    formData.set('priority', form.priority)
    formData.set('publish_date', form.publish_date || new Date().toISOString())
    formData.set('expiry_date', form.expiry_date || '')

    if (isEditing) {
      formData.set('id', form.id)
      const result = await updateAnnouncement({ error: null, success: false }, formData)
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
      const result = await createAnnouncement({ error: null, success: false }, formData)
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

  const handleEdit = useCallback((announcement: StayNestAnnouncement) => {
    setForm({
      id: announcement.id,
      title: announcement.title,
      message: announcement.message,
      priority: announcement.priority,
      publish_date: announcement.publish_date?.slice(0, 16) ?? '',
      expiry_date: announcement.expiry_date?.slice(0, 16) ?? '',
    })
    setShowForm(true)
    setError(null)
  }, [])

  const handleDelete = useCallback(
    async (id: string) => {
      const result = await deleteAnnouncement(id)
      if (result?.error) {
        setError(result.error)
      } else {
        router.refresh()
      }
    },
    [router]
  )

  const isPublished = (a: StayNestAnnouncement) =>
    a.publish_date && new Date(a.publish_date) <= new Date()

  const columns: Column<StayNestAnnouncement>[] = [
    { header: 'Title', accessor: (a) => <span className="text-sm font-medium text-gray-900">{a.title}</span> },
    {
      header: 'Message',
      hideOnMobile: true,
      accessor: (a) => (
        <span className="text-sm text-gray-600 line-clamp-2">{a.message}</span>
      ),
    },
    {
      header: 'Priority',
      accessor: (a) => (
        <StatusBadge variant={priorityVariant[a.priority]}>
          {priorityLabel[a.priority]}
        </StatusBadge>
      ),
    },
    {
      header: 'Status',
      hideOnMobile: true,
      accessor: (a) =>
        isPublished(a) ? (
          <span className="text-xs text-green-600 font-medium">Published</span>
        ) : (
          <span className="text-xs text-gray-400">Draft</span>
        ),
    },
    {
      header: 'Publish Date',
      hideOnMobile: true,
      accessor: (a) =>
        a.publish_date ? (
          <span className="text-xs text-gray-500">{formatDateTime(a.publish_date)}</span>
        ) : (
          <span className="text-xs text-gray-400">—</span>
        ),
    },
    {
      header: '',
      accessor: (a) => (
        <div className="flex gap-2">
          <Button size="sm" variant="ghost" onClick={() => handleEdit(a)}>
            Edit
          </Button>
          <Button size="sm" variant="ghost" onClick={() => handleDelete(a.id)}>
            Delete
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        title="Announcements"
        description="Create and manage announcements for residents."
        actions={
          <Button
            onClick={() => {
              setShowForm(!showForm)
              if (showForm) resetForm()
            }}
          >
            {showForm ? 'Cancel' : 'New Announcement'}
          </Button>
        }
      />

      {showForm && (
        <Card className="mb-6 border-amber-200">
          <CardBody>
            <h3 className="mb-4 text-sm font-semibold text-gray-900">
              {isEditing ? 'Edit Announcement' : 'New Announcement'}
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Title *
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
                  Message *
                </label>
                <textarea
                  rows={4}
                  required
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Priority
                </label>
                <select
                  value={form.priority}
                  onChange={(e) => setForm({ ...form, priority: e.target.value as any })}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                >
                  <option value="normal">Normal</option>
                  <option value="important">Important</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Publish Date
                </label>
                <input
                  type="datetime-local"
                  value={form.publish_date}
                  onChange={(e) => setForm({ ...form, publish_date: e.target.value })}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Expiry Date
                </label>
                <input
                  type="datetime-local"
                  value={form.expiry_date}
                  onChange={(e) => setForm({ ...form, expiry_date: e.target.value })}
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
                {isEditing ? 'Update' : 'Create'}
              </Button>
            </div>
          </CardBody>
        </Card>
      )}

      {initialNotices.length === 0 ? (
        <EmptyState
          title="No announcements yet"
          description="Create your first announcement to get started."
          action={{ label: 'New Announcement', onClick: () => setShowForm(true) }}
        />
      ) : (
        <Table
          columns={columns}
          data={initialNotices}
          keyExtractor={(a) => a.id}
          renderCard={(a) => (
            <div>
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{a.title}</p>
                  <p className="mt-1 text-sm text-gray-600 line-clamp-3">{a.message}</p>
                </div>
                <StatusBadge variant={priorityVariant[a.priority]}>
                  {priorityLabel[a.priority]}
                </StatusBadge>
              </div>
              {a.publish_date && (
                <p className="mt-2 text-xs text-gray-400">
                  {isPublished(a) ? 'Published' : 'Scheduled'} {formatDateTime(a.publish_date)}
                </p>
              )}
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => handleEdit(a)}
                  className="min-h-[44px] rounded-md bg-indigo-50 px-4 text-sm font-medium text-indigo-700 hover:bg-indigo-100"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(a.id)}
                  className="min-h-[44px] rounded-md bg-red-50 px-4 text-sm font-medium text-red-600 hover:bg-red-100"
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        />
      )}
    </div>
  )
}
