type EnvShape = Partial<Record<string, string | undefined>>

export type SupabaseConfig = {
  readonly url: string
  readonly publishableKey: string
  readonly siteUrl: string
}

const defaultSiteUrl = "http://localhost:3000"

const readNonEmpty = (
  environment: EnvShape,
  key: string
): string | undefined => {
  const rawValue = environment[key]?.trim()

  return rawValue && rawValue.length > 0 ? rawValue : undefined
}

const normalizeUrl = (value: string): string => value.replace(/\/+$/, "")

export const normalizeNextPath = (
  value: string | null | undefined,
  fallback = "/submit"
): string => (value && value.startsWith("/") ? value : fallback)

export const getSupabaseConfig = (
  environment: EnvShape = process.env
): SupabaseConfig => {
  const url = readNonEmpty(environment, "NEXT_PUBLIC_SUPABASE_URL")
  const publishableKey =
    readNonEmpty(environment, "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY") ??
    readNonEmpty(environment, "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY")

  if (!url || !publishableKey) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY."
    )
  }

  const siteUrl = normalizeUrl(
    readNonEmpty(environment, "NEXT_PUBLIC_SITE_URL") ?? defaultSiteUrl
  )

  return {
    url: normalizeUrl(url),
    publishableKey,
    siteUrl
  }
}

export const isSupabaseConfigured = (
  environment: EnvShape = process.env
): boolean => {
  try {
    getSupabaseConfig(environment)
    return true
  } catch {
    return false
  }
}

export const hasSupabaseConfig = isSupabaseConfigured

export const requireSupabaseConfig = getSupabaseConfig
