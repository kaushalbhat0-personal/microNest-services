import Link from 'next/link'
import type { Metadata } from 'next'
import { Button, Section, Card, CardBody, StatusBadge } from '@micronest/ui'
import { FeedbackForm } from './feedback-form'

export const metadata: Metadata = {
  title: 'StayNest — PG & Hostel Management Software',
  description:
    'Manage your PG accommodation, hostel, or co-living space with StayNest. Visitor logs, rent tracking, complaint management, and resident management in one dashboard.',
}

const FEATURES = [
  {
    icon: '👥',
    title: 'Residents',
    desc: 'Track all residents with name, phone, room assignment, guardian info, and joining date. Know who is staying where at all times.',
    href: '/dashboard/staynest/residents',
    stats: '30+ residents',
  },
  {
    icon: '🚪',
    title: 'Rooms',
    desc: 'Manage room inventory with capacity, occupancy, rent amount, and status. Single, double, triple — any configuration.',
    href: '/dashboard/staynest/rooms',
    stats: '15 rooms',
  },
  {
    icon: '💰',
    title: 'Rent Management',
    desc: 'Track payments by month. See who has paid, who is pending, and who is overdue. Mark payments with a single click.',
    href: '/dashboard/staynest/rent',
    stats: '₹1.4L tracked',
  },
  {
    icon: '📋',
    title: 'Complaints',
    desc: 'Tenants raise issues, you track resolution. Priority tagging keeps urgent items visible until resolved.',
    href: '/dashboard/staynest/complaints',
    stats: 'Avg 2h resolution',
  },
  {
    icon: '🚶',
    title: 'Visitor Log',
    desc: 'Digital check-in/check-out with timestamps. Know who entered, when, and which room they visited.',
    href: '/dashboard/staynest/visitors',
    stats: '20+ visitors/day',
  },
  {
    icon: '📢',
    title: 'Notices',
    desc: 'Publish announcements, policy changes, and reminders. Residents see them immediately on the dashboard.',
    href: '/dashboard/staynest/notices',
    stats: 'Instant publish',
  },
]

const PROBLEMS = [
  {
    icon: '📝',
    title: 'Rent tracking on paper',
    desc: 'You chase tenants for payments. You lose track of who paid. Spreadsheets get messy.',
    solution: 'One-click payment tracking with clear paid/pending/overdue status.',
  },
  {
    icon: '🔍',
    title: 'No resident records',
    desc: 'You forget who is in which room. Guardian contacts are scattered across WhatsApp chats.',
    solution: 'Centralized resident directory with guardian info, move-in dates, and notes.',
  },
  {
    icon: '🔧',
    title: 'Lost complaints',
    desc: 'Tenants tell you about issues. You forget. They get frustrated. Problems pile up.',
    solution: 'Digital complaint tracker with priority levels and resolution workflow.',
  },
  {
    icon: '🚪',
    title: 'No visitor trail',
    desc: 'Unknown people enter your property. No record of who came or when they left.',
    solution: 'Digital visitor log with check-in/check-out timestamps and purpose tracking.',
  },
]

const PRICING_TIERS = [
  {
    name: 'Starter',
    price: 'Free',
    period: 'forever',
    desc: 'For small PGs just getting started.',
    features: ['Up to 10 residents', 'Up to 5 rooms', 'Rent tracking', 'Visitor log'],
    cta: 'Start Free',
    href: '/signup',
    highlighted: false,
  },
  {
    name: 'Growth',
    price: '₹999',
    period: '/month',
    desc: 'For growing hostels and co-living spaces.',
    features: [
      'Unlimited residents',
      'Unlimited rooms',
      'Full rent management',
      'Complaint tracker',
      'Notices & announcements',
      'All modules included',
    ],
    cta: 'Start Free Trial',
    href: '/signup',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    desc: 'For multi-property operators.',
    features: [
      'Everything in Growth',
      'Multi-property support',
      'Custom integrations',
      'Priority support',
      'Dedicated account manager',
    ],
    cta: 'Contact Sales',
    href: '#contact',
    highlighted: false,
  },
]

const FAQS = [
  {
    q: 'What is StayNest?',
    a: 'StayNest is a property management dashboard for PG accommodations, hostels, and co-living spaces. It helps you track residents, rooms, rent payments, complaints, visitors, and notices — all from one place.',
  },
  {
    q: 'Do I need technical skills to use it?',
    a: 'Not at all. StayNest is designed for property owners, not tech professionals. If you can use WhatsApp, you can use StayNest. The interface is simple, clean, and works on mobile Chrome.',
  },
  {
    q: 'Can I try it before paying?',
    a: 'Yes. Sign up for free and load demo data to see a fully populated dashboard instantly. No credit card required. You can understand the entire product within 60 seconds.',
  },
  {
    q: 'How is my data secured?',
    a: 'Every record is scoped to your organization. Row-level security ensures no one else can access your data. All connections are encrypted via HTTPS, and authentication is handled by Supabase.',
  },
  {
    q: 'Can I use it on my phone?',
    a: 'Yes. StayNest works on Android Chrome, iPhone Safari, and desktop browsers. All tables have mobile-friendly card views, and buttons are sized for touch.',
  },
  {
    q: 'What if I need help?',
    a: 'Contact us via the form below or email. We respond within 24 hours. Enterprise plans include dedicated account management.',
  },
]

export default function StayNestLandingPage() {
  return (
    <>
      {/* ──────── Hero ──────── */}
      <Section background="indigo" className="relative overflow-hidden text-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(251,191,36,0.15),transparent_50%)]" />
        <div className="relative">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm text-indigo-100">
            <span className="flex h-5 w-5 items-center justify-center rounded bg-amber-500 text-[10px] font-bold text-white">
              S
            </span>
            StayNest — For PG & Hostel Owners
          </div>
          <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Run Your PG or Hostel
            <br />
            <span className="text-amber-300">from One Dashboard</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-indigo-100">
            Visitor logs, rent tracking, complaints, notices, resident and room
            management — everything you need to manage your property, all in one
            place. No spreadsheets. No WhatsApp chaos.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/signup">
              <Button
                className="bg-white text-indigo-700 hover:bg-indigo-50"
                size="lg"
              >
                Try Demo Data
              </Button>
            </Link>
            <Link href="#features">
              <Button variant="secondary" size="lg">
                Explore Features
              </Button>
            </Link>
          </div>
          <p className="mt-4 text-sm text-indigo-200">
            No credit card required &middot; 60-second setup &middot; Works on
            mobile
          </p>
        </div>
      </Section>

      {/* ──────── Problems ──────── */}
      <Section background="gray" id="problems">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Managing a PG without software?
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            These problems feel familiar because every PG owner faces them.
          </p>
        </div>
        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {PROBLEMS.map((p) => (
            <Card key={p.title} padding="lg">
              <CardBody>
                <div className="flex items-start gap-4">
                  <span className="text-2xl">{p.icon}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">{p.title}</h3>
                    <p className="mt-1 text-sm text-gray-500">{p.desc}</p>
                    <p className="mt-2 text-sm font-medium text-green-700">
                      ✓ {p.solution}
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </Section>

      {/* ──────── Features Ecosystem ──────── */}
      <Section id="features">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Six Modules. One Dashboard.
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Every tool you need to run your property, connected and organized.
          </p>
        </div>
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <Card key={f.title} padding="lg" className="flex flex-col transition-shadow hover:shadow-md">
              <CardBody className="flex flex-1 flex-col">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{f.icon}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">{f.title}</h3>
                    <StatusBadge variant="success">{f.stats}</StatusBadge>
                  </div>
                </div>
                <p className="mt-4 flex-1 text-sm text-gray-600">{f.desc}</p>
                <div className="mt-4">
                  <Link
                    href={f.href}
                    className="text-sm font-medium text-amber-600 hover:text-amber-500"
                  >
                    Learn more &rarr;
                  </Link>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </Section>

      {/* ──────── Product Preview (Demo Screens) ──────── */}
      <Section background="gray" id="demo">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            See It in Action — in 60 Seconds
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Sign up, load demo data, and see a fully populated dashboard
            instantly. No setup. No commitment.
          </p>
        </div>

        {/* Mock dashboard cards */}
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardBody className="text-center">
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                Residents
              </p>
              <p className="mt-1 text-3xl font-bold text-gray-900">30</p>
              <p className="mt-1 text-xs text-green-600">Active residents</p>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="text-center">
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                Rooms
              </p>
              <p className="mt-1 text-3xl font-bold text-gray-900">15</p>
              <p className="mt-1 text-xs text-green-600">
                12 occupied &middot; 3 available
              </p>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="text-center">
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                Pending Rent
              </p>
              <p className="mt-1 text-3xl font-bold text-amber-600">
                ₹72,500
              </p>
              <p className="mt-1 text-xs text-red-600">₹24,000 overdue</p>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="text-center">
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                Open Complaints
              </p>
              <p className="mt-1 text-3xl font-bold text-red-600">4</p>
              <p className="mt-1 text-xs text-gray-500">
                2 high priority
              </p>
            </CardBody>
          </Card>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <Card>
            <CardBody className="text-center">
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                Visitors Today
              </p>
              <p className="mt-1 text-3xl font-bold text-blue-600">12</p>
              <p className="mt-1 text-xs text-gray-500">4 checked in</p>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="text-center">
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                Published Notices
              </p>
              <p className="mt-1 text-3xl font-bold text-purple-600">5</p>
              <p className="mt-1 text-xs text-gray-500">Latest: 2 days ago</p>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="text-center">
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                Rent Collected
              </p>
              <p className="mt-1 text-3xl font-bold text-green-600">
                ₹72,000
              </p>
              <p className="mt-1 text-xs text-gray-500">This month</p>
            </CardBody>
          </Card>
        </div>

        <div className="mt-10 text-center">
          <Link href="/signup">
            <Button size="lg">
              Try Demo Data Now
            </Button>
          </Link>
        </div>
      </Section>

      {/* ──────── Benefits ──────── */}
      <Section>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            What You Gain
          </h2>
        </div>
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
              <span className="text-2xl">⏱️</span>
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-900">
              Save 10+ Hours/Week
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Stop chasing payments, maintaining spreadsheets, and fielding
              calls. StayNest automates the busywork.
            </p>
          </div>
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <span className="text-2xl">📉</span>
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-900">
              Reduce Manual Work
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Digital records mean no more paper logs, lost complaint notes, or
              forgotten payment reminders.
            </p>
          </div>
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
              <span className="text-2xl">🎯</span>
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-900">
              Centralized Operations
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Residents, rooms, rent, complaints, visitors, notices — all in one
              dashboard. No switching between apps.
            </p>
          </div>
        </div>
      </Section>

      {/* ──────── Help Us Build StayNest ──────── */}
      <Section background="indigo" className="text-center" id="feedback">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm text-indigo-100">
            🏗️ Community-Driven Development
          </span>
          <h2 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl">
            Help Us Build StayNest
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-indigo-100">
            We are working directly with PG and hostel owners across India.
          </p>
          <p className="mt-2 text-indigo-200">
            Tell us your biggest operational challenge. If we build a solution for it,
            we may invite you for early access.
          </p>
        </div>
        <div className="mx-auto mt-10 max-w-xl text-left">
          <Card>
            <CardBody>
              <FeedbackForm />
            </CardBody>
          </Card>
        </div>
      </Section>

      {/* ──────── Pricing ──────── */}
      <Section background="gray" id="pricing">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Simple Pricing
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Start free. Upgrade when you grow.
          </p>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {PRICING_TIERS.map((tier) => (
            <Card
              key={tier.name}
              padding="lg"
              className={`flex flex-col ${tier.highlighted ? 'border-amber-300 ring-2 ring-amber-200' : ''}`}
            >
              <CardBody className="flex flex-1 flex-col">
                <h3 className="text-lg font-semibold text-gray-900">
                  {tier.name}
                </h3>
                <div className="mt-2">
                  <span className="text-3xl font-bold text-gray-900">
                    {tier.price}
                  </span>
                  <span className="ml-1 text-sm text-gray-500">
                    {tier.period}
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-500">{tier.desc}</p>
                <ul className="mt-6 flex-1 space-y-3">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-gray-700">
                      <span className="text-green-600">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <Link href={tier.href}>
                    <Button
                      variant={tier.highlighted ? 'primary' : 'outline'}
                      className="w-full"
                    >
                      {tier.cta}
                    </Button>
                  </Link>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </Section>

      {/* ──────── FAQ ──────── */}
      <Section id="faq">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Frequently Asked Questions
          </h2>
        </div>
        <div className="mx-auto mt-12 max-w-2xl space-y-4">
          {FAQS.map((faq) => (
            <details
              key={faq.q}
              className="group cursor-pointer rounded-lg border border-gray-200 bg-white"
            >
              <summary className="flex items-center justify-between px-6 py-4 text-sm font-medium text-gray-900 [&::-webkit-details-marker]:hidden">
                {faq.q}
                <span className="ml-2 shrink-0 text-gray-400 transition-transform group-open:rotate-180">
                  ▼
                </span>
              </summary>
              <div className="border-t border-gray-100 px-6 py-4 text-sm text-gray-600">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </Section>

      {/* ──────── Demo Booking / Contact ──────── */}
      <Section background="gray" id="contact">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Want a Personal Demo?
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            We will walk you through StayNest, answer your questions, and set up
            your property in minutes.
          </p>
        </div>
        <div className="mx-auto mt-10 max-w-xl">
          <Card>
            <CardBody>
              <form
                action="mailto:sales@micronest.app"
                method="GET"
                encType="text/plain"
                className="space-y-4"
              >
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Your name"
                    className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="you@example.com"
                    className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="+91 98765 43210"
                    className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Message
                  </label>
                  <textarea
                    name="body"
                    rows={3}
                    placeholder="Tell us about your property..."
                    className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <Button type="submit" className="w-full">
                  Book a Demo
                </Button>
              </form>
            </CardBody>
          </Card>
        </div>
      </Section>

      {/* ──────── Final CTA ──────── */}
      <Section background="indigo" className="text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Ready to Take Control of Your Property?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-indigo-100">
          Join PG owners who have digitized their operations with StayNest.
        </p>
        <div className="mt-8">
          <Link href="/signup">
            <Button
              className="bg-white text-indigo-700 hover:bg-indigo-50"
              size="lg"
            >
              Start Free — No Credit Card
            </Button>
          </Link>
        </div>
      </Section>
    </>
  )
}
