import Link from 'next/link'
import { Button, Section, EcosystemCard } from '@micronest/ui'
import { EXPLORER_ECOSYSTEMS } from '@/lib/marketing/ecosystems'

export default function HomePage() {
  return (
    <>
      <Section background="indigo" className="text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          Your platform. Your ecosystems.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-indigo-100">
          MicroNest is a unified platform for niche businesses. One login. One
          dashboard. Multiple ecosystems tailored to your industry.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <Link href="/ecosystems">
            <Button variant="secondary" size="lg">
              Explore ecosystems
            </Button>
          </Link>
          <Link href="/signup">
            <Button
              size="lg"
              className="bg-white text-indigo-700 hover:bg-indigo-50"
            >
              Get started
            </Button>
          </Link>
        </div>
      </Section>

      <Section>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Explore our ecosystems
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Each ecosystem is purpose-built for a specific industry. Pick yours
            and hit the ground running.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {EXPLORER_ECOSYSTEMS.map((ecosystem) => (
            <EcosystemCard key={ecosystem.id} {...ecosystem} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/ecosystems">
            <Button variant="outline">
              View all ecosystems &rarr;
            </Button>
          </Link>
        </div>
      </Section>

      <Section background="gray" className="text-center">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Ready to get started?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-gray-600">
          Create your account and unlock access to all ecosystems.
        </p>
        <div className="mt-8">
          <Link href="/signup">
            <Button size="lg">Create your account</Button>
          </Link>
        </div>
      </Section>
    </>
  )
}
