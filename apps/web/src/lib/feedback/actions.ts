'use server'

import { createClient, createProductFeedback, type FeedbackCategory } from '@micronest/db'

export async function submitFeedback(
  _prev: { error?: string | null; success?: boolean },
  formData: FormData
) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const name = formData.get('name') as string
  const businessName = formData.get('business_name') as string
  const phone = formData.get('phone') as string
  const ecosystem = formData.get('ecosystem') as string
  const category = formData.get('category') as FeedbackCategory
  const problem = formData.get('problem') as string

  if (!name?.trim() || !phone?.trim() || !category || !problem?.trim()) {
    return { error: 'Name, phone, category, and problem are required.', success: false }
  }

  const result = await createProductFeedback(supabase, {
    name: name.trim(),
    business_name: businessName.trim() || name.trim(),
    phone: phone.trim(),
    ecosystem: ecosystem || 'staynest',
    category,
    problem: problem.trim(),
  })

  if (!result) {
    return { error: 'Failed to submit. Please try again.', success: false }
  }

  return { error: null, success: true }
}
