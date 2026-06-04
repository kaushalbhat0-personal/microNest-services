import type { Metadata } from 'next'
import Link from 'next/link'
import { Card, CardBody, Badge } from '@micronest/ui'
import { ECOSYSTEMS } from '@micronest/config'

export const metadata: Metadata = {
  title: 'Dashboard',
}

const ecosystemHref: Record<string, string> = {
  staynest: '/dashboard/staynest',
  clinicnest: '/dashboard/clinicnest',
}

export default function DashboardPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-gray-600">
          Welcome to MicroNest. Select an ecosystem to get started.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {ECOSYSTEMS.map((ecosystem) => (
          <Link
            key={ecosystem.id}
            href={ecosystemHref[ecosystem.id] ?? ecosystem.href}
          >
            <Card className="h-full transition-shadow hover:shadow-md">
              <CardBody>
                <Badge variant="indigo">{ecosystem.tagline}</Badge>
                <h2 className="mt-3 text-lg font-semibold text-gray-900">
                  {ecosystem.name}
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                  {ecosystem.description}
                </p>
              </CardBody>
            </Card>
          </Link>
        ))}
      </div>

      {/* TODO: Add ecosystem-specific dashboard widgets for activated ecosystems */}
      <Card className="mt-8">
        <CardBody className="text-center text-gray-500">
          <p className="text-sm">
            Dashboard widgets will appear here when you activate an ecosystem.
          </p>
        </CardBody>
      </Card>
    </div>
  )
}
