import { createServerClient } from "@supabase/ssr"
import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"

import type { Database } from "@/lib/supabase/database.types"
import { getSupabaseConfig } from "@/lib/supabase/config"

export const createSupabaseServerClient = async () => {
  const cookieStore = await cookies()
  const { publishableKey, url } = getSupabaseConfig()

  return createServerClient<Database>(url, publishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, options, value }) =>
            cookieStore.set(name, value, options)
          )
        } catch {
          return
        }
      }
    }
  })
}

export const createClient = createSupabaseServerClient

export const createSupabaseReadClient = () => {
  const { publishableKey, url } = getSupabaseConfig()

  return createSupabaseClient<Database>(url, publishableKey, {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false
    }
  })
}
