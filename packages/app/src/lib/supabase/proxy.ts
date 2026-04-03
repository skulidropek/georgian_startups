import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

import type { Database } from "@/lib/supabase/database.types"
import {
  getSupabaseConfig,
  isSupabaseConfigured
} from "@/lib/supabase/config"

export const updateSession = async (
  request: NextRequest
): Promise<NextResponse> => {
  if (!isSupabaseConfigured()) {
    return NextResponse.next({ request })
  }

  const { publishableKey, url } = getSupabaseConfig()
  let response = NextResponse.next({ request })

  const supabase = createServerClient<Database>(url, publishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet: Array<{
        name: string
        value: string
        options: Parameters<typeof response.cookies.set>[2]
      }>) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        )

        response = NextResponse.next({ request })

        cookiesToSet.forEach(({ name, options, value }) => {
          if (options) {
            response.cookies.set(name, value, options)
            return
          }

          response.cookies.set(name, value)
        })
      }
    }
  })

  await supabase.auth.getClaims()

  return response
}
