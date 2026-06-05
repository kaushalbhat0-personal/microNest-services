'use client'

import { useState, useCallback } from 'react'
import {
  PageHeader,
  Card,
  CardBody,
  Button,
} from '@micronest/ui'
import { exportCSV } from '@/lib/staynest/export-actions'

const sections = [
  { key: 'residents' as const, label: 'Residents', desc: 'All active residents with contact and ID proof details' },
  { key: 'rent' as const, label: 'Rent Records', desc: 'All rent records with payment status and amounts' },
  { key: 'maintenance' as const, label: 'Maintenance Requests', desc: 'All maintenance requests with status and assignments' },
  { key: 'visitors' as const, label: 'Visitors', desc: 'All visitor log entries with check-in/out times' },
]

export function ExportContent() {
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleExport = useCallback(async (key: typeof sections[number]['key']) => {
    setLoading(key)
    setError(null)

    const result = await exportCSV(key)
    if (result?.error) {
      setError(result.error)
      setLoading(null)
      return
    }

    if (result?.csv) {
      const blob = new Blob([result.csv], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `staynest-${key}-${new Date().toISOString().slice(0, 10)}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }

    setLoading(null)
  }, [])

  return (
    <div>
      <PageHeader
        title="Export Data"
        description="Download your data as CSV files."
      />

      <div className="grid gap-4 sm:grid-cols-2">
        {sections.map((s) => (
          <Card key={s.key}>
            <CardBody>
              <h3 className="text-sm font-semibold text-gray-900">{s.label}</h3>
              <p className="mt-1 text-xs text-gray-500">{s.desc}</p>
              <div className="mt-4">
                <Button
                  loading={loading === s.key}
                  onClick={() => handleExport(s.key)}
                >
                  Export CSV
                </Button>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {error && (
        <p className="mt-4 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}
