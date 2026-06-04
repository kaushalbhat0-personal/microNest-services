import Link from 'next/link'
import type { Metadata } from 'next'
import { Button, Section, Card, CardBody, Badge } from '@micronest/ui'

export const metadata: Metadata = {
  title: 'ClinicNest — Clinic & Practice Management',
  description:
    'Manage your clinic with ClinicNest. Appointments, patient records, prescriptions, and more.',
}

const features = [
  {
    title: 'Appointments',
    description:
      'Schedule, track, and manage patient appointments. See who is in the queue and who is next.',
    href: '/dashboard/clinicnest/appointments',
  },
  {
    title: 'Patient Records',
    description:
      'Maintain a searchable directory of all your patients with visit history and contact details.',
    href: '/dashboard/clinicnest/patients',
  },
  {
    title: 'Prescriptions',
    description:
      'Log medications, track dosages, and keep a record of every prescription issued.',
    href: '/dashboard/clinicnest/prescriptions',
  },
]

export default function ClinicNestLandingPage() {
  return (
    <>
      <Section background="indigo" className="text-center">
        <div className="mx-auto inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm text-indigo-100">
          <span className="flex h-5 w-5 items-center justify-center rounded bg-teal-500 text-[10px] font-bold text-white">
            C
          </span>
          ClinicNest Ecosystem
        </div>
        <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          Your clinic,
          <br />
          <span className="text-teal-300">digitally organized</span>.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-indigo-100">
          ClinicNest gives you a simple dashboard to manage appointments,
          patient records, and prescriptions — so you can focus on care.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <Link href="/signup">
            <Button
              className="bg-white text-indigo-700 hover:bg-indigo-50"
              size="lg"
            >
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
            Built for clinics, big or small
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Three essential tools purpose-built for clinic management.
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
          Ready to organize your clinic?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-gray-600">
          Create your MicroNest account and activate ClinicNest in minutes.
        </p>
        <div className="mt-8">
          <Link href="/signup">
            <Button size="lg">Get started with ClinicNest</Button>
          </Link>
        </div>
      </Section>
    </>
  )
}
