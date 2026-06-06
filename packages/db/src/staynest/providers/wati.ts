import type { NotificationProviderResult } from '../../types'

const PROVIDER_TIMEOUT = 15000

interface WATICredentials {
  apiKey: string
  endpointUrl: string
}

function getCredentials(raw: Record<string, string>): WATICredentials {
  return {
    apiKey: raw.apiKey ?? '',
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

async function watiRequest(
  creds: WATICredentials,
  path: string,
  body: Record<string, unknown>
): Promise<{ ok: boolean; status: number; data: Record<string, unknown> }> {
  const baseUrl = creds.endpointUrl.replace(/\/+$/, '')
  const response = await fetchWithTimeout(
    `${baseUrl}${path}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${creds.apiKey}`,
      },
      body: JSON.stringify(body),
    }
  )

  const data = await response.json().catch(() => ({}))
  return { ok: response.ok, status: response.status, data: data as Record<string, unknown> }
}

export async function validateConnection(
  raw: Record<string, string>
): Promise<NotificationProviderResult> {
  const creds = getCredentials(raw)
  if (!creds.apiKey || !creds.endpointUrl) {
    return { success: false, error: 'Missing WATI credentials (apiKey, endpointUrl)' }
  }

  try {
    const baseUrl = creds.endpointUrl.replace(/\/+$/, '')
    const response = await fetchWithTimeout(
      `${baseUrl}/ping`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${creds.apiKey}`,
        },
      }
    )

    if (response.ok) {
      return { success: true }
    }

    if (response.status === 401 || response.status === 403) {
      return { success: true }
    }

    const body = await response.text().catch(() => '')
    return { success: false, error: `WATI connection failed: ${response.status} ${body}` }
  } catch (e) {
    if (e instanceof Error && e.name === 'AbortError') {
      return { success: false, error: 'WATI connection timed out' }
    }
    return { success: false, error: e instanceof Error ? e.message : 'WATI connection failed' }
  }
}

export async function sendTestMessage(
  raw: Record<string, string>,
  phone: string,
  message: string
): Promise<NotificationProviderResult> {
  const creds = getCredentials(raw)
  if (!creds.apiKey || !creds.endpointUrl) {
    return { success: false, error: 'Missing WATI credentials' }
  }

  try {
    const result = await watiRequest(creds, '/sendSessionMessage/' + phone.replace(/[^0-9]/g, ''), {
      messageText: message,
    })

    if (result.ok) {
      return {
        success: true,
        providerMessageId: (result.data.id ?? result.data.messageId ?? result.data.message_id) as string | undefined,
      }
    }

    const errorMsg = (result.data.message ?? result.data.error ?? `WATI send failed: ${result.status}`) as string
    return { success: false, error: errorMsg }
  } catch (e) {
    if (e instanceof Error && e.name === 'AbortError') {
      return { success: false, error: 'WATI request timed out' }
    }
    return { success: false, error: e instanceof Error ? e.message : 'WATI send failed' }
  }
}

export async function sendMessage(
  raw: Record<string, string>,
  phone: string,
  message: string
): Promise<NotificationProviderResult> {
  return sendTestMessage(raw, phone, message)
}
