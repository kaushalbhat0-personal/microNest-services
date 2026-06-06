'use client'

import { useState } from 'react'
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

const INITIAL_STATE = { error: null as string | null }

type StepProps = {
  ecosystems: readonly Ecosystem[]
}

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="mb-8 flex items-center justify-center gap-2">
      {Array.from({ length: total }, (_, i) => (
        <div key={i} className="flex items-center gap-2">
          <div
            className={cn(
              'flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium transition-colors',
              i < current
                ? 'bg-indigo-600 text-white'
                : i === current
                  ? 'border-2 border-indigo-600 bg-white text-indigo-600'
                  : 'border-2 border-gray-200 bg-white text-gray-400'
            )}
          >
            {i < current ? (
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            ) : (
              i + 1
            )}
          </div>
          {i < total - 1 && (
            <div
              className={cn(
                'h-0.5 w-8 transition-colors sm:w-12',
                i < current ? 'bg-indigo-600' : 'bg-gray-200'
              )}
            />
          )}
        </div>
      ))}
    </div>
  )
}

export function OnboardingForm({ ecosystems }: StepProps) {
  const [step, setStep] = useState(0)
  const [orgName, setOrgName] = useState('')
  const [selectedEcosystems, setSelectedEcosystems] = useState<string[]>([])
  const [mode, setMode] = useState<'demo' | 'empty' | null>(null)

  const [state, formAction, isPending] = useActionState(
    completeOnboarding,
    INITIAL_STATE
  )

  const isStep1Valid = orgName.trim().length > 0 && selectedEcosystems.length > 0
  const isStep2Valid = mode !== null

  function handleEcosystemToggle(id: string) {
    setSelectedEcosystems((prev) =>
      prev.includes(id)
        ? prev.filter((e) => e !== id)
        : [...prev, id]
    )
  }

  function handleSubmit(formData: FormData) {
    formData.set('mode', mode ?? 'empty')
    formAction(formData)
  }

  if (step === 0) {
    return (
      <>
        <StepIndicator current={0} total={2} />
        <div className="space-y-6">
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
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
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
              {ecosystems.map((eco) => {
                const checked = selectedEcosystems.includes(eco.id)
                return (
                  <label
                    key={eco.id}
                    className={cn(
                      'relative flex cursor-pointer rounded-lg border-2 p-3 transition-all',
                      checked
                        ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-500'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    )}
                  >
                    <input
                      type="checkbox"
                      name="ecosystems"
                      value={eco.id}
                      checked={checked}
                      onChange={() => handleEcosystemToggle(eco.id)}
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
                      {checked && (
                        <svg
                          className={cn('mt-0.5 h-5 w-5 shrink-0', ecosystemCheck[eco.id])}
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                  </label>
                )
              })}
            </div>
          </fieldset>

          <Button
            type="button"
            disabled={!isStep1Valid}
            className="w-full"
            onClick={() => setStep(1)}
          >
            Continue
          </Button>
        </div>
      </>
    )
  }

  return (
    <form action={handleSubmit}>
      <StepIndicator current={1} total={2} />

      <div className="text-center">
        <h2 className="text-lg font-semibold text-gray-900">
          Choose how you want to start
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          You can always add more data later.
        </p>
      </div>

      <input type="hidden" name="org_name" value={orgName} />
      {selectedEcosystems.map((id) => (
        <input key={id} type="hidden" name="ecosystems" value={id} />
      ))}

      <div className="mt-6 grid gap-4">
        <button
          type="submit"
          name="mode"
          value="demo"
          onClick={() => setMode('demo')}
          className={cn(
            'group relative flex items-start gap-4 rounded-xl border-2 p-5 text-left transition-all',
            mode === 'demo'
              ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-500'
              : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
          )}
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-xl">
            <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-900">
              Explore with Demo Data
            </p>
            <p className="mt-1 text-xs leading-relaxed text-gray-500">
              Instantly populate your dashboard with sample rooms, residents, rent records, visitors, and maintenance requests. See how everything works before adding your own data.
            </p>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {['15 Rooms', '30 Residents', '40 Rent Records', '20 Visitors', '5 Notices', '10 Requests'].map(
                (label) => (
                  <span
                    key={label}
                    className="inline-flex items-center justify-center rounded-md bg-indigo-50 px-2 py-1 text-[10px] font-medium text-indigo-700"
                  >
                    {label}
                  </span>
                )
              )}
            </div>
          </div>
          {mode === 'demo' && (
            <div className="absolute right-4 top-4 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600">
              <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
          )}
        </button>

        <button
          type="submit"
          name="mode"
          value="empty"
          onClick={() => setMode('empty')}
          className={cn(
            'group relative flex items-start gap-4 rounded-xl border-2 p-5 text-left transition-all',
            mode === 'empty'
              ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-500'
              : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
          )}
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-xl">
            <svg className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-900">
              Start Empty
            </p>
            <p className="mt-1 text-xs leading-relaxed text-gray-500">
              Begin with a blank dashboard and add your data manually. Best if you already have your resident and room information ready.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {['Add rooms first', 'Add residents', 'Track rent', 'Set up notifications'].map(
                (label) => (
                  <span
                    key={label}
                    className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-[10px] font-medium text-gray-600"
                  >
                    {label}
                  </span>
                )
              )}
            </div>
          </div>
          {mode === 'empty' && (
            <div className="absolute right-4 top-4 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600">
              <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
          )}
        </button>
      </div>

      {state?.error && (
        <p className="mt-4 text-sm text-red-600">{state.error}</p>
      )}

      <div className="mt-6 flex gap-3">
        <Button
          type="button"
          variant="secondary"
          className="flex-1"
          onClick={() => {
            setStep(0)
            setMode(null)
          }}
        >
          Back
        </Button>
        <Button
          type="submit"
          disabled={!isStep2Valid}
          loading={isPending}
          className="flex-1"
        >
          {mode === 'demo' ? 'Load Demo Data' : 'Start Building'}
        </Button>
      </div>
    </form>
  )
}
