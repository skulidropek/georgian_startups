import type { PostgrestError } from "@supabase/supabase-js"

import type { AuthenticatedUser } from "@/lib/auth"
import type { Database } from "@/lib/supabase/database.types"
import { hasSupabaseConfig } from "@/lib/supabase/config"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import {
  createUniqueSlug,
  isStartupStage,
  isValidEmail,
  isValidUrl,
  normalizeCommaSeparated,
  normalizeLineSeparated,
  type StartupFormValues,
  type StartupRecord
} from "@/lib/startups"

type StartupRow = Database["public"]["Tables"]["startups"]["Row"]
type StartupInsert = Database["public"]["Tables"]["startups"]["Insert"]
type StartupSlugRow = Pick<StartupRow, "slug">

const missingStartupsTableCode = "PGRST205"
const uniqueViolationCode = "23505"

const isMissingStartupsTable = (error: PostgrestError): boolean =>
  error.code === missingStartupsTableCode

const throwStartupStoreError = (
  action: "load" | "save",
  error: PostgrestError
): never => {
  if (isMissingStartupsTable(error)) {
    throw new Error(
      "Supabase startups table is missing. Apply the startups migration."
    )
  }

  if (action === "save" && error.code === "42501") {
    throw new Error("Supabase policy rejected the write.")
  }

  if (action === "save" && error.code === "23503") {
    throw new Error("Your account is not allowed to create startups yet.")
  }

  throw new Error(error.message)
}

const mapStartupRowToRecord = (row: StartupRow): StartupRecord => ({
  slug: row.slug,
  startupName: row.startup_name,
  tagline: row.tagline,
  stage: row.stage,
  market: row.market,
  industries: row.industries,
  about: row.about,
  traction: row.traction,
  request: row.request,
  needs: row.needs,
  websiteUrl: row.website_url,
  pitchDeckUrl: row.pitch_deck_url,
  email: row.email,
  createdAt: row.created_at,
  isFeatured: row.is_featured,
  isPublished: row.is_published
})

const createStartupInsert = (
  values: StartupFormValues,
  slug: string,
  createdBy: AuthenticatedUser
): StartupInsert => ({
  slug,
  startup_name: values.startupName.trim(),
  tagline: values.tagline.trim(),
  stage: values.stage,
  market: values.market.trim(),
  industries: normalizeCommaSeparated(values.industriesRaw),
  about: values.about.trim(),
  traction: values.traction.trim(),
  request: values.request.trim(),
  needs: normalizeLineSeparated(values.needsRaw),
  website_url:
    values.websiteUrl.trim().length > 0 ? values.websiteUrl.trim() : null,
  pitch_deck_url: values.pitchDeckUrl.trim(),
  email: values.email.trim(),
  is_featured: false,
  is_published: true,
  created_by: createdBy.id
})

const listExistingStartupSlugs = async (): Promise<ReadonlySet<string>> => {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase.from("startups").select("slug")

  if (error) {
    throwStartupStoreError("load", error)
  }

  return new Set((data ?? []).map((row: StartupSlugRow) => row.slug))
}

export const validateStartupInput = (
  values: StartupFormValues
): string | null => {
  const allRequiredFieldsPresent =
    values.startupName.length > 0 &&
    values.tagline.length > 0 &&
    values.market.length > 0 &&
    values.industriesRaw.length > 0 &&
    values.about.length > 0 &&
    values.traction.length > 0 &&
    values.request.length > 0 &&
    values.needsRaw.length > 0 &&
    values.pitchDeckUrl.length > 0 &&
    values.email.length > 0

  if (!allRequiredFieldsPresent) {
    return "Fill in all required fields."
  }

  if (!isValidEmail(values.email)) {
    return "Enter a valid contact email."
  }

  if (values.websiteUrl.length > 0 && !isValidUrl(values.websiteUrl)) {
    return "Website URL must be valid."
  }

  if (!isValidUrl(values.pitchDeckUrl)) {
    return "Pitch deck URL must be valid."
  }

  if (normalizeCommaSeparated(values.industriesRaw).length === 0) {
    return "Add at least one industry."
  }

  if (normalizeLineSeparated(values.needsRaw).length === 0) {
    return "Add at least one startup need."
  }

  return null
}

export const parseStartupSubmissionInput = (
  formData: FormData
): StartupFormValues => {
  const rawStage = String(formData.get("stage") ?? "").trim()

  return {
    startupName: String(formData.get("startupName") ?? "").trim(),
    tagline: String(formData.get("tagline") ?? "").trim(),
    stage: isStartupStage(rawStage) ? rawStage : "pre-seed",
    market: String(formData.get("market") ?? "").trim(),
    industriesRaw: String(formData.get("industriesRaw") ?? "").trim(),
    about: String(formData.get("about") ?? "").trim(),
    traction: String(formData.get("traction") ?? "").trim(),
    request: String(formData.get("request") ?? "").trim(),
    needsRaw: String(formData.get("needsRaw") ?? "").trim(),
    websiteUrl: String(formData.get("websiteUrl") ?? "").trim(),
    pitchDeckUrl: String(formData.get("pitchDeckUrl") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim()
  }
}

export const listPublishedStartups = async (): Promise<Array<StartupRecord>> => {
  if (!hasSupabaseConfig()) {
    return []
  }

  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from("startups")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false })

  if (error) {
    throwStartupStoreError("load", error)
  }

  return (data ?? []).map(mapStartupRowToRecord)
}

export const listFeaturedStartups = async (
  limit: number
): Promise<Array<StartupRecord>> => {
  if (!hasSupabaseConfig()) {
    return []
  }

  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from("startups")
    .select("*")
    .eq("is_published", true)
    .eq("is_featured", true)
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) {
    throwStartupStoreError("load", error)
  }

  return (data ?? []).map(mapStartupRowToRecord)
}

export const findPublishedStartupBySlug = async (
  slug: string
): Promise<StartupRecord | undefined> => {
  if (!hasSupabaseConfig()) {
    return undefined
  }

  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from("startups")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle()

  if (error) {
    throwStartupStoreError("load", error)
  }

  return data ? mapStartupRowToRecord(data) : undefined
}

export const createStartup = async (
  values: StartupFormValues,
  createdBy: AuthenticatedUser
): Promise<StartupRecord> => {
  if (!hasSupabaseConfig()) {
    throw new Error(
      "Supabase is not configured yet. Add the required environment variables and redeploy."
    )
  }

  const validationMessage = validateStartupInput(values)

  if (validationMessage) {
    throw new Error(validationMessage)
  }

  const supabase = await createSupabaseServerClient()

  for (let attempt = 0; attempt < 3; attempt += 1) {
    const slug = createUniqueSlug(values.startupName, await listExistingStartupSlugs())
    const { data, error } = await supabase
      .from("startups")
      .insert(createStartupInsert(values, slug, createdBy))
      .select("*")
      .single()

    if (!error) {
      return mapStartupRowToRecord(data)
    }

    if (error.code === uniqueViolationCode) {
      continue
    }

    throwStartupStoreError("save", error)
  }

  throw new Error("Unable to create a unique startup slug.")
}
