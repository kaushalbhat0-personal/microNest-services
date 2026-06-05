import type { Metadata } from 'next'
import Link from 'next/link'
import { Card, CardBody, Badge } from '@micronest/ui'
import { createServerClient } from '@micronest/auth'
import { getUserOrganizations, getOrganizationEcosystems, getAvailableEcosystems } from '@micronest/db'

export const metadata: Metadata = {
  title: 'Ecosystems',
}

export default async function EcosystemsPage() {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  let activatedSlugs: string[] = []
  let activatedEcosystems: { id: string; slug: string; name: string; description: string | null }[] = []
  let availableEcosystems: { id: string; slug: string; name: string; description: string | null }[] = []

  if (user) {
    const orgs = await getUserOrganizations(supabase, user.id)
    if (orgs.length > 0) {
      const orgId = orgs[0].id
      const activated = await getOrganizationEcosystems(supabase, orgId)
      activatedEcosystems = activated.map((e) => ({
        id: e.id,
        slug: e.slug,
        name: e.name,
        description: e.description,
      }))
      activatedSlugs = activated.map((e) => e.slug)

      const allEcosystems = await getAvailableEcosystems(supabase)
      availableEcosystems = allEcosystems.filter(
        (e) => !activatedSlugs.includes(e.slug)
      )
    }
  }

  const ecosystemHref: Record<string, string> = {
    staynest: '/dashboard/staynest',
    clinicnest: '/dashboard/clinicnest',
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Ecosystems</h1>
        <p className="mt-1 text-gray-600">
          Manage your activated ecosystems and explore new ones.
        </p>
      </div>

      {/* Activated ecosystems */}
      <div className="mb-8">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Active Ecosystems
        </h2>
        {activatedEcosystems.length === 0 ? (
          <Card>
            <CardBody className="text-center text-gray-500">
              <p className="text-sm">No ecosystems activated yet.</p>
            </CardBody>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {activatedEcosystems.map((eco) => {
              const href = ecosystemHref[eco.slug]
              return (
                <Card key={eco.slug} className={href ? 'transition-shadow hover:shadow-md' : ''}>
                  <CardBody>
                    <div className="mb-2 flex items-center gap-2">
                      <span className="inline-flex h-2 w-2 rounded-full bg-green-500" />
                      <Badge variant="indigo">{eco.name}</Badge>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">
                      {eco.description}
                    </p>
                    {href ? (
                      <Link
                        href={href}
                        className="mt-3 inline-block text-sm font-medium text-indigo-600 hover:text-indigo-500"
                      >
                        Open dashboard &rarr;
                      </Link>
                    ) : (
                      <p className="mt-3 text-sm text-gray-400">
                        Dashboard coming soon
                      </p>
                    )}
                  </CardBody>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      {/* Available ecosystems */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Available Ecosystems
        </h2>
        {availableEcosystems.length === 0 ? (
          <Card>
            <CardBody className="text-center text-gray-500">
              <p className="text-sm">All ecosystems are already activated.</p>
            </CardBody>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {availableEcosystems.map((eco) => (
              <Card key={eco.slug} className="opacity-75">
                <CardBody>
                  <div className="mb-2 flex items-center gap-2">
                    <span className="inline-flex h-2 w-2 rounded-full bg-gray-300" />
                    <Badge variant="default">{eco.name}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-gray-600">
                    {eco.description}
                  </p>
                  <p className="mt-3 text-sm text-gray-400">
                    Contact support to activate
                  </p>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
