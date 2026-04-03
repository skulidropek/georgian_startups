import fs from "node:fs"
import path from "node:path"
import type { PostgrestError } from "@supabase/supabase-js"

import type { AuthenticatedUser } from "@/lib/auth"
import type { Database } from "@/lib/supabase/database.types"
import { isSupabaseConfigured } from "@/lib/supabase/config"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import {
  createUniqueSlug,
  isStartupStage,
  isValidEmail,
  isValidUrl,
  normalizeCommaSeparated,
  normalizeLineSeparated,
  seedStartups,
  type StartupFormValues,
  type StartupRecord
} from "@/lib/startups"

type StartupRow = Database["public"]["Tables"]["startups"]["Row"]
type StartupInsert = Database["public"]["Tables"]["startups"]["Insert"]

const defaultDataPath = path.join(process.cwd(), "data", "startups.json")
const missingStartupsTableCode = "PGRST205"
const uniqueViolationCode = "23505"

const ensureDataFile = (filePath: string): void => {
  fs.mkdirSync(path.dirname(filePath), { recursive: true })

  if (!fs.existsSync(filePath)) {
    const initialData =
      filePath === defaultDataPath ? seedStartups : []

    fs.writeFileSync(filePath, `${JSON.stringify(initialData, null, 2)}\n`, "utf8")
  }
}

const readStartupCollection = (filePath: string): Array<StartupRecord> => {
  ensureDataFile(filePath)
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as Array<StartupRecord>
}

const writeStartupCollection = (
  filePath: string,
  startups: ReadonlyArray<StartupRecord>
): void => {
  fs.writeFileSync(filePath, `${JSON.stringify(startups, null, 2)}\n`, "utf8")
}

const sortByNewest = (
  startups: ReadonlyArray<StartupRecord>
): Array<StartupRecord> =>
  [...startups].sort((left, right) =>
    right.createdAt.localeCompare(left.createdAt)
  )

const isMissingStartupsTable = (error: PostgrestError): boolean =>
  error.code === missingStartupsTableCode

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

const toErrorMessage = (
  action: "load" | "save",
  error: PostgrestError
): string => {
  if (action === "save" && error.code === "42501") {
    return "Supabase policy rejected the write. Apply the startups migration first."
  }

  if (action === "save" && error.code === "23503") {
    return "Your account is not allowed to create startups yet."
  }

  return error.message
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

export const createStartupStore = (
  options: {
    readonly filePath?: string
  } = {}
) => {
  const filePath = options.filePath ?? defaultDataPath

  return {
    list: (): Array<StartupRecord> =>
      sortByNewest(
        readStartupCollection(filePath).filter((startup) => startup.isPublished)
      ),
    listFeatured: (limit: number): Array<StartupRecord> =>
      sortByNewest(
        readStartupCollection(filePath).filter(
          (startup) => startup.isPublished && startup.isFeatured
        )
      ).slice(0, limit),
    findBySlug: (slug: string): StartupRecord | undefined =>
      readStartupCollection(filePath).find(
        (startup) => startup.slug === slug && startup.isPublished
      ),
    add: (input: StartupFormValues, createdBy: AuthenticatedUser): StartupRecord => {
      void createdBy

      const validationMessage = validateStartupInput(input)

      if (validationMessage) {
        throw new Error(validationMessage)
      }

      const currentStartups = readStartupCollection(filePath)
      const startup: StartupRecord = {
        slug: createUniqueSlug(
          input.startupName,
          new Set(currentStartups.map((record) => record.slug))
        ),
        startupName: input.startupName.trim(),
        tagline: input.tagline.trim(),
        stage: input.stage,
        market: input.market.trim(),
        industries: normalizeCommaSeparated(input.industriesRaw),
        about: input.about.trim(),
        traction: input.traction.trim(),
        request: input.request.trim(),
        needs: normalizeLineSeparated(input.needsRaw),
        websiteUrl:
          input.websiteUrl.trim().length > 0 ? input.websiteUrl.trim() : null,
        pitchDeckUrl: input.pitchDeckUrl.trim(),
        email: input.email.trim(),
        createdAt: new Date().toISOString(),
        isFeatured: false,
        isPublished: true
      }

      writeStartupCollection(filePath, [startup, ...currentStartups])

      return startup
    }
  }
}

export const listPublishedStartups = async (): Promise<Array<StartupRecord>> => {
  if (!isSupabaseConfigured()) {
    return createStartupStore().list()
  }

  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from("startups")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false })

  if (error) {
    if (isMissingStartupsTable(error)) {
      return createStartupStore().list()
    }

    throw new Error(toErrorMessage("load", error))
  }

  return data.map(mapStartupRowToRecord)
}

export const listFeaturedStartups = async (
  limit: number
): Promise<Array<StartupRecord>> => {
  if (!isSupabaseConfigured()) {
    return createStartupStore().listFeatured(limit)
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
    if (isMissingStartupsTable(error)) {
      return createStartupStore().listFeatured(limit)
    }

    throw new Error(toErrorMessage("load", error))
  }

  return data.map(mapStartupRowToRecord)
}

export const findPublishedStartupBySlug = async (
  slug: string
): Promise<StartupRecord | undefined> => {
  if (!isSupabaseConfigured()) {
    return createStartupStore().findBySlug(slug)
  }

  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from("startups")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle()

  if (error) {
    if (isMissingStartupsTable(error)) {
      return createStartupStore().findBySlug(slug)
    }

    throw new Error(toErrorMessage("load", error))
  }

  return data ? mapStartupRowToRecord(data) : undefined
}

export const createStartup = async (
  values: StartupFormValues,
  createdBy: AuthenticatedUser
): Promise<StartupRecord> => {
  const validationMessage = validateStartupInput(values)

  if (validationMessage) {
    throw new Error(validationMessage)
  }

  if (!isSupabaseConfigured()) {
    return createStartupStore().add(values, createdBy)
  }

  const supabase = await createSupabaseServerClient()

  for (let attempt = 0; attempt < 3; attempt += 1) {
    const { data: existingRows, error: existingRowsError } = await supabase
      .from("startups")
      .select("slug")

    if (existingRowsError) {
      if (isMissingStartupsTable(existingRowsError)) {
        return createStartupStore().add(values, createdBy)
      }

      throw new Error(toErrorMessage("load", existingRowsError))
    }

    const slug = createUniqueSlug(
      values.startupName,
      new Set((existingRows ?? []).map((row: { slug: string }) => row.slug))
    )
    const { data, error } = await supabase
      .from("startups")
      .insert(createStartupInsert(values, slug, createdBy))
      .select("*")
      .single()

    if (!error) {
      return mapStartupRowToRecord(data)
    }

    if (isMissingStartupsTable(error)) {
      return createStartupStore().add(values, createdBy)
    }

    if (error.code === uniqueViolationCode) {
      continue
    }

    throw new Error(toErrorMessage("save", error))
  }

  throw new Error("Unable to create a unique startup slug.")
}
