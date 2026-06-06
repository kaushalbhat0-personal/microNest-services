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
      <div className="flex items-center justify-between border-b border-border-light px-3 py-2.5 sm:px-4 sm:py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-5 w-5 items-center justify-center rounded-md bg-charcoal text-[8px] font-bold text-white sm:h-6 sm:w-6 sm:text-[10px]">M</div>
          <span className="text-xs font-semibold text-charcoal sm:text-sm">MicroNest</span>
        </div>
        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-lavender/20 text-[8px] font-medium text-lavender sm:h-6 sm:w-6 sm:text-[10px]">U</div>
      </div>

      <div className="flex flex-col sm:flex-row">
        <div className="w-full border-b border-border-light bg-cream/50 px-3 py-3 sm:w-44 sm:border-b-0 sm:border-r sm:px-4 sm:py-4">
          <nav className="flex flex-row gap-1 sm:flex-col">
            {['Dashboard', 'Ecosystems', 'Settings'].map((item, i) => (
              <span
                key={item}
                className={`rounded-lg px-2.5 py-2 text-xs font-medium transition-colors sm:px-3 sm:py-2 ${
                  i === 0 ? 'bg-lavender/10 text-lavender' : 'text-gray-500 hover:text-charcoal'
                }`}
              >
                {item}
              </span>
            ))}
          </nav>
        </div>

        <div className="flex-1 px-3 py-3 sm:p-5">
          <h3 className="text-sm font-semibold text-charcoal sm:text-base">Your Ecosystems</h3>

          <div className="mt-2 grid grid-cols-2 gap-2 sm:mt-3">
            <div className="rounded-lg border border-border-light bg-green-50/50 p-2 sm:p-3">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="flex h-4 w-4 items-center justify-center rounded bg-charcoal text-[6px] font-bold text-white sm:h-5 sm:w-5 sm:text-[8px]">S</span>
                <span className="text-[11px] font-semibold text-charcoal sm:text-xs">StayNest</span>
              </div>
              <div className="mt-1 flex items-center gap-1 sm:mt-2">
                <span className="h-1 w-1 rounded-full bg-green-500 sm:h-1.5 sm:w-1.5" />
                <span className="text-[9px] text-green-600 sm:text-[10px]">Active</span>
              </div>
            </div>
            <div className="rounded-lg border border-border-light bg-amber-50/50 p-2 sm:p-3">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="flex h-4 w-4 items-center justify-center rounded bg-charcoal text-[6px] font-bold text-white sm:h-5 sm:w-5 sm:text-[8px]">C</span>
                <span className="text-[11px] font-semibold text-charcoal sm:text-xs">ClinicNest</span>
              </div>
              <div className="mt-1 flex items-center gap-1 sm:mt-2">
                <span className="h-1 w-1 rounded-full bg-amber-500 sm:h-1.5 sm:w-1.5" />
                <span className="text-[9px] text-amber-600 sm:text-[10px]">Early Access</span>
              </div>
            </div>
          </div>

          <div className="mt-2 rounded-lg border border-dashed border-border-light bg-gray-50/50 p-2 sm:mt-3 sm:p-3">
            <p className="text-[9px] font-medium uppercase tracking-wider text-gray-500 sm:text-[10px]">Available</p>
            <div className="mt-1 flex items-center gap-2 sm:mt-1.5 sm:gap-3">
              {['FreelanceNest', 'PropertyNest'].map((name) => (
                <span key={name} className="flex items-center gap-1 text-[11px] text-gray-500 sm:text-xs">
                  <span className="flex h-3 w-3 items-center justify-center rounded bg-gray-300 text-[5px] font-bold text-white sm:h-3 sm:w-3 sm:text-[6px]">
                    {name.charAt(0)}
                  </span>
                  {name}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-3 sm:mt-4">
            <p className="text-[9px] font-medium uppercase tracking-wider text-gray-500 sm:text-[10px]">At a Glance</p>
            <div className="mt-1.5 grid grid-cols-2 gap-1.5 sm:mt-2 sm:grid-cols-4 sm:gap-2">
              {[
                { label: 'Residents', value: '28', sub: '+3 this month', color: 'text-charcoal' },
                { label: "Today's Apps", value: '6', sub: '2 checked in', color: 'text-charcoal' },
                { label: 'Revenue', value: '₹1.2L', sub: 'this month', color: 'text-green-600' },
                { label: 'Active Tasks', value: '12', sub: '4 overdue', color: 'text-red-600' },
              ].map((stat) => (
                <div key={stat.label} className="rounded-lg bg-cream p-1.5 text-center sm:p-2">
                  <p className="text-[9px] text-gray-500 sm:text-[10px]">{stat.label}</p>
                  <p className={`text-xs font-semibold sm:text-sm ${stat.color}`}>{stat.value}</p>
                  <p className="text-[8px] text-gray-400 sm:text-[9px]">{stat.sub}</p>
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
    <div className="flex flex-col items-center gap-5 sm:gap-8">
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
        {tools.map((tool, i) => (
          <FadeIn key={tool} delay={i * 60}>
            <div className="flex items-center gap-1.5 rounded-full border border-border-light bg-white px-3 py-1.5 text-xs text-gray-500 shadow-sm sm:gap-2 sm:px-4 sm:py-2 sm:text-sm">
              <span className="flex h-4 w-4 items-center justify-center rounded bg-gray-100 text-[8px] font-bold text-gray-400 sm:h-5 sm:w-5 sm:text-[10px]">
                {tool.charAt(0)}
              </span>
              {tool}
            </div>
          </FadeIn>
        ))}
      </div>

      <FadeIn delay={350}>
        <div className="flex h-8 w-8 items-center justify-center sm:h-10 sm:w-10">
          <svg className="h-5 w-5 text-lavender sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
          </svg>
        </div>
      </FadeIn>

      <FadeIn delay={420}>
        <div className="flex items-center gap-2 rounded-2xl border-2 border-lavender/30 bg-lavender/5 px-5 py-3 sm:gap-3 sm:px-8 sm:py-4">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-lavender text-xs font-bold text-white sm:h-8 sm:w-8 sm:text-sm">M</div>
          <div>
            <span className="text-sm font-semibold text-charcoal sm:text-base">MicroNest</span>
            <p className="text-[11px] text-gray-500 sm:text-xs">One platform. All your tools.</p>
          </div>
        </div>
      </FadeIn>
    </div>
  )
}

function EcosystemMap() {
  const products = [
    { name: 'StayNest', initial: 'S', status: 'Live', color: 'text-green-600', bg: 'bg-green-50' },
    { name: 'ClinicNest', initial: 'C', status: 'Early Access', color: 'text-amber-600', bg: 'bg-amber-50' },
    { name: 'FreelanceNest', initial: 'F', status: 'Coming Soon', color: 'text-gray-500', bg: 'bg-gray-50' },
    { name: 'PropertyNest', initial: 'P', status: 'Coming Soon', color: 'text-gray-500', bg: 'bg-gray-50' },
  ]

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mx-auto flex w-fit items-center gap-2 rounded-2xl border-2 border-lavender/30 bg-white px-4 py-3 shadow-sm sm:gap-3 sm:px-6 sm:py-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-lavender text-xs font-bold text-white sm:h-9 sm:w-9 sm:text-sm">M</div>
        <div>
          <p className="text-sm font-semibold text-charcoal sm:text-base">MicroNest</p>
          <p className="text-[11px] text-gray-500 sm:text-xs">Ecosystem Platform</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-10 sm:gap-6">
        {products.map((p, i) => (
          <FadeIn key={p.name} delay={i * 80}>
            <div className={`rounded-xl border border-border-light ${p.bg} p-3 transition-shadow hover:shadow-sm sm:p-4`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-2.5">
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-charcoal text-[7px] font-bold text-white sm:h-7 sm:w-7 sm:text-[9px]">
                    {p.initial}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-charcoal sm:text-sm">{p.name}</p>
                    <p className={`text-[10px] font-medium sm:text-[11px] ${p.color}`}>{p.status}</p>
                  </div>
                </div>
                <svg className="h-3 w-3 text-lavender sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>

      <FadeIn delay={400}>
        <p className="mt-4 text-center text-[11px] text-gray-400 sm:mt-6 sm:text-xs">
          Activate ecosystems from your MicroNest dashboard. One click. No separate signups.
        </p>
      </FadeIn>
    </div>
  )
}

function PillarDiagram({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-lavender/10 text-lavender sm:mb-4 sm:h-12 sm:w-12">
        {children}
      </div>
      <h3 className="text-sm font-semibold text-charcoal sm:text-base">{title}</h3>
      <p className="mt-1 text-xs leading-relaxed text-gray-500 sm:mt-1.5 sm:text-sm">{description}</p>
    </div>
  )
}

export default function HomePage() {
  return (
    <div className="bg-cream font-body text-charcoal">
      {/* ════════ 1. Hero — Mobile-first ════════ */}
      <section className="overflow-hidden border-b border-border-light px-4 py-10 sm:py-16 md:py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-8 md:gap-12 lg:grid-cols-2 lg:gap-20">
            <FadeIn>
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-full border border-border-light bg-white/60 px-2.5 py-0.5 text-[10px] font-medium text-gray-500 sm:gap-2 sm:px-3 sm:py-1 sm:text-xs">
                  <span className="flex h-3 w-3 items-center justify-center rounded bg-charcoal text-[6px] font-bold text-white sm:h-4 sm:w-4 sm:text-[8px]">M</span>
                  Ecosystem platform
                </div>
                <h1 className="mt-3 text-3xl font-display leading-[1.1] tracking-tight text-charcoal sm:mt-5 sm:text-4xl md:text-5xl lg:text-display-xl lg:leading-[1.05]">
                  One platform.
                  <br />
                  <span className="text-lavender">Multiple business</span>
                  <br />
                  operating systems.
                </h1>
                <p className="mt-3 text-sm leading-relaxed text-gray-500 sm:mt-5 sm:text-base lg:text-lg">
                  Launch, manage and scale niche businesses from a single account.
                  Activate only the tools you need.
                </p>
                <div className="mt-5 flex flex-col gap-2 sm:mt-8 sm:flex-row sm:flex-wrap sm:gap-3">
                  <Link href="/signup">
                    <button className="min-h-[48px] w-full rounded-full bg-charcoal px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-charcoal/90 sm:w-auto sm:px-8">
                      Create Free Account
                    </button>
                  </Link>
                  <Link href="/ecosystems">
                    <button className="min-h-[48px] w-full rounded-full border border-border-light bg-white px-6 py-3 text-sm font-medium text-charcoal transition-colors hover:bg-gray-50 sm:w-auto sm:px-8">
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
      <section className="px-4 py-14 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-4xl">
          <FadeIn>
            <div className="mx-auto max-w-xl text-center">
              <p className="text-[10px] font-medium uppercase tracking-widest text-gray-500 sm:text-xs">The Problem</p>
              <h2 className="mt-3 text-2xl font-display text-charcoal sm:mt-4 sm:text-display-md">
                Businesses are forced to stitch together tools.
              </h2>
              <p className="mt-2 text-sm text-gray-500 sm:mt-3 sm:text-base">
                Spreadsheets, chat apps, notebooks, and manual reminders. None of them talk to each other.
                You end up managing your tools instead of your business.
              </p>
            </div>
          </FadeIn>

          <div className="mt-10 sm:mt-14">
            <ProblemTransition />
          </div>
        </div>
      </section>

      {/* ════════ 3. Ecosystem Showcase — Mobile: cards, Desktop: rows ════════ */}
      <section className="bg-white border-y border-border-light px-4 py-14 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <FadeIn>
            <div className="mx-auto max-w-xl text-center">
              <p className="text-[10px] font-medium uppercase tracking-widest text-gray-500 sm:text-xs">Products</p>
              <h2 className="mt-3 text-2xl font-display text-charcoal sm:mt-4 sm:text-display-md">
                Operating systems for your business
              </h2>
              <p className="mt-2 text-sm text-gray-500 sm:mt-3 sm:text-base">
                Each ecosystem is a complete operating system for its industry.
                Not a dashboard. Not a template. Real software.
              </p>
            </div>
          </FadeIn>

          <div className="mt-10 space-y-10 sm:mt-14 sm:space-y-16">
            {/* StayNest — Screenshot first on mobile */}
            <FadeIn>
              <div className="grid items-center gap-6 lg:grid-cols-2 lg:gap-16">
                {/* Screenshot row — visible first on mobile */}
                <div className="rounded-2xl border border-border-light bg-cream p-3 shadow-sm sm:p-4 lg:p-6">
                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    <div className="rounded-xl bg-white p-2 sm:p-3">
                      <p className="text-[10px] text-gray-500 sm:text-xs">Residents</p>
                      <p className="text-base font-semibold text-charcoal sm:text-xl">30</p>
                    </div>
                    <div className="rounded-xl bg-white p-2 sm:p-3">
                      <p className="text-[10px] text-gray-500 sm:text-xs">Rooms</p>
                      <p className="text-base font-semibold text-charcoal sm:text-xl">15</p>
                    </div>
                  </div>
                  <div className="mt-2 space-y-1.5 sm:mt-4">
                    {[
                      { name: 'Amit Sharma', room: '101', status: 'Paid', color: 'text-green-600' },
                      { name: 'Priya Patel', room: '102', status: 'Pending', color: 'text-amber-600' },
                      { name: 'Rahul Verma', room: '103', status: 'Overdue', color: 'text-red-600' },
                    ].map((r) => (
                      <div key={r.name} className="flex items-center justify-between rounded-xl bg-white px-2.5 py-1.5 sm:px-3 sm:py-2">
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-lavender/20 text-[8px] font-medium text-lavender sm:h-6 sm:w-6 sm:text-[10px]">
                            {r.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-xs font-medium text-charcoal sm:text-sm">{r.name}</p>
                            <p className="text-[10px] text-gray-500 sm:text-xs">Room {r.room}</p>
                          </div>
                        </div>
                        <span className={`text-[10px] font-medium sm:text-xs ${r.color}`}>{r.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Copy second on mobile */}
                <div>
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-2.5 py-0.5 text-[10px] font-medium text-green-700 sm:gap-2 sm:px-3 sm:py-1 sm:text-xs">
                    <span className="flex h-1.5 w-1.5 rounded-full bg-green-500 sm:h-2 sm:w-2" />
                    Available Now — Production Ready
                  </div>
                  <h3 className="mt-3 text-2xl font-display text-charcoal sm:mt-5 sm:text-display-md">StayNest</h3>
                  <p className="mt-1 text-sm text-gray-500 sm:mt-2 sm:text-base">Operating system for PG & Hostel Owners</p>
                  <p className="mt-2 text-xs leading-relaxed text-gray-500 sm:mt-4 sm:text-sm">
                    Manage residents, rooms, rent, maintenance, visitors, and announcements.
                    WhatsApp notifications, analytics, and receipt generation included.
                    Everything a PG owner needs to run their property.
                  </p>
                  <div className="mt-4 flex flex-col gap-2 sm:mt-6 sm:flex-row sm:items-center sm:gap-6">
                    <Link href="/ecosystems/staynest">
                      <button className="min-h-[48px] w-full rounded-full bg-charcoal px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-charcoal/90 sm:w-auto sm:px-6 sm:py-2.5">
                        Explore StayNest &rarr;
                      </button>
                    </Link>
                    <Link href="/signup">
                      <span className="text-center text-sm font-medium text-lavender transition-colors hover:text-lavender-hover sm:text-left">
                        Start Free &rarr;
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </FadeIn>

            {/* ClinicNest — Screenshot first on mobile */}
            <FadeIn delay={100}>
              <div className="grid items-center gap-6 lg:grid-cols-2 lg:gap-16">
                {/* Screenshot first on mobile */}
                <div>
                  <div className="rounded-2xl border border-border-light bg-cream p-3 shadow-sm sm:p-4 lg:p-6">
                    <div className="space-y-1.5 sm:space-y-2">
                      {[
                        { patient: 'Ananya Gupta', time: '10:00 AM', type: 'Checkup', status: 'Confirmed' },
                        { patient: 'Vikram Singh', time: '11:30 AM', type: 'Follow-up', status: 'Checked In' },
                        { patient: 'Neha Joshi', time: '2:00 PM', type: 'Consultation', status: 'Pending' },
                      ].map((a) => (
                        <div key={a.patient} className="flex items-center justify-between rounded-xl bg-white px-2.5 py-2 sm:px-3 sm:py-2.5">
                          <div className="flex items-center gap-1.5 sm:gap-2.5">
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-lavender/20 text-[8px] font-medium text-lavender sm:h-7 sm:w-7 sm:text-[10px]">
                              {a.patient.charAt(0)}
                            </div>
                            <div>
                              <p className="text-xs font-medium text-charcoal sm:text-sm">{a.patient}</p>
                              <p className="text-[10px] text-gray-500 sm:text-xs">{a.time} — {a.type}</p>
                            </div>
                          </div>
                          <span className={`text-[10px] font-medium sm:text-xs ${a.status === 'Confirmed' ? 'text-green-600' : a.status === 'Checked In' ? 'text-lavender' : 'text-amber-600'}`}>
                            {a.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                {/* Copy second on mobile */}
                <div>
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[10px] font-medium text-amber-700 sm:gap-2 sm:px-3 sm:py-1 sm:text-xs">
                    <span className="flex h-1.5 w-1.5 rounded-full bg-amber-500 sm:h-2 sm:w-2" />
                    Early Access
                  </div>
                  <h3 className="mt-3 text-2xl font-display text-charcoal sm:mt-5 sm:text-display-md">ClinicNest</h3>
                  <p className="mt-1 text-sm text-gray-500 sm:mt-2 sm:text-base">Operating system for Clinics & Practices</p>
                  <p className="mt-2 text-xs leading-relaxed text-gray-500 sm:mt-4 sm:text-sm">
                    Appointment scheduling, patient records, prescription management, and automated reminders.
                    Built for clinics that want to eliminate paperwork and reduce no-shows.
                    No complexity. No training required.
                  </p>
                  <div className="mt-4 flex flex-col gap-2 sm:mt-6 sm:flex-row sm:items-center sm:gap-6">
                    <Link href="/ecosystems/clinicnest">
                      <button className="min-h-[48px] w-full rounded-full bg-charcoal px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-charcoal/90 sm:w-auto sm:px-6 sm:py-2.5">
                        Join Waitlist &rarr;
                      </button>
                    </Link>
                    <Link href="/ecosystems/clinicnest">
                      <span className="text-center text-sm font-medium text-lavender transition-colors hover:text-lavender-hover sm:text-left">
                        Learn More &rarr;
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </FadeIn>

            {/* FreelanceNest & PropertyNest — Coming Soon */}
            <FadeIn delay={150}>
              <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                {[
                  { name: 'FreelanceNest', tagline: 'For Freelancers', desc: 'Project tracking, invoicing, client management, and portfolio tools for independent professionals.', initial: 'F' },
                  { name: 'PropertyNest', tagline: 'For Real Estate', desc: 'Property listings, inquiry management, tour scheduling, and deal tracking for real estate professionals.', initial: 'P' },
                ].map((p) => (
                  <div key={p.name} className="rounded-2xl border border-dashed border-border-light bg-gray-50/50 p-5 sm:p-8">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-200 text-sm font-bold text-gray-400 sm:h-10 sm:w-10">{p.initial}</div>
                      <div>
                        <h4 className="text-sm font-semibold text-charcoal sm:text-base">{p.name}</h4>
                        <p className="text-xs text-gray-500 sm:text-sm">{p.tagline}</p>
                      </div>
                      <span className="ml-auto whitespace-nowrap rounded-full bg-gray-100 px-2.5 py-0.5 text-[10px] font-medium text-gray-500 sm:px-3 sm:py-1 sm:text-xs">Coming Soon</span>
                    </div>
                    <p className="mt-3 text-xs leading-relaxed text-gray-500 sm:mt-4 sm:text-sm">{p.desc}</p>
                    <Link href={`/ecosystems/${p.name.toLowerCase().replace('nest', '')}nest`}>
                      <span className="mt-3 inline-block text-xs font-medium text-lavender transition-colors hover:text-lavender-hover sm:mt-4 sm:text-sm">
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
      <section className="px-4 py-14 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <FadeIn>
            <div className="mx-auto max-w-xl text-center">
              <p className="text-[10px] font-medium uppercase tracking-widest text-gray-500 sm:text-xs">Why MicroNest</p>
              <h2 className="mt-3 text-2xl font-display text-charcoal sm:mt-4 sm:text-display-md">
                Infrastructure designed for multi-business operations
              </h2>
            </div>
          </FadeIn>

          <div className="mt-10 grid gap-8 sm:grid-cols-2 sm:gap-10 lg:grid-cols-4">
            <FadeIn delay={0}>
              <PillarDiagram
                title="One Login"
                description="One account gives you access to every ecosystem. No separate registrations, no password fatigue."
              >
                <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
              </PillarDiagram>
            </FadeIn>

            <FadeIn delay={80}>
              <PillarDiagram
                title="Shared Billing"
                description="One subscription covers all your active ecosystems. Pay once. Use everything you need."
              >
                <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                </svg>
              </PillarDiagram>
            </FadeIn>

            <FadeIn delay={160}>
              <PillarDiagram
                title="Shared Analytics"
                description="View performance across all ecosystems from one dashboard. Compare, analyze, optimize."
              >
                <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                </svg>
              </PillarDiagram>
            </FadeIn>

            <FadeIn delay={240}>
              <PillarDiagram
                title="Shared Infrastructure"
                description="Ecosystems share auth, notifications, and data layer. New products feel instantly familiar."
              >
                <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25z" />
                </svg>
              </PillarDiagram>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ════════ 5. Product Ecosystem Map ════════ */}
      <section className="bg-white border-y border-border-light px-4 py-14 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <FadeIn>
            <div className="mx-auto max-w-xl text-center">
              <p className="text-[10px] font-medium uppercase tracking-widest text-gray-500 sm:text-xs">Ecosystem Map</p>
              <h2 className="mt-3 text-2xl font-display text-charcoal sm:mt-4 sm:text-display-md">
                One platform. Four operating systems.
              </h2>
              <p className="mt-2 text-sm text-gray-500 sm:mt-3 sm:text-base">
                Activate what you need. Add more as you grow. Everything works together.
              </p>
            </div>
          </FadeIn>

          <div className="mt-10 sm:mt-14">
            <EcosystemMap />
          </div>
        </div>
      </section>

      {/* ════════ 6. Social Proof — 2-column mobile grid ════════ */}
      <section className="px-4 py-14 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <FadeIn>
            <div className="mx-auto max-w-xl text-center">
              <p className="text-[10px] font-medium uppercase tracking-widest text-gray-500 sm:text-xs">Platform Metrics</p>
              <h2 className="mt-3 text-2xl font-display text-charcoal sm:mt-4 sm:text-display-md">
                Growing with businesses like yours
              </h2>
            </div>
          </FadeIn>

          <div className="mt-10 grid grid-cols-2 gap-3 sm:mt-14 sm:gap-6 lg:grid-cols-4">
            {[
              { label: 'Residents Managed', end: 1000, suffix: '+' },
              { label: 'Rent Payments Tracked', end: 500, suffix: '+' },
              { label: 'Maintenance Requests Closed', end: 100, suffix: '+' },
              { label: 'Active Properties', end: 50, suffix: '+' },
            ].map((stat, i) => (
              <FadeIn key={stat.label} delay={i * 80}>
                <div className="rounded-2xl border border-border-light bg-white px-4 py-6 text-center transition-shadow hover:shadow-sm sm:px-6 sm:py-8">
                  <p className="text-2xl font-semibold tracking-tight text-charcoal sm:text-4xl">
                    <CountUp end={stat.end} suffix={stat.suffix} />
                  </p>
                  <p className="mt-1 text-[11px] text-gray-500 sm:mt-2 sm:text-sm">{stat.label}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ 7. Roadmap ════════ */}
      <section className="bg-white border-y border-border-light px-4 py-14 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <FadeIn>
            <div className="mx-auto max-w-xl text-center">
              <p className="text-[10px] font-medium uppercase tracking-widest text-gray-500 sm:text-xs">Roadmap</p>
              <h2 className="mt-3 text-2xl font-display text-charcoal sm:mt-4 sm:text-display-md">
                What&rsquo;s available and what&rsquo;s next
              </h2>
            </div>
          </FadeIn>

          <div className="relative mx-auto mt-10 max-w-3xl sm:mt-14">
            <div className="absolute left-5 top-0 h-full w-px bg-border-light sm:left-6" />

            <div className="space-y-6 sm:space-y-8">
              {[
                { name: 'StayNest', status: 'Available Now', color: 'bg-green-500', textColor: 'text-green-700', badgeBg: 'bg-green-50', desc: 'Production ready. Full feature set including rent tracking, maintenance, visitors, WhatsApp notifications, and analytics.' },
                { name: 'ClinicNest', status: 'Early Access', color: 'bg-amber-500', textColor: 'text-amber-700', badgeBg: 'bg-amber-50', desc: 'Early access phase. Appointments, patient records, and prescriptions available. More modules in development.' },
                { name: 'FreelanceNest', status: 'In Development', color: 'bg-lavender', textColor: 'text-lavender', badgeBg: 'bg-lavender/10', desc: 'Project tracking, invoicing, and client management tools under active development.' },
                { name: 'PropertyNest', status: 'In Development', color: 'bg-lavender', textColor: 'text-lavender', badgeBg: 'bg-lavender/10', desc: 'Property listings, inquiry management, and deal tracking being built for real estate professionals.' },
              ].map((item, i) => (
                <FadeIn key={item.name} delay={i * 80}>
                  <div className="relative flex items-start gap-4 pl-12 sm:gap-6 sm:pl-14">
                    <div className={`absolute left-3 top-2 z-10 flex h-3.5 w-3.5 rounded-full ${item.color} ring-4 ring-white sm:left-4 sm:h-4 sm:w-4`} />
                    <div className="flex-1 rounded-xl border border-border-light bg-white p-4 sm:p-5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h3 className="text-sm font-semibold text-charcoal sm:text-base">{item.name}</h3>
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium sm:px-2.5 sm:py-0.5 sm:text-xs ${item.badgeBg} ${item.textColor}`}>
                          {item.status}
                        </span>
                      </div>
                      <p className="mt-1.5 text-xs leading-relaxed text-gray-500 sm:mt-2 sm:text-sm">{item.desc}</p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════ 8. Final CTA ════════ */}
      <section className="bg-charcoal px-4 py-20 sm:px-6 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <FadeIn>
            <p className="text-[10px] font-medium uppercase tracking-widest text-gray-500 sm:text-xs">Get Started</p>
            <h2 className="mt-4 text-2xl font-display text-white sm:mt-5 sm:text-display-md">
              Start with one ecosystem.
              <br />
              Expand when you&rsquo;re ready.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-400 sm:mt-4 sm:text-lg">
              Free plan included. No credit card required. Set up your first ecosystem in under a minute.
            </p>
            <div className="mt-8 sm:mt-10">
              <Link href="/signup">
                <button className="min-h-[48px] rounded-full bg-white px-8 py-3 text-sm font-medium text-charcoal transition-colors hover:bg-white/90 sm:px-10 sm:py-3.5 sm:text-base">
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
