export const mapSupabaseAuthErrorMessage = (message: string): string => {
  const normalizedMessage = message.trim().toLowerCase()

  if (normalizedMessage.includes("email not confirmed")) {
    return "Confirm your email first, then sign in."
  }

  if (normalizedMessage.includes("invalid login credentials")) {
    return "Incorrect email or password."
  }

  return message
}
