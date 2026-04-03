import { NextResponse } from "next/server"

import { createSupabaseAdminClient } from "@/lib/supabase/admin"
import { isValidEmail } from "@/lib/startups"

type RegisterRequestBody = {
  readonly email?: string
  readonly password?: string
}

const jsonError = (
  message: string,
  status: number
): NextResponse<{ message: string }> =>
  NextResponse.json({ message }, { status })

const mapAdminAuthError = (message: string): string => {
  const normalizedMessage = message.trim().toLowerCase()

  if (
    normalizedMessage.includes("already been registered") ||
    normalizedMessage.includes("user already registered")
  ) {
    return "This email is already registered."
  }

  if (normalizedMessage.includes("password should be at least")) {
    return "Password must be at least 8 characters."
  }

  return message
}

export const POST = async (request: Request): Promise<Response> => {
  let body: RegisterRequestBody

  try {
    body = (await request.json()) as RegisterRequestBody
  } catch {
    return jsonError("Invalid registration payload.", 400)
  }

  const email = body.email?.trim() ?? ""
  const password = body.password ?? ""

  if (!isValidEmail(email)) {
    return jsonError("Enter a valid email.", 400)
  }

  if (password.length < 8) {
    return jsonError("Password must be at least 8 characters.", 400)
  }

  try {
    const supabase = createSupabaseAdminClient()
    const { error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    })

    if (error) {
      return jsonError(mapAdminAuthError(error.message), 400)
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    return jsonError(
      error instanceof Error ? error.message : "Could not create the account.",
      500
    )
  }
}
