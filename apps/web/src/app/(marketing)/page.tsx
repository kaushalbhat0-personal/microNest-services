import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Run your business without spreadsheets',
  description:
    'Purpose-built software for PG owners, clinics, freelancers, and real estate professionals. One account. Multiple businesses.',
  openGraph: {
    title: 'MicroNest — Run your business without spreadsheets',
    description:
      'Software built specifically for PGs, clinics, freelancers, and real estate businesses.',
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

export default function HomePage() {
  return (
    <div className="bg-cream font-body text-charcoal">
      {/* ════════ Section 1 — Hero ════════ */}
      <section className="overflow-hidden border-b border-border-light px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <FadeIn>
              <div className="max-w-lg">
                <div className="inline-flex items-center gap-2 rounded-full border border-border-light bg-white/60 px-3 py-1 text-xs font-medium text-gray-500">
                  <span className="flex h-4 w-4 items-center justify-center rounded bg-charcoal text-[8px] font-bold text-white">M</span>
                  One platform for your business
                </div>
                <h1 className="mt-4 text-display-xl font-display leading-[1.05] tracking-tight text-charcoal">
                  Run your business
                  <br />
                  <span className="text-lavender">without spreadsheets.</span>
                </h1>
                <p className="mt-4 text-lg leading-relaxed text-gray-500">
                  Software built specifically for PGs, clinics, freelancers, and real estate businesses.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link href="/ecosystems/staynest">
                    <button className="rounded-full bg-charcoal px-7 py-3 text-sm font-medium text-white transition-colors hover:bg-charcoal/90">
                      Explore StayNest
                    </button>
                  </Link>
                  <Link href="/ecosystems">
                    <button className="rounded-full border border-border-light bg-white px-7 py-3 text-sm font-medium text-charcoal transition-colors hover:bg-gray-50">
                      See Ecosystems
                    </button>
                  </Link>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={150}>
              <div className="rounded-card-lg border border-border-light bg-white p-4 shadow-sm sm:p-6">
                <div className="mb-4 flex items-center justify-between border-b border-border-light pb-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded bg-charcoal text-[10px] font-bold text-white">S</div>
                    <span className="text-sm font-semibold text-charcoal">StayNest</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="flex h-2 w-2 rounded-full bg-green-500" />
                    <span className="text-xs text-gray-500">Live</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div className="rounded-lg bg-cream p-3">
                    <p className="text-xs text-gray-500">Residents</p>
                    <p className="text-xl font-semibold text-charcoal">30</p>
                    <p className="text-xs text-green-600">28 active</p>
                  </div>
                  <div className="rounded-lg bg-cream p-3">
                    <p className="text-xs text-gray-500">Rooms</p>
                    <p className="text-xl font-semibold text-charcoal">15</p>
                    <p className="text-xs text-gray-500">12 occupied</p>
                  </div>
                  <div className="rounded-lg bg-cream p-3">
                    <p className="text-xs text-gray-500">Pending Rent</p>
                    <p className="text-xl font-semibold text-charcoal">₹72K</p>
                    <p className="text-xs text-red-500">₹24K overdue</p>
                  </div>
                  <div className="rounded-lg bg-cream p-3">
                    <p className="text-xs text-gray-500">Open Maint.</p>
                    <p className="text-xl font-semibold text-charcoal">4</p>
                    <p className="text-xs text-gray-500">2 high priority</p>
                  </div>
                </div>
                <div className="mt-4 flex h-12 items-end gap-1.5">
                  <div className="w-full rounded-t bg-lavender/20" style={{ height: '40%' }} />
                  <div className="w-full rounded-t bg-lavender/30" style={{ height: '60%' }} />
                  <div className="w-full rounded-t bg-lavender/40" style={{ height: '75%' }} />
                  <div className="w-full rounded-t bg-lavender/50" style={{ height: '55%' }} />
                  <div className="w-full rounded-t bg-lavender/60" style={{ height: '85%' }} />
                  <div className="w-full rounded-t bg-lavender/70" style={{ height: '65%' }} />
                  <div className="w-full rounded-t bg-lavender/80" style={{ height: '90%' }} />
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ════════ Section 2 — Problem ════════ */}
      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <FadeIn>
            <div className="mx-auto max-w-xl text-center">
              <h2 className="text-display-md font-display text-charcoal">
                Generic software was never built for your business.
              </h2>
            </div>
          </FadeIn>
          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: 'PG Owners',
                problem: 'Tracking rent in WhatsApp',
                desc: 'Spreadsheets and chat threads. No real view of who paid, who owes, or what\'s overdue.',
              },
              {
                title: 'Clinics',
                problem: 'Missed appointments',
                desc: 'Patients forget. No automated reminders. Empty slots cost you revenue every day.',
              },
              {
                title: 'Freelancers',
                problem: 'Scattered projects',
                desc: 'Clients across platforms. invoices in different tools. No single source of truth.',
              },
              {
                title: 'Real Estate',
                problem: 'Lead management chaos',
                desc: 'Inquiries lost in messages. No follow-up system. Deals slip through the cracks.',
              },
            ].map((item, i) => (
              <FadeIn key={item.title} delay={i * 80}>
                <div className="rounded-card border border-border-light bg-white p-5 transition-shadow hover:shadow-sm">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-lavender/10 text-sm font-bold text-lavender">
                    {item.title.charAt(0)}
                  </div>
                  <h3 className="mt-3 text-sm font-semibold uppercase tracking-wider text-gray-500">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-base font-semibold text-charcoal">{item.problem}</p>
                  <p className="mt-2 text-sm leading-relaxed text-gray-500">{item.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ Section 3 — Ecosystem Showcase ════════ */}
      <section className="bg-white px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <FadeIn>
            <div className="mx-auto max-w-xl text-center">
              <h2 className="text-display-md font-display text-charcoal">
                Choose your ecosystem
              </h2>
              <p className="mt-3 text-lg text-gray-500">
                Each one is purpose-built for your industry. Not a generic tool with your logo on it.
              </p>
            </div>
          </FadeIn>

          <div className="mt-10 space-y-6">
            {/* StayNest — Large Card */}
            <FadeIn>
              <div className="rounded-card-lg border border-border-light bg-cream p-6 transition-shadow hover:shadow-md sm:p-8 lg:p-10">
                <div className="grid items-center gap-8 lg:grid-cols-2">
                  <div>
                    <div className="inline-flex items-center gap-2 rounded-full border border-border-light bg-white px-3 py-1 text-xs font-medium text-green-600">
                      <span className="flex h-2 w-2 rounded-full bg-green-500" />
                      Live — Production Ready
                    </div>
                    <h3 className="mt-4 text-display-md font-display text-charcoal">StayNest</h3>
                    <p className="mt-2 text-base text-gray-500">For PG & Hostel Owners</p>
                    <p className="mt-3 text-sm leading-relaxed text-gray-500">
                      Manage residents, rooms, rent, maintenance, visitors, and announcements — all from one dashboard.
                      WhatsApp notifications keep everyone in the loop.
                    </p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {['Residents', 'Rooms', 'Rent', 'Maintenance', 'Visitors', 'WhatsApp'].map((f) => (
                        <span key={f} className="inline-flex items-center rounded-full bg-white px-3 py-1 text-xs font-medium text-charcoal ring-1 ring-border-light">
                          {f}
                        </span>
                      ))}
                    </div>
                    <div className="mt-6">
                      <Link href="/ecosystems/staynest">
                        <button className="rounded-full bg-charcoal px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-charcoal/90">
                          Explore StayNest &rarr;
                        </button>
                      </Link>
                    </div>
                  </div>
                  <div className="rounded-card-lg border border-border-light bg-white p-4 shadow-sm sm:p-6">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-lg bg-cream p-3">
                        <p className="text-xs text-gray-500">Monthly Collection</p>
                        <p className="text-lg font-semibold text-charcoal">₹1,42,000</p>
                      </div>
                      <div className="rounded-lg bg-cream p-3">
                        <p className="text-xs text-gray-500">Occupancy</p>
                        <p className="text-lg font-semibold text-charcoal">87%</p>
                      </div>
                    </div>
                    <div className="mt-3 space-y-2">
                      {[
                        { name: 'Amit Sharma', room: '101', status: 'Paid' },
                        { name: 'Priya Patel', room: '102', status: 'Pending' },
                        { name: 'Rahul Verma', room: '103', status: 'Overdue' },
                      ].map((r) => (
                        <div key={r.name} className="flex items-center justify-between rounded-lg bg-cream px-3 py-2">
                          <div className="flex items-center gap-2">
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-lavender/20 text-[10px] font-medium text-lavender">
                              {r.name.charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-charcoal">{r.name}</p>
                              <p className="text-xs text-gray-500">Room {r.room}</p>
                            </div>
                          </div>
                          <span className={`text-xs font-medium ${r.status === 'Paid' ? 'text-green-600' : r.status === 'Pending' ? 'text-amber-600' : 'text-red-600'}`}>
                            {r.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>

            {/* ClinicNest — Large Card */}
            <FadeIn delay={100}>
              <div className="rounded-card-lg border border-border-light bg-cream p-6 transition-shadow hover:shadow-md sm:p-8 lg:p-10">
                <div className="grid items-center gap-8 lg:grid-cols-2">
                  <div className="order-last lg:order-first">
                    <div className="rounded-card-lg border border-border-light bg-white p-4 shadow-sm sm:p-6">
                      <div className="space-y-3">
                        {[
                          { patient: 'Ananya Gupta', time: '10:00 AM', type: 'Checkup', status: 'Confirmed' },
                          { patient: 'Vikram Singh', time: '11:30 AM', type: 'Follow-up', status: 'Checked In' },
                          { patient: 'Neha Joshi', time: '2:00 PM', type: 'Consultation', status: 'Pending' },
                        ].map((a) => (
                          <div key={a.patient} className="flex items-center justify-between rounded-lg bg-cream px-3 py-2">
                            <div className="flex items-center gap-2">
                              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-lavender/20 text-[10px] font-medium text-lavender">
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
                    <div className="inline-flex items-center gap-2 rounded-full border border-border-light bg-white px-3 py-1 text-xs font-medium text-amber-600">
                      <span className="flex h-2 w-2 rounded-full bg-amber-500" />
                      Early Access
                    </div>
                    <h3 className="mt-4 text-display-md font-display text-charcoal">ClinicNest</h3>
                    <p className="mt-2 text-base text-gray-500">For Clinics & Practices</p>
                    <p className="mt-3 text-sm leading-relaxed text-gray-500">
                      Appointment scheduling, patient records, prescription management, and automated reminders.
                      Built for clinics that want to go digital without the complexity.
                    </p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {['Appointments', 'Patients', 'Prescriptions', 'Reminders'].map((f) => (
                        <span key={f} className="inline-flex items-center rounded-full bg-white px-3 py-1 text-xs font-medium text-charcoal ring-1 ring-border-light">
                          {f}
                        </span>
                      ))}
                    </div>
                    <div className="mt-6">
                      <Link href="/ecosystems/clinicnest">
                        <button className="rounded-full bg-charcoal px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-charcoal/90">
                          Join Waitlist &rarr;
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>

            {/* Coming Soon — Smaller Cards */}
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  name: 'FreelanceNest',
                  tagline: 'For Freelancers',
                  desc: 'Project tracking, invoicing, and client management for independent professionals.',
                  icon: 'F',
                },
                {
                  name: 'PropertyNest',
                  tagline: 'For Real Estate',
                  desc: 'Property listings, inquiries, tours, and deal management for real estate professionals.',
                  icon: 'P',
                },
              ].map((item, i) => (
                <FadeIn key={item.name} delay={i * 80}>
                  <div className="rounded-card-lg border border-border-light bg-white p-6 opacity-70 sm:p-8">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-200 text-sm font-bold text-gray-500">
                        {item.icon}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-charcoal">{item.name}</h3>
                        <p className="text-sm text-gray-500">{item.tagline}</p>
                      </div>
                      <div className="ml-auto">
                        <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-500">
                          Coming Soon
                        </span>
                      </div>
                    </div>
                    <p className="mt-4 text-sm leading-relaxed text-gray-500">{item.desc}</p>
                  </div>
                </FadeIn>
              ))}
            </div>

            <FadeIn delay={150}>
              <div className="text-center">
                <Link href="/ecosystems">
                  <button className="rounded-full border border-border-light bg-white px-6 py-2.5 text-sm font-medium text-charcoal transition-colors hover:bg-gray-50">
                    View Ecosystem Roadmap &rarr;
                  </button>
                </Link>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ════════ Section 4 — Why Customers Choose MicroNest ════════ */}
      <section className="border-y border-border-light px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <FadeIn>
            <div className="mx-auto max-w-xl text-center">
              <h2 className="text-display-md font-display text-charcoal">
                Why customers choose MicroNest
              </h2>
            </div>
          </FadeIn>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              {
                title: 'Purpose Built',
                desc: 'Every ecosystem is built from the ground up for one industry. Not a generic CRM with your logo on it.',
                icon: (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                ),
              },
              {
                title: 'Unified Login',
                desc: 'One account. Access every ecosystem your business needs. No separate logins, no data silos.',
                icon: (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z" />
                  </svg>
                ),
              },
              {
                title: 'Grow Together',
                desc: 'New ecosystems unlock over time. Start with one, add more as your business grows. No migration needed.',
                icon: (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                  </svg>
                ),
              },
            ].map((item, i) => (
              <FadeIn key={item.title} delay={i * 80}>
                <div className="rounded-card border border-border-light bg-white p-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-lavender/10 text-lavender">
                    {item.icon}
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-charcoal">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-500">{item.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ Section 5 — Real Screens ════════ */}
      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <FadeIn>
            <div className="mx-auto max-w-xl text-center">
              <h2 className="text-display-md font-display text-charcoal">
                See the actual software
              </h2>
              <p className="mt-3 text-lg text-gray-500">
                No illustrations. No mock concepts. This is what you get.
              </p>
            </div>
          </FadeIn>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {[
              {
                title: 'StayNest Analytics',
                desc: 'Revenue, occupancy, and maintenance metrics calculated from your data in real time.',
                content: (
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-2">
                      <div className="rounded-lg bg-cream p-2 text-center">
                        <p className="text-[10px] text-gray-500">Revenue</p>
                        <p className="text-sm font-semibold text-charcoal">₹1.4L</p>
                      </div>
                      <div className="rounded-lg bg-cream p-2 text-center">
                        <p className="text-[10px] text-gray-500">Occupancy</p>
                        <p className="text-sm font-semibold text-charcoal">87%</p>
                      </div>
                      <div className="rounded-lg bg-cream p-2 text-center">
                        <p className="text-[10px] text-gray-500">Overdue</p>
                        <p className="text-sm font-semibold text-red-600">₹24K</p>
                      </div>
                    </div>
                    <div className="flex h-12 items-end gap-1">
                      <div className="w-full rounded-t bg-lavender/20" style={{ height: '35%' }} />
                      <div className="w-full rounded-t bg-lavender/30" style={{ height: '55%' }} />
                      <div className="w-full rounded-t bg-lavender/40" style={{ height: '70%' }} />
                      <div className="w-full rounded-t bg-lavender/50" style={{ height: '50%' }} />
                      <div className="w-full rounded-t bg-lavender/60" style={{ height: '80%' }} />
                      <div className="w-full rounded-t bg-lavender/70" style={{ height: '60%' }} />
                    </div>
                  </div>
                ),
              },
              {
                title: 'Rent Collection',
                desc: 'See who paid, who hasn\'t, and who\'s overdue. One click to mark payments.',
                content: (
                  <div className="space-y-1.5">
                    {[
                      { name: 'Room 101', amount: '₹8,000', status: 'Paid', color: 'text-green-600' },
                      { name: 'Room 102', amount: '₹8,000', status: 'Pending', color: 'text-amber-600' },
                      { name: 'Room 103', amount: '₹8,500', status: 'Overdue', color: 'text-red-600' },
                      { name: 'Room 201', amount: '₹9,000', status: 'Paid', color: 'text-green-600' },
                    ].map((r) => (
                      <div key={r.name} className="flex items-center justify-between rounded-lg bg-cream px-3 py-2">
                        <span className="text-sm font-medium text-charcoal">{r.name}</span>
                        <div className="text-right">
                          <p className="text-sm text-charcoal">{r.amount}</p>
                          <p className={`text-xs ${r.color}`}>{r.status}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ),
              },
              {
                title: 'Resident Directory',
                desc: 'Complete profiles with emergency contacts, room assignments, and move-in history.',
                content: (
                  <div className="space-y-1.5">
                    {[
                      { name: 'Ananya', room: '301', phone: '+91 98765 43210' },
                      { name: 'Vikram', room: '302', phone: '+91 87654 32109' },
                      { name: 'Neha', room: '303', phone: '+91 76543 21098' },
                    ].map((r) => (
                      <div key={r.name} className="flex items-center justify-between rounded-lg bg-cream px-3 py-2">
                        <div className="flex items-center gap-2">
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-lavender/20 text-xs font-medium text-lavender">
                            {r.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-charcoal">{r.name}</p>
                            <p className="text-xs text-gray-500">Room {r.room}</p>
                          </div>
                        </div>
                        <span className="text-xs text-gray-500">{r.phone}</span>
                      </div>
                    ))}
                  </div>
                ),
              },
              {
                title: 'Maintenance Board',
                desc: 'Track requests from open to resolved. Residents report issues. You manage them.',
                content: (
                  <div className="space-y-1.5">
                    {[
                      { issue: 'AC not working', room: '101', status: 'In Progress' },
                      { issue: 'Water leak', room: '203', status: 'Open' },
                      { issue: 'Broken window', room: '105', status: 'Resolved' },
                    ].map((m) => (
                      <div key={m.issue} className="flex items-center justify-between rounded-lg bg-cream px-3 py-2">
                        <div>
                          <p className="text-sm font-medium text-charcoal">{m.issue}</p>
                          <p className="text-xs text-gray-500">Room {m.room}</p>
                        </div>
                        <span className={`text-xs font-medium ${
                          m.status === 'Resolved' ? 'text-green-600' :
                          m.status === 'In Progress' ? 'text-lavender' : 'text-amber-600'
                        }`}>
                          {m.status}
                        </span>
                      </div>
                    ))}
                  </div>
                ),
              },
            ].map((item, i) => (
              <FadeIn key={item.title} delay={i * 80}>
                <div className="rounded-card-lg border border-border-light bg-white p-5 transition-shadow hover:shadow-md sm:p-6">
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-semibold text-charcoal">{item.title}</h3>
                      <p className="text-xs text-gray-500">{item.desc}</p>
                    </div>
                  </div>
                  {item.content}
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ Section 6 — Social Proof ════════ */}
      <section className="bg-white border-t border-border-light px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <FadeIn>
            <div className="mx-auto max-w-xl text-center">
              <h2 className="text-display-md font-display text-charcoal">
                Trusted by business owners like you
              </h2>
            </div>
          </FadeIn>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              {
                quote: 'Stop managing your PG with WhatsApp and sticky notes. MicroNest gives you a real dashboard, and the WhatsApp integration means my tenants actually pay on time now.',
                name: 'PG Owner',
                role: 'Manages 15 rooms',
              },
              {
                quote: 'We were using three different tools for appointments, billing, and patient records. Now it\'s all in one place. The early access is solid.',
                name: 'Clinic Owner',
                role: 'Single practice',
              },
              {
                quote: 'As a freelancer, I\'ve been waiting for something like this. One place for projects, invoices, and client management without the bloat.',
                name: 'Freelancer',
                role: 'Product designer',
              },
            ].map((item, i) => (
              <FadeIn key={item.name} delay={i * 80}>
                <div className="rounded-card border border-border-light bg-cream p-6">
                  <svg className="h-5 w-5 text-lavender/40" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                  <p className="mt-3 text-sm leading-relaxed text-gray-600">&ldquo;{item.quote}&rdquo;</p>
                  <div className="mt-5 flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-lavender/20 text-xs font-medium text-lavender">
                      {item.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-charcoal">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.role}</p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ Section 7 — Pricing Preview ════════ */}
      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <FadeIn>
            <div className="mx-auto max-w-xl text-center">
              <p className="text-xs font-medium uppercase tracking-widest text-gray-500">Pricing</p>
              <h2 className="mt-3 text-display-md font-display text-charcoal">
                Start free. Grow with us.
              </h2>
              <p className="mt-3 text-lg text-gray-500">
                No hidden fees. No long-term contracts. Cancel anytime.
              </p>
            </div>
          </FadeIn>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              {
                name: 'Starter',
                price: 'Free',
                period: 'forever',
                desc: 'For small PGs just getting started.',
                features: ['Up to 10 residents', 'Up to 5 rooms', 'Rent tracking', 'Visitor log', 'Basic notifications'],
                cta: 'Start Free',
                href: '/signup',
                featured: false,
              },
              {
                name: 'Growth',
                price: '₹999',
                period: '/month',
                desc: 'For growing hostels and co-living spaces.',
                features: ['Unlimited residents', 'Unlimited rooms', 'Full rent + receipts', 'Maintenance & announcements', 'WhatsApp notifications', 'Analytics dashboard'],
                cta: 'Start Free Trial',
                href: '/signup',
                featured: true,
              },
              {
                name: 'Pro',
                price: 'Custom',
                period: '',
                desc: 'For multi-property operators.',
                features: ['Everything in Growth', 'Multi-property support', 'Custom integrations', 'Priority support', 'Dedicated account manager'],
                cta: 'Contact Sales',
                href: 'mailto:sales@micronest.app',
                featured: false,
              },
            ].map((tier, i) => (
              <FadeIn key={tier.name} delay={i * 80}>
                <div className={`rounded-card border p-6 ${
                  tier.featured
                    ? 'border-lavender/30 bg-white shadow-md ring-1 ring-lavender/20'
                    : 'border-border-light bg-white'
                }`}>
                  {tier.featured && (
                    <span className="inline-block rounded-full bg-lavender/10 px-3 py-0.5 text-xs font-medium text-lavender">
                      Most Popular
                    </span>
                  )}
                  <h3 className="mt-3 text-base font-semibold text-charcoal">{tier.name}</h3>
                  <div className="mt-2">
                    <span className="text-display-md font-display text-charcoal">{tier.price}</span>
                    {tier.period && <span className="ml-1 text-sm text-gray-500">{tier.period}</span>}
                  </div>
                  <p className="mt-1 text-sm text-gray-500">{tier.desc}</p>
                  <ul className="mt-6 space-y-2.5">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                        <svg className="h-4 w-4 shrink-0 text-lavender" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8">
                    <Link href={tier.href}>
                      <button className={`w-full rounded-full px-4 py-2.5 text-sm font-medium transition-colors ${
                        tier.featured
                          ? 'bg-charcoal text-white hover:bg-charcoal/90'
                          : 'border border-border-light bg-white text-charcoal hover:bg-gray-50'
                      }`}>
                        {tier.cta}
                      </button>
                    </Link>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
          <FadeIn delay={250}>
            <div className="mt-8 text-center">
              <Link href="/pricing">
                <button className="rounded-full border border-border-light bg-white px-6 py-2.5 text-sm font-medium text-charcoal transition-colors hover:bg-gray-50">
                  Compare all plans &rarr;
                </button>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ════════ Section 8 — Final CTA ════════ */}
      <section className="bg-charcoal px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <FadeIn>
            <h2 className="text-display-md font-display text-white">
              Start with StayNest today.
            </h2>
            <p className="mt-4 text-lg text-gray-400">
              Free plan included. No credit card required. Set up in under a minute.
            </p>
            <div className="mt-8">
              <Link href="/signup">
                <button className="rounded-full bg-white px-8 py-3 text-sm font-medium text-charcoal transition-colors hover:bg-white/90">
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
