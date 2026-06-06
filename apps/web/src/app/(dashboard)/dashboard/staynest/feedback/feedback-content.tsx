'use client'

import { useState } from 'react'
import { useActionState } from 'react'
import { Card, CardBody, Button } from '@micronest/ui'
import type { ProductFeedback } from '@micronest/db'
import { submitDashboardFeedback } from '@/lib/staynest/feedback-actions'

const CATEGORIES = [
  { value: 'rent', label: 'Rent Collection' },
  { value: 'rooms', label: 'Occupancy Tracking' },
  { value: 'visitors', label: 'Visitors' },
  { value: 'complaints', label: 'Maintenance Issues' },
  { value: 'electricity', label: 'Electricity Bills' },
  { value: 'deposits', label: 'Deposits' },
  { value: 'staff', label: 'Staff Management' },
  { value: 'food', label: 'Food Management' },
  { value: 'attendance', label: 'Attendance' },
  { value: 'other', label: 'Other' },
] as const

const SURVEYS = [
  {
    id: 'frustration',
    question: 'What frustrates you most?',
    options: ['Rent tracking', 'Maintenance delays', 'Finding residents', 'Visitor security', 'Manual paperwork'],
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 16.318A4.486 4.486 0 0012.016 15a4.486 4.486 0 00-3.198 1.318M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
      </svg>
    ),
  },
  {
    id: 'feature',
    question: 'What feature should we build next?',
    options: ['Multi-property', 'Resident app', 'Auto late fees', 'Bulk rent generate', 'HR/staff module'],
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
      </svg>
    ),
  },
  {
    id: 'recommend',
    question: 'Would you recommend StayNest?',
    options: ['Definitely', 'Probably', 'Not sure', 'Probably not', 'No'],
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
      </svg>
    ),
  },
]

const LAUNCH_OPTIONS = [
  { value: 'yes', label: 'Yes, completely', color: 'border-green-300 hover:border-green-400 bg-green-50 text-green-800' },
  { value: 'maybe', label: 'Maybe with a few gaps', color: 'border-amber-300 hover:border-amber-400 bg-amber-50 text-amber-800' },
  { value: 'no', label: 'No, not yet', color: 'border-red-300 hover:border-red-400 bg-red-50 text-red-800' },
]

const CATEGORY_LABELS: Record<string, string> = {
  rent: 'Rent Collection',
  rooms: 'Occupancy Tracking',
  visitors: 'Visitors',
  complaints: 'Maintenance Issues',
  electricity: 'Electricity Bills',
  deposits: 'Deposits',
  staff: 'Staff Management',
  food: 'Food Management',
  attendance: 'Attendance',
  other: 'Other',
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function FeedbackContent({
  initialFeedback,
}: {
  initialFeedback: ProductFeedback[]
}) {
  const [feedback, setFeedback] = useState<ProductFeedback[]>(initialFeedback)
  const [surveys, setSurveys] = useState<Record<string, string | null>>({})
  const [launchAnswer, setLaunchAnswer] = useState<string | null>(null)

  const [state, formAction, isPending] = useActionState(
    submitDashboardFeedback,
    { error: null, success: false }
  )

  const feedbackCount = feedback.length
  const recentFeedback = feedback.slice(0, 5)

  function handleSurveyAnswer(surveyId: string, option: string) {
    setSurveys((prev) => ({
      ...prev,
      [surveyId]: prev[surveyId] === option ? null : option,
    }))
  }

  function handleLaunchAnswer(value: string) {
    setLaunchAnswer((prev) => (prev === value ? null : value))
  }

  if (state.success) {
    return (
      <div className="mx-auto max-w-lg py-16 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-green-100">
          <svg className="h-7 w-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <h2 className="mt-4 text-lg font-semibold text-gray-900">Thank you for your feedback!</h2>
        <p className="mt-2 text-sm text-gray-500">
          We review every submission and use it to improve StayNest.
        </p>
        <div className="mt-6">
          <Button onClick={() => window.location.reload()}>
            Submit another
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">Feedback Center</h1>
        <p className="mt-1 text-sm text-gray-500">
          Help us build a better StayNest. Share your thoughts, vote on features, and tell us if we are ready for launch.
        </p>
      </div>

      {/* 2. Feedback Dashboard */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardBody>
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
              Total Submissions
            </p>
            <p className="mt-1 text-2xl font-bold text-amber-600">{feedbackCount}</p>
            <p className="mt-1 text-xs text-gray-400">Across all StayNest users</p>
          </CardBody>
        </Card>
        <Card className="sm:col-span-2">
          <CardBody>
            <p className="mb-3 text-xs font-medium uppercase tracking-wider text-gray-500">
              Recent Feedback
            </p>
            {recentFeedback.length === 0 ? (
              <p className="py-4 text-center text-sm text-gray-400">No feedback submitted yet. Be the first!</p>
            ) : (
              <div className="divide-y divide-gray-100">
                {recentFeedback.map((item) => (
                  <div key={item.id} className="flex items-center justify-between py-2">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-gray-900">{item.problem}</p>
                      <p className="text-xs text-gray-400">
                        {CATEGORY_LABELS[item.category] ?? item.category} &middot; {formatDate(item.created_at)}
                      </p>
                    </div>
                    <span className="ml-3 shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600">
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>
      </div>

      {/* 1. Submit Feedback */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100">
            <svg className="h-4 w-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-gray-900">Submit Feedback</h2>
            <p className="text-xs text-gray-500">Share a problem or suggest an improvement</p>
          </div>
        </div>
        <form action={formAction} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-700">Category</label>
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map((cat) => (
                <label
                  key={cat.value}
                  className="cursor-pointer rounded-full border border-gray-200 px-3 py-1.5 text-xs text-gray-600 transition-colors has-[:checked]:border-amber-500 has-[:checked]:bg-amber-50 has-[:checked]:text-amber-700 hover:border-gray-300"
                >
                  <input type="radio" name="category" value={cat.value} required className="sr-only" />
                  {cat.label}
                </label>
              ))}
            </div>
          </div>
          <div>
            <label htmlFor="problem" className="mb-1.5 block text-xs font-medium text-gray-700">
              Describe the problem
            </label>
            <textarea
              id="problem"
              name="problem"
              required
              rows={3}
              placeholder="What is not working well? What could be better?"
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>
          <div>
            <label htmlFor="solution" className="mb-1.5 block text-xs font-medium text-gray-700">
              Suggested solution (optional)
            </label>
            <textarea
              id="solution"
              name="solution"
              rows={2}
              placeholder="How would you like this to work?"
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>
          {state?.error && (
            <p className="text-sm text-red-600">{state.error}</p>
          )}
          <Button type="submit" loading={isPending} size="sm">
            Submit Feedback
          </Button>
        </form>
      </div>

      {/* 3. Quick Surveys */}
      <div>
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100">
            <svg className="h-4 w-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
            </svg>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-gray-900">Quick Surveys</h2>
            <p className="text-xs text-gray-500">Your answers help us prioritize what to build next</p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {SURVEYS.map((survey) => (
            <div key={survey.id} className="rounded-xl border border-gray-200 bg-white p-5">
              <div className="mb-3 flex items-center gap-2">
                <span className="text-indigo-600">{survey.icon}</span>
                <h3 className="text-sm font-medium text-gray-900">{survey.question}</h3>
              </div>
              <div className="space-y-1.5">
                {survey.options.map((option) => {
                  const selected = surveys[survey.id] === option
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => handleSurveyAnswer(survey.id, option)}
                      className={`w-full rounded-lg px-3 py-2 text-left text-xs font-medium transition-all ${
                        selected
                          ? 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-300'
                          : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {option}
                    </button>
                  )
                })}
              </div>
              {surveys[survey.id] && (
                <p className="mt-3 text-[10px] text-green-600">Response recorded</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 4. Launch Readiness Widget */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100">
            <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
            </svg>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-gray-900">Launch Readiness</h2>
            <p className="text-xs text-gray-500">Can StayNest replace your current process?</p>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {LAUNCH_OPTIONS.map((opt) => {
            const selected = launchAnswer === opt.value
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleLaunchAnswer(opt.value)}
                className={`rounded-xl border-2 p-4 text-left text-sm font-medium transition-all ${
                  selected
                    ? `${opt.color} ring-2 ring-offset-1`
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                }`}
              >
                {opt.label}
                {selected && (
                  <span className="mt-1 block text-[10px] font-normal opacity-75">
                    {opt.value === 'yes'
                      ? 'Great to hear! Share what you like.'
                      : opt.value === 'maybe'
                        ? 'Tell us what is missing via the form above.'
                        : 'What would make it work for you?'}
                  </span>
                )}
              </button>
            )
          })}
        </div>
        {launchAnswer && (
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-gray-50 px-4 py-3">
            <svg className="h-4 w-4 shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            <p className="text-xs text-gray-500">
              Your response helps us gauge product-market fit. We track aggregate signals to decide when to launch publicly.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
