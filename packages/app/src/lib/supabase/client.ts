import { createBrowserClient } from "@supabase/ssr"
import type { SupabaseClient } from "@supabase/supabase-js"

import type { Database } from "@/lib/supabase/database.types"
import { getSupabaseConfig } from "@/lib/supabase/config"

let browserClient: SupabaseClient<Database> | undefined

export const createClient = (): SupabaseClient<Database> => {
  if (browserClient) {
    return browserClient
  }

  const { publishableKey, url } = getSupabaseConfig()

  browserClient = createBrowserClient<Database>(url, publishableKey)

  return browserClient
}
