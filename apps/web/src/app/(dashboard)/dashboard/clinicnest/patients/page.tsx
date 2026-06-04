'use client'

import { useState } from 'react'
import {
  PageHeader,
  Table,
  EmptyState,
  Button,
  Card,
  CardBody,
} from '@micronest/ui'
import type { Column } from '@micronest/ui'
import type { Patient } from '@/lib/clinicnest/data'
import { PATIENT_PLACEHOLDERS } from '@/lib/clinicnest/data'

const emptyForm = {
  name: '',
  phone: '',
  age: '' as string,
  gender: 'Male' as string,
  condition: '',
}

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>(PATIENT_PLACEHOLDERS)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)

  function handleAdd() {
    if (!form.name || !form.phone || !form.age) return

    const newPatient: Patient = {
      id: `p${Date.now()}`,
      name: form.name,
      phone: form.phone,
      age: parseInt(form.age, 10),
      gender: form.gender,
      lastVisit: new Date().toISOString().slice(0, 10),
      condition: form.condition,
    }

    setPatients([newPatient, ...patients])
    setForm(emptyForm)
    setShowForm(false)
  }

  const columns: Column<Patient>[] = [
    { header: 'Name', accessor: (p) => p.name },
    { header: 'Phone', accessor: (p) => p.phone },
    { header: 'Age', accessor: (p) => p.age },
    { header: 'Gender', accessor: (p) => p.gender },
    {
      header: 'Last Visit',
      accessor: (p) => (
        <span className="text-xs text-gray-500">
          {p.lastVisit ?? 'Never'}
        </span>
      ),
    },
    { header: 'Condition', accessor: (p) => p.condition },
  ]

  return (
    <div>
      <PageHeader
        title="Patient Records"
        description="View and manage registered patients."
        actions={
          <Button onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : 'Add Patient'}
          </Button>
        }
      />

      {showForm && (
        <Card className="mb-6 border-teal-200">
          <CardBody>
            <h3 className="mb-4 text-sm font-semibold text-gray-900">
              New Patient
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
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
                  Age
                </label>
                <input
                  type="number"
                  value={form.age}
                  onChange={(e) => setForm({ ...form, age: e.target.value })}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Gender
                </label>
                <select
                  value={form.gender}
                  onChange={(e) => setForm({ ...form, gender: e.target.value })}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                >
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Condition / Notes
                </label>
                <input
                  type="text"
                  value={form.condition}
                  onChange={(e) =>
                    setForm({ ...form, condition: e.target.value })
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
              <Button onClick={handleAdd}>Add Patient</Button>
            </div>
          </CardBody>
        </Card>
      )}

      {patients.length === 0 ? (
        <EmptyState
          title="No patients registered"
          description="Add your first patient to get started."
          action={{
            label: 'Add Patient',
            onClick: () => setShowForm(true),
          }}
        />
      ) : (
        <Table
          columns={columns}
          data={patients}
          keyExtractor={(p) => p.id}
        />
      )}
    </div>
  )
}
