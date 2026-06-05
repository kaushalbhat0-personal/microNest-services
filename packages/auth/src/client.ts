import { createBrowserClient } from '@supabase/ssr'
import type { Database, DBClient } from '@micronest/db'

export function createClient(): DBClient {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  ) as unknown as DBClient
}
