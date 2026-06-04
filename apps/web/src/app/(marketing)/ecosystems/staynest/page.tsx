import Link from 'next/link'
import type { Metadata } from 'next'
import { Button, Section, Card, CardBody, Badge } from '@micronest/ui'

export const metadata: Metadata = {
  title: 'StayNest — PG & Hostel Management',
  description:
    'Manage your PG accommodation or hostel with StayNest. Visitor logs, complaint tracking, rent reminders, and more.',
}

const features = [
  {
    title: 'Visitor Log',
    description:
      'Track every person who enters your property. Digital check-in/check-out with timestamps and purpose logging.',
    href: '/dashboard/staynest/visitors',
  },
  {
    title: 'Complaint Tracker',
    description:
      'Tenants can raise issues, and you can track resolution from open to done. Priority tagging keeps urgent items visible.',
    href: '/dashboard/staynest/complaints',
  },
  {
    title: 'Rent Reminder',
    description:
      'Never miss a payment. View who has paid, who is pending, and who is overdue — all in one place.',
    href: '/dashboard/staynest/rent-reminder',
  },
]

export default function StayNestLandingPage() {
  return (
    <>
      <Section background="indigo" className="text-center">
        <div className="mx-auto inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm text-indigo-100">
          <span className="flex h-5 w-5 items-center justify-center rounded bg-amber-500 text-[10px] font-bold text-white">
            S
          </span>
          StayNest Ecosystem
        </div>
        <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          Your PG or hostel,
          <br />
          <span className="text-amber-300">digitally managed</span>.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-indigo-100">
          StayNest gives you a simple dashboard to log visitors, track
          complaints, and manage rent — so you can focus on running your
          property.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <Link href="/signup">
            <Button className="bg-white text-indigo-700 hover:bg-indigo-50" size="lg">
              Start free
            </Button>
          </Link>
          <Link href="#features">
            <Button variant="secondary" size="lg">
              See features
            </Button>
          </Link>
        </div>
      </Section>

      <Section id="features">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need, nothing you don&apos;t
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Three essential tools purpose-built for PG and hostel management.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} padding="lg" className="flex flex-col">
              <CardBody className="flex flex-1 flex-col">
                <Badge variant="indigo">{feature.title}</Badge>
                <p className="mt-4 flex-1 text-sm text-gray-600">
                  {feature.description}
                </p>
                <div className="mt-6">
                  <Link href={feature.href}>
                    <Button variant="outline" size="sm">
                      Learn more
                    </Button>
                  </Link>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </Section>

      <Section background="gray" className="text-center">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Ready to simplify your property management?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-gray-600">
          Create your MicroNest account and activate StayNest in minutes.
        </p>
        <div className="mt-8">
          <Link href="/signup">
            <Button size="lg">Get started with StayNest</Button>
          </Link>
        </div>
      </Section>
    </>
  )
}
