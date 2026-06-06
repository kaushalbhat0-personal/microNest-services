import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ClinicNest — Early Access',
  description:
    'ClinicNest is an early access product for clinics. Appointment scheduling, patient records, and prescriptions — built for modern practices.',
}

export default function ClinicNestLandingPage() {
  return (
    <div className="bg-cream font-body text-charcoal">
      {/* ──────── Hero ──────── */}
      <section className="overflow-hidden border-b border-border-light px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
                <span className="flex h-2 w-2 rounded-full bg-amber-500" />
                Early Access — Preview
              </div>
              <h1 className="mt-5 text-display-xl font-display leading-[1.05] tracking-tight text-charcoal">
                Your clinic,
                <br />
                <span className="text-lavender">digitally organized</span>.
              </h1>
              <p className="mt-5 text-lg leading-relaxed text-gray-500">
                Appointments, patient records, and prescriptions — purpose-built for
                clinics that want to go digital without the complexity.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/signup">
                  <button className="rounded-full bg-charcoal px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-charcoal/90">
                    Join Waitlist
                  </button>
                </Link>
                <Link href="#features">
                  <button className="rounded-full border border-border-light bg-white px-8 py-3 text-sm font-medium text-charcoal transition-colors hover:bg-gray-50">
                    See Features
                  </button>
                </Link>
              </div>
              <p className="mt-4 text-xs text-gray-400">
                Early access product — features are actively being built.
              </p>
            </div>

            <div className="rounded-2xl border border-border-light bg-white p-4 shadow-sm sm:p-6">
              <div className="mb-3 flex items-center justify-between border-b border-border-light pb-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded bg-charcoal text-[10px] font-bold text-white">C</div>
                  <span className="text-sm font-semibold text-charcoal">ClinicNest</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="flex h-2 w-2 rounded-full bg-amber-500" />
                  <span className="text-xs text-gray-500">Preview</span>
                </div>
              </div>
              <div className="space-y-2">
                {[
                  { patient: 'Ananya Gupta', time: '10:00 AM', type: 'Checkup', status: 'Confirmed' },
                  { patient: 'Vikram Singh', time: '11:30 AM', type: 'Follow-up', status: 'Checked In' },
                  { patient: 'Neha Joshi', time: '2:00 PM', type: 'Consultation', status: 'Pending' },
                  { patient: 'Priya Sharma', time: '3:30 PM', type: 'Follow-up', status: 'Pending' },
                ].map((a) => (
                  <div key={a.patient} className="flex items-center justify-between rounded-xl bg-cream px-3 py-2.5">
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
        </div>
      </section>

      {/* ──────── Features ──────── */}
      <section className="bg-white border-y border-border-light px-4 py-20 sm:px-6 sm:py-28 lg:px-8" id="features">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-xl text-center">
            <p className="text-xs font-medium uppercase tracking-widest text-gray-500">Features</p>
            <h2 className="mt-4 text-display-md font-display text-charcoal">
              Essential tools for your clinic
            </h2>
            <p className="mt-3 text-base text-gray-500">
              Three core modules available in early access. More coming as we build with early users.
            </p>
          </div>

          <div className="mt-14 grid gap-4 sm:grid-cols-3">
            {[
              {
                title: 'Appointments',
                desc: 'Schedule, track, and manage patient appointments. See who is checked in, who is next, and who is running late.',
                metric: 'Available Now',
              },
              {
                title: 'Patient Records',
                desc: 'Searchable patient directory with visit history, contact details, and medical notes. Everything in one profile.',
                metric: 'Available Now',
              },
              {
                title: 'Prescriptions',
                desc: 'Digital prescriptions with medication logs and dosage tracking. Print or share with patients instantly.',
                metric: 'Available Now',
              },
            ].map((f) => (
              <div key={f.title} className="rounded-2xl border border-border-light bg-cream p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lavender/10 text-lavender">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0118 18.75h-2.25m-7.5 0H7.5a2.25 2.25 0 01-2.25-2.25V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08m5.801 0c.065.21.1.433.1.664 0 .414-.336.75-.75.75h-4.5a.75.75 0 01-.75-.75 2.25 2.25 0 01.1-.664m5.8 0a2.25 2.25 0 00-2.15-1.586H13.5a2.25 2.25 0 00-2.15 1.586" />
                  </svg>
                </div>
                <h3 className="mt-4 text-base font-semibold text-charcoal">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">{f.desc}</p>
                <span className="mt-4 inline-flex items-center rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700">
                  {f.metric}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────── CTA ──────── */}
      <section className="px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
            Early Access
          </div>
          <h2 className="mt-5 text-display-md font-display text-charcoal">
            Help us shape ClinicNest
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-gray-500">
            We are building ClinicNest with input from real clinics. Join the early access
            program and help us build the operating system clinics deserve.
          </p>
          <div className="mt-10">
            <Link href="/signup">
              <button className="rounded-full bg-charcoal px-10 py-3.5 text-base font-medium text-white transition-colors hover:bg-charcoal/90">
                Join Waitlist
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
