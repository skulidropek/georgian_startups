import { NextResponse } from "next/server"

import { mapSupabaseAuthErrorMessage } from "@/lib/supabase/auth-messages"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { isValidEmail } from "@/lib/startups"

type LoginRequestBody = {
  readonly email?: string
  readonly password?: string
}

const jsonError = (
  message: string,
  status: number
): NextResponse<{ message: string }> =>
  NextResponse.json({ message }, { status })

export const POST = async (request: Request): Promise<Response> => {
  let body: LoginRequestBody

  try {
    body = (await request.json()) as LoginRequestBody
  } catch {
    return jsonError("Invalid login payload.", 400)
  }

  const email = body.email?.trim() ?? ""
  const password = body.password ?? ""

  if (!isValidEmail(email)) {
    return jsonError("Enter a valid email.", 400)
  }

  if (password.length === 0) {
    return jsonError("Enter your password.", 400)
  }

  try {
    const supabase = await createSupabaseServerClient()
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      return jsonError(mapSupabaseAuthErrorMessage(error), 401)
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    return jsonError(
      error instanceof Error ? error.message : "Authentication failed.",
      500
    )
  }
}
