import { TabNav } from '@micronest/ui'

const tabs = [
  { href: '/dashboard/clinicnest', label: 'Overview' },
  { href: '/dashboard/clinicnest/appointments', label: 'Appointments' },
  { href: '/dashboard/clinicnest/patients', label: 'Patients' },
  { href: '/dashboard/clinicnest/prescriptions', label: 'Prescriptions' },
]

export default function ClinicNestLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <div className="mb-6">
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-teal-600 text-xs font-bold text-white">
            C
          </div>
          <h2 className="text-sm font-semibold text-gray-900">ClinicNest</h2>
        </div>
        <TabNav tabs={tabs} activeColor="teal" />
      </div>
      {children}
    </div>
  )
}
