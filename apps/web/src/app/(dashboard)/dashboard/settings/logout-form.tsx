'use client'

import { Button } from '@micronest/ui'
import { signout } from '@/lib/auth/actions'

export function LogoutForm() {
  return (
    <form action={signout}>
      <Button type="submit" variant="outline" size="sm">
        Log out
      </Button>
    </form>
  )
}
