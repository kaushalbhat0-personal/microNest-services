import type { DBClient } from './types'

// Inline plan config to avoid cross-package dependency
type PlanLimitsShape = {
  maxResidents: number | null
  maxRooms: number | null
  maxProperties: number | null
}

const PLANS_DATA: Record<string, { name: string; limits: PlanLimitsShape }> = {
  starter: {
    name: 'Starter',
    limits: { maxResidents: 10, maxRooms: 5, maxProperties: 1 },
  },
  growth: {
    name: 'Growth',
    limits: { maxResidents: null, maxRooms: null, maxProperties: 1 },
  },
  pro: {
    name: 'Pro',
    limits: { maxResidents: null, maxRooms: null, maxProperties: null },
  },
}

function getPlanData(planName: string): { name: string; limits: PlanLimitsShape } | undefined {
  return PLANS_DATA[planName] ?? PLANS_DATA['starter']
}

function checkLimit(limit: number | null, current: number): { allowed: boolean; limit: number | null } {
  if (limit === null) return { allowed: true, limit: null }
  return { allowed: current < limit, limit }
}

const NEXT_PLAN_ORDER = ['growth', 'pro']

export interface PlanCheckResult {
  allowed: boolean
  limit: number | null
  current: number
  planName: string
  limitName: string
  upgradeLabel: string
}

async function getOrgPlanName(supabase: DBClient, orgId: string): Promise<string> {
  const { data } = await supabase
    .from('subscriptions')
    .select('plan_name')
    .eq('organization_id', orgId)
    .single() as unknown as { data: { plan_name: string } | null; error: unknown }
  return data?.plan_name ?? 'starter'
}

async function countOrgResidents(supabase: DBClient, orgId: string): Promise<number> {
  const { count } = await supabase
    .from('staynest_residents')
    .select('*', { count: 'exact', head: true })
    .eq('organization_id', orgId)
    .is('deleted_at', null)
    .in('status', ['active', 'notice_period'])
  return count ?? 0
}

async function countOrgRooms(supabase: DBClient, orgId: string): Promise<number> {
  const { count } = await supabase
    .from('staynest_rooms')
    .select('*', { count: 'exact', head: true })
    .eq('organization_id', orgId)
    .is('deleted_at', null)
  return count ?? 0
}

async function countOrgProperties(supabase: DBClient, orgId: string): Promise<number> {
  const { count } = await supabase
    .from('organizations')
    .select('*', { count: 'exact', head: true })
    .eq('id', orgId)
  return count ?? 1
}

export async function getOrgUsageCounts(
  supabase: DBClient,
  orgId: string
): Promise<{ residents: number; rooms: number; properties: number }> {
  const [residents, rooms, properties] = await Promise.all([
    countOrgResidents(supabase, orgId),
    countOrgRooms(supabase, orgId),
    countOrgProperties(supabase, orgId),
  ])
  return { residents, rooms, properties }
}

export async function checkResidentLimit(
  supabase: DBClient,
  orgId: string
): Promise<PlanCheckResult> {
  const planName = await getOrgPlanName(supabase, orgId)
  const current = await countOrgResidents(supabase, orgId)
  const plan = getPlanData(planName)
  const result = checkLimit(plan?.limits.maxResidents ?? null, current)
  const nextPlan = NEXT_PLAN_ORDER.find((p) => p !== planName)
  const nextName = nextPlan ? getPlanData(nextPlan)?.name : undefined
  return {
    allowed: result.allowed,
    limit: result.limit,
    current,
    planName,
    limitName: 'resident',
    upgradeLabel: nextName
      ? `Upgrade to ${nextName} for unlimited residents`
      : 'Upgrade for unlimited residents',
  }
}

export async function checkRoomLimit(
  supabase: DBClient,
  orgId: string
): Promise<PlanCheckResult> {
  const planName = await getOrgPlanName(supabase, orgId)
  const current = await countOrgRooms(supabase, orgId)
  const plan = getPlanData(planName)
  const result = checkLimit(plan?.limits.maxRooms ?? null, current)
  const nextPlan = NEXT_PLAN_ORDER.find((p) => p !== planName)
  const nextName = nextPlan ? getPlanData(nextPlan)?.name : undefined
  return {
    allowed: result.allowed,
    limit: result.limit,
    current,
    planName,
    limitName: 'room',
    upgradeLabel: nextName
      ? `Upgrade to ${nextName} for unlimited rooms`
      : 'Upgrade for unlimited rooms',
  }
}

export async function checkPropertyLimit(
  supabase: DBClient,
  orgId: string
): Promise<PlanCheckResult> {
  const planName = await getOrgPlanName(supabase, orgId)
  const current = await countOrgProperties(supabase, orgId)
  const plan = getPlanData(planName)
  const result = checkLimit(plan?.limits.maxProperties ?? null, current)
  const nextPlan = NEXT_PLAN_ORDER.find((p) => p !== planName)
  const nextName = nextPlan ? getPlanData(nextPlan)?.name : undefined
  return {
    allowed: result.allowed,
    limit: result.limit,
    current,
    planName,
    limitName: 'property',
    upgradeLabel: nextName
      ? `Upgrade to ${nextName} for multi-property support`
      : 'Upgrade for multi-property support',
  }
}

export async function getPlanUsage(
  supabase: DBClient,
  orgId: string
): Promise<{
  planName: string
  planLabel: string
  residents: { current: number; limit: number | null; percentage: number }
  rooms: { current: number; limit: number | null; percentage: number }
}> {
  const [planName, residents, rooms] = await Promise.all([
    getOrgPlanName(supabase, orgId),
    countOrgResidents(supabase, orgId),
    countOrgRooms(supabase, orgId),
  ])
  const plan = getPlanData(planName)

  const residentLimit = plan?.limits.maxResidents ?? null
  const roomLimit = plan?.limits.maxRooms ?? null

  return {
    planName,
    planLabel: plan?.name ?? 'Starter',
    residents: {
      current: residents,
      limit: residentLimit,
      percentage: residentLimit ? Math.min(Math.round((residents / residentLimit) * 100), 100) : 0,
    },
    rooms: {
      current: rooms,
      limit: roomLimit,
      percentage: roomLimit ? Math.min(Math.round((rooms / roomLimit) * 100), 100) : 0,
    },
  }
}
