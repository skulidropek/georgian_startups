import { createClient } from "@supabase/supabase-js"

import type { Database } from "@/lib/supabase/database.types"
import { getSupabaseConfig } from "@/lib/supabase/config"

const getSupabaseAdminKey = (): string => {
  const adminKey =
    process.env["SUPABASE_SECRET_KEY"]?.trim() ||
    process.env["SUPABASE_SERVICE_ROLE_KEY"]?.trim()

  if (!adminKey) {
    throw new Error(
      "Supabase admin auth is not configured. Set SUPABASE_SECRET_KEY."
    )
  }

  return adminKey
}

export const createSupabaseAdminClient = () => {
  const { url } = getSupabaseConfig()

  return createClient<Database>(url, getSupabaseAdminKey(), {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}
