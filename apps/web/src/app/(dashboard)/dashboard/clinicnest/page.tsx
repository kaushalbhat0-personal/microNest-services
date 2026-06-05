import type { Metadata } from 'next'
import Link from 'next/link'
import { Card, CardBody, StatusBadge, CountUp, FadeIn } from '@micronest/ui'
import {
  CLINIC_STATS,
  APPOINTMENT_PLACEHOLDERS,
} from '@/lib/clinicnest/data'

export const metadata: Metadata = {
  title: 'ClinicNest',
}

const statusVariant = {
  scheduled: 'info' as const,
  'in-progress': 'warning' as const,
  completed: 'success' as const,
  cancelled: 'danger' as const,
}

const statusLabel = {
  scheduled: 'Scheduled',
  'in-progress': 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
}

export default function ClinicNestOverviewPage() {
  const todayApps = APPOINTMENT_PLACEHOLDERS.filter(
    (a) => a.date === '2026-06-05'
  ).slice(0, 4)

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">
          ClinicNest Overview
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          At a glance view of your clinic.
        </p>
      </div>

      <FadeIn>
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardBody>
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
              Today&apos;s Appointments
            </p>
            <p className="mt-1 text-2xl font-bold text-gray-900">
              <CountUp end={CLINIC_STATS.todayAppointments} />
            </p>
            <p className="mt-1 text-xs text-gray-500">
              <CountUp end={CLINIC_STATS.completedToday} /> completed so far
            </p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
              Total Patients
            </p>
            <p className="mt-1 text-2xl font-bold text-teal-600">
              <CountUp end={CLINIC_STATS.totalPatients} />
            </p>
            <p className="mt-1 text-xs text-gray-500">Registered</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
              Active Prescriptions
            </p>
            <p className="mt-1 text-2xl font-bold text-amber-600">
              <CountUp end={CLINIC_STATS.activePrescriptions} />
            </p>
            <p className="mt-1 text-xs text-gray-500">In progress</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
              Doctors on Duty
            </p>
            <p className="mt-1 text-2xl font-bold text-blue-600">
              <CountUp end={CLINIC_STATS.doctorsOnDuty} />
            </p>
            <p className="mt-1 text-xs text-gray-500">Today</p>
          </CardBody>
        </Card>
      </div>
      </FadeIn>

      <FadeIn delay={50}>
      <Card padding="none">
        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
          <h3 className="text-sm font-semibold text-gray-900">
            Today&apos;s Appointments
          </h3>
          <Link
            href="/dashboard/clinicnest/appointments"
            className="text-xs font-medium text-teal-600 hover:text-teal-500"
          >
            View all
          </Link>
        </div>
        <div className="divide-y divide-gray-100">
          {todayApps.map((appt) => (
            <div
              key={appt.id}
              className="flex items-center justify-between px-4 py-3"
            >
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {appt.patientName}
                </p>
                <p className="text-xs text-gray-500">
                  {appt.time} &middot; {appt.doctorName} &middot;{' '}
                  {appt.reason}
                </p>
              </div>
              <StatusBadge variant={statusVariant[appt.status]}>
                {statusLabel[appt.status]}
              </StatusBadge>
            </div>
          ))}
        </div>
      </Card>
      </FadeIn>

      <FadeIn delay={100}>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/dashboard/clinicnest/appointments"
          className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
        >
          ← Manage appointments
        </Link>
        <Link
          href="/dashboard/clinicnest/patients"
          className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
        >
          ← View patients
        </Link>
        <Link
          href="/dashboard/clinicnest/prescriptions"
          className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
        >
          ← Check prescriptions
        </Link>
      </div>
      </FadeIn>
    </div>
  )
}
