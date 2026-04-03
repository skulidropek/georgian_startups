const missingConfigNeedle = "supabase is not configured"
const missingTableNeedle = "supabase startups table is missing"

export const missingStartupCatalogConfigMessage =
  "Startup catalog is unavailable on this deployment. Verify NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in Vercel, then redeploy."

const startupCatalogReadFailureMessage =
  "Startup catalog is temporarily unavailable. Verify the Supabase URL, publishable key, and read access for the startups table on this deployment."

const startupCatalogTableFailureMessage =
  "Startup catalog is unavailable because the Supabase startups table is missing."

export const getStartupCatalogErrorMessage = (error: unknown): string => {
  if (!(error instanceof Error)) {
    return startupCatalogReadFailureMessage
  }

  const normalizedMessage = error.message.trim().toLowerCase()

  if (normalizedMessage.includes(missingConfigNeedle)) {
    return missingStartupCatalogConfigMessage
  }

  if (normalizedMessage.includes(missingTableNeedle)) {
    return startupCatalogTableFailureMessage
  }

  return startupCatalogReadFailureMessage
}
