import type { Route } from "next"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { isValidEmail } from "@/lib/startups"
import {
  getSupabaseConfig,
  isSupabaseConfigured,
  normalizeNextPath
} from "@/lib/supabase/config"
import { createSupabaseServerClient } from "@/lib/supabase/server"

const defaultProtectedPath = "/submit"

type HeaderShape = Pick<Headers, "get">

export { normalizeNextPath } from "@/lib/supabase/config"

export type AuthenticatedUser = {
  readonly id: string
  readonly email: string | null
}

export type PasswordAuthResult = {
  readonly ok: boolean
  readonly message: string | null
}

export type RegistrationResult =
  | {
      readonly status: "authenticated"
      readonly message: null
    }
  | {
      readonly status: "confirmation_required"
      readonly message: string
    }
  | {
      readonly status: "error"
      readonly message: string
    }

const readHeaderValue = (
  headersList: HeaderShape,
  key: string
): string | null => {
  const value = headersList.get(key)?.trim()

  return value && value.length > 0 ? value : null
}

const mapAuthErrorMessage = (message: string): string => {
  const normalizedMessage = message.trim().toLowerCase()

  if (normalizedMessage.includes("email not confirmed")) {
    return "Confirm your email first, then sign in."
  }

  if (normalizedMessage.includes("invalid login credentials")) {
    return "Incorrect email or password."
  }

  return message
}

export const resolveRequestOrigin = (
  headersList: HeaderShape,
  fallbackUrl: string
): string => {
  const origin = readHeaderValue(headersList, "origin")

  if (origin) {
    return origin
  }

  const forwardedHost =
    readHeaderValue(headersList, "x-forwarded-host") ??
    readHeaderValue(headersList, "host")
  const forwardedProtocol =
    readHeaderValue(headersList, "x-forwarded-proto") ?? "http"

  if (forwardedHost) {
    return `${forwardedProtocol}://${forwardedHost}`
  }

  return fallbackUrl
}

export const getRequestOrigin = async (): Promise<string> => {
  const headersList = await headers()

  return resolveRequestOrigin(headersList, getSupabaseConfig().siteUrl)
}

export const buildEmailRedirectUrl = async (
  nextPath = defaultProtectedPath
): Promise<string> => {
  const origin = await getRequestOrigin()
  const redirectUrl = new URL("/auth/callback", origin)

  redirectUrl.searchParams.set(
    "next",
    normalizeNextPath(nextPath, defaultProtectedPath)
  )

  return redirectUrl.toString()
}

export const getAuthenticatedUser = async (): Promise<AuthenticatedUser | null> => {
  if (!isSupabaseConfigured()) {
    return null
  }

  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
    error
  } = await supabase.auth.getUser()

  if (error || !user) {
    return null
  }

  return {
    id: user.id,
    email: user.email ?? null
  }
}

export const getCurrentUser = getAuthenticatedUser

export const isAuthenticated = async (): Promise<boolean> =>
  (await getAuthenticatedUser()) !== null

export const signInWithPassword = async (
  email: string,
  password: string
): Promise<PasswordAuthResult> => {
  if (!isSupabaseConfigured()) {
    return {
      ok: false,
      message: "Supabase is not configured yet."
    }
  }

  if (!isValidEmail(email)) {
    return {
      ok: false,
      message: "Enter a valid email."
    }
  }

  const supabase = await createSupabaseServerClient()
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) {
    return {
      ok: false,
      message: mapAuthErrorMessage(error.message)
    }
  }

  return {
    ok: true,
    message: null
  }
}

export const registerWithPassword = async (
  email: string,
  password: string,
  nextPath: string
): Promise<RegistrationResult> => {
  if (!isSupabaseConfigured()) {
    return {
      status: "error",
      message: "Supabase is not configured yet."
    }
  }

  if (!isValidEmail(email)) {
    return {
      status: "error",
      message: "Enter a valid email."
    }
  }

  if (password.length < 8) {
    return {
      status: "error",
      message: "Password must be at least 8 characters."
    }
  }

  const emailRedirectTo = await buildEmailRedirectUrl(nextPath)
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo
    }
  })

  if (error) {
    return {
      status: "error",
      message: mapAuthErrorMessage(error.message)
    }
  }

  if (data.session) {
    return {
      status: "authenticated",
      message: null
    }
  }

  return {
    status: "confirmation_required",
    message:
      "Account created. Check your email, confirm it, then sign in to continue."
  }
}

export const clearSession = async (): Promise<void> => {
  if (!isSupabaseConfigured()) {
    return
  }

  const supabase = await createSupabaseServerClient()
  await supabase.auth.signOut()
}

export const requireAuthentication = async (
  nextPath = defaultProtectedPath
): Promise<AuthenticatedUser> => {
  const user = await getAuthenticatedUser()

  if (!user) {
    const redirectPath = normalizeNextPath(nextPath, defaultProtectedPath)
    redirect(`/login?next=${encodeURIComponent(redirectPath)}` as Route)
  }

  return user
}
