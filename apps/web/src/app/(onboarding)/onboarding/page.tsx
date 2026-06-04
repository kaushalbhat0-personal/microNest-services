import type { Metadata } from 'next'
import { Card, Logo } from '@micronest/ui'
import { ECOSYSTEMS } from '@micronest/config'
import { OnboardingForm } from './onboarding-form'

export const metadata: Metadata = {
  title: 'Set up your workspace',
}

export default function OnboardingPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <Card className="w-full max-w-lg">
        <div className="mb-8 text-center">
          <Logo className="justify-center" />
          <h1 className="mt-4 text-xl font-semibold text-gray-900">
            Set up your workspace
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Create your organization and choose your ecosystems.
          </p>
        </div>

        <OnboardingForm ecosystems={ECOSYSTEMS} />
      </Card>
    </div>
  )
}
