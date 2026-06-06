'use client'

import type { StayNestAnalytics } from '@micronest/db'
import {
  PageHeader,
  Card,
  CardBody,
  CountUp,
  FadeIn,
} from '@micronest/ui'

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

function BarChart({
  data,
  height = 160,
  color,
  labelKey,
  valueKey,
  format,
}: {
  data: { month: string; expected: number; collected: number }[] | { month: string; open: number; resolved: number }[] | { month: string; occupied: number; total: number }[]
  height?: number
  color?: string
  labelKey: string
  valueKey: string
  format?: (v: number) => string
}) {
  const values = data.map((d: any) => d[valueKey])
  const max = Math.max(...values, 1)
  const barWidth = Math.max(20, Math.min(60, 600 / data.length - 8))

  return (
    <div className="relative" style={{ height }}>
      <svg
        viewBox={`0 0 ${data.length * (barWidth + 8) + 20} ${height}`}
        className="w-full"
        preserveAspectRatio="xMidYMid meet"
      >
        {data.map((d: any, i) => {
          const barH = (d[valueKey] / max) * (height - 24)
          return (
            <g key={d.month}>
              <rect
                x={i * (barWidth + 8) + 10}
                y={height - 20 - barH}
                width={barWidth}
                height={barH}
                rx={3}
                fill={color ?? '#2563eb'}
                opacity={0.85}
              />
              <text
                x={i * (barWidth + 8) + 10 + barWidth / 2}
                y={height - 4}
                textAnchor="middle"
                fontSize={9}
                fill="#6b7280"
              >
                {d.month}
              </text>
              <text
                x={i * (barWidth + 8) + 10 + barWidth / 2}
                y={height - 24 - barH - 4}
                textAnchor="middle"
                fontSize={8}
                fill="#374151"
              >
                {format ? format(d[valueKey]) : d[valueKey]}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

function MetricCard({
  label,
  value,
  sub,
  color,
}: {
  label: string
  value: string | number
  sub?: string
  color?: string
}) {
  return (
    <Card>
      <CardBody>
        <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
          {label}
        </p>
        <p className={`mt-1 text-2xl font-bold ${color ?? 'text-gray-900'}`}>
          {typeof value === 'number' ? <CountUp end={value} /> : value}
        </p>
        {sub && <p className="mt-1 text-xs text-gray-500">{sub}</p>}
      </CardBody>
    </Card>
  )
}

export function AnalyticsContent({
  analytics,
}: {
  analytics: StayNestAnalytics | null
}) {
  if (!analytics) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-sm text-gray-500">No organization selected.</p>
      </div>
    )
  }

  const { occupancy, revenue, residents, maintenance, visitors, revenueTrend, occupancyTrend, maintenanceTrend } = analytics

  return (
    <div>
      <PageHeader
        title="Analytics"
        description="Key metrics and trends across your property."
      />

      {/* ── Occupancy ── */}
      <FadeIn>
        <h3 className="mb-3 text-sm font-semibold text-gray-900">Occupancy</h3>
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <MetricCard label="Total Beds" value={occupancy.total_capacity} sub={`${occupancy.total_rooms} rooms`} color="text-gray-900" />
          <MetricCard label="Occupied Beds" value={occupancy.occupied_beds} color="text-green-600" />
          <MetricCard label="Occupancy %" value={`${occupancy.occupancy_percentage}%`} sub={`${occupancy.vacant_beds} vacant`} color="text-blue-600" />
        </div>
      </FadeIn>

      {/* ── Charts Row: Revenue + Occupancy + Maintenance ── */}
      <FadeIn delay={50}>
        <div className="mb-6 grid gap-6 lg:grid-cols-3">
          <Card>
            <CardBody>
              <h4 className="mb-3 text-sm font-semibold text-gray-900">Monthly Collections</h4>
              <BarChart
                data={revenueTrend}
                valueKey="collected"
                labelKey="month"
                color="#059669"
                format={(v) => `₹${(v / 1000).toFixed(0)}k`}
              />
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <h4 className="mb-3 text-sm font-semibold text-gray-900">Occupancy Trend</h4>
              <BarChart
                data={occupancyTrend as any}
                valueKey="occupied"
                labelKey="month"
                color="#2563eb"
              />
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <h4 className="mb-3 text-sm font-semibold text-gray-900">Maintenance by Status</h4>
              <BarChart
                data={maintenanceTrend as any}
                valueKey="open"
                labelKey="month"
                color="#dc2626"
                format={(v) => `${v}`}
              />
              <div className="mt-2 flex items-center justify-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1"><span className="inline-block h-2.5 w-2.5 rounded bg-red-600" /> Open</span>
                <span className="flex items-center gap-1"><span className="inline-block h-2.5 w-2.5 rounded bg-green-600" /> Resolved</span>
              </div>
            </CardBody>
          </Card>
        </div>
      </FadeIn>

      {/* ── Revenue ── */}
      <FadeIn delay={100}>
        <h3 className="mb-3 text-sm font-semibold text-gray-900">Revenue</h3>
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard label="Total Rent Due" value={formatCurrency(revenue.expected_revenue)} color="text-gray-900" />
          <MetricCard label="Total Collected" value={formatCurrency(revenue.collected_revenue)} color="text-green-600" />
          <MetricCard label="Pending Rent" value={formatCurrency(revenue.pending_revenue)} color="text-amber-600" />
          <MetricCard label="Overdue Rent" value={formatCurrency(revenue.overdue_revenue)} color="text-red-600" />
        </div>
      </FadeIn>

      {/* ── Operations ── */}
      <FadeIn delay={150}>
        <h3 className="mb-3 text-sm font-semibold text-gray-900">Operations</h3>
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <MetricCard label="Active Residents" value={residents.active} color="text-green-600" />
          <MetricCard label="Open Maintenance" value={maintenance.open} color="text-amber-600" />
          <MetricCard label="Visitors Today" value={visitors.today} color="text-blue-600" />
        </div>
      </FadeIn>
    </div>
  )
}
