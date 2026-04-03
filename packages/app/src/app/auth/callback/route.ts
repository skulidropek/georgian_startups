import { NextResponse } from "next/server"

import { normalizeNextPath } from "@/lib/supabase/config"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export const GET = async (request: Request): Promise<Response> => {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const nextPath = normalizeNextPath(searchParams.get("next"))

  if (code) {
    const supabase = await createSupabaseServerClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      const forwardedHost = request.headers.get("x-forwarded-host")
      const forwardedProtocol = request.headers.get("x-forwarded-proto")

      if (process.env["NODE_ENV"] === "development") {
        return NextResponse.redirect(`${origin}${nextPath}`)
      }

      if (forwardedHost) {
        return NextResponse.redirect(
          `${forwardedProtocol ?? "https"}://${forwardedHost}${nextPath}`
        )
      }

      return NextResponse.redirect(`${origin}${nextPath}`)
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth-callback`)
}
