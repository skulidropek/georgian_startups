import { createBrowserClient } from "@supabase/ssr"

import type { Database } from "@/lib/supabase/database.types"
import { requireSupabaseConfig } from "@/lib/supabase/config"

export const createClient = () => {
  const config = requireSupabaseConfig()

  return createBrowserClient<Database>(config.url, config.publishableKey)
}
