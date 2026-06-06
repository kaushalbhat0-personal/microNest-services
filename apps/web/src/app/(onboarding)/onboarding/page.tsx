import type { Metadata } from 'next'
import { Logo } from '@micronest/ui'
import { ECOSYSTEMS } from '@micronest/config'
import { OnboardingForm } from './onboarding-form'

export const metadata: Metadata = {
  title: 'Set up your workspace',
}

export default function OnboardingPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="mb-8 text-center">
          <Logo className="justify-center" />
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
          <OnboardingForm ecosystems={ECOSYSTEMS} />
        </div>
      </div>
    </div>
  )
}
