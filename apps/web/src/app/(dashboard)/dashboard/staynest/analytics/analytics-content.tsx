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

// ── Lightweight SVG Bar ─────────────────────────────────────────────────

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

// ── Metric Card ─────────────────────────────────────────────────────────

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

  const { occupancy, revenue, residents, maintenance, visitors, revenueTrend, occupancyTrend } = analytics

  return (
    <div>
      <PageHeader
        title="Analytics"
        description="Key metrics and trends across your property."
      />

      {/* ── Occupancy ── */}
      <FadeIn>
        <h3 className="mb-3 text-sm font-semibold text-gray-900">Occupancy</h3>
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard label="Total Rooms" value={occupancy.total_rooms} />
          <MetricCard label="Occupied Beds" value={occupancy.occupied_beds} color="text-green-600" />
          <MetricCard label="Vacant Beds" value={occupancy.vacant_beds} color="text-amber-600" />
          <MetricCard label="Occupancy Rate" value={`${occupancy.occupancy_percentage}%`} sub={`${occupancy.occupied_beds}/${occupancy.total_capacity} beds`} color="text-blue-600" />
        </div>
      </FadeIn>

      {/* ── Charts Row 1: Revenue Trend + Occupancy ── */}
      <FadeIn delay={50}>
        <div className="mb-6 grid gap-6 lg:grid-cols-2">
          <Card>
            <CardBody>
              <h4 className="mb-3 text-sm font-semibold text-gray-900">Revenue Trend</h4>
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
        </div>
      </FadeIn>

      {/* ── Revenue ── */}
      <FadeIn delay={100}>
        <h3 className="mb-3 text-sm font-semibold text-gray-900">Revenue</h3>
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard label="Expected" value={formatCurrency(revenue.expected_revenue)} color="text-gray-900" />
          <MetricCard label="Collected" value={formatCurrency(revenue.collected_revenue)} color="text-green-600" />
          <MetricCard label="Pending" value={formatCurrency(revenue.pending_revenue)} color="text-amber-600" />
          <MetricCard label="Overdue" value={formatCurrency(revenue.overdue_revenue)} color="text-red-600" />
        </div>
      </FadeIn>

      {/* ── Residents ── */}
      <FadeIn delay={150}>
        <h3 className="mb-3 text-sm font-semibold text-gray-900">Residents</h3>
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard label="Active" value={residents.active} color="text-green-600" />
          <MetricCard label="Notice Period" value={residents.notice_period} color="text-amber-600" />
          <MetricCard label="Checked Out" value={residents.checked_out} color="text-gray-500" />
          <MetricCard label="Total" value={residents.total} color="text-blue-600" />
        </div>
      </FadeIn>

      {/* ── Maintenance ── */}
      <FadeIn delay={200}>
        <h3 className="mb-3 text-sm font-semibold text-gray-900">Maintenance</h3>
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard label="Open" value={maintenance.open} color="text-red-600" />
          <MetricCard label="Assigned" value={maintenance.assigned} color="text-amber-600" />
          <MetricCard label="In Progress" value={maintenance.in_progress} color="text-blue-600" />
          <MetricCard label="Resolved" value={maintenance.resolved} color="text-green-600" />
        </div>
      </FadeIn>

      {/* ── Visitors ── */}
      <FadeIn delay={250}>
        <h3 className="mb-3 text-sm font-semibold text-gray-900">Visitors</h3>
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard label="Today" value={visitors.today} color="text-blue-600" />
          <MetricCard label="This Week" value={visitors.week} color="text-indigo-600" />
          <MetricCard label="This Month" value={visitors.month} color="text-purple-600" />
          <MetricCard label="All Time" value={visitors.total} color="text-gray-900" />
        </div>
      </FadeIn>
    </div>
  )
}
