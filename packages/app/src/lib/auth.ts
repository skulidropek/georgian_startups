import type { Route } from "next"
import { redirect } from "next/navigation"

import { isSupabaseConfigured, normalizeNextPath } from "@/lib/supabase/config"
import { createSupabaseServerClient } from "@/lib/supabase/server"

const defaultProtectedPath = "/submit"

export { normalizeNextPath } from "@/lib/supabase/config"

export type AuthenticatedUser = {
  readonly id: string
  readonly email: string | null
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
