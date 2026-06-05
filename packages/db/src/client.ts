import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import type { Database, DBClient } from './types'

export function createClient(url: string, anonKey: string): DBClient {
  return createSupabaseClient<Database>(url, anonKey) as unknown as DBClient
}
