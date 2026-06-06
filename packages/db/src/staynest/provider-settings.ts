import type { DBClient } from '../types'

export type ProviderName = 'interakt' | 'wati'

export type ProviderConfig = {
  name: ProviderName
  label: string
  description: string
  fields: ProviderField[]
  configured: boolean
}

export type ProviderField = {
  key: string
  label: string
  type: 'text' | 'password' | 'url'
  placeholder: string
  required: boolean
}

export const PROVIDER_DEFINITIONS: ProviderConfig[] = [
  {
    name: 'interakt',
    label: 'Interakt',
    description: 'Interakt is a WhatsApp Business API provider for Indian businesses. Supports templates, session messages, and webhooks.',
    configured: false,
    fields: [
      { key: 'apiKey', label: 'API Key', type: 'text', placeholder: 'Your Interakt API key', required: true },
      { key: 'apiSecret', label: 'API Secret', type: 'password', placeholder: 'Your Interakt API secret', required: true },
      { key: 'endpointUrl', label: 'Endpoint URL', type: 'url', placeholder: 'https://api.interakt.ai/v1/public/', required: true },
    ],
  },
  {
    name: 'wati',
    label: 'WATI',
    description: 'WATI is a WhatsApp Team Inbox and automation platform. Uses API key authentication and supports broadcast messaging.',
    configured: false,
    fields: [
      { key: 'apiKey', label: 'API Key', type: 'password', placeholder: 'Your WATI API access token', required: true },
      { key: 'endpointUrl', label: 'Endpoint URL', type: 'url', placeholder: 'https://live.wati.io/api/v1/', required: true },
    ],
  },
]

function getStayNestEcosystemSlug(): string {
  return 'staynest'
}

export async function getProviderSettings(
  supabase: DBClient,
  organizationId: string
): Promise<Record<string, Record<string, string>>> {
  const { data: orgEco } = await supabase
    .from('organization_ecosystems')
    .select('settings')
    .eq('organization_id', organizationId)
    .eq('ecosystem_id', (await getEcosystemIdBySlug(supabase, getStayNestEcosystemSlug())))
    .single() as unknown as { data: { settings: Record<string, unknown> } | null; error: unknown }

  if (!orgEco?.settings) return {}
  const providers = (orgEco.settings as Record<string, unknown>)['notification_providers'] as Record<string, Record<string, string>> | undefined
  return providers ?? {}
}

export async function saveProviderSettings(
  supabase: DBClient,
  organizationId: string,
  providers: Record<string, Record<string, string>>
): Promise<boolean> {
  const ecosystemId = await getEcosystemIdBySlug(supabase, getStayNestEcosystemSlug())
  const { data: existing } = await supabase
    .from('organization_ecosystems')
    .select('settings')
    .eq('organization_id', organizationId)
    .eq('ecosystem_id', ecosystemId)
    .single() as unknown as { data: { settings: Record<string, unknown> } | null; error: unknown }

  const currentSettings = (existing?.settings ?? {}) as Record<string, unknown>
  const { error } = await supabase
    .from('organization_ecosystems')
    .update({
      settings: {
        ...currentSettings,
        notification_providers: providers,
      } as any,
    })
    .eq('organization_id', organizationId)
    .eq('ecosystem_id', ecosystemId)

  return !error
}

async function getEcosystemIdBySlug(supabase: DBClient, slug: string): Promise<string> {
  const { data } = await supabase
    .from('ecosystems')
    .select('id')
    .eq('slug', slug)
    .single() as unknown as { data: { id: string } | null; error: unknown }
  return data?.id ?? ''
}
