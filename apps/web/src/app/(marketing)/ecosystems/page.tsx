import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Ecosystems — MicroNest',
  description:
    'Explore MicroNest ecosystems — StayNest for PG & hostel owners, ClinicNest for clinics, FreelanceNest for freelancers, PropertyNest for real estate.',
  openGraph: {
    title: 'Ecosystems | MicroNest',
    description:
      'Purpose-built business operating systems for PGs, clinics, freelancers, and real estate. One platform. Multiple businesses.',
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
      <section className="border-b border-border-light px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <FadeIn>
            <div className="mx-auto max-w-xl text-center">
              <p className="text-xs font-medium uppercase tracking-widest text-gray-500">Platform</p>
              <h1 className="mt-4 text-display-lg font-display text-charcoal">
                Choose your operating system
              </h1>
              <p className="mt-4 text-lg leading-relaxed text-gray-500">
                Each ecosystem is purpose-built for its industry. Activate what you need.
                Add more as you grow. Everything works together under one account.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ════════ Available Now — Featured Showcase ════════ */}
      <section className="px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <FadeIn>
            <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-500">
              Available Now
            </h2>
          </FadeIn>

          <div className="mt-10 space-y-20">
            {/* StayNest — Product Showcase Row */}
            <FadeIn>
              <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                    <span className="flex h-2 w-2 rounded-full bg-green-500" />
                    Production Ready
                  </div>
                  <h3 className="mt-5 text-display-lg font-display text-charcoal">StayNest</h3>
                  <p className="mt-2 text-lg text-gray-500">Operating system for PG & Hostel Owners</p>

                  <div className="mt-6 space-y-4">
                    {[
                      { title: 'Complete resident lifecycle', desc: 'Check-in, room assignment, guardian contacts, move-out history. Everything in one profile.' },
                      { title: 'Rent tracking with status', desc: 'Clear paid, pending, and overdue views. One-click payment marking. Automatic receipt generation.' },
                      { title: 'Maintenance workflow', desc: 'Open → In Progress → Resolved. Residents report issues. You track resolution. Never lose a request.' },
                      { title: 'WhatsApp notifications', desc: 'Automated rent reminders, maintenance updates, and announcements. Residents receive alerts on WhatsApp.' },
                    ].map((f) => (
                      <div key={f.title} className="flex gap-3">
                        <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-lavender/20">
                          <span className="h-1.5 w-1.5 rounded-full bg-lavender" />
                        </span>
                        <div>
                          <p className="text-sm font-medium text-charcoal">{f.title}</p>
                          <p className="text-sm text-gray-500">{f.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 flex flex-wrap gap-3">
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

                <div className="rounded-2xl border border-border-light bg-white p-4 shadow-sm sm:p-6">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-cream p-3">
                      <p className="text-xs text-gray-500">Monthly Collection</p>
                      <p className="text-xl font-semibold text-charcoal">₹1,42,000</p>
                    </div>
                    <div className="rounded-xl bg-cream p-3">
                      <p className="text-xs text-gray-500">Occupancy</p>
                      <p className="text-xl font-semibold text-charcoal">87%</p>
                    </div>
                  </div>
                  <div className="mt-3 space-y-2">
                    {[
                      { name: 'Amit Sharma', room: '101', status: 'Paid' },
                      { name: 'Priya Patel', room: '102', status: 'Pending' },
                      { name: 'Rahul Verma', room: '103', status: 'Overdue' },
                      { name: 'Sneha Rao', room: '201', status: 'Paid' },
                    ].map((r) => (
                      <div key={r.name} className="flex items-center justify-between rounded-xl bg-cream px-3 py-2">
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
            </FadeIn>

            {/* ClinicNest — Product Showcase Row */}
            <FadeIn delay={100}>
              <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
                <div className="order-last lg:order-first">
                  <div className="rounded-2xl border border-border-light bg-white p-4 shadow-sm sm:p-6">
                    <div className="space-y-2">
                      {[
                        { patient: 'Ananya Gupta', time: '10:00 AM', status: 'Confirmed' },
                        { patient: 'Vikram Singh', time: '11:30 AM', status: 'Checked In' },
                        { patient: 'Neha Joshi', time: '2:00 PM', status: 'Pending' },
                      ].map((a) => (
                        <div key={a.patient} className="flex items-center justify-between rounded-xl bg-cream px-3 py-2.5">
                          <div className="flex items-center gap-2.5">
                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-lavender/20 text-[10px] font-medium text-lavender">
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
                  <h3 className="mt-5 text-display-lg font-display text-charcoal">ClinicNest</h3>
                  <p className="mt-2 text-lg text-gray-500">Operating system for Clinics & Practices</p>

                  <div className="mt-6 space-y-4">
                    {[
                      { title: 'Appointment scheduling', desc: 'Book, reschedule, and cancel appointments. Automated reminders reduce no-shows significantly.' },
                      { title: 'Patient records', desc: 'Digital health records with visit history, prescriptions, and medical notes. Access everything instantly.' },
                      { title: 'Prescription management', desc: 'Generate and manage prescriptions digitally. Print or share via WhatsApp.' },
                      { title: 'Automated reminders', desc: 'Patients receive SMS and WhatsApp reminders. Fewer no-shows, better revenue.' },
                    ].map((f) => (
                      <div key={f.title} className="flex gap-3">
                        <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-lavender/20">
                          <span className="h-1.5 w-1.5 rounded-full bg-lavender" />
                        </span>
                        <div>
                          <p className="text-sm font-medium text-charcoal">{f.title}</p>
                          <p className="text-sm text-gray-500">{f.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 flex flex-wrap gap-3">
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
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ════════ Coming Soon ════════ */}
      <section className="bg-white border-y border-border-light px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <FadeIn>
            <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-500">
              Coming Soon
            </h2>
          </FadeIn>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {[
              {
                name: 'FreelanceNest',
                tagline: 'Operating system for Freelancers',
                desc: 'Project tracking, invoicing, client management, and portfolio tools for independent professionals. Stop juggling multiple tools.',
                initial: 'F',
                href: '/ecosystems/freelancenest',
              },
              {
                name: 'PropertyNest',
                tagline: 'Operating system for Real Estate',
                desc: 'Property listings, inquiry management, tour scheduling, and deal tracking for real estate professionals. Close more deals.',
                initial: 'P',
                href: '/ecosystems/propertynest',
              },
            ].map((item) => (
              <FadeIn key={item.name}>
                <div className="rounded-2xl border border-dashed border-border-light bg-gray-50/50 p-6 sm:p-8">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-200 text-base font-bold text-gray-400">
                      {item.initial}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-charcoal">{item.name}</h3>
                      <p className="text-sm text-gray-500">{item.tagline}</p>
                    </div>
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-500">
                      Coming Soon
                    </span>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-gray-500">{item.desc}</p>
                  <Link href={item.href}>
                    <span className="mt-4 inline-block text-sm font-medium text-lavender transition-colors hover:text-lavender-hover">
                      Get notified &rarr;
                    </span>
                  </Link>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ Roadmap ════════ */}
      <section className="px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <FadeIn>
            <div className="mx-auto max-w-xl text-center">
              <h2 className="text-display-md font-display text-charcoal">
                Ecosystem roadmap
              </h2>
              <p className="mt-3 text-base text-gray-500">
                Here&rsquo;s where we are and where we&rsquo;re headed.
              </p>
            </div>
          </FadeIn>

          <div className="relative mx-auto mt-14 max-w-3xl">
            <div className="absolute left-6 top-0 h-full w-px bg-border-light" />

            <div className="space-y-8">
              {[
                { name: 'StayNest', status: 'Available Now', color: 'bg-green-500', textColor: 'text-green-700', badgeBg: 'bg-green-50' },
                { name: 'ClinicNest', status: 'Early Access', color: 'bg-amber-500', textColor: 'text-amber-700', badgeBg: 'bg-amber-50' },
                { name: 'FreelanceNest', status: 'In Development', color: 'bg-lavender', textColor: 'text-lavender', badgeBg: 'bg-lavender/10' },
                { name: 'PropertyNest', status: 'In Development', color: 'bg-lavender', textColor: 'text-lavender', badgeBg: 'bg-lavender/10' },
              ].map((item, i) => (
                <FadeIn key={item.name} delay={i * 80}>
                  <div className="relative flex items-start gap-6 pl-14">
                    <div className={`absolute left-4 top-2 z-10 flex h-4 w-4 rounded-full ${item.color} ring-4 ring-cream`} />
                    <div className="flex-1 rounded-xl border border-border-light bg-white p-5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h3 className="text-base font-semibold text-charcoal">{item.name}</h3>
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${item.badgeBg} ${item.textColor}`}>
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
                  Create Free Account &rarr;
                </button>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  )
}
