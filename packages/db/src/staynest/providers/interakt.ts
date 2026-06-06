import type { NotificationProviderResult } from '../../types'

const PROVIDER_TIMEOUT = 15000

interface InteraktCredentials {
  apiKey: string
  apiSecret: string
  endpointUrl: string
}

function getCredentials(raw: Record<string, string>): InteraktCredentials {
  return {
    apiKey: raw.apiKey ?? '',
    apiSecret: raw.apiSecret ?? '',
    endpointUrl: raw.endpointUrl ?? '',
  }
}

async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeoutMs: number = PROVIDER_TIMEOUT
): Promise<Response> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const response = await fetch(url, { ...options, signal: controller.signal })
    return response
  } finally {
    clearTimeout(timeout)
  }
}

export async function validateConnection(
  raw: Record<string, string>
): Promise<NotificationProviderResult> {
  const creds = getCredentials(raw)
  if (!creds.apiKey || !creds.apiSecret || !creds.endpointUrl) {
    return { success: false, error: 'Missing Interakt credentials (apiKey, apiSecret, endpointUrl)' }
  }

  try {
    const response = await fetchWithTimeout(
      `${creds.endpointUrl.replace(/\/+$/, '')}/v1/public/message/`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${Buffer.from(`${creds.apiKey}:${creds.apiSecret}`).toString('base64')}`,
        },
        body: JSON.stringify({
          countryCode: '+91',
          phoneNumber: '9000000000',
          callbackData: 'validation',
          type: 'Text',
          text: 'Connection test from StayNest',
        }),
      }
    )

    if (response.ok || response.status === 401 || response.status === 403) {
      return { success: true }
    }

    const body = await response.text().catch(() => '')
    return { success: false, error: `Interakt connection failed: ${response.status} ${body}` }
  } catch (e) {
    if (e instanceof Error && e.name === 'AbortError') {
      return { success: false, error: 'Interakt connection timed out' }
    }
    return { success: false, error: e instanceof Error ? e.message : 'Interakt connection failed' }
  }
}

export async function sendTestMessage(
  raw: Record<string, string>,
  phone: string,
  message: string
): Promise<NotificationProviderResult> {
  const creds = getCredentials(raw)
  if (!creds.apiKey || !creds.apiSecret || !creds.endpointUrl) {
    return { success: false, error: 'Missing Interakt credentials' }
  }

  try {
    const response = await fetchWithTimeout(
      `${creds.endpointUrl.replace(/\/+$/, '')}/v1/public/message/`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${Buffer.from(`${creds.apiKey}:${creds.apiSecret}`).toString('base64')}`,
        },
        body: JSON.stringify({
          countryCode: '+91',
          phoneNumber: phone.replace(/[^0-9]/g, ''),
          callbackData: 'test_message',
          type: 'Text',
          text: message,
        }),
      }
    )

    const body = await response.json().catch(() => ({}))
    if (response.ok) {
      return {
        success: true,
        providerMessageId: body.id ?? body.messageId ?? null,
      }
    }

    return {
      success: false,
      error: body.message ?? body.error ?? `Interakt send failed: ${response.status}`,
    }
  } catch (e) {
    if (e instanceof Error && e.name === 'AbortError') {
      return { success: false, error: 'Interakt request timed out' }
    }
    return { success: false, error: e instanceof Error ? e.message : 'Interakt send failed' }
  }
}

export async function sendMessage(
  raw: Record<string, string>,
  phone: string,
  message: string
): Promise<NotificationProviderResult> {
  return sendTestMessage(raw, phone, message)
}
