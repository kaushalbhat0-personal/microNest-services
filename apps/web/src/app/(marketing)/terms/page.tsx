import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms of Service — MicroNest',
  description: 'MicroNest Terms of Service — terms governing the use of our platform.',
}

const sections = [
  {
    title: 'Acceptance of Terms',
    content: 'By accessing or using MicroNest ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, do not use the Service. We may update these terms at any time, and continued use of the Service constitutes acceptance of the updated terms.',
  },
  {
    title: 'Account Registration',
    content: 'You must provide accurate and complete information when creating an account. You are responsible for maintaining the confidentiality of your login credentials. You must notify us immediately of any unauthorized use of your account. You are responsible for all activity that occurs under your account.',
  },
  {
    title: 'Acceptable Use',
    content: 'You agree to use the Service only for lawful purposes and in accordance with these terms. You may not use the Service to store or transmit illegal content, harass others, infringe on intellectual property rights, or violate any applicable laws. You may not attempt to bypass security measures or access data belonging to other organizations.',
  },
  {
    title: 'Data Ownership',
    content: 'You retain full ownership of all data you input into the Service. MicroNest claims no intellectual property rights over your data. We may use aggregated, anonymized data for service improvement and analytics. You can export or delete your data at any time.',
  },
  {
    title: 'Service Availability',
    content: 'We strive to maintain 99.9% uptime for the Service. Scheduled maintenance will be communicated in advance. We are not liable for downtime caused by factors outside our control, including third-party service interruptions, internet outages, or force majeure events.',
  },
  {
    title: 'Payment and Billing',
    content: 'Paid plans are billed monthly or annually as selected. Payments are due at the start of each billing period. Failure to pay may result in service suspension. Refunds are provided at our discretion for billing errors. You can cancel anytime, and your service continues until the end of the current billing period.',
  },
  {
    title: 'Cancellation and Termination',
    content: 'You can cancel your account at any time from the Settings page. Upon cancellation, your data remains accessible for 30 days before permanent deletion. We may terminate or suspend your account for violations of these terms, with notice where possible.',
  },
  {
    title: 'Limitation of Liability',
    content: 'MicroNest is provided "as is" without warranties of any kind. We are not liable for any indirect, incidental, or consequential damages arising from your use of the Service. Our total liability is limited to the amount you have paid us in the 12 months preceding the claim.',
  },
  {
    title: 'WhatsApp Provider Disclaimer',
    content: 'WhatsApp notifications are delivered through third-party providers (Interakt, WATI). Message delivery depends on WhatsApp/Meta infrastructure and the recipient\'s network connectivity. We are not responsible for undelivered, delayed, or misdirected messages. Message charges may apply based on WhatsApp\'s billing policies.',
  },
  {
    title: 'Governing Law',
    content: 'These terms are governed by the laws of India. Any disputes shall be resolved through binding arbitration in accordance with the Arbitration and Conciliation Act, 1996. The venue for arbitration shall be Mumbai, India.',
  },
  {
    title: 'Contact',
    content: 'For questions about these terms, email legal@micronest.app. For support, visit the feedback section in your dashboard or email support@micronest.app.',
  },
]

export default function TermsPage() {
  return (
    <div className="bg-cream font-body text-charcoal">
      <section className="px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-medium uppercase tracking-widest text-ink-muted">Legal</p>
          <h1 className="mt-3 text-display-md font-display text-charcoal">
            Terms of Service
          </h1>
          <p className="mt-3 text-lg text-ink-muted">
            Last updated: July 2026
          </p>

          <div className="mt-12 space-y-10">
            {sections.map((section) => (
              <div key={section.title}>
                <h2 className="text-lg font-semibold text-charcoal">{section.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{section.content}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 border-t border-hairline-cream pt-8 text-center">
            <p className="text-sm text-ink-muted">
              Questions?{' '}
              <Link href="mailto:legal@micronest.app" className="font-medium text-lavender hover:underline">
                legal@micronest.app
              </Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
