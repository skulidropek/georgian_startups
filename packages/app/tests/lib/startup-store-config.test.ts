import { afterEach, describe, expect, it } from "vitest"

import {
  createStartup,
  findPublishedStartupBySlug,
  listFeaturedStartups,
  listPublishedStartups
} from "../../src/lib/startup-store"
import type { StartupFormValues } from "../../src/lib/startups"

const supabaseEnvKeys = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
  "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY"
] as const

const originalEnv = Object.fromEntries(
  supabaseEnvKeys.map((key) => [key, process.env[key]])
)

const validSubmission: StartupFormValues = {
  startupName: "Port Nova",
  tagline: "Logistics OS",
  stage: "seed",
  market: "Logistics",
  industriesRaw: "supply chain",
  about: "Simple description",
  traction: "3 pilots",
  request: "Looking for angels",
  needsRaw: "intro to shippers",
  websiteUrl: "https://portnova.example",
  pitchDeckUrl: "https://portnova.example/deck",
  email: "hello@portnova.example"
}

const clearSupabaseEnv = () => {
  for (const key of supabaseEnvKeys) {
    delete process.env[key]
  }
}

const restoreSupabaseEnv = () => {
  for (const key of supabaseEnvKeys) {
    const value = originalEnv[key]

    if (value) {
      process.env[key] = value
    } else {
      delete process.env[key]
    }
  }
}

describe("startup store without Supabase env", () => {
  afterEach(() => {
    restoreSupabaseEnv()
  })

  it("returns empty public startup collections", async () => {
    clearSupabaseEnv()

    await expect(listPublishedStartups()).resolves.toEqual([])
    await expect(listFeaturedStartups(2)).resolves.toEqual([])
    await expect(findPublishedStartupBySlug("atlasfreight")).resolves.toBeUndefined()
  })

  it("returns a clear error for writes", async () => {
    clearSupabaseEnv()

    await expect(
      createStartup(validSubmission, {
        id: "user-1",
        email: "founder@example.com"
      })
    ).rejects.toThrow(
      "Supabase is not configured yet. Add the required environment variables and redeploy."
    )
  })
})
