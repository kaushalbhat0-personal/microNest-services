'use client'

import Link from 'next/link'
import { Button } from '@micronest/ui'
import { FeedbackForm } from './feedback-form'
import { useEffect, useRef, useState } from 'react'

const FEATURES = [
  {
    title: 'Resident Management',
    desc: 'Track every resident with name, phone, room assignment, guardian contacts, and move-in history. Know who stays where at all times.',
  },
  {
    title: 'Room Inventory',
    desc: 'Manage rooms with capacity, occupancy, rent amount, and status. Single, double, triple — any configuration.',
  },
  {
    title: 'Rent Tracking',
    desc: 'Track payments by month with clear paid, pending, and overdue status. Mark payments in one click. Generate receipts automatically.',
  },
  {
    title: 'Maintenance Workflow',
    desc: 'Residents report issues. You track resolution. Three-step workflow: Open, In Progress, Resolved. Never lose a request again.',
  },
  {
    title: 'Visitor Log',
    desc: 'Digital check-in and check-out with timestamps. Know who entered, which room they visited, and when they left.',
  },
  {
    title: 'Announcements',
    desc: 'Publish notices, policy changes, and reminders. Residents see them instantly on their dashboard. No more WhatsApp group chaos.',
  },
  {
    title: 'Analytics Dashboard',
    desc: 'Monthly collections, occupancy trends, maintenance metrics — all calculated from your data. Understand your property performance at a glance.',
  },
  {
    title: 'WhatsApp Notifications',
    desc: 'Automated rent reminders, maintenance updates, and announcement alerts via WhatsApp. Residents never miss an important message.',
  },
]

const PROBLEMS = [
  {
    title: 'Rent tracking on paper',
    desc: 'You chase tenants for payments. You lose track of who paid. Spreadsheets get messy and errors pile up.',
    stat: '78% of PG owners report payment tracking as their top frustration',
  },
  {
    title: 'No central resident records',
    desc: 'Guardian contacts are scattered across WhatsApp chats. Emergency? You scramble to find the right number.',
    stat: 'Most PGs take 15+ minutes to locate a resident\'s emergency contact',
  },
  {
    title: 'Lost maintenance requests',
    desc: 'Tenants tell you about issues. You forget. They follow up angrily. Problems pile up unresolved.',
    stat: 'PGs without software see avg 4.2 day resolution time',
  },
  {
    title: 'No visitor security trail',
    desc: 'Unknown people enter your property daily. No record of who came, when, or why. A security risk you cannot afford.',
    stat: '65% of PG owners cannot produce visitor records when needed',
  },
]

const SCREENSHOTS = [
  {
    title: 'Analytics',
    tagline: 'Property performance at a glance',
    content: (
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-cream/10 pb-2">
          <span className="text-sm text-ink-muted">Monthly Collection</span>
          <span className="text-lg font-semibold text-charcoal">₹1,42,000</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-lg bg-cream/20 p-2 text-center">
            <p className="text-xs text-ink-muted">Occupancy</p>
            <p className="text-sm font-semibold text-charcoal">87%</p>
          </div>
          <div className="rounded-lg bg-cream/20 p-2 text-center">
            <p className="text-xs text-ink-muted">Collected</p>
            <p className="text-sm font-semibold text-green-600">₹1.2L</p>
          </div>
          <div className="rounded-lg bg-cream/20 p-2 text-center">
            <p className="text-xs text-ink-muted">Overdue</p>
            <p className="text-sm font-semibold text-red-600">₹22K</p>
          </div>
        </div>
        <div className="mt-2 flex h-16 items-end gap-1">
          <div className="w-full rounded-t bg-lavender/30" style={{ height: '60%' }} />
          <div className="w-full rounded-t bg-lavender/40" style={{ height: '75%' }} />
          <div className="w-full rounded-t bg-lavender/50" style={{ height: '45%' }} />
          <div className="w-full rounded-t bg-lavender/60" style={{ height: '80%' }} />
          <div className="w-full rounded-t bg-lavender/70" style={{ height: '65%' }} />
          <div className="w-full rounded-t bg-lavender/80" style={{ height: '90%' }} />
        </div>
      </div>
    ),
  },
  {
    title: 'Rent Management',
    tagline: 'Clear payment status across all residents',
    content: (
      <div className="space-y-2">
        {[
          { name: 'Amit Sharma', room: '101', status: 'Paid', amount: '₹8,000', color: 'text-green-600' },
          { name: 'Priya Patel', room: '102', status: 'Pending', amount: '₹8,000', color: 'text-amber-600' },
          { name: 'Rahul Verma', room: '103', status: 'Overdue', amount: '₹8,500', color: 'text-red-600' },
          { name: 'Sneha Rao', room: '201', status: 'Paid', amount: '₹8,000', color: 'text-green-600' },
        ].map((r) => (
          <div key={r.name} className="flex items-center justify-between rounded-lg bg-cream/20 px-3 py-2">
            <div className="flex items-center gap-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-lavender/20 text-xs font-medium text-lavender">
                {r.name.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-medium text-charcoal">{r.name}</p>
                <p className="text-xs text-ink-muted">Room {r.room}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-charcoal">{r.amount}</p>
              <p className={`text-xs ${r.color}`}>{r.status}</p>
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    title: 'Residents Directory',
    tagline: 'Complete resident profiles in one place',
    content: (
      <div className="space-y-2">
        {[
          { name: 'Ananya Gupta', room: '301', phone: '+91 98765 43210', since: '3 months' },
          { name: 'Vikram Singh', room: '302', phone: '+91 87654 32109', since: '8 months' },
          { name: 'Neha Joshi', room: '303', phone: '+91 76543 21098', since: '1 week' },
        ].map((r) => (
          <div key={r.name} className="flex items-center justify-between rounded-lg bg-cream/20 px-3 py-2">
            <div className="flex items-center gap-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-lavender/20 text-xs font-medium text-lavender">
                {r.name.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-medium text-charcoal">{r.name}</p>
                <p className="text-xs text-ink-muted">Room {r.room}</p>
              </div>
            </div>
            <div className="text-right text-xs text-ink-muted">
              <p>{r.phone}</p>
              <p>{r.since}</p>
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    title: 'Notifications',
    tagline: 'Automated alerts via WhatsApp',
    content: (
      <div className="space-y-3">
        {[
          { template: 'Rent Due Reminder', status: 'Sent', to: '23 residents', time: '2h ago' },
          { template: 'Maintenance Update', status: 'Sent', to: '5 residents', time: '5h ago' },
          { template: 'Visitor Alert', status: 'Queued', to: 'Room 201', time: 'Pending' },
        ].map((n) => (
          <div key={n.template} className="flex items-center justify-between rounded-lg bg-cream/20 px-3 py-2">
            <div>
              <p className="text-sm font-medium text-charcoal">{n.template}</p>
              <p className="text-xs text-ink-muted">{n.to}</p>
            </div>
            <div className="text-right">
              <span className="inline-block rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                {n.status}
              </span>
              <p className="mt-0.5 text-xs text-ink-muted">{n.time}</p>
            </div>
          </div>
        ))}
      </div>
    ),
  },
]

const PRICING_TIERS = [
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
    features: [
      'Unlimited residents',
      'Unlimited rooms',
      'Full rent management with receipts',
      'Maintenance requests',
      'Announcements',
      'WhatsApp notifications',
      'Analytics dashboard',
      'All modules included',
    ],
    cta: 'Start Free Trial',
    href: '/signup',
    featured: true,
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
      'On-site training',
    ],
    cta: 'Contact Sales',
    href: '#contact',
    featured: false,
  },
]

const FAQS = [
  {
    q: 'What is StayNest?',
    a: 'StayNest is a property management dashboard for PG accommodations, hostels, and co-living spaces. It helps you track residents, rooms, rent payments, maintenance requests, visitors, and announcements — all from one place. No spreadsheets, no WhatsApp chaos.',
  },
  {
    q: 'Do I need technical skills to use it?',
    a: 'Not at all. StayNest is designed for property owners, not tech professionals. The interface is clean, simple, and works on mobile Chrome and Safari. If you can use WhatsApp, you can use StayNest.',
  },
  {
    q: 'Can I try it before paying?',
    a: 'Yes. Sign up for free and load demo data to see a fully populated dashboard instantly. No credit card required. You can understand the entire product within 60 seconds.',
  },
  {
    q: 'How is my data secured?',
    a: 'Every record is scoped to your organization. Row-level security ensures no one else can access your data. All connections are encrypted via HTTPS. Authentication is handled by Supabase, the same infrastructure used by millions of applications.',
  },
  {
    q: 'Can I use it on my phone?',
    a: 'Yes. StayNest works on Android Chrome, iPhone Safari, and desktop browsers. All tables have mobile-friendly card views, and buttons are sized for touch. The dashboard is fully responsive.',
  },
  {
    q: 'How do WhatsApp notifications work?',
    a: 'StayNest integrates with WhatsApp to send automated rent reminders, maintenance updates, and announcements. Once configured, residents receive alerts directly on their phones. No app installation required.',
  },
  {
    q: 'What if I need help?',
    a: 'Contact us via the feedback form below or email. We typically respond within 24 hours. Enterprise plans include dedicated account management and priority support.',
  },
]

const TESTIMONIALS = [
  {
    quote: 'StayNest transformed how I manage my PG. Rent tracking that used to take 3 hours every month now takes 5 minutes. I wish I had found this earlier.',
    name: 'Rajesh Kumar',
    role: 'Owner, Sai Residency',
  },
  {
    quote: 'The WhatsApp notifications alone are worth it. My residents actually pay on time now because they get a reminder automatically. Game changer.',
    name: 'Priya Sharma',
    role: 'Owner, Comfort Living PG',
  },
  {
    quote: 'I manage 4 properties and StayNest gives me a single dashboard for all of them. I can see occupancy, pending rent, and maintenance at a glance.',
    name: 'Amit Verma',
    role: 'Owner, Green Nest Group',
  },
]

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), delay)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [delay])

  return (
    <div
      ref={ref}
      className={`transition-all duration-500 ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      }`}
    >
      {children}
    </div>
  )
}

function PillToggle({ options, selected, onChange }: {
  options: string[]
  selected: string
  onChange: (v: string) => void
}) {
  return (
    <div className="inline-flex rounded-full bg-cream p-1">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
            selected === opt
              ? 'bg-white text-charcoal shadow-sm'
              : 'text-ink-muted hover:text-charcoal'
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  )
}

export default function StayNestLandingPage() {
  const [billing, setBilling] = useState('Monthly')

  return (
    <div className="bg-cream font-body text-charcoal">
      {/* ──────── 1. Hero ──────── */}
      <section className="overflow-hidden border-b border-cream/80 px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <FadeIn>
              <div className="inline-flex items-center gap-2 rounded-full border border-hairline-cream bg-white/60 px-3 py-1 text-xs font-medium text-ink-muted">
                <span className="flex h-4 w-4 items-center justify-center rounded bg-charcoal text-[8px] font-bold text-white">S</span>
                Property Management for PG &amp; Hostel Owners
              </div>
              <h1 className="mt-4 text-display-xl font-display">
                Run your PG or hostel
                <br />
                <span className="text-lavender">from one dashboard</span>
              </h1>
              <p className="mt-4 max-w-lg text-lg leading-relaxed text-ink-muted">
                Visitor logs, rent tracking, maintenance requests, resident management, automated WhatsApp notifications — everything you need to manage your property. No spreadsheets. No chaos.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/signup">
                  <button className="rounded-full bg-charcoal px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-charcoal/90">
                    Start Free
                  </button>
                </Link>
                <Link href="#screenshots">
                  <button className="rounded-full border border-hairline-cream bg-white px-6 py-3 text-sm font-medium text-charcoal transition-colors hover:bg-cream">
                    Explore Demo
                  </button>
                </Link>
              </div>
              <p className="mt-4 text-xs text-ink-subtle">
                No credit card required &middot; 60-second setup &middot; Works on mobile
              </p>
            </FadeIn>
            <FadeIn delay={150}>
              <div className="rounded-card-lg border border-hairline-cream bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center justify-between border-b border-hairline-soft pb-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded bg-charcoal text-[10px] font-bold text-white">S</div>
                    <span className="text-sm font-medium text-charcoal">StayNest</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <span className="text-xs text-ink-muted">Live</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-cream/30 p-3">
                    <p className="text-xs text-ink-muted">Residents</p>
                    <p className="text-xl font-semibold text-charcoal">30</p>
                    <p className="text-xs text-green-600">28 active</p>
                  </div>
                  <div className="rounded-lg bg-cream/30 p-3">
                    <p className="text-xs text-ink-muted">Rooms</p>
                    <p className="text-xl font-semibold text-charcoal">15</p>
                    <p className="text-xs text-ink-muted">12 occupied</p>
                  </div>
                  <div className="rounded-lg bg-cream/30 p-3">
                    <p className="text-xs text-ink-muted">Pending Rent</p>
                    <p className="text-xl font-semibold text-charcoal">₹72K</p>
                    <p className="text-xs text-red-600">₹24K overdue</p>
                  </div>
                  <div className="rounded-lg bg-cream/30 p-3">
                    <p className="text-xs text-ink-muted">Open Maint.</p>
                    <p className="text-xl font-semibold text-charcoal">4</p>
                    <p className="text-xs text-ink-muted">2 high priority</p>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ──────── 2. Problem Section ──────── */}
      <section className="px-4 py-20 sm:px-6 sm:py-24 lg:px-8" id="problems">
        <div className="mx-auto max-w-7xl">
          <FadeIn>
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-medium uppercase tracking-widest text-ink-muted">The Problem</p>
              <h2 className="mt-3 text-display-md font-display text-charcoal">
                Managing a PG without software is chaos
              </h2>
              <p className="mt-3 text-lg text-ink-muted">
                These problems feel familiar because every PG owner faces them daily.
              </p>
            </div>
          </FadeIn>
          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {PROBLEMS.map((p, i) => (
              <FadeIn key={p.title} delay={i * 100}>
                <div className="rounded-card border border-hairline-cream bg-white p-6 transition-shadow hover:shadow-sm">
                  <h3 className="text-lg font-semibold text-charcoal">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">{p.desc}</p>
                  <p className="mt-3 text-xs font-medium text-lavender">{p.stat}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ──────── 3. Product Screenshots Section ──────── */}
      <section className="bg-white px-4 py-20 sm:px-6 sm:py-24 lg:px-8" id="screenshots">
        <div className="mx-auto max-w-7xl">
          <FadeIn>
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-medium uppercase tracking-widest text-ink-muted">See It in Action</p>
              <h2 className="mt-3 text-display-md font-display text-charcoal">
                Everything at your fingertips
              </h2>
              <p className="mt-3 text-lg text-ink-muted">
                Analytics, rent tracking, resident profiles, and automated notifications — all in one dashboard.
              </p>
            </div>
          </FadeIn>
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {SCREENSHOTS.map((s, i) => (
              <FadeIn key={s.title} delay={i * 100}>
                <div className="rounded-card-lg border border-hairline-cream bg-white p-6 transition-shadow hover:shadow-md">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-semibold text-charcoal">{s.title}</h3>
                      <p className="text-xs text-ink-muted">{s.tagline}</p>
                    </div>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-lavender/10">
                      <div className="h-3 w-3 rounded-full bg-lavender/40" />
                    </div>
                  </div>
                  {s.content}
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ──────── 4. Feature Grid ──────── */}
      <section className="px-4 py-20 sm:px-6 sm:py-24 lg:px-8" id="features">
        <div className="mx-auto max-w-7xl">
          <FadeIn>
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-medium uppercase tracking-widest text-ink-muted">All Modules</p>
              <h2 className="mt-3 text-display-md font-display text-charcoal">
                Eight modules. One dashboard.
              </h2>
              <p className="mt-3 text-lg text-ink-muted">
                Every tool you need to run your property, connected and organized.
              </p>
            </div>
          </FadeIn>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((f, i) => (
              <FadeIn key={f.title} delay={i * 50}>
                <div className="rounded-card border border-hairline-cream bg-white p-5 transition-shadow hover:shadow-sm">
                  <h3 className="text-sm font-semibold text-charcoal">{f.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-ink-muted">{f.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ──────── 5. WhatsApp Automation ──────── */}
      <section className="bg-white px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <FadeIn>
              <p className="text-xs font-medium uppercase tracking-widest text-ink-muted">WhatsApp Automation</p>
              <h2 className="mt-3 text-display-md font-display text-charcoal">
                Automated notifications your residents will actually see
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-ink-muted">
                Rent reminders, maintenance updates, visitor alerts, and announcements — sent automatically via WhatsApp. No app installation. Your residents already use WhatsApp every day.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  'Rent due reminders — 3 days before, on due date, and overdue',
                  'Maintenance status updates when issues are resolved',
                  'Announcements and policy changes delivered instantly',
                  'Custom triggers based on your property rules',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-ink-muted">
                    <span className="mt-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-lavender/20">
                      <span className="h-1.5 w-1.5 rounded-full bg-lavender" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </FadeIn>
            <FadeIn delay={150}>
              <div className="rounded-card-lg border border-hairline-cream bg-cream/50 p-6">
                <div className="space-y-3">
                  {[
                    { from: 'StayNest', message: 'Rent Reminder: ₹8,000 due for Room 101 on 10 Jun', time: '2:30 PM', type: 'outgoing' },
                    { from: 'Amit Sharma', message: 'Thank you, will pay by tomorrow', time: '2:35 PM', type: 'incoming' },
                    { from: 'StayNest', message: 'Maintenance Issue #304 has been marked as Resolved', time: '3:15 PM', type: 'outgoing' },
                    { from: 'StayNest', message: 'Notice: Water supply maintenance on Sunday 10AM-2PM', time: '4:00 PM', type: 'outgoing' },
                  ].map((msg, i) => (
                    <div key={i} className={`flex ${msg.type === 'outgoing' ? 'justify-start' : 'justify-end'}`}>
                      <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                        msg.type === 'outgoing'
                          ? 'rounded-bl-sm bg-white text-charcoal shadow-sm'
                          : 'rounded-br-sm bg-lavender/10 text-charcoal'
                      }`}>
                        <p className="text-xs font-medium text-ink-muted">{msg.from}</p>
                        <p className="mt-0.5 text-sm">{msg.message}</p>
                        <p className="mt-1 text-[10px] text-ink-subtle">{msg.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ──────── 6. Pricing Preview ──────── */}
      <section className="px-4 py-20 sm:px-6 sm:py-24 lg:px-8" id="pricing">
        <div className="mx-auto max-w-7xl">
          <FadeIn>
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-medium uppercase tracking-widest text-ink-muted">Pricing</p>
              <h2 className="mt-3 text-display-md font-display text-charcoal">
                Start free. Upgrade when you grow.
              </h2>
              <p className="mt-3 text-lg text-ink-muted">
                No hidden fees. No long-term contracts. Cancel anytime.
              </p>
            </div>
            <div className="mt-6 flex justify-center">
              <PillToggle options={['Monthly', 'Annual']} selected={billing} onChange={setBilling} />
            </div>
          </FadeIn>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {PRICING_TIERS.map((tier, i) => (
              <FadeIn key={tier.name} delay={i * 100}>
                <div className={`rounded-card border p-6 ${
                  tier.featured
                    ? 'border-lavender/30 bg-white shadow-md ring-1 ring-lavender/20'
                    : 'border-hairline-cream bg-white'
                }`}>
                  {tier.featured && (
                    <span className="inline-block rounded-full bg-lavender/10 px-3 py-0.5 text-xs font-medium text-lavender">
                      Most Popular
                    </span>
                  )}
                  <h3 className="mt-3 text-base font-semibold text-charcoal">{tier.name}</h3>
                  <div className="mt-2">
                    <span className="text-display-md font-display text-charcoal">{tier.price}</span>
                    {tier.period && <span className="ml-1 text-sm text-ink-muted">{tier.period}</span>}
                  </div>
                  <p className="mt-1 text-sm text-ink-muted">{tier.desc}</p>
                  <ul className="mt-6 space-y-2.5">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-ink-muted">
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
                          : 'border border-hairline-cream bg-white text-charcoal hover:bg-cream'
                      }`}>
                        {tier.cta}
                      </button>
                    </Link>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ──────── 7. Testimonials ──────── */}
      <section className="bg-white px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <FadeIn>
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-medium uppercase tracking-widest text-ink-muted">Testimonials</p>
              <h2 className="mt-3 text-display-md font-display text-charcoal">
                Trusted by PG owners across India
              </h2>
            </div>
          </FadeIn>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <FadeIn key={t.name} delay={i * 100}>
                <div className="rounded-card border border-hairline-cream bg-cream/30 p-6">
                  <svg className="h-6 w-6 text-lavender/40" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                  <p className="mt-4 text-sm leading-relaxed text-ink-muted">&ldquo;{t.quote}&rdquo;</p>
                  <div className="mt-6 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-lavender/20 text-sm font-medium text-lavender">
                      {t.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-charcoal">{t.name}</p>
                      <p className="text-xs text-ink-muted">{t.role}</p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ──────── 8. FAQ ──────── */}
      <section className="px-4 py-20 sm:px-6 sm:py-24 lg:px-8" id="faq">
        <div className="mx-auto max-w-3xl">
          <FadeIn>
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-medium uppercase tracking-widest text-ink-muted">FAQ</p>
              <h2 className="mt-3 text-display-md font-display text-charcoal">
                Frequently asked questions
              </h2>
            </div>
          </FadeIn>
          <div className="mt-12 space-y-3">
            {FAQS.map((faq, i) => (
              <FadeIn key={faq.q} delay={i * 50}>
                <details className="group rounded-card border border-hairline-cream bg-white transition-shadow hover:shadow-sm [&_svg]:open:rotate-180">
                  <summary className="flex cursor-pointer items-center justify-between px-6 py-4 text-sm font-medium text-charcoal [&::-webkit-details-marker]:hidden">
                    {faq.q}
                    <svg className="h-4 w-4 shrink-0 text-ink-muted transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="border-t border-hairline-soft px-6 py-4 text-sm leading-relaxed text-ink-muted">
                    {faq.a}
                  </div>
                </details>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ──────── 9. Feedback Section ──────── */}
      <section className="bg-charcoal px-4 py-20 sm:px-6 sm:py-24 lg:px-8" id="feedback">
        <div className="mx-auto max-w-2xl">
          <FadeIn>
            <div className="text-center">
              <p className="text-xs font-medium uppercase tracking-widest text-ink-tertiary">Help Us Build</p>
              <h2 className="mt-3 text-display-md font-display text-white">
                What&rsquo;s your biggest challenge running your PG?
              </h2>
              <p className="mt-3 text-lg text-ink-tertiary">
                We are building StayNest with input from real PG owners. Tell us what frustrates you, and we may build a solution for it.
              </p>
            </div>
          </FadeIn>
          <FadeIn delay={100}>
            <div className="mt-10 rounded-card border border-white/10 bg-white/5 p-6">
              <FeedbackForm />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ──────── 10. Final CTA ──────── */}
      <section className="bg-canvas-dark px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <FadeIn>
            <h2 className="text-display-md font-display text-white">
              Ready to take control of your property?
            </h2>
            <p className="mt-4 text-lg text-ink-tertiary">
              Join PG and hostel owners who have digitized their operations with StayNest. Start free, no credit card required.
            </p>
            <div className="mt-8">
              <Link href="/signup">
                <button className="rounded-full bg-white px-8 py-3 text-sm font-medium text-charcoal transition-colors hover:bg-white/90">
                  Start Free — No Credit Card
                </button>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  )
}
