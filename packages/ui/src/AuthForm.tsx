'use client'

import { useActionState } from 'react'
import { Button } from './Button'

type State = {
  error?: string | null
}

type AuthFormProps = {
  mode: 'login' | 'signup'
  action: (prev: State, formData: FormData) => Promise<State>
}

export function AuthForm({ mode, action }: AuthFormProps) {
  const [state, formAction, isPending] = useActionState(action, {
    error: null,
  })

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-3 text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-lavender focus:outline-none focus:ring-1 focus:ring-lavender min-h-[48px]"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete={
            mode === 'login' ? 'current-password' : 'new-password'
          }
          required
          minLength={6}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-3 text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-lavender focus:outline-none focus:ring-1 focus:ring-lavender min-h-[48px]"
        />
      </div>

      {state?.error && (
        <p className="text-sm text-red-600">{state.error}</p>
      )}

      <Button type="submit" loading={isPending} className="w-full min-h-[48px]">
        {mode === 'login' ? 'Sign in' : 'Create account'}
      </Button>
    </form>
  )
}
