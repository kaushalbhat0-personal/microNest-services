import type { Metadata } from 'next'
import { createServerClient } from '@micronest/auth'
import { listProductFeedback } from '@micronest/db'
import { FeedbackContent } from './feedback-content'

export const metadata: Metadata = {
  title: 'Feedback',
}

export default async function FeedbackPage() {
  const supabase = await createServerClient()
  const feedback = await listProductFeedback(supabase, 'staynest')

  return <FeedbackContent initialFeedback={feedback} />
}
