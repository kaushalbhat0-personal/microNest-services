import type { Metadata } from 'next'
import { Card, CardBody, CardHeader, Button, StatusBadge, UsageBar } from '@micronest/ui'
import { createServerClient } from '@micronest/auth'
import { getOrganizationSubscription, getUserOrganizations, getPlanUsage } from '@micronest/db'
import { PLANS, getPlan } from '@micronest/config'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Subscription',
}

function formatDate(iso: string | null): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default async function SubscriptionPage() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  let currentPlanName = 'starter'
  let status = 'trial'
  let trialEnd = null as string | null
  let periodEnd = null as string | null
  let planUsage = null as Awaited<ReturnType<typeof getPlanUsage>> | null

  if (user) {
    const orgs = await getUserOrganizations(supabase, user.id)
    if (orgs.length > 0) {
      const orgId = orgs[0].id
      const [sub, usage] = await Promise.all([
        getOrganizationSubscription(supabase, orgId),
        getPlanUsage(supabase, orgId),
      ])
      if (sub) {
        currentPlanName = sub.plan_name
        status = sub.status
        trialEnd = sub.trial_ends_at
        periodEnd = sub.current_period_ends_at
      }
      planUsage = usage
    }
  }

  const currentPlan = getPlan(currentPlanName) ?? PLANS[0]
  const isTrial = status === 'trial'
  const isActive = status === 'active'
  const isExpired = status === 'expired' || status === 'cancelled'
  const isOnStarter = currentPlanName === 'starter'

  const statusBadgeVariant = isActive || isTrial ? 'success' : isExpired ? 'danger' : 'warning'
  const statusLabel = isTrial ? 'Trial' : status.charAt(0).toUpperCase() + status.slice(1)

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Subscription</h1>
        <p className="mt-1 text-gray-600">Manage your plan and billing.</p>
      </div>

      {/* Current Plan Card */}
      <Card className="mb-8">
        <CardBody>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Current Plan</h2>
              <div className="mt-2 flex items-center gap-3">
                <span className="text-2xl font-bold text-gray-900">{currentPlan.name}</span>
                <StatusBadge variant={statusBadgeVariant}>
                  {statusLabel}
                </StatusBadge>
              </div>
              <p className="mt-1 text-sm text-gray-600">{currentPlan.description}</p>
              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex gap-2">
                  <dt className="text-gray-500">Price:</dt>
                  <dd className="font-medium text-gray-900">{currentPlan.price}{currentPlan.period}</dd>
                </div>
                {isTrial && trialEnd && (
                  <div className="flex gap-2">
                    <dt className="text-gray-500">Trial ends:</dt>
                    <dd className="font-medium text-gray-900">{formatDate(trialEnd)}</dd>
                  </div>
                )}
                {periodEnd && (
                  <div className="flex gap-2">
                    <dt className="text-gray-500">Current period ends:</dt>
                    <dd className="font-medium text-gray-900">{formatDate(periodEnd)}</dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Usage vs Limits */}
      {planUsage && (
        <Card className="mb-8">
          <CardBody>
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Usage vs Plan Limits</h2>
            <div className="space-y-4">
              <UsageBar
                label="Residents"
                current={planUsage.residents.current}
                limit={planUsage.residents.limit}
              />
              <UsageBar
                label="Rooms"
                current={planUsage.rooms.current}
                limit={planUsage.rooms.limit}
              />
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Properties</p>
                <p className="mt-1 text-xl font-bold text-gray-900">
                  {currentPlan.limits.maxProperties === null ? 'Unlimited' : currentPlan.limits.maxProperties}
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Plan Limit</p>
                <p className="mt-1 text-xl font-bold text-gray-900">{currentPlan.price}{currentPlan.period}</p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Status</p>
                <p className="mt-1 text-xl font-bold text-gray-900 capitalize">{statusLabel}</p>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Available Plans */}
      <Card>
        <CardBody>
          <h2 className="mb-6 text-lg font-semibold text-gray-900">
            {isOnStarter ? 'Upgrade your plan' : 'Compare plans'}
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {PLANS.filter((p) => p.id !== currentPlanName).map((plan) => (
              <div
                key={plan.id}
                className={`rounded-lg border p-5 ${
                  plan.highlighted
                    ? 'border-indigo-200 bg-indigo-50/30 ring-1 ring-indigo-200'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <h3 className="text-base font-semibold text-gray-900">{plan.name}</h3>
                <div className="mt-2">
                  <span className="text-xl font-bold text-gray-900">{plan.price}</span>
                  {plan.period && <span className="ml-1 text-sm text-gray-500">{plan.period}</span>}
                </div>
                <p className="mt-1 text-sm text-gray-600">{plan.description}</p>
                <ul className="mt-4 space-y-2">
                  {plan.features.slice(0, 6).map((f) => (
                    <li key={f.text} className="flex items-center gap-2 text-sm text-gray-600">
                      <svg className={`h-4 w-4 shrink-0 ${f.included ? 'text-green-500' : 'text-gray-300'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d={f.included ? 'M5 13l4 4L19 7' : 'M6 18L18 6M6 6l12 12'} />
                      </svg>
                      {f.text}
                    </li>
                  ))}
                </ul>
                <div className="mt-6">
                  <Link href={plan.id === 'pro' ? 'mailto:sales@micronest.app' : '/pricing'}>
                    <Button className="w-full" variant={plan.highlighted ? 'primary' : 'outline'} size="sm">
                      {plan.cta}
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
