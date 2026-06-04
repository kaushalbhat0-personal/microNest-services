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
import type { Prescription, PrescriptionStatus } from '@/lib/clinicnest/data'
import { PRESCRIPTION_PLACEHOLDERS } from '@/lib/clinicnest/data'

const statusVariant: Record<PrescriptionStatus, 'success' | 'info'> = {
  active: 'info',
  completed: 'success',
}

const statusLabel: Record<PrescriptionStatus, string> = {
  active: 'Active',
  completed: 'Completed',
}

const emptyForm = {
  patientName: '',
  medication: '',
  dosage: '',
  prescribedBy: '',
}

export default function PrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(
    PRESCRIPTION_PLACEHOLDERS
  )
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)

  function handleAdd() {
    if (!form.patientName || !form.medication || !form.dosage) return

    const newRx: Prescription = {
      id: `rx${Date.now()}`,
      patientName: form.patientName,
      medication: form.medication,
      dosage: form.dosage,
      prescribedBy: form.prescribedBy,
      date: new Date().toISOString().slice(0, 10),
      status: 'active',
    }

    setPrescriptions([newRx, ...prescriptions])
    setForm(emptyForm)
    setShowForm(false)
  }

  function handleComplete(id: string) {
    setPrescriptions(
      prescriptions.map((r) =>
        r.id === id ? { ...r, status: 'completed' as const } : r
      )
    )
  }

  const columns: Column<Prescription>[] = [
    { header: 'Patient', accessor: (r) => r.patientName },
    { header: 'Medication', accessor: (r) => r.medication },
    { header: 'Dosage', accessor: (r) => r.dosage },
    {
      header: 'Prescribed By',
      accessor: (r) => (
        <span className="text-xs text-gray-500">{r.prescribedBy}</span>
      ),
    },
    {
      header: 'Date',
      accessor: (r) => (
        <span className="text-xs text-gray-500">{r.date}</span>
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
        r.status === 'active' ? (
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleComplete(r.id)}
          >
            Complete
          </Button>
        ) : null,
    },
  ]

  return (
    <div>
      <PageHeader
        title="Prescriptions"
        description="Track medications prescribed to patients."
        actions={
          <Button onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : 'New Prescription'}
          </Button>
        }
      />

      {showForm && (
        <Card className="mb-6 border-teal-200">
          <CardBody>
            <h3 className="mb-4 text-sm font-semibold text-gray-900">
              New Prescription
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
                  Medication
                </label>
                <input
                  type="text"
                  value={form.medication}
                  onChange={(e) =>
                    setForm({ ...form, medication: e.target.value })
                  }
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Dosage
                </label>
                <input
                  type="text"
                  value={form.dosage}
                  onChange={(e) =>
                    setForm({ ...form, dosage: e.target.value })
                  }
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Prescribed By
                </label>
                <input
                  type="text"
                  value={form.prescribedBy}
                  onChange={(e) =>
                    setForm({ ...form, prescribedBy: e.target.value })
                  }
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
              <Button onClick={handleAdd}>Prescribe</Button>
            </div>
          </CardBody>
        </Card>
      )}

      {prescriptions.length === 0 ? (
        <EmptyState
          title="No prescriptions"
          description="Create your first prescription."
          action={{
            label: 'New Prescription',
            onClick: () => setShowForm(true),
          }}
        />
      ) : (
        <Table
          columns={columns}
          data={prescriptions}
          keyExtractor={(r) => r.id}
        />
      )}
    </div>
  )
}
