import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy — MicroNest',
  description: 'MicroNest Privacy Policy — how we collect, use, and protect your data.',
}

const sections = [
  {
    title: 'Information We Collect',
    content: 'We collect information you provide when creating an account, including your name, email address, and organization details. We also collect data you input into our platform, such as resident information, rent records, and property details. Usage data, including page visits and feature interactions, is collected automatically to improve our service.',
  },
  {
    title: 'How We Use Your Information',
    content: 'Your information is used solely to provide and improve our services. This includes processing transactions, sending notifications, generating reports, and maintaining your account. We do not sell your personal data to third parties. Aggregated, anonymized data may be used for analytics and product improvements.',
  },
  {
    title: 'Data Storage and Security',
    content: 'Your data is stored securely on Supabase infrastructure with encryption at rest and in transit. Row-level security ensures that each organization can only access their own data. We implement industry-standard security measures including HTTPS, database encryption, and access controls.',
  },
  {
    title: 'Data Retention',
    content: 'We retain your data for as long as your account is active. If you delete your account, your data is permanently deleted within 30 days. Backup data is retained for up to 90 days and then securely purged.',
  },
  {
    title: 'Third-Party Services',
    content: 'We integrate with third-party services including Supabase (database and authentication), WhatsApp Business API providers (Interakt, WATI), and email delivery services. Each provider processes data according to their own privacy policies and data processing agreements.',
  },
  {
    title: 'Your Rights',
    content: 'You have the right to access, correct, or delete your personal data at any time. You can export your data from the Settings page. To request complete data deletion, contact us. We will respond to all legitimate requests within 30 days.',
  },
  {
    title: 'Cookies',
    content: 'We use essential cookies for authentication and session management. No tracking cookies or third-party analytics cookies are used. You can control cookie settings through your browser preferences.',
  },
  {
    title: 'Changes to This Policy',
    content: 'We may update this privacy policy from time to time. Material changes will be communicated via email or through the platform. Continued use of the service after changes constitutes acceptance of the updated policy.',
  },
  {
    title: 'Contact',
    content: 'For privacy-related inquiries, email privacy@micronest.app. We aim to respond within 48 hours during business days.',
  },
]

export default function PrivacyPage() {
  return (
    <div className="bg-cream font-body text-charcoal">
      <section className="px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-medium uppercase tracking-widest text-ink-muted">Legal</p>
          <h1 className="mt-3 text-display-md font-display text-charcoal">
            Privacy Policy
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
              <Link href="mailto:privacy@micronest.app" className="font-medium text-lavender hover:underline">
                privacy@micronest.app
              </Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
