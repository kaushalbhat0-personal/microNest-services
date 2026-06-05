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
import type { StayNestNotice } from '@micronest/db'
import { createNotice, updateNotice, publishNotice, archiveNotice } from '@/lib/staynest/actions'

const statusVariant: Record<string, 'default' | 'success' | 'info'> = {
  draft: 'default',
  published: 'success',
  archived: 'info',
}

const statusLabel: Record<string, string> = {
  draft: 'Draft',
  published: 'Published',
  archived: 'Archived',
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
  content: '',
}

export function NoticesContent({
  initialNotices,
  organizationId,
}: {
  initialNotices: StayNestNotice[]
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
    if (!form.title || !form.content) {
      setError('Title and content are required.')
      return
    }
    setError(null)
    setLoading(true)

    const formData = new FormData()
    formData.set('title', form.title)
    formData.set('content', form.content)

    if (isEditing) {
      formData.set('id', form.id)
      const result = await updateNotice({ error: null, success: false }, formData)
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
      const result = await createNotice({ error: null, success: false }, formData)
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

  const handleEdit = useCallback((notice: StayNestNotice) => {
    setForm({
      id: notice.id,
      title: notice.title,
      content: notice.content,
    })
    setShowForm(true)
    setError(null)
  }, [])

  const handlePublish = useCallback(
    async (id: string) => {
      const result = await publishNotice(id)
      if (result?.error) {
        setError(result.error)
      } else {
        router.refresh()
      }
    },
    [router]
  )

  const handleArchive = useCallback(
    async (id: string) => {
      const result = await archiveNotice(id)
      if (result?.error) {
        setError(result.error)
      } else {
        router.refresh()
      }
    },
    [router]
  )

  const columns: Column<StayNestNotice>[] = [
    { header: 'Title', accessor: (n) => <span className="text-sm font-medium text-gray-900">{n.title}</span> },
    {
      header: 'Content',
      hideOnMobile: true,
      accessor: (n) => (
        <span className="text-sm text-gray-600 line-clamp-2">{n.content}</span>
      ),
    },
    {
      header: 'Status',
      accessor: (n) => (
        <StatusBadge variant={statusVariant[n.status]}>
          {statusLabel[n.status]}
        </StatusBadge>
      ),
    },
    {
      header: 'Published At',
      hideOnMobile: true,
      accessor: (n) =>
        n.published_at ? (
          <span className="text-xs text-gray-500">{formatDateTime(n.published_at)}</span>
        ) : (
          <span className="text-xs text-gray-400">—</span>
        ),
    },
    {
      header: '',
      accessor: (n) => (
        <div className="flex gap-2">
          {n.status === 'draft' && (
            <>
              <Button size="sm" variant="ghost" onClick={() => handleEdit(n)}>
                Edit
              </Button>
              <Button size="sm" variant="ghost" onClick={() => handlePublish(n.id)}>
                Publish
              </Button>
            </>
          )}
          {n.status === 'published' && (
            <Button size="sm" variant="ghost" onClick={() => handleArchive(n.id)}>
              Archive
            </Button>
          )}
        </div>
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        title="Notices"
        description="Create and manage announcements for residents."
        actions={
          <Button
            onClick={() => {
              setShowForm(!showForm)
              if (showForm) resetForm()
            }}
          >
            {showForm ? 'Cancel' : isEditing ? 'Cancel' : 'Create Notice'}
          </Button>
        }
      />

      {showForm && (
        <Card className="mb-6 border-amber-200">
          <CardBody>
            <h3 className="mb-4 text-sm font-semibold text-gray-900">
              {isEditing ? 'Edit Notice' : 'New Notice'}
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
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Content *
                </label>
                <textarea
                  rows={4}
                  required
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
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
                {isEditing ? 'Update Notice' : 'Create Notice'}
              </Button>
            </div>
          </CardBody>
        </Card>
      )}

      {initialNotices.length === 0 ? (
        <EmptyState
          title="No notices yet"
          description="Create your first notice to get started."
          action={{ label: 'Create Notice', onClick: () => setShowForm(true) }}
        />
      ) : (
        <Table
          columns={columns}
          data={initialNotices}
          keyExtractor={(n) => n.id}
          renderCard={(n) => (
            <div>
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{n.title}</p>
                  <p className="mt-1 text-sm text-gray-600 line-clamp-3">{n.content}</p>
                </div>
                <StatusBadge variant={statusVariant[n.status]}>
                  {statusLabel[n.status]}
                </StatusBadge>
              </div>
              {n.published_at && (
                <p className="mt-2 text-xs text-gray-400">
                  Published {formatDateTime(n.published_at)}
                </p>
              )}
              <div className="mt-3 flex gap-2">
                {n.status === 'draft' && (
                  <>
                    <button
                      onClick={() => handleEdit(n)}
                      className="min-h-[44px] rounded-md bg-indigo-50 px-4 text-sm font-medium text-indigo-700 hover:bg-indigo-100"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handlePublish(n.id)}
                      className="min-h-[44px] rounded-md bg-green-50 px-4 text-sm font-medium text-green-700 hover:bg-green-100"
                    >
                      Publish
                    </button>
                  </>
                )}
                {n.status === 'published' && (
                  <button
                    onClick={() => handleArchive(n.id)}
                    className="min-h-[44px] rounded-md bg-gray-50 px-4 text-sm font-medium text-gray-600 hover:bg-gray-100"
                  >
                    Archive
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
