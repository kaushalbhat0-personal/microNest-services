import type { Metadata } from 'next'
import Link from 'next/link'
import { Card, CardBody, Badge } from '@micronest/ui'
import { createServerClient } from '@micronest/auth'
import { getUserOrganizations, getOrganizationEcosystems } from '@micronest/db'

export const metadata: Metadata = {
  title: 'Dashboard',
}

const ecosystemHref: Record<string, string> = {
  staynest: '/dashboard/staynest',
  clinicnest: '/dashboard/clinicnest',
  freelancenest: '/dashboard/freelancenest',
  propertynest: '/dashboard/propertynest',
}

export default async function DashboardPage() {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  let activatedEcosystems: { id: string; slug: string; name: string; description: string; tagline: string }[] = []

  if (user) {
    const orgs = await getUserOrganizations(supabase, user.id)
    if (orgs.length > 0) {
      const orgEcosystems = await getOrganizationEcosystems(supabase, orgs[0].id)
      activatedEcosystems = orgEcosystems.map((e) => ({
        id: e.id,
        slug: e.slug,
        name: e.name,
        description: e.description ?? '',
        tagline: e.name,
      }))
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-gray-600">
          Welcome to MicroNest. Select an ecosystem to get started.
        </p>
      </div>

      {activatedEcosystems.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {activatedEcosystems.map((ecosystem) => (
              <Link
              key={ecosystem.id}
              href={ecosystemHref[ecosystem.slug] ?? `/dashboard/${ecosystem.slug}`}
            >
              <Card className="h-full transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] hover:shadow-md">
                <CardBody>
                  <Badge variant="indigo">{ecosystem.name}</Badge>
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
      ) : (
        <Card className="mt-8">
          <CardBody className="text-center text-gray-500">
            <p className="text-sm">
              No ecosystems activated yet. Activate an ecosystem to get started.
            </p>
          </CardBody>
        </Card>
      )}
    </div>
  )
}
