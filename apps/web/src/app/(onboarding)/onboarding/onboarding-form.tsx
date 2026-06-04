'use client'

import { useActionState } from 'react'
import { Button } from '@micronest/ui'
import { completeOnboarding } from '@/lib/onboarding/actions'

function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ')
}

type Ecosystem = {
  id: string
  name: string
  tagline: string
  description: string
}

const ecosystemAccent: Record<string, string> = {
  staynest: 'border-amber-500 bg-amber-50',
  clinicnest: 'border-teal-500 bg-teal-50',
  freelancenest: 'border-blue-500 bg-blue-50',
  propertynest: 'border-purple-500 bg-purple-50',
}

const ecosystemCheck: Record<string, string> = {
  staynest: 'text-amber-600',
  clinicnest: 'text-teal-600',
  freelancenest: 'text-blue-600',
  propertynest: 'text-purple-600',
}

export function OnboardingForm({
  ecosystems,
}: {
  ecosystems: readonly Ecosystem[]
}) {
  const [state, formAction, isPending] = useActionState(completeOnboarding, {
    error: null,
  })

  return (
    <form action={formAction} className="space-y-6">
      <div>
        <label
          htmlFor="org_name"
          className="block text-sm font-medium text-gray-700"
        >
          Organization name
        </label>
        <input
          id="org_name"
          name="org_name"
          type="text"
          required
          placeholder="e.g. Sunshine Properties"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>

      <fieldset>
        <legend className="block text-sm font-medium text-gray-700">
          Choose your ecosystems
        </legend>
        <p className="mt-0.5 text-xs text-gray-500">
          Select at least one to get started.
        </p>

        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {ecosystems.map((eco) => (
            <label
              key={eco.id}
              className={cn(
                'relative flex cursor-pointer rounded-lg border-2 p-3 transition-all',
                'has-[:checked]:ring-2 has-[:checked]:ring-indigo-500',
                'has-[:checked]:border-indigo-500 has-[:checked]:bg-indigo-50',
                'border-gray-200 bg-white hover:border-gray-300'
              )}
            >
              <input
                type="checkbox"
                name="ecosystems"
                value={eco.id}
                className="sr-only"
              />
              <div className="flex w-full items-start justify-between">
                <div className="flex-1">
                  <span
                    className={cn(
                      'inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide',
                      ecosystemAccent[eco.id]
                    )}
                  >
                    {eco.tagline}
                  </span>
                  <p className="mt-1.5 text-sm font-medium text-gray-900">
                    {eco.name}
                  </p>
                  <p className="mt-0.5 text-xs text-gray-500">
                    {eco.description}
                  </p>
                </div>
                <svg
                  className={cn(
                    'mt-0.5 h-5 w-5 shrink-0',
                    ecosystemCheck[eco.id]
                  )}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </label>
          ))}
        </div>
      </fieldset>

      {state?.error && (
        <p className="text-sm text-red-600">{state.error}</p>
      )}

      <Button type="submit" loading={isPending} className="w-full">
        Continue to Dashboard
      </Button>
    </form>
  )
}
