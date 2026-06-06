import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Ecosystems',
  description:
    'Explore MicroNest ecosystems — StayNest for PG & hostel owners, ClinicNest for clinics, FreelanceNest for freelancers, PropertyNest for real estate.',
  openGraph: {
    title: 'Ecosystems | MicroNest',
    description:
      'Purpose-built business software for PGs, clinics, freelancers, and real estate.',
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

export default function EcosystemsPage() {
  return (
    <div className="bg-cream font-body text-charcoal">
      {/* ════════ Header ════════ */}
      <section className="border-b border-border-light px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <FadeIn>
            <div className="mx-auto max-w-xl text-center">
              <h1 className="text-display-lg font-display text-charcoal">
                Our ecosystems
              </h1>
              <p className="mt-4 text-lg text-gray-500">
                Each ecosystem is purpose-built for its industry. Not a generic tool — 
                software that understands how your business works.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ════════ Available Now ════════ */}
      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <FadeIn>
            <div className="flex items-center gap-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-xs font-bold text-green-700">
                ✓
              </span>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
                Available Now
              </h2>
            </div>
          </FadeIn>

          <div className="mt-8 space-y-8">
            {/* StayNest */}
            <FadeIn>
              <div className="rounded-card-lg border border-border-light bg-white p-6 transition-shadow hover:shadow-md sm:p-8 lg:p-10">
                <div className="grid items-center gap-8 lg:grid-cols-2">
                  <div>
                    <div className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                      <span className="flex h-2 w-2 rounded-full bg-green-500" />
                      Production Ready
                    </div>
                    <h3 className="mt-4 text-display-md font-display text-charcoal">StayNest</h3>
                    <p className="mt-2 text-base text-gray-500">For PG & Hostel Owners</p>
                    <p className="mt-3 text-sm leading-relaxed text-gray-500">
                      Everything you need to run your PG or hostel. Resident management, room inventory, 
                      rent tracking with payment status, maintenance workflow, digital visitor log, 
                      announcements, analytics dashboard, and automated WhatsApp notifications.
                    </p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {['Residents', 'Rooms', 'Rent', 'Maintenance', 'Visitors', 'WhatsApp', 'Analytics', 'Announcements'].map((f) => (
                        <span key={f} className="inline-flex items-center rounded-full bg-cream px-3 py-1 text-xs font-medium text-charcoal ring-1 ring-border-light">
                          {f}
                        </span>
                      ))}
                    </div>
                    <div className="mt-6 flex flex-wrap gap-3">
                      <Link href="/ecosystems/staynest">
                        <button className="rounded-full bg-charcoal px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-charcoal/90">
                          Explore StayNest &rarr;
                        </button>
                      </Link>
                      <Link href="/signup">
                        <button className="rounded-full border border-border-light bg-white px-6 py-2.5 text-sm font-medium text-charcoal transition-colors hover:bg-gray-50">
                          Start Free
                        </button>
                      </Link>
                    </div>
                  </div>
                  <div className="rounded-card-lg border border-border-light bg-cream p-4 shadow-sm sm:p-6">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-lg bg-white p-3">
                        <p className="text-xs text-gray-500">Monthly Collection</p>
                        <p className="text-lg font-semibold text-charcoal">₹1,42,000</p>
                      </div>
                      <div className="rounded-lg bg-white p-3">
                        <p className="text-xs text-gray-500">Occupancy</p>
                        <p className="text-lg font-semibold text-charcoal">87%</p>
                      </div>
                    </div>
                    <div className="mt-3 space-y-2">
                      {[
                        { name: 'Amit Sharma', room: '101', status: 'Paid' },
                        { name: 'Priya Patel', room: '102', status: 'Pending' },
                        { name: 'Rahul Verma', room: '103', status: 'Overdue' },
                        { name: 'Sneha Rao', room: '201', status: 'Paid' },
                      ].map((r) => (
                        <div key={r.name} className="flex items-center justify-between rounded-lg bg-white px-3 py-2">
                          <div className="flex items-center gap-2">
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-lavender/20 text-[10px] font-medium text-lavender">
                              {r.name.charAt(0)}
                            </div>
                            <span className="text-sm text-charcoal">{r.name}</span>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-500">Room {r.room}</p>
                            <p className={`text-xs font-medium ${r.status === 'Paid' ? 'text-green-600' : r.status === 'Pending' ? 'text-amber-600' : 'text-red-600'}`}>
                              {r.status}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>

            {/* ClinicNest */}
            <FadeIn delay={100}>
              <div className="rounded-card-lg border border-border-light bg-white p-6 transition-shadow hover:shadow-md sm:p-8 lg:p-10">
                <div className="grid items-center gap-8 lg:grid-cols-2">
                  <div className="order-last lg:order-first">
                    <div className="rounded-card-lg border border-border-light bg-cream p-4 shadow-sm sm:p-6">
                      <div className="space-y-2">
                        {[
                          { patient: 'Ananya Gupta', time: '10:00 AM', status: 'Confirmed' },
                          { patient: 'Vikram Singh', time: '11:30 AM', status: 'Checked In' },
                          { patient: 'Neha Joshi', time: '2:00 PM', status: 'Pending' },
                        ].map((a) => (
                          <div key={a.patient} className="flex items-center justify-between rounded-lg bg-white px-3 py-2">
                            <div className="flex items-center gap-2">
                              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-lavender/20 text-[10px] font-medium text-lavender">
                                {a.patient.charAt(0)}
                              </div>
                              <div>
                                <p className="text-sm text-charcoal">{a.patient}</p>
                                <p className="text-xs text-gray-500">{a.time}</p>
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
                    <h3 className="mt-4 text-display-md font-display text-charcoal">ClinicNest</h3>
                    <p className="mt-2 text-base text-gray-500">For Clinics & Practices</p>
                    <p className="mt-3 text-sm leading-relaxed text-gray-500">
                      Appointment scheduling, patient records, prescription management, and automated reminders. 
                      Built for clinics that want to eliminate paperwork and reduce no-shows.
                    </p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {['Appointments', 'Patient Records', 'Prescriptions', 'Reminders'].map((f) => (
                        <span key={f} className="inline-flex items-center rounded-full bg-cream px-3 py-1 text-xs font-medium text-charcoal ring-1 ring-border-light">
                          {f}
                        </span>
                      ))}
                    </div>
                    <div className="mt-6 flex flex-wrap gap-3">
                      <Link href="/ecosystems/clinicnest">
                        <button className="rounded-full bg-charcoal px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-charcoal/90">
                          Join Waitlist &rarr;
                        </button>
                      </Link>
                      <Link href="/ecosystems/clinicnest">
                        <button className="rounded-full border border-border-light bg-white px-6 py-2.5 text-sm font-medium text-charcoal transition-colors hover:bg-gray-50">
                          Learn More
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ════════ Coming Soon ════════ */}
      <section className="bg-white border-y border-border-light px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <FadeIn>
            <div className="flex items-center gap-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 text-xs font-bold text-gray-500">
                *
              </span>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
                Coming Soon
              </h2>
            </div>
          </FadeIn>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {[
              {
                name: 'FreelanceNest',
                tagline: 'For Freelancers',
                desc: 'Project tracking, invoicing, client management, and portfolio tools for independent professionals.',
                icon: 'F',
              },
              {
                name: 'PropertyNest',
                tagline: 'For Real Estate',
                desc: 'Property listings, inquiry management, tour scheduling, and deal tracking for real estate professionals.',
                icon: 'P',
              },
            ].map((item, i) => (
              <FadeIn key={item.name} delay={i * 80}>
                <div className="rounded-card-lg border border-border-light bg-cream p-6 sm:p-8">
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
                  <div className="mt-4">
                    <Link href={`/ecosystems/${item.name.toLowerCase().replace('nest', '')}nest`}>
                      <button className="rounded-full border border-border-light bg-white px-5 py-2 text-sm font-medium text-charcoal transition-colors hover:bg-gray-50">
                        Get notified &rarr;
                      </button>
                    </Link>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ Roadmap ════════ */}
      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <FadeIn>
            <div className="mx-auto max-w-xl text-center">
              <h2 className="text-display-md font-display text-charcoal">
                Ecosystem roadmap
              </h2>
              <p className="mt-3 text-lg text-gray-500">
                Here&rsquo;s where we are and where we&rsquo;re headed.
              </p>
            </div>
          </FadeIn>

          <div className="relative mx-auto mt-10 max-w-3xl">
            <div className="absolute left-6 top-0 h-full w-px bg-border-light" />

            <div className="space-y-8">
              {[
                { name: 'StayNest', status: 'Live', color: 'bg-green-500', bg: 'bg-green-50', text: 'text-green-700' },
                { name: 'ClinicNest', status: 'Early Access', color: 'bg-amber-500', bg: 'bg-amber-50', text: 'text-amber-700' },
                { name: 'FreelanceNest', status: 'In Development', color: 'bg-lavender', bg: 'bg-lavender/10', text: 'text-lavender' },
                { name: 'PropertyNest', status: 'In Development', color: 'bg-lavender', bg: 'bg-lavender/10', text: 'text-lavender' },
              ].map((item, i) => (
                <FadeIn key={item.name} delay={i * 80}>
                  <div className="relative flex items-start gap-6 pl-14">
                    <div className={`absolute left-4 top-1 z-10 flex h-4 w-4 rounded-full ${item.color} ring-4 ring-cream`} />
                    <div className="flex-1 rounded-card border border-border-light bg-white p-5">
                      <div className="flex items-center justify-between">
                        <h3 className="text-base font-semibold text-charcoal">{item.name}</h3>
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${item.bg} ${item.text}`}>
                          {item.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>

          <FadeIn delay={350}>
            <div className="mt-12 text-center">
              <Link href="/signup">
                <button className="rounded-full bg-charcoal px-7 py-3 text-sm font-medium text-white transition-colors hover:bg-charcoal/90">
                  Get early access &rarr;
                </button>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  )
}
