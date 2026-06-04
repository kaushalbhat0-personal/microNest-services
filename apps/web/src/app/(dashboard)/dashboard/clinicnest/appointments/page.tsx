'use client'

import { useState } from 'react'
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
import type { Appointment, AppointmentStatus } from '@/lib/clinicnest/data'
import { APPOINTMENT_PLACEHOLDERS } from '@/lib/clinicnest/data'

const statusVariant: Record<AppointmentStatus, 'info' | 'warning' | 'success' | 'danger'> = {
  scheduled: 'info',
  'in-progress': 'warning',
  completed: 'success',
  cancelled: 'danger',
}

const statusLabel: Record<AppointmentStatus, string> = {
  scheduled: 'Scheduled',
  'in-progress': 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
}

const emptyForm = {
  patientName: '',
  phone: '',
  reason: '',
  doctorName: '',
  date: '',
  time: '',
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>(
    APPOINTMENT_PLACEHOLDERS
  )
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)

  function handleAdd() {
    if (!form.patientName || !form.phone || !form.date || !form.time) return

    const newAppt: Appointment = {
      id: `a${Date.now()}`,
      patientName: form.patientName,
      phone: form.phone,
      reason: form.reason,
      doctorName: form.doctorName,
      date: form.date,
      time: form.time,
      status: 'scheduled',
    }

    setAppointments([...appointments, newAppt])
    setForm(emptyForm)
    setShowForm(false)
  }

  function handleStatus(id: string, status: AppointmentStatus) {
    setAppointments(
      appointments.map((a) => (a.id === id ? { ...a, status } : a))
    )
  }

  function renderActions(a: Appointment) {
    if (a.status === 'completed' || a.status === 'cancelled') return null
    return (
      <div className="flex gap-2">
        {a.status === 'scheduled' && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleStatus(a.id, 'in-progress')}
          >
            Start
          </Button>
        )}
        {a.status === 'in-progress' && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleStatus(a.id, 'completed')}
          >
            Complete
          </Button>
        )}
        <Button
          size="sm"
          variant="ghost"
          onClick={() => handleStatus(a.id, 'cancelled')}
        >
          Cancel
        </Button>
      </div>
    )
  }

  const columns: Column<Appointment>[] = [
    { header: 'Patient', accessor: (a) => a.patientName },
    { header: 'Phone', accessor: (a) => a.phone },
    { header: 'Reason', accessor: (a) => a.reason },
    { header: 'Doctor', accessor: (a) => a.doctorName },
    { header: 'Date', accessor: (a) => <span className="text-xs text-gray-500">{a.date}</span> },
    { header: 'Time', accessor: (a) => a.time },
    {
      header: 'Status',
      accessor: (a) => (
        <StatusBadge variant={statusVariant[a.status]}>
          {statusLabel[a.status]}
        </StatusBadge>
      ),
    },
    { header: '', accessor: (a) => renderActions(a) },
  ]

  return (
    <div>
      <PageHeader
        title="Appointments"
        description="Manage patient appointments."
        actions={
          <Button onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : 'New Appointment'}
          </Button>
        }
      />

      {showForm && (
        <Card className="mb-6 border-teal-200">
          <CardBody>
            <h3 className="mb-4 text-sm font-semibold text-gray-900">
              New Appointment
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Patient Name
                </label>
                <input
                  type="text"
                  value={form.patientName}
                  onChange={(e) =>
                    setForm({ ...form, patientName: e.target.value })
                  }
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Phone
                </label>
                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Reason
                </label>
                <input
                  type="text"
                  value={form.reason}
                  onChange={(e) => setForm({ ...form, reason: e.target.value })}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Doctor
                </label>
                <input
                  type="text"
                  value={form.doctorName}
                  onChange={(e) =>
                    setForm({ ...form, doctorName: e.target.value })
                  }
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Date
                </label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Time
                </label>
                <input
                  type="time"
                  value={form.time}
                  onChange={(e) => setForm({ ...form, time: e.target.value })}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-3">
              <Button
                variant="ghost"
                onClick={() => {
                  setShowForm(false)
                  setForm(emptyForm)
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleAdd}>Schedule</Button>
            </div>
          </CardBody>
        </Card>
      )}

      {appointments.length === 0 ? (
        <EmptyState
          title="No appointments"
          description="Schedule your first appointment."
          action={{
            label: 'New Appointment',
            onClick: () => setShowForm(true),
          }}
        />
      ) : (
        <Table
          columns={columns}
          data={appointments}
          keyExtractor={(a) => a.id}
        />
      )}
    </div>
  )
}
