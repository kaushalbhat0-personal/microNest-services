export type PlanId = 'starter' | 'growth' | 'pro'

export interface PlanFeature {
  text: string
  included: boolean
}

export interface PlanLimits {
  maxResidents: number | null
  maxRooms: number | null
  maxProperties: number | null
}

export interface Plan {
  id: PlanId
  name: string
  price: string
  period: string
  description: string
  cta: string
  features: PlanFeature[]
  limits: PlanLimits
  highlighted?: boolean
}

export const PLANS: Plan[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 'Free',
    period: 'forever',
    description: 'For small PGs just getting started.',
    cta: 'Start Free',
    features: [
      { text: 'Up to 10 residents', included: true },
      { text: 'Up to 5 rooms', included: true },
      { text: 'Rent tracking', included: true },
      { text: 'Visitor log', included: true },
      { text: 'Basic email notifications', included: true },
      { text: 'WhatsApp notifications', included: false },
      { text: 'Maintenance requests', included: false },
      { text: 'Announcements', included: false },
      { text: 'Analytics dashboard', included: false },
      { text: 'Receipt generation', included: false },
      { text: 'Multi-property support', included: false },
      { text: 'Priority support', included: false },
    ],
    limits: {
      maxResidents: 10,
      maxRooms: 5,
      maxProperties: 1,
    },
  },
  {
    id: 'growth',
    name: 'Growth',
    price: '₹999',
    period: '/month',
    description: 'For growing hostels and co-living spaces.',
    cta: 'Start Free Trial',
    features: [
      { text: 'Unlimited residents', included: true },
      { text: 'Unlimited rooms', included: true },
      { text: 'Rent tracking with receipts', included: true },
      { text: 'Visitor log', included: true },
      { text: 'WhatsApp notifications', included: true },
      { text: 'Maintenance requests', included: true },
      { text: 'Announcements', included: true },
      { text: 'Analytics dashboard', included: true },
      { text: 'Receipt generation', included: true },
      { text: 'Multi-property support', included: false },
      { text: 'Priority support', included: false },
      { text: 'Dedicated account manager', included: false },
    ],
    limits: {
      maxResidents: null,
      maxRooms: null,
      maxProperties: 1,
    },
    highlighted: true,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 'Custom',
    period: '',
    description: 'For multi-property operators.',
    cta: 'Contact Sales',
    features: [
      { text: 'Everything in Growth', included: true },
      { text: 'Unlimited residents', included: true },
      { text: 'Unlimited rooms', included: true },
      { text: 'Multi-property support', included: true },
      { text: 'Custom integrations', included: true },
      { text: 'Priority support', included: true },
      { text: 'Dedicated account manager', included: true },
      { text: 'On-site training', included: true },
      { text: 'Custom WhatsApp templates', included: true },
      { text: 'SLA guarantees', included: true },
    ],
    limits: {
      maxResidents: null,
      maxRooms: null,
      maxProperties: null,
    },
  },
]

export function getPlan(planName: string): Plan | undefined {
  return PLANS.find((p) => p.id === planName || p.name.toLowerCase() === planName.toLowerCase())
}

export function getDefaultPlan(): Plan {
  return PLANS[0]
}

export function checkPlanLimit(
  planName: string,
  currentValue: number,
  limitKey: keyof PlanLimits
): { allowed: boolean; limit: number | null } {
  const plan = getPlan(planName)
  if (!plan) return { allowed: true, limit: null }
  const limit = plan.limits[limitKey]
  if (limit === null) return { allowed: true, limit: null }
  return { allowed: currentValue < limit, limit }
}
