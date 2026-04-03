import { createServerClient } from "@supabase/ssr"
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
