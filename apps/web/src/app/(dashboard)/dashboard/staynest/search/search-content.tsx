'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import Link from 'next/link'
import { PageHeader, Card, CardBody, StatusBadge } from '@micronest/ui'
import type { GlobalSearchResult } from '@micronest/db'

const statusVariant: Record<string, 'success' | 'warning' | 'default' | 'info'> = {
  active: 'success',
  checked_out: 'default',
  'checked-in': 'info',
  'checked-out': 'default',
  open: 'warning',
  assigned: 'warning',
  in_progress: 'warning',
  resolved: 'success',
  closed: 'default',
  available: 'success',
  partially_occupied: 'warning',
  full: 'default',
  maintenance: 'warning',
}

function ResultSection({
  title,
  items,
  href,
  render,
}: {
  title: string
  items: any[]
  href?: (item: any) => string
  render: (item: any) => React.ReactNode
}) {
  if (items.length === 0) return null
  return (
    <div className="mb-6">
      <h3 className="mb-2 text-sm font-semibold text-gray-900">
        {title} ({items.length})
      </h3>
      <div className="space-y-2">
        {items.map((item: any) => (
          <Link
            key={item.id}
            href={href?.(item) ?? '#'}
            className="block rounded-lg border border-gray-200 bg-white p-3 transition-colors hover:border-amber-200 hover:bg-amber-50"
          >
            {render(item)}
          </Link>
        ))}
      </div>
    </div>
  )
}

export function SearchContent() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<GlobalSearchResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults(null)
      setSearched(false)
      return
    }

    setLoading(true)
    try {
      const res = await fetch(
        `/api/staynest/search?q=${encodeURIComponent(q)}`
      )
      if (res.ok) {
        const data = await res.json()
        setResults(data)
      }
    } catch {
      // fallback
    } finally {
      setLoading(false)
      setSearched(true)
    }
  }, [])

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const q = e.target.value
      setQuery(q)
      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => doSearch(q), 300)
    },
    [doSearch]
  )

  const totalResults =
    (results?.residents.length ?? 0) +
    (results?.rooms.length ?? 0) +
    (results?.maintenance.length ?? 0) +
    (results?.visitors.length ?? 0)

  return (
    <div>
      <PageHeader
        title="Search"
        description="Search across residents, rooms, maintenance, and visitors."
      />

      <div className="mb-6">
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={handleChange}
          placeholder="Search by name, phone, room, title..."
          className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-sm shadow-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
        />
      </div>

      {loading && (
        <p className="text-sm text-gray-400">Searching...</p>
      )}

      {searched && !loading && query.trim() && totalResults === 0 && (
        <Card>
          <CardBody>
            <p className="text-center text-sm text-gray-500">
              No results found for &quot;{query}&quot;
            </p>
          </CardBody>
        </Card>
      )}

      {results && (
        <div>
          {totalResults > 0 && (
            <p className="mb-4 text-xs text-gray-400">
              {totalResults} result{totalResults !== 1 ? 's' : ''} for &quot;{query}&quot;
            </p>
          )}

          <ResultSection
            title="Residents"
            items={results.residents}
            href={(r) => `/dashboard/staynest/residents`}
            render={(r) => (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{r.full_name}</p>
                  <p className="text-xs text-gray-500">{r.phone}</p>
                </div>
                <StatusBadge variant={statusVariant[r.status] ?? 'default'}>
                  {r.status}
                </StatusBadge>
              </div>
            )}
          />

          <ResultSection
            title="Rooms"
            items={results.rooms}
            href={(r) => `/dashboard/staynest/rooms`}
            render={(r) => (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">Room {r.room_number}</p>
                  {r.floor != null && <p className="text-xs text-gray-500">Floor {r.floor}</p>}
                </div>
                <StatusBadge variant={statusVariant[r.status] ?? 'default'}>
                  {r.status}
                </StatusBadge>
              </div>
            )}
          />

          <ResultSection
            title="Maintenance"
            items={results.maintenance}
            href={() => `/dashboard/staynest/maintenance`}
            render={(r) => (
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900">{r.title}</p>
                  <p className="text-xs text-gray-500">{r.priority}</p>
                </div>
                <StatusBadge variant={statusVariant[r.status] ?? 'default'}>
                  {r.status}
                </StatusBadge>
              </div>
            )}
          />

          <ResultSection
            title="Visitors"
            items={results.visitors}
            href={(r) => `/dashboard/staynest/visitors`}
            render={(r) => (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{r.name}</p>
                  <p className="text-xs text-gray-500">{r.purpose} &middot; {r.phone}</p>
                </div>
                <StatusBadge variant={statusVariant[r.status] ?? 'default'}>
                  {r.status}
                </StatusBadge>
              </div>
            )}
          />
        </div>
      )}
    </div>
  )
}
