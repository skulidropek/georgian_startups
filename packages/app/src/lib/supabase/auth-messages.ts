type AuthErrorShape = {
  readonly code?: string
  readonly message?: string
}

export const mapSupabaseAuthErrorMessage = (error: unknown): string => {
  const authError =
    error && typeof error === "object" ? (error as AuthErrorShape) : undefined
  const code = authError?.code?.trim().toLowerCase()
  const message =
    typeof authError?.message === "string"
      ? authError.message
      : error instanceof Error
        ? error.message
        : "Authentication failed."
  const normalizedMessage = message.trim().toLowerCase()

  if (
    code === "over_email_send_rate_limit" ||
    normalizedMessage.includes("email rate limit exceeded")
  ) {
    return "Supabase has temporarily rate limited sign-up emails for this project. Wait a bit, or disable email confirmation / configure SMTP in Supabase Auth."
  }

  if (
    code === "email_address_invalid" ||
    normalizedMessage.includes("email address") &&
      normalizedMessage.includes("invalid")
  ) {
    return "Enter a real email address."
  }

  if (normalizedMessage.includes("email not confirmed")) {
    return "Confirm your email first, then sign in."
  }

  if (normalizedMessage.includes("invalid login credentials")) {
    return "Incorrect email or password."
  }

  return message
}
