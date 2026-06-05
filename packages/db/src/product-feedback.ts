import type { DBClient, ProductFeedback, FeedbackCategory } from './types'

export async function createProductFeedback(
  supabase: DBClient,
  input: {
    name: string
    business_name: string
    phone: string
    ecosystem: string
    category: FeedbackCategory
    problem: string
  }
): Promise<ProductFeedback | null> {
  const { data } = await supabase
    .from('product_feedback')
    .insert({
      name: input.name,
      business_name: input.business_name,
      phone: input.phone,
      ecosystem: input.ecosystem,
      category: input.category,
      problem: input.problem,
      status: 'new',
    })
    .select('*')
    .single() as unknown as { data: ProductFeedback | null; error: unknown }
  return data
}

export async function listProductFeedback(
  supabase: DBClient,
  ecosystem?: string
): Promise<ProductFeedback[]> {
  let query = supabase
    .from('product_feedback')
    .select('*')
    .order('created_at', { ascending: false })

  if (ecosystem) {
    query = query.eq('ecosystem', ecosystem)
  }

  const { data } = await query as unknown as { data: ProductFeedback[] | null; error: unknown }
  return data ?? []
}
