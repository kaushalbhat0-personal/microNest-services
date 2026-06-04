import type { SupabaseClient } from '@supabase/supabase-js'
import type {
  Database,
  Profile,
  Organization,
  OrganizationMember,
  OrganizationEcosystem,
  Ecosystem,
  Subscription,
  AuditLog,
} from './types'

type DBClient = SupabaseClient<Database>

// ── Utility ─────────────────────────────────────────────────────────────

export async function userHasOrganization(
  supabase: DBClient,
  userId: string
): Promise<boolean> {
  const { count } = await supabase
    .from('organization_members')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
  return (count ?? 0) > 0
}

// ── Profile ────────────────────────────────────────────────────────────

export async function getProfile(
  supabase: DBClient,
  userId: string
): Promise<Profile | null> {
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  return data
}

export async function updateProfile(
  supabase: DBClient,
  userId: string,
  updates: Partial<Pick<Profile, 'full_name' | 'avatar_url'>>
): Promise<Profile | null> {
  const { data } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select('*')
    .single()
  return data
}

// ── Organizations ──────────────────────────────────────────────────────

export async function getUserOrganizations(
  supabase: DBClient,
  userId: string
): Promise<(Organization & { membership: OrganizationMember })[]> {
  const { data } = await supabase
    .from('organization_members')
    .select('*, organization:organizations(*)')
    .eq('user_id', userId) as any
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return (data ?? []).map((m: any) => ({
    ...(m.organization as Organization),
    membership: {
      id: m.id,
      organization_id: m.organization_id,
      user_id: m.user_id,
      role: m.role,
      created_at: m.created_at,
    } as OrganizationMember,
  }))
}

export async function getOrganization(
  supabase: DBClient,
  organizationId: string
): Promise<Organization | null> {
  const { data } = await supabase
    .from('organizations')
    .select('*')
    .eq('id', organizationId)
    .single()
  return data
}

export async function getOrganizationBySlug(
  supabase: DBClient,
  slug: string
): Promise<Organization | null> {
  const { data } = await supabase
    .from('organizations')
    .select('*')
    .eq('slug', slug)
    .single()
  return data
}

// ── Organization Members ───────────────────────────────────────────────

export async function getOrganizationMembers(
  supabase: DBClient,
  organizationId: string
): Promise<(OrganizationMember & { profile: Profile })[]> {
  const { data } = await supabase
    .from('organization_members')
    .select('*, profile:profiles(*)')
    .eq('organization_id', organizationId) as any
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return (data ?? []).map((m: any) => ({
    id: m.id,
    organization_id: m.organization_id,
    user_id: m.user_id,
    role: m.role,
    created_at: m.created_at,
    profile: m.profile as Profile,
  }))
}

// ── Ecosystems ─────────────────────────────────────────────────────────

export async function getAvailableEcosystems(
  supabase: DBClient
): Promise<Ecosystem[]> {
  const { data } = await supabase
    .from('ecosystems')
    .select('*')
    .order('name')
  return data ?? []
}

export async function getOrganizationEcosystems(
  supabase: DBClient,
  organizationId: string
): Promise<(Ecosystem & { activation: OrganizationEcosystem })[]> {
  const { data } = await supabase
    .from('organization_ecosystems')
    .select('*, ecosystem:ecosystems(*)')
    .eq('organization_id', organizationId) as any
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return (data ?? []).map((oe: any) => ({
    ...(oe.ecosystem as Ecosystem),
    activation: {
      id: oe.id,
      organization_id: oe.organization_id,
      ecosystem_id: oe.ecosystem_id,
      settings: oe.settings,
      activated_at: oe.activated_at,
    } as OrganizationEcosystem,
  }))
}

export async function activateEcosystem(
  supabase: DBClient,
  organizationId: string,
  ecosystemId: string,
  settings?: Record<string, unknown>
): Promise<OrganizationEcosystem | null> {
  const { data } = await supabase
    .from('organization_ecosystems')
    .insert({
      organization_id: organizationId,
      ecosystem_id: ecosystemId,
      settings: settings ?? {},
    })
    .select('*')
    .single()
  return data
}

// ── Subscriptions ──────────────────────────────────────────────────────

export async function getOrganizationSubscription(
  supabase: DBClient,
  organizationId: string
): Promise<Subscription | null> {
  const { data } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('organization_id', organizationId)
    .single()
  return data
}

// ── Audit Log ──────────────────────────────────────────────────────────

export async function createAuditLog(
  supabase: DBClient,
  log: {
    organization_id?: string
    user_id?: string
    action: string
    entity_type: string
    entity_id?: string
    metadata?: Record<string, unknown>
  }
): Promise<void> {
  await supabase.from('audit_logs').insert({
    organization_id: log.organization_id ?? null,
    user_id: log.user_id ?? null,
    action: log.action,
    entity_type: log.entity_type,
    entity_id: log.entity_id ?? null,
    metadata: (log.metadata ?? {}) as any,
  })
}

export async function getAuditLogs(
  supabase: DBClient,
  organizationId: string,
  options?: { limit?: number; offset?: number }
): Promise<AuditLog[]> {
  const { data } = await supabase
    .from('audit_logs')
    .select('*')
    .eq('organization_id', organizationId)
    .order('created_at', { ascending: false })
    .range(options?.offset ?? 0, (options?.offset ?? 0) + (options?.limit ?? 50) - 1)
  return data ?? []
}
