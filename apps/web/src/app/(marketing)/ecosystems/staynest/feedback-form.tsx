'use client'

import { useActionState } from 'react'
import { submitFeedback } from '@/lib/feedback/actions'
import { Button } from '@micronest/ui'

const CATEGORIES = [
  { value: 'rent', label: 'Rent Collection' },
  { value: 'rooms', label: 'Occupancy Tracking' },
  { value: 'visitors', label: 'Visitors' },
  { value: 'maintenance', label: 'Maintenance Issues' },
  { value: 'electricity', label: 'Electricity Bills' },
  { value: 'deposits', label: 'Deposits' },
  { value: 'staff', label: 'Staff Management' },
  { value: 'food', label: 'Food Management' },
  { value: 'attendance', label: 'Attendance' },
  { value: 'other', label: 'Other' },
] as const

const initialState = { error: null, success: false }

export function FeedbackForm() {
  const [state, formAction] = useActionState(submitFeedback, initialState)

  if (state.success) {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 px-8 py-12 text-center">
        <p className="text-4xl">🎉</p>
        <p className="mt-4 text-lg font-semibold text-green-800">
          Thank you for your input!
        </p>
        <p className="mt-2 text-sm text-green-700">
          We are reviewing every response. If we build a solution for your pain point,
          we may reach out for early access.
        </p>
      </div>
    )
  }

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="ecosystem" value="staynest" />

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1 block text-sm font-medium text-gray-700">
            Your Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder="e.g. Rajesh Kumar"
            className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
          />
        </div>
        <div>
          <label htmlFor="business_name" className="mb-1 block text-sm font-medium text-gray-700">
            PG / Hostel Name
          </label>
          <input
            id="business_name"
            name="business_name"
            type="text"
            placeholder="e.g. Sai Residency"
            className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
          />
        </div>
      </div>

      <div>
        <label htmlFor="phone" className="mb-1 block text-sm font-medium text-gray-700">
          WhatsApp Number
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          required
          placeholder="+91 98765 43210"
          className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
        />
      </div>

      <div>
        <p className="mb-3 text-sm font-medium text-gray-700">
          What is the most frustrating part of running your PG or hostel?
        </p>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <label
              key={cat.value}
              className="cursor-pointer rounded-full border border-gray-200 px-4 py-2 text-sm text-gray-700 transition-colors has-[:checked]:border-amber-500 has-[:checked]:bg-amber-50 has-[:checked]:text-amber-800 hover:border-gray-300"
            >
              <input
                type="radio"
                name="category"
                value={cat.value}
                required
                className="sr-only"
              />
              {cat.label}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="problem" className="mb-1 block text-sm font-medium text-gray-700">
          Tell us more...
        </label>
        <textarea
          id="problem"
          name="problem"
          required
          rows={4}
          placeholder="Describe your biggest operational challenge — what's wasting your time, causing losses, or creating daily frustration..."
          className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
        />
      </div>

      {state?.error && (
        <p className="text-sm text-red-600">{state.error}</p>
      )}

      <Button type="submit" className="w-full" size="lg">
        Submit
      </Button>

      <p className="text-center text-xs text-gray-400">
        We will not spam you. Your number is only used if we want to follow up about your feedback.
      </p>
    </form>
  )
}
