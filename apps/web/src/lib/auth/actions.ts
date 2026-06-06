'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { createServerClient } from '@micronest/auth'

export async function login(
  _prev: { error?: string | null },
  formData: FormData
) {
  const supabase = await createServerClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signup(
  _prev: { error?: string | null },
  formData: FormData
) {
  const supabase = await createServerClient()

  const cookieStore = await cookies()
  const nonce = Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
  cookieStore.set('auth_state', nonce, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 600,
    path: '/',
  })

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  })

  if (error) {
    cookieStore.delete('auth_state')
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/onboarding')
}

export async function signout() {
  const supabase = await createServerClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/')
}
