import Link from 'next/link'
import type { Metadata } from 'next'
import { Button, Section } from '@micronest/ui'

export const metadata: Metadata = {
  title: 'FreelanceNest',
  description: 'Freelancer Management',
}

export default function FreelanceNestPage() {
  return (
    <Section>
      <div className="mx-auto max-w-3xl">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          FreelanceNest
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          For Freelancers — Project tracking, invoicing, client management, and
          portfolio tools.
        </p>

        {/* TODO: Build FreelanceNest ecosystem landing page with feature highlights, screenshots, and CTA */}
        <div className="mt-12 rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
          <p className="text-gray-500">
            FreelanceNest is under development. Features for freelancers will be
            added here.
          </p>
          <div className="mt-6">
            <Link href="/ecosystems">
              <Button variant="outline">Back to ecosystems</Button>
            </Link>
          </div>
        </div>
      </div>
    </Section>
  )
}
