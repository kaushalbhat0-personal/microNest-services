import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@micronest/auth'
import { getUserOrganizations, globalSearch } from '@micronest/db'

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q')
  if (!q || !q.trim()) {
    return NextResponse.json({
      residents: [], rooms: [], maintenance: [], visitors: [],
    })
  }

  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({
      residents: [], rooms: [], maintenance: [], visitors: [],
    })
  }

  const orgs = await getUserOrganizations(supabase, user.id)
  if (orgs.length === 0) {
    return NextResponse.json({
      residents: [], rooms: [], maintenance: [], visitors: [],
    })
  }

  const results = await globalSearch(supabase, orgs[0].id, q.trim())
  return NextResponse.json(results)
}
