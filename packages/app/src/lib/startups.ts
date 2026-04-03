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

export const seedStartups: ReadonlyArray<StartupRecord> = [
  {
    slug: "atlasfreight",
    startupName: "AtlasFreight",
    tagline: "Freight visibility for Black Sea trade corridors.",
    stage: "seed",
    market: "Logistics",
    industries: ["supply chain", "export", "b2b saas"],
    about:
      "AtlasFreight helps exporters across Georgia coordinate port bookings, customs milestones, and invoice collections from a single dashboard.",
    traction:
      "Piloting with 11 freight operators and two Tbilisi-based customs brokers, tracking more than $4.8M in annualized shipment volume.",
    request:
      "Looking for strategic capital and introductions to regional logistics groups expanding into the Caucasus.",
    needs: [
      "Warm intros to port operators",
      "Revenue-focused seed investors",
      "Pricing feedback from freight forwarders"
    ],
    websiteUrl: "https://atlasfreight.example",
    pitchDeckUrl: "https://atlasfreight.example/deck",
    email: "hello@atlasfreight.example",
    createdAt: "2026-03-28T10:00:00.000Z",
    isFeatured: true,
    isPublished: true
  },
  {
    slug: "orchardos",
    startupName: "OrchardOS",
    tagline: "Farm operations software built for high-value orchards.",
    stage: "pre-seed",
    market: "AgriTech",
    industries: ["agritech", "operations", "climate"],
    about:
      "OrchardOS gives fruit producers task scheduling, irrigation logs, and crop-risk reporting tailored to Georgian orchards.",
    traction:
      "Used by 23 farms this spring season with 87% weekly active managers and three paid pilots in Kakheti.",
    request:
      "Raising a pre-seed round to productize satellite-based yield forecasting and multilingual field workflows.",
    needs: [
      "Pilot farms for pomegranate and hazelnut crops",
      "Mentors in agri distribution",
      "Design partner for forecasting UX"
    ],
    websiteUrl: "https://orchardos.example",
    pitchDeckUrl: "https://orchardos.example/deck",
    email: "team@orchardos.example",
    createdAt: "2026-03-21T09:30:00.000Z",
    isFeatured: true,
    isPublished: true
  },
  {
    slug: "clinicmesh",
    startupName: "ClinicMesh",
    tagline: "Care coordination for independent clinics and diagnostics labs.",
    stage: "series-a",
    market: "HealthTech",
    industries: ["healthtech", "workflow", "interop"],
    about:
      "ClinicMesh connects appointment intake, lab processing, and patient follow-up in one operational layer for private clinics.",
    traction:
      "Processing 14,000 monthly visits across five clinics with signed expansion plans into two new diagnostic chains.",
    request:
      "Seeking growth capital and operators experienced in B2B healthcare sales across Eastern Europe.",
    needs: [
      "Partnerships with diagnostics networks",
      "Hiring pipeline for enterprise sales",
      "Regulatory advisors for regional expansion"
    ],
    websiteUrl: "https://clinicmesh.example",
    pitchDeckUrl: "https://clinicmesh.example/deck",
    email: "contact@clinicmesh.example",
    createdAt: "2026-02-14T14:15:00.000Z",
    isFeatured: false,
    isPublished: true
  }
]

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
