import Link from 'next/link'
import type { Metadata } from 'next'
import { Button, Section, EcosystemCard } from '@micronest/ui'
import { EXPLORER_ECOSYSTEMS } from '@/lib/marketing/ecosystems'

export const metadata: Metadata = {
  title: 'Ecosystems',
  description: 'Explore all MicroNest ecosystems',
}

export default function EcosystemsPage() {
  const active = EXPLORER_ECOSYSTEMS.filter((e) => e.status === 'active')
  const comingSoon = EXPLORER_ECOSYSTEMS.filter(
    (e) => e.status === 'coming-soon'
  )

  return (
    <>
      <Section className="pb-0">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            Ecosystems
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Choose an ecosystem that fits your business. Each one is built from
            the ground up for its industry.
          </p>
        </div>
      </Section>

      {/* Active ecosystems */}
      <Section className="pt-12">
        <div className="mb-8 flex items-center gap-3">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-xs font-bold text-green-700">
            ✓
          </span>
          <h2 className="text-lg font-semibold text-gray-900">
            Available now
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {active.map((ecosystem) => (
            <EcosystemCard key={ecosystem.id} {...ecosystem} />
          ))}
        </div>
      </Section>

      {/* Coming soon ecosystems */}
      <Section className="pt-0">
        <div className="mb-8 flex items-center gap-3">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-500">
            *
          </span>
          <h2 className="text-lg font-semibold text-gray-900">
            Coming soon
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {comingSoon.map((ecosystem) => (
            <EcosystemCard key={ecosystem.id} {...ecosystem} />
          ))}
        </div>
      </Section>

      <Section background="gray" className="text-center">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Want early access?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-gray-600">
          Sign up today and be the first to know when new ecosystems launch.
        </p>
        <div className="mt-8">
          <Link href="/signup">
            <Button size="lg">Get notified</Button>
          </Link>
        </div>
      </Section>
    </>
  )
}
