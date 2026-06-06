import type { Metadata } from 'next'
import Link from 'next/link'
import { PLANS } from '@micronest/config'

export const metadata: Metadata = {
  title: 'Pricing — MicroNest',
  description: 'Start free. Upgrade when you grow. Simple, transparent pricing for PG owners, hostel managers, and property operators.',
}

function CheckIcon() {
  return (
    <svg className="h-4 w-4 shrink-0 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  )
}

function CrossIcon() {
  return (
    <svg className="h-4 w-4 shrink-0 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}

export default function PricingPage() {
  return (
    <div className="bg-cream font-body text-charcoal">
      {/* Hero */}
      <section className="px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-medium uppercase tracking-widest text-ink-muted">Pricing</p>
            <h1 className="mt-3 text-display-md font-display text-charcoal">
              Start free. Upgrade when you grow.
            </h1>
            <p className="mt-3 text-lg text-ink-muted">
              No hidden fees. No long-term contracts. Cancel anytime.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`rounded-card border p-6 ${
                  plan.highlighted
                    ? 'border-lavender/30 bg-white shadow-md ring-1 ring-lavender/20'
                    : 'border-hairline-cream bg-white'
                }`}
              >
                {plan.highlighted && (
                  <span className="inline-block rounded-full bg-lavender/10 px-3 py-0.5 text-xs font-medium text-lavender">
                    Most Popular
                  </span>
                )}
                <h3 className="mt-3 text-base font-semibold text-charcoal">{plan.name}</h3>
                <div className="mt-2">
                  <span className="text-display-md font-display text-charcoal">{plan.price}</span>
                  {plan.period && <span className="ml-1 text-sm text-ink-muted">{plan.period}</span>}
                </div>
                <p className="mt-1 text-sm text-ink-muted">{plan.description}</p>

                <ul className="mt-6 space-y-2.5">
                  {plan.features.map((f) => (
                    <li key={f.text} className="flex items-center gap-2 text-sm text-ink-muted">
                      {f.included ? <CheckIcon /> : <CrossIcon />}
                      {f.text}
                    </li>
                  ))}
                </ul>

                <div className="mt-8">
                  <Link href={plan.id === 'pro' ? 'mailto:sales@micronest.app' : '/signup'}>
                    <button
                      className={`w-full rounded-full px-4 py-2.5 text-sm font-medium transition-colors ${
                        plan.highlighted
                          ? 'bg-charcoal text-white hover:bg-charcoal/90'
                          : 'border border-hairline-cream bg-white text-charcoal hover:bg-cream'
                      }`}
                    >
                      {plan.cta}
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* FAQ */}
          <div className="mx-auto mt-20 max-w-3xl">
            <h2 className="text-center text-display-sm font-display text-charcoal">
              Frequently asked questions
            </h2>
            <div className="mt-10 space-y-3">
              {[
                { q: 'Can I try before paying?', a: 'Yes. Sign up for free and get a 14-day trial with full access to all Growth plan features. No credit card required.' },
                { q: 'What happens when my trial ends?', a: 'Your account converts to the free Starter plan. You keep all your data but some features will be limited based on the Starter plan limits.' },
                { q: 'Can I upgrade or downgrade anytime?', a: 'Yes. You can change your plan at any time. Upgrades take effect immediately. Downgrades apply at the end of your billing period.' },
                { q: 'Is there a long-term contract?', a: 'No. All plans are month-to-month. You can cancel anytime with no penalties. Your data is always accessible.' },
                { q: 'What payment methods do you accept?', a: 'We accept all major credit cards, debit cards, and UPI. Invoicing is available for Pro plan customers.' },
                { q: 'Do you offer discounts for annual billing?', a: 'Yes. Annual billing gives you 2 months free (pay for 10 months, get 12). Contact our sales team for details.' },
              ].map((faq) => (
                <details
                  key={faq.q}
                  className="group rounded-card border border-hairline-cream bg-white transition-shadow hover:shadow-sm [&_svg]:open:rotate-180"
                >
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
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
