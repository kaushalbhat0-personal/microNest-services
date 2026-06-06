'use server'

import { revalidatePath } from 'next/cache'
import { createServerClient } from '@micronest/auth'
import { createProductFeedback, listProductFeedback } from '@micronest/db'
import type { FeedbackCategory } from '@micronest/db'

export async function submitDashboardFeedback(
  _prev: { error?: string | null; success?: boolean },
  formData: FormData
) {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'You must be signed in to submit feedback.', success: false }
  }

  const category = formData.get('category') as FeedbackCategory
  const problem = formData.get('problem') as string
  const solution = formData.get('solution') as string

  if (!category || !problem?.trim()) {
    return { error: 'Category and problem are required.', success: false }
  }

  const fullProblem = solution?.trim()
    ? `${problem.trim()}\n\n--- Suggested Solution ---\n${solution.trim()}`
    : problem.trim()

  const name = user.user_metadata?.full_name ?? user.email?.split('@')[0] ?? 'User'
  const phone = user.user_metadata?.phone ?? ''

  const result = await createProductFeedback(supabase, {
    name,
    business_name: name,
    phone,
    ecosystem: 'staynest',
    category,
    problem: fullProblem,
  })

  if (!result) {
    return { error: 'Failed to submit feedback. Please try again.', success: false }
  }

  revalidatePath('/dashboard/staynest/feedback')
  return { error: null, success: true }
}

export async function getFeedbackStats() {
  const supabase = await createServerClient()
  const feedback = await listProductFeedback(supabase, 'staynest')
  return {
    total: feedback.length,
    recent: feedback.slice(0, 5),
  }
}
