'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  PageHeader,
  Card,
  CardBody,
  CountUp,
  Button,
} from '@micronest/ui'
import type { StayNestMaintenanceRequest, StayNestResident, StayNestRoom } from '@micronest/db'
import { createMaintenanceRequest, startWork, resolveRequest } from '@/lib/staynest/actions'

const priorityColor: Record<string, string> = {
  low: 'bg-blue-100 text-blue-800',
  medium: 'bg-amber-100 text-amber-800',
  high: 'bg-red-100 text-red-800',
}

const statusColor: Record<string, string> = {
  open: 'bg-slate-100 text-slate-800',
  in_progress: 'bg-amber-100 text-amber-800',
  resolved: 'bg-green-100 text-green-800',
}

const statusLabel: Record<string, string> = {
  open: 'Open',
  in_progress: 'In Progress',
  resolved: 'Resolved',
}

const categoryLabel: Record<string, string> = {
  electrical: 'Electrical',
  plumbing: 'Plumbing',
  cleaning: 'Cleaning',
  furniture: 'Furniture',
  internet: 'Internet',
  other: 'Other',
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function MaintenanceContent({
  initialRequests,
  counts,
  residents,
  rooms,
  organizationId,
}: {
  initialRequests: StayNestMaintenanceRequest[]
  counts: { open: number; inProgress: number; resolved: number; resolvedThisMonth: number }
  residents: StayNestResident[]
  rooms: StayNestRoom[]
  organizationId: string | null
}) {
  const router = useRouter()
  const [requests, setRequests] = useState(initialRequests)
  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'other',
    priority: 'medium',
    assigned_to: '',
    resident_id: '',
    room_id: '',
  })

  const resetForm = () => {
    setForm({ title: '', description: '', category: 'other', priority: 'medium', assigned_to: '', resident_id: '', room_id: '' })
    setShowForm(false)
  }

  const handleCreate = useCallback(async () => {
    if (!form.title || !form.description) return
    setError(null)
    setLoading(true)

    const fd = new FormData()
    fd.set('title', form.title)
    fd.set('description', form.description)
    fd.set('category', form.category)
    fd.set('priority', form.priority)
    fd.set('assigned_to', form.assigned_to)
    fd.set('resident_id', form.resident_id)
    fd.set('room_id', form.room_id)

    const result = await createMaintenanceRequest({ error: null, success: false }, fd)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    } else {
      resetForm()
      setLoading(false)
      router.refresh()
    }
  }, [form, router])

  const handleStartWork = useCallback(async (id: string) => {
    const result = await startWork(id)
    if (result?.error) {
      setError(result.error)
    } else {
      router.refresh()
    }
  }, [router])

  const [resolveId, setResolveId] = useState<string | null>(null)
  const [resolveNotes, setResolveNotes] = useState('')

  const handleResolve = useCallback(async (id: string) => {
    setResolveId(id)
    setResolveNotes('')
  }, [])

  const submitResolve = useCallback(async () => {
    if (!resolveId) return
    setLoading(true)

    const fd = new FormData()
    fd.set('id', resolveId)
    fd.set('resolved_notes', resolveNotes)

    const result = await resolveRequest({ error: null, success: false }, fd)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    } else {
      setResolveId(null)
      setLoading(false)
      router.refresh()
    }
  }, [resolveId, resolveNotes, router])

  return (
    <div>
      <PageHeader
        title="Maintenance Requests"
        description="Track and resolve maintenance issues in your PG."
        actions={
          <Button onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : 'New Request'}
          </Button>
        }
      />

      {/* Metric cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <Card>
          <CardBody>
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Open</p>
            <p className="mt-1 text-2xl font-bold text-slate-700"><CountUp end={counts.open} /></p>
            <p className="mt-1 text-xs text-gray-500">Requires attention</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">In Progress</p>
            <p className="mt-1 text-2xl font-bold text-amber-600"><CountUp end={counts.inProgress} /></p>
            <p className="mt-1 text-xs text-gray-500">Being worked on</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Resolved This Month</p>
            <p className="mt-1 text-2xl font-bold text-green-600"><CountUp end={counts.resolvedThisMonth} /></p>
            <p className="mt-1 text-xs text-gray-500">Closed this month</p>
          </CardBody>
        </Card>
      </div>

      {/* New request form */}
      {showForm && (
        <Card className="mb-6 border-amber-200">
          <CardBody>
            <h3 className="mb-4 text-sm font-semibold text-gray-900">New Maintenance Request</h3>
            {error && <p className="mb-3 text-sm text-red-600">{error}</p>}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium text-gray-700">Title</label>
                <input type="text" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500" />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium text-gray-700">Description</label>
                <textarea rows={3} required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Category</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500">
                  <option value="electrical">Electrical</option>
                  <option value="plumbing">Plumbing</option>
                  <option value="cleaning">Cleaning</option>
                  <option value="furniture">Furniture</option>
                  <option value="internet">Internet</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Priority</label>
                <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Assigned To</label>
                <input type="text" value={form.assigned_to} onChange={(e) => setForm({ ...form, assigned_to: e.target.value })}
                  placeholder="e.g. Electrician"
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Resident</label>
                <select value={form.resident_id} onChange={(e) => setForm({ ...form, resident_id: e.target.value })}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500">
                  <option value="">— Optional —</option>
                  {residents.filter((r) => r.status === 'active' || r.status === 'notice_period').map((r) => (
                    <option key={r.id} value={r.id}>{r.full_name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Room</label>
                <select value={form.room_id} onChange={(e) => setForm({ ...form, room_id: e.target.value })}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500">
                  <option value="">— Optional —</option>
                  {rooms.filter((r) => !r.deleted_at).map((r) => (
                    <option key={r.id} value={r.id}>Room {r.room_number}{r.floor ? ` (Floor ${r.floor})` : ''}</option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <Button onClick={handleCreate} loading={loading}>Create Request</Button>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Resolve modal */}
      {resolveId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <Card className="w-full max-w-md">
            <CardBody>
              <h3 className="mb-3 text-sm font-semibold text-gray-900">Resolve Request</h3>
              <label className="mb-1 block text-sm font-medium text-gray-700">Resolution Notes</label>
              <textarea rows={3} value={resolveNotes} onChange={(e) => setResolveNotes(e.target.value)}
                placeholder="What was done to fix the issue?"
                className="mb-4 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500" />
              <div className="flex gap-3">
                <Button onClick={submitResolve} loading={loading}>Confirm Resolve</Button>
                <Button variant="outline" onClick={() => setResolveId(null)}>Cancel</Button>
              </div>
            </CardBody>
          </Card>
        </div>
      )}

      {/* Requests list */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Title</th>
              <th className="hidden px-4 py-3 text-left font-medium text-gray-500 sm:table-cell">Category</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Priority</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Status</th>
              <th className="hidden px-4 py-3 text-left font-medium text-gray-500 lg:table-cell">Assigned To</th>
              <th className="hidden px-4 py-3 text-left font-medium text-gray-500 md:table-cell">Date</th>
              <th className="px-4 py-3 text-right font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {requests.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-gray-400">
                  No maintenance requests yet.
                </td>
              </tr>
            ) : (
              requests.map((req) => (
                <tr key={req.id} className="hover:bg-gray-50">
                  <td className="max-w-[200px] px-4 py-3">
                    <p className="truncate font-medium text-gray-900">{req.title}</p>
                    <p className="hidden truncate text-xs text-gray-500 sm:line-clamp-1">{req.description}</p>
                  </td>
                  <td className="hidden px-4 py-3 text-gray-600 sm:table-cell">
                    {categoryLabel[req.category] ?? req.category}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${priorityColor[req.priority]}`}>
                      {req.priority.charAt(0).toUpperCase() + req.priority.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor[req.status]}`}>
                      {statusLabel[req.status]}
                    </span>
                  </td>
                  <td className="hidden px-4 py-3 text-gray-600 lg:table-cell">
                    {req.assigned_to || <span className="text-gray-400">—</span>}
                  </td>
                  <td className="hidden px-4 py-3 text-xs text-gray-500 md:table-cell">
                    {formatDate(req.created_at)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {req.status === 'open' && (
                      <button
                        onClick={() => handleStartWork(req.id)}
                        className="rounded px-2.5 py-1 text-xs font-medium text-amber-700 hover:bg-amber-50"
                      >
                        Start Work
                      </button>
                    )}
                    {req.status === 'in_progress' && (
                      <button
                        onClick={() => handleResolve(req.id)}
                        className="rounded px-2.5 py-1 text-xs font-medium text-green-700 hover:bg-green-50"
                      >
                        Resolve
                      </button>
                    )}
                    {req.status === 'resolved' && (
                      <span className="text-xs text-gray-400">
                        {req.resolved_at ? formatDate(req.resolved_at) : 'Done'}
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
