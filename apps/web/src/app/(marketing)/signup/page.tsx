import type { Metadata } from 'next'
import Link from 'next/link'
import { AuthForm, Card, Logo } from '@micronest/ui'
import { signup } from '@/lib/auth/actions'

export const metadata: Metadata = {
  title: 'Sign Up',
}

export default function SignupPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Logo className="justify-center" />
          <h1 className="mt-4 text-xl font-semibold text-gray-900">
            Create your account
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            One account for all ecosystems
          </p>
        </div>

        <AuthForm mode="signup" action={signup} />

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link
            href="/login"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Sign in
          </Link>
        </p>
      </Card>
    </div>
  )
}
