import { NextResponse } from 'next/server'
import { createServerClient } from '@micronest/auth'
import { cookies } from 'next/headers'

function isInternalPath(path: string): boolean {
  if (!path || !path.startsWith('/')) return false
  try {
    const url = new URL(path, 'http://n')
    return url.origin === 'http://n'
  } catch {
    return false
  }
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const nextParam = searchParams.get('next')
  const next = nextParam && isInternalPath(nextParam) ? nextParam : '/dashboard'

  const cookieStore = await cookies()
  const stateNonce = cookieStore.get('auth_state')?.value

  if (code) {
    const supabase = await createServerClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (error) {
      const response = NextResponse.redirect(
        `${origin}/login?error=${encodeURIComponent(error.message)}`
      )
      if (stateNonce) response.cookies.delete('auth_state')
      return response
    }
  }

  const response = NextResponse.redirect(`${origin}${next}`)
  if (stateNonce) response.cookies.delete('auth_state')
  return response
}
