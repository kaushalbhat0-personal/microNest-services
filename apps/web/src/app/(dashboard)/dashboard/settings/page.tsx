import type { Metadata } from 'next'
import Link from 'next/link'
import { Card, CardBody } from '@micronest/ui'
import { createServerClient } from '@micronest/auth'
import { getUserOrganizations, getOrganizationEcosystems } from '@micronest/db'
import { signout } from '@/lib/auth/actions'
import { LogoutForm } from './logout-form'

export const metadata: Metadata = {
  title: 'Settings',
}

export default async function SettingsPage() {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  let org: { id: string; name: string; slug: string } | null = null
  let ecosystems: { id: string; slug: string; name: string }[] = []

  if (user) {
    const orgs = await getUserOrganizations(supabase, user.id)
    if (orgs.length > 0) {
      org = { id: orgs[0].id, name: orgs[0].name, slug: orgs[0].slug }
      const activated = await getOrganizationEcosystems(supabase, org.id)
      ecosystems = activated.map((e) => ({
        id: e.id,
        slug: e.slug,
        name: e.name,
      }))
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-gray-600">
          Manage your organization and account.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Organization */}
        <Card>
          <CardBody>
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Organization
            </h2>
            {org ? (
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-500">Name</dt>
                  <dd className="font-medium text-gray-900">{org.name}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Slug</dt>
                  <dd className="font-medium text-gray-900">{org.slug}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">ID</dt>
                  <dd className="font-mono text-xs text-gray-500">{org.id}</dd>
                </div>
              </dl>
            ) : (
              <p className="text-sm text-gray-500">
                No organization found.{' '}
                <Link href="/onboarding" className="text-indigo-600 hover:underline">
                  Create one
                </Link>
              </p>
            )}
          </CardBody>
        </Card>

        {/* Account */}
        <Card>
          <CardBody>
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Account
            </h2>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-500">Email</dt>
                <dd className="font-medium text-gray-900">
                  {user?.email ?? '—'}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">User ID</dt>
                <dd className="font-mono text-xs text-gray-500">
                  {user?.id ?? '—'}
                </dd>
              </div>
            </dl>

            <div className="mt-6 border-t border-gray-100 pt-4">
              <LogoutForm />
            </div>
          </CardBody>
        </Card>

        {/* Activated Ecosystems */}
        <Card className="lg:col-span-2">
          <CardBody>
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Activated Ecosystems
            </h2>
            {ecosystems.length === 0 ? (
              <p className="text-sm text-gray-500">
                No ecosystems activated yet.{' '}
                <Link
                  href="/onboarding"
                  className="text-indigo-600 hover:underline"
                >
                  Activate one
                </Link>
              </p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {ecosystems.map((eco) => {
                  const href =
                    eco.slug === 'staynest'
                      ? '/dashboard/staynest'
                      : eco.slug === 'clinicnest'
                        ? '/dashboard/clinicnest'
                        : null
                  return (
                    <div
                      key={eco.id}
                      className="rounded-lg border border-gray-200 bg-gray-50 p-3"
                    >
                      <p className="text-sm font-medium text-gray-900">
                        {eco.name}
                      </p>
                      <p className="text-xs text-gray-500">{eco.slug}</p>
                      {href && (
                        <Link
                          href={href}
                          className="mt-1 inline-block text-xs font-medium text-indigo-600 hover:text-indigo-500"
                        >
                          Open &rarr;
                        </Link>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
