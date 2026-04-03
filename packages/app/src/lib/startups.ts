export const startupStages = [
  "pre-seed",
  "seed",
  "series-a",
  "series-b",
  "series-c",
  "exit"
] as const

export type StartupStage = (typeof startupStages)[number]

export type StartupRecord = {
  readonly slug: string
  readonly startupName: string
  readonly tagline: string
  readonly stage: StartupStage
  readonly market: string
  readonly industries: ReadonlyArray<string>
  readonly about: string
  readonly traction: string
  readonly request: string
  readonly needs: ReadonlyArray<string>
  readonly websiteUrl: string | null
  readonly pitchDeckUrl: string
  readonly email: string
  readonly createdAt: string
  readonly isFeatured: boolean
  readonly isPublished: boolean
}

export type StartupFormValues = {
  readonly startupName: string
  readonly tagline: string
  readonly stage: StartupStage
  readonly market: string
  readonly industriesRaw: string
  readonly about: string
  readonly traction: string
  readonly request: string
  readonly needsRaw: string
  readonly websiteUrl: string
  readonly pitchDeckUrl: string
  readonly email: string
}

export type StartupFormState = {
  readonly status: "idle" | "error"
  readonly message: string | null
  readonly values: StartupFormValues
}

export const emptyStartupFormValues: StartupFormValues = {
  startupName: "",
  tagline: "",
  stage: "pre-seed",
  market: "",
  industriesRaw: "",
  about: "",
  traction: "",
  request: "",
  needsRaw: "",
  websiteUrl: "",
  pitchDeckUrl: "",
  email: ""
}

export const idleStartupFormState: StartupFormState = {
  status: "idle",
  message: null,
  values: emptyStartupFormValues
}

export const isStartupStage = (value: string): value is StartupStage =>
  startupStages.includes(value as StartupStage)

export const normalizeCommaSeparated = (rawValue: string): Array<string> =>
  rawValue
    .split(",")
    .map((value) => value.trim())
    .filter((value) => value.length > 0)

export const normalizeLineSeparated = (rawValue: string): Array<string> =>
  rawValue
    .split("\n")
    .map((value) => value.trim())
    .filter((value) => value.length > 0)

export const slugifyStartupName = (startupName: string): string =>
  startupName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")

export const isValidEmail = (value: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

export const isValidUrl = (value: string): boolean => {
  try {
    const url = new URL(value)
    return url.protocol === "http:" || url.protocol === "https:"
  } catch {
    return false
  }
}

export const createUniqueSlug = (
  startupName: string,
  existingSlugs: ReadonlySet<string>
): string => {
  const baseSlug = slugifyStartupName(startupName)
  const fallbackSlug = baseSlug.length > 0 ? baseSlug : "startup"

  if (!existingSlugs.has(fallbackSlug)) {
    return fallbackSlug
  }

  let index = 2
  let nextSlug = `${fallbackSlug}-${index}`

  while (existingSlugs.has(nextSlug)) {
    index += 1
    nextSlug = `${fallbackSlug}-${index}`
  }

  return nextSlug
}
