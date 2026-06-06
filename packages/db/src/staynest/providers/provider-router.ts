import type { NotificationProviderResult } from '../../types'
import * as interakt from './interakt'
import * as wati from './wati'

export type ProviderName = 'interakt' | 'wati'

const providerMap: Record<string, {
  validateConnection: (creds: Record<string, string>) => Promise<NotificationProviderResult>
  sendTestMessage: (creds: Record<string, string>, phone: string, message: string) => Promise<NotificationProviderResult>
  sendMessage: (creds: Record<string, string>, phone: string, message: string) => Promise<NotificationProviderResult>
}> = {
  interakt,
  wati,
}

export function getProvider(name: string) {
  return providerMap[name] ?? null
}

export function getActiveProvider(
  providerSettings: Record<string, Record<string, string>>
): { name: string; handler: typeof providerMap[string]; credentials: Record<string, string> } | null {
  for (const [name, settings] of Object.entries(providerSettings)) {
    if (settings.activated === 'true') {
      const handler = getProvider(name)
      if (handler) return { name, handler, credentials: settings }
    }
  }
  return null
}
