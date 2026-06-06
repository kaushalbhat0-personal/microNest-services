import type { Metadata } from 'next'
import Link from 'next/link'
import { CountUp } from '@micronest/ui'

export const metadata: Metadata = {
  title: 'One platform. Multiple business operating systems.',
  description:
    'MicroNest is a platform of purpose-built business operating systems. Launch, manage and scale niche businesses from a single account.',
  openGraph: {
    title: 'MicroNest — One platform. Multiple business operating systems.',
    description:
      'Launch, manage and scale niche businesses from a single account. Activate only the tools you need.',
    type: 'website',
    siteName: 'MicroNest',
  },
}

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <div
      className="animate-fadeIn opacity-0"
      style={{
        animationDelay: `${delay}ms`,
        animationFillMode: 'forwards',
      }}
    >
      {children}
    </div>
  )
}

function HubMockup() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border-light bg-white shadow-sm">
      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-border-light px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-charcoal text-[10px] font-bold text-white">M</div>
          <span className="text-sm font-semibold text-charcoal">MicroNest</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-lavender/20 text-[10px] font-medium text-lavender">U</div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row">
        {/* Sidebar */}
        <div className="w-full border-b border-border-light bg-cream/50 px-4 py-4 sm:w-44 sm:border-b-0 sm:border-r">
          <nav className="flex flex-row gap-1 sm:flex-col">
            {['Dashboard', 'Ecosystems', 'Settings'].map((item, i) => (
              <span
                key={item}
                className={`rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                  i === 0 ? 'bg-lavender/10 text-lavender' : 'text-gray-500 hover:text-charcoal'
                }`}
              >
                {item}
              </span>
            ))}
          </nav>
        </div>

        {/* Main */}
        <div className="flex-1 px-4 py-4 sm:p-5">
          <h3 className="text-base font-semibold text-charcoal">Your Ecosystems</h3>

          {/* Active ecosystems */}
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="rounded-lg border border-border-light bg-green-50/50 p-3">
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded bg-charcoal text-[8px] font-bold text-white">S</span>
                <span className="text-xs font-semibold text-charcoal">StayNest</span>
              </div>
              <div className="mt-2 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                <span className="text-[10px] text-green-600">Active</span>
              </div>
            </div>
            <div className="rounded-lg border border-border-light bg-amber-50/50 p-3">
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded bg-charcoal text-[8px] font-bold text-white">C</span>
                <span className="text-xs font-semibold text-charcoal">ClinicNest</span>
              </div>
              <div className="mt-2 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                <span className="text-[10px] text-amber-600">Early Access</span>
              </div>
            </div>
          </div>

          {/* Available */}
          <div className="mt-3 rounded-lg border border-dashed border-border-light bg-gray-50/50 p-3">
            <p className="text-[10px] font-medium uppercase tracking-wider text-gray-500">Available</p>
            <div className="mt-1.5 flex items-center gap-3">
              {['FreelanceNest', 'PropertyNest'].map((name) => (
                <span key={name} className="flex items-center gap-1.5 text-xs text-gray-500">
                  <span className="flex h-3 w-3 items-center justify-center rounded bg-gray-300 text-[6px] font-bold text-white">
                    {name.charAt(0)}
                  </span>
                  {name}
                </span>
              ))}
            </div>
          </div>

          {/* At a Glance */}
          <div className="mt-4">
            <p className="text-[10px] font-medium uppercase tracking-wider text-gray-500">At a Glance</p>
            <div className="mt-2 grid grid-cols-4 gap-2">
              {[
                { label: 'Residents', value: '28', sub: '+3 this month', color: 'text-charcoal' },
                { label: "Today's Apps", value: '6', sub: '2 checked in', color: 'text-charcoal' },
                { label: 'Revenue', value: '₹1.2L', sub: 'this month', color: 'text-green-600' },
                { label: 'Active Tasks', value: '12', sub: '4 overdue', color: 'text-red-600' },
              ].map((stat) => (
                <div key={stat.label} className="rounded-lg bg-cream p-2 text-center">
                  <p className="text-[10px] text-gray-500">{stat.label}</p>
                  <p className={`text-sm font-semibold ${stat.color}`}>{stat.value}</p>
                  <p className="text-[9px] text-gray-400">{stat.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ProblemTransition() {
  const tools = ['Excel', 'WhatsApp', 'Notebook', 'Sheets', 'Reminders']
  return (
    <div className="flex flex-col items-center gap-6 sm:gap-8">
      {/* Fragmented tools row */}
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
        {tools.map((tool, i) => (
          <FadeIn key={tool} delay={i * 60}>
            <div className="flex items-center gap-2 rounded-full border border-border-light bg-white px-4 py-2 text-sm text-gray-500 shadow-sm">
              <span className="flex h-5 w-5 items-center justify-center rounded bg-gray-100 text-[10px] font-bold text-gray-400">
                {tool.charAt(0)}
              </span>
              {tool}
            </div>
          </FadeIn>
        ))}
      </div>

      {/* Arrow */}
      <FadeIn delay={350}>
        <div className="flex h-10 w-10 items-center justify-center">
          <svg className="h-6 w-6 text-lavender" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
          </svg>
        </div>
      </FadeIn>

      {/* MicroNest */}
      <FadeIn delay={420}>
        <div className="flex items-center gap-3 rounded-2xl border-2 border-lavender/30 bg-lavender/5 px-8 py-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-lavender text-sm font-bold text-white">M</div>
          <div>
            <span className="text-base font-semibold text-charcoal">MicroNest</span>
            <p className="text-xs text-gray-500">One platform. All your tools.</p>
          </div>
        </div>
      </FadeIn>
    </div>
  )
}

function EcosystemMap() {
  const products = [
    { name: 'StayNest', initial: 'S', status: 'Live', x: 'left', color: 'text-green-600', bg: 'bg-green-50' },
    { name: 'ClinicNest', initial: 'C', status: 'Early Access', x: 'right', color: 'text-amber-600', bg: 'bg-amber-50' },
    { name: 'FreelanceNest', initial: 'F', status: 'Coming Soon', x: 'left', color: 'text-gray-500', bg: 'bg-gray-50' },
    { name: 'PropertyNest', initial: 'P', status: 'Coming Soon', x: 'right', color: 'text-gray-500', bg: 'bg-gray-50' },
  ]

  return (
    <div className="relative mx-auto max-w-3xl">
      {/* Center node — MicroNest */}
      <div className="relative z-10 mx-auto flex w-fit items-center gap-3 rounded-2xl border-2 border-lavender/30 bg-white px-6 py-4 shadow-sm">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-lavender text-sm font-bold text-white">M</div>
        <div>
          <p className="text-base font-semibold text-charcoal">MicroNest</p>
          <p className="text-xs text-gray-500">Ecosystem Platform</p>
        </div>
      </div>

      {/* Products grid */}
      <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-6">
        {products.map((p, i) => (
          <FadeIn key={p.name} delay={i * 80}>
            <div className={`rounded-xl border border-border-light ${p.bg} p-4 transition-shadow hover:shadow-sm`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-charcoal text-[9px] font-bold text-white">
                    {p.initial}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-charcoal">{p.name}</p>
                    <p className={`text-[11px] font-medium ${p.color}`}>{p.status}</p>
                  </div>
                </div>
                <svg className="h-4 w-4 text-lavender" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>

      {/* Activation flow hint */}
      <FadeIn delay={400}>
        <p className="mt-6 text-center text-xs text-gray-400">
          Activate ecosystems from your MicroNest dashboard. One click. No separate signups.
        </p>
      </FadeIn>
    </div>
  )
}

function PillarDiagram({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-lavender/10 text-lavender">
        {children}
      </div>
      <h3 className="text-base font-semibold text-charcoal">{title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-gray-500">{description}</p>
    </div>
  )
}

export default function HomePage() {
  return (
    <div className="bg-cream font-body text-charcoal">
      {/* ════════ 1. Hero ════════ */}
      <section className="overflow-hidden border-b border-border-light px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
            <FadeIn>
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-border-light bg-white/60 px-3 py-1 text-xs font-medium text-gray-500">
                  <span className="flex h-4 w-4 items-center justify-center rounded bg-charcoal text-[8px] font-bold text-white">M</span>
                  Ecosystem platform
                </div>
                <h1 className="mt-5 text-display-xl font-display leading-[1.05] tracking-tight text-charcoal">
                  One platform.
                  <br />
                  <span className="text-lavender">Multiple business</span>
                  <br />
                  operating systems.
                </h1>
                <p className="mt-5 text-lg leading-relaxed text-gray-500">
                  Launch, manage and scale niche businesses from a single account.
                  Activate only the tools you need.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link href="/signup">
                    <button className="rounded-full bg-charcoal px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-charcoal/90">
                      Create Free Account
                    </button>
                  </Link>
                  <Link href="/ecosystems">
                    <button className="rounded-full border border-border-light bg-white px-8 py-3 text-sm font-medium text-charcoal transition-colors hover:bg-gray-50">
                      Explore Ecosystems
                    </button>
                  </Link>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={150}>
              <HubMockup />
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ════════ 2. Problem ════════ */}
      <section className="px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <FadeIn>
            <div className="mx-auto max-w-xl text-center">
              <p className="text-xs font-medium uppercase tracking-widest text-gray-500">The Problem</p>
              <h2 className="mt-4 text-display-md font-display text-charcoal">
                Businesses are forced to stitch together tools.
              </h2>
              <p className="mt-3 text-base text-gray-500">
                Spreadsheets, chat apps, notebooks, and manual reminders. None of them talk to each other.
                You end up managing your tools instead of your business.
              </p>
            </div>
          </FadeIn>

          <div className="mt-14">
            <ProblemTransition />
          </div>
        </div>
      </section>

      {/* ════════ 3. Ecosystem Showcase — Horizontal Rows ════════ */}
      <section className="bg-white border-y border-border-light px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <FadeIn>
            <div className="mx-auto max-w-xl text-center">
              <p className="text-xs font-medium uppercase tracking-widest text-gray-500">Products</p>
              <h2 className="mt-4 text-display-md font-display text-charcoal">
                Operating systems for your business
              </h2>
              <p className="mt-3 text-base text-gray-500">
                Each ecosystem is a complete operating system for its industry.
                Not a dashboard. Not a template. Real software.
              </p>
            </div>
          </FadeIn>

          <div className="mt-14 space-y-16">
            {/* StayNest */}
            <FadeIn>
              <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                    <span className="flex h-2 w-2 rounded-full bg-green-500" />
                    Available Now — Production Ready
                  </div>
                  <h3 className="mt-5 text-display-md font-display text-charcoal">StayNest</h3>
                  <p className="mt-2 text-base text-gray-500">Operating system for PG & Hostel Owners</p>
                  <p className="mt-4 text-sm leading-relaxed text-gray-500">
                    Manage residents, rooms, rent, maintenance, visitors, and announcements.
                    WhatsApp notifications, analytics, and receipt generation included.
                    Everything a PG owner needs to run their property.
                  </p>
                  <div className="mt-6 flex items-center gap-6">
                    <Link href="/ecosystems/staynest">
                      <button className="rounded-full bg-charcoal px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-charcoal/90">
                        Explore StayNest &rarr;
                      </button>
                    </Link>
                    <Link href="/signup">
                      <span className="text-sm font-medium text-lavender transition-colors hover:text-lavender-hover">
                        Start Free &rarr;
                      </span>
                    </Link>
                  </div>
                </div>
                <div className="rounded-2xl border border-border-light bg-cream p-4 shadow-sm sm:p-6">
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <div className="rounded-xl bg-white p-3">
                      <p className="text-xs text-gray-500">Residents</p>
                      <p className="text-xl font-semibold text-charcoal">30</p>
                    </div>
                    <div className="rounded-xl bg-white p-3">
                      <p className="text-xs text-gray-500">Rooms</p>
                      <p className="text-xl font-semibold text-charcoal">15</p>
                    </div>
                    <div className="rounded-xl bg-white p-3">
                      <p className="text-xs text-gray-500">Revenue</p>
                      <p className="text-xl font-semibold text-charcoal">₹1.4L</p>
                    </div>
                    <div className="rounded-xl bg-white p-3">
                      <p className="text-xs text-gray-500">Open Maint.</p>
                      <p className="text-xl font-semibold text-charcoal">4</p>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    {[
                      { name: 'Amit Sharma', room: '101', status: 'Paid', color: 'text-green-600' },
                      { name: 'Priya Patel', room: '102', status: 'Pending', color: 'text-amber-600' },
                      { name: 'Rahul Verma', room: '103', status: 'Overdue', color: 'text-red-600' },
                    ].map((r) => (
                      <div key={r.name} className="flex items-center justify-between rounded-xl bg-white px-3 py-2">
                        <div className="flex items-center gap-2">
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-lavender/20 text-[10px] font-medium text-lavender">
                            {r.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-charcoal">{r.name}</p>
                            <p className="text-xs text-gray-500">Room {r.room}</p>
                          </div>
                        </div>
                        <span className={`text-xs font-medium ${r.color}`}>{r.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </FadeIn>

            {/* ClinicNest */}
            <FadeIn delay={100}>
              <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
                <div className="order-last lg:order-first">
                  <div className="rounded-2xl border border-border-light bg-cream p-4 shadow-sm sm:p-6">
                    <div className="space-y-2">
                      {[
                        { patient: 'Ananya Gupta', time: '10:00 AM', type: 'Checkup', status: 'Confirmed' },
                        { patient: 'Vikram Singh', time: '11:30 AM', type: 'Follow-up', status: 'Checked In' },
                        { patient: 'Neha Joshi', time: '2:00 PM', type: 'Consultation', status: 'Pending' },
                      ].map((a) => (
                        <div key={a.patient} className="flex items-center justify-between rounded-xl bg-white px-3 py-2.5">
                          <div className="flex items-center gap-2.5">
                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-lavender/20 text-[10px] font-medium text-lavender">
                              {a.patient.charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-charcoal">{a.patient}</p>
                              <p className="text-xs text-gray-500">{a.time} — {a.type}</p>
                            </div>
                          </div>
                          <span className={`text-xs font-medium ${a.status === 'Confirmed' ? 'text-green-600' : a.status === 'Checked In' ? 'text-lavender' : 'text-amber-600'}`}>
                            {a.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
                    <span className="flex h-2 w-2 rounded-full bg-amber-500" />
                    Early Access
                  </div>
                  <h3 className="mt-5 text-display-md font-display text-charcoal">ClinicNest</h3>
                  <p className="mt-2 text-base text-gray-500">Operating system for Clinics & Practices</p>
                  <p className="mt-4 text-sm leading-relaxed text-gray-500">
                    Appointment scheduling, patient records, prescription management, and automated reminders.
                    Built for clinics that want to eliminate paperwork and reduce no-shows.
                    No complexity. No training required.
                  </p>
                  <div className="mt-6 flex items-center gap-6">
                    <Link href="/ecosystems/clinicnest">
                      <button className="rounded-full bg-charcoal px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-charcoal/90">
                        Join Waitlist &rarr;
                      </button>
                    </Link>
                    <Link href="/ecosystems/clinicnest">
                      <span className="text-sm font-medium text-lavender transition-colors hover:text-lavender-hover">
                        Learn More &rarr;
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </FadeIn>

            {/* FreelanceNest & PropertyNest — Coming Soon */}
            <FadeIn delay={150}>
              <div className="grid gap-6 sm:grid-cols-2">
                {[
                  { name: 'FreelanceNest', tagline: 'For Freelancers', desc: 'Project tracking, invoicing, client management, and portfolio tools for independent professionals.', initial: 'F' },
                  { name: 'PropertyNest', tagline: 'For Real Estate', desc: 'Property listings, inquiry management, tour scheduling, and deal tracking for real estate professionals.', initial: 'P' },
                ].map((p) => (
                  <div key={p.name} className="rounded-2xl border border-dashed border-border-light bg-gray-50/50 p-6 sm:p-8">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-200 text-sm font-bold text-gray-400">{p.initial}</div>
                      <div>
                        <h4 className="text-base font-semibold text-charcoal">{p.name}</h4>
                        <p className="text-sm text-gray-500">{p.tagline}</p>
                      </div>
                      <span className="ml-auto rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-500">Coming Soon</span>
                    </div>
                    <p className="mt-4 text-sm leading-relaxed text-gray-500">{p.desc}</p>
                    <Link href={`/ecosystems/${p.name.toLowerCase().replace('nest', '')}nest`}>
                      <span className="mt-4 inline-block text-sm font-medium text-lavender transition-colors hover:text-lavender-hover">
                        Get notified &rarr;
                      </span>
                    </Link>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ════════ 4. Why MicroNest — 4 Pillars ════════ */}
      <section className="px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <FadeIn>
            <div className="mx-auto max-w-xl text-center">
              <p className="text-xs font-medium uppercase tracking-widest text-gray-500">Why MicroNest</p>
              <h2 className="mt-4 text-display-md font-display text-charcoal">
                Infrastructure designed for multi-business operations
              </h2>
            </div>
          </FadeIn>

          <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <FadeIn delay={0}>
              <PillarDiagram
                title="One Login"
                description="One account gives you access to every ecosystem. No separate registrations, no password fatigue."
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
              </PillarDiagram>
            </FadeIn>

            <FadeIn delay={80}>
              <PillarDiagram
                title="Shared Billing"
                description="One subscription covers all your active ecosystems. Pay once. Use everything you need."
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                </svg>
              </PillarDiagram>
            </FadeIn>

            <FadeIn delay={160}>
              <PillarDiagram
                title="Shared Analytics"
                description="View performance across all ecosystems from one dashboard. Compare, analyze, optimize."
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                </svg>
              </PillarDiagram>
            </FadeIn>

            <FadeIn delay={240}>
              <PillarDiagram
                title="Shared Infrastructure"
                description="Ecosystems share auth, notifications, and data layer. New products feel instantly familiar."
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25z" />
                </svg>
              </PillarDiagram>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ════════ 5. Product Ecosystem Map ════════ */}
      <section className="bg-white border-y border-border-light px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <FadeIn>
            <div className="mx-auto max-w-xl text-center">
              <p className="text-xs font-medium uppercase tracking-widest text-gray-500">Ecosystem Map</p>
              <h2 className="mt-4 text-display-md font-display text-charcoal">
                One platform. Four operating systems.
              </h2>
              <p className="mt-3 text-base text-gray-500">
                Activate what you need. Add more as you grow. Everything works together.
              </p>
            </div>
          </FadeIn>

          <div className="mt-14">
            <EcosystemMap />
          </div>
        </div>
      </section>

      {/* ════════ 6. Social Proof — Metrics ════════ */}
      <section className="px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <FadeIn>
            <div className="mx-auto max-w-xl text-center">
              <p className="text-xs font-medium uppercase tracking-widest text-gray-500">Platform Metrics</p>
              <h2 className="mt-4 text-display-md font-display text-charcoal">
                Growing with businesses like yours
              </h2>
            </div>
          </FadeIn>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: 'Residents Managed', end: 1000, suffix: '+' },
              { label: 'Rent Payments Tracked', end: 500, suffix: '+' },
              { label: 'Maintenance Requests Closed', end: 100, suffix: '+' },
              { label: 'Active Properties', end: 50, suffix: '+' },
            ].map((stat, i) => (
              <FadeIn key={stat.label} delay={i * 80}>
                <div className="rounded-2xl border border-border-light bg-white px-6 py-8 text-center transition-shadow hover:shadow-sm">
                  <p className="text-4xl font-semibold tracking-tight text-charcoal">
                    <CountUp end={stat.end} suffix={stat.suffix} />
                  </p>
                  <p className="mt-2 text-sm text-gray-500">{stat.label}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ 7. Roadmap ════════ */}
      <section className="bg-white border-y border-border-light px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <FadeIn>
            <div className="mx-auto max-w-xl text-center">
              <p className="text-xs font-medium uppercase tracking-widest text-gray-500">Roadmap</p>
              <h2 className="mt-4 text-display-md font-display text-charcoal">
                What&rsquo;s available and what&rsquo;s next
              </h2>
            </div>
          </FadeIn>

          <div className="relative mx-auto mt-14 max-w-3xl">
            <div className="absolute left-6 top-0 h-full w-px bg-border-light" />

            <div className="space-y-8">
              {[
                { name: 'StayNest', status: 'Available Now', color: 'bg-green-500', textColor: 'text-green-700', badgeBg: 'bg-green-50', desc: 'Production ready. Full feature set including rent tracking, maintenance, visitors, WhatsApp notifications, and analytics.' },
                { name: 'ClinicNest', status: 'Early Access', color: 'bg-amber-500', textColor: 'text-amber-700', badgeBg: 'bg-amber-50', desc: 'Early access phase. Appointments, patient records, and prescriptions available. More modules in development.' },
                { name: 'FreelanceNest', status: 'In Development', color: 'bg-lavender', textColor: 'text-lavender', badgeBg: 'bg-lavender/10', desc: 'Project tracking, invoicing, and client management tools under active development.' },
                { name: 'PropertyNest', status: 'In Development', color: 'bg-lavender', textColor: 'text-lavender', badgeBg: 'bg-lavender/10', desc: 'Property listings, inquiry management, and deal tracking being built for real estate professionals.' },
              ].map((item, i) => (
                <FadeIn key={item.name} delay={i * 80}>
                  <div className="relative flex items-start gap-6 pl-14">
                    <div className={`absolute left-4 top-2 z-10 flex h-4 w-4 rounded-full ${item.color} ring-4 ring-white`} />
                    <div className="flex-1 rounded-xl border border-border-light bg-white p-5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h3 className="text-base font-semibold text-charcoal">{item.name}</h3>
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${item.badgeBg} ${item.textColor}`}>
                          {item.status}
                        </span>
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-gray-500">{item.desc}</p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════ 8. Final CTA ════════ */}
      <section className="bg-charcoal px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <FadeIn>
            <p className="text-xs font-medium uppercase tracking-widest text-gray-500">Get Started</p>
            <h2 className="mt-5 text-display-md font-display text-white">
              Start with one ecosystem.
              <br />
              Expand when you&rsquo;re ready.
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-gray-400">
              Free plan included. No credit card required. Set up your first ecosystem in under a minute.
            </p>
            <div className="mt-10">
              <Link href="/signup">
                <button className="rounded-full bg-white px-10 py-3.5 text-base font-medium text-charcoal transition-colors hover:bg-white/90">
                  Create Free Account
                </button>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  )
}
