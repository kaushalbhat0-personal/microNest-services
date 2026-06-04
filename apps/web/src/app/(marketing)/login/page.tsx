import type { Metadata } from 'next'
import Link from 'next/link'
import { AuthForm, Card, Logo } from '@micronest/ui'
import { login } from '@/lib/auth/actions'

export const metadata: Metadata = {
  title: 'Login',
}

export default function LoginPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Logo className="justify-center" />
          <h1 className="mt-4 text-xl font-semibold text-gray-900">
            Welcome back
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Sign in to your account
          </p>
        </div>

        <AuthForm mode="login" action={login} />

        <p className="mt-6 text-center text-sm text-gray-600">
          Don&apos;t have an account?{' '}
          <Link
            href="/signup"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Sign up
          </Link>
        </p>
      </Card>
    </div>
  )
}
