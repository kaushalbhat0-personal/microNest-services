'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createServerClient } from '@micronest/auth'
import { activateEcosystem, createAuditLog, createOrganizationSubscription } from '@micronest/db'

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 100)
}

export async function completeOnboarding(
  _prev: { error?: string | null },
  formData: FormData
) {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'You must be signed in to complete onboarding.' }
  }

  const orgName = formData.get('org_name') as string
  const selectedEcosystems = formData.getAll('ecosystems') as string[]

  if (!orgName?.trim()) {
    return { error: 'Organization name is required.' }
  }

  if (selectedEcosystems.length === 0) {
    return { error: 'Select at least one ecosystem.' }
  }

  // Generate unique slug
  let slug = generateSlug(orgName)
  const { data: existing } = await supabase
    .from('organizations')
    .select('id')
    .eq('slug', slug)
    .maybeSingle()

  if (existing) {
    slug = `${slug}-${Math.random().toString(36).slice(2, 6)}`
  }

  // Create organization
  const orgResult = await supabase
    .from('organizations')
    .insert({ name: orgName.trim(), slug, created_by: user.id })
    .select('*') as unknown as { data: unknown[] | null; error: unknown }

  if (orgResult.error || !orgResult.data || orgResult.data.length === 0) {
    return { error: 'Failed to create organization. Please try again.' }
  }

  const org = orgResult.data[0] as { id: string; slug: string; name: string }

  // Add user as owner
  const { error: memberError } = await supabase
    .from('organization_members')
    .insert({ organization_id: org.id, user_id: user.id, role: 'owner' })

  if (memberError) {
    return { error: 'Failed to set up organization membership.' }
  }

  // Look up ecosystem IDs from slugs
  const { data: ecosystems } = await supabase
    .from('ecosystems')
    .select('id, slug')
    .in('slug', selectedEcosystems as ('staynest' | 'clinicnest' | 'freelancenest' | 'propertynest')[])

  if (!ecosystems || ecosystems.length === 0) {
    return { error: 'Selected ecosystems not found.' }
  }

  if (ecosystems.length !== selectedEcosystems.length) {
    return { error: 'Some selected ecosystems were not recognized. Please try again.' }
  }

  // Activate each selected ecosystem
  for (const eco of ecosystems) {
    const activation = await activateEcosystem(supabase, org.id, eco.id)
    if (!activation) {
      return { error: `Failed to activate ecosystem "${eco.slug}". Please try again.` }
    }
    await createAuditLog(supabase, {
      organization_id: org.id,
      user_id: user.id,
      action: 'ecosystem.activated',
      entity_type: 'ecosystem',
      entity_id: eco.id,
    })
  }

  // Create default subscription (free starter plan with 14-day trial)
  const sub = await createOrganizationSubscription(supabase, org.id, 'starter', 'trial')
  if (!sub) {
    return { error: 'Failed to create subscription. Please try again.' }
  }
  await createAuditLog(supabase, {
    organization_id: org.id,
    user_id: user.id,
    action: 'subscription.created',
    entity_type: 'subscription',
    entity_id: sub.id,
    metadata: { plan_name: 'starter', status: 'trial' },
  })

  // Log onboarding completion
  await createAuditLog(supabase, {
    organization_id: org.id,
    user_id: user.id,
    action: 'onboarding.completed',
    entity_type: 'organization',
    entity_id: org.id,
    metadata: { ecosystems: selectedEcosystems },
  })

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}
