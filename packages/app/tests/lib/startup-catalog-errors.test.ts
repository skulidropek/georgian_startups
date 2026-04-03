import { describe, expect, it } from "vitest"

import {
  getStartupCatalogErrorMessage,
  missingStartupCatalogConfigMessage
} from "../../src/lib/startup-catalog-errors"

describe("startup catalog errors", () => {
  it("maps missing config errors to the Vercel env hint", () => {
    expect(
      getStartupCatalogErrorMessage(
        new Error(
          "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY."
        )
      )
    ).toBe(missingStartupCatalogConfigMessage)
  })

  it("maps missing table errors to a table-specific message", () => {
    expect(
      getStartupCatalogErrorMessage(
        new Error(
          "Supabase startups table is missing. Apply the startups migration."
        )
      )
    ).toBe(
      "Startup catalog is unavailable because the Supabase startups table is missing."
    )
  })

  it("maps unknown errors to a generic read-access hint", () => {
    expect(getStartupCatalogErrorMessage(new Error("fetch failed"))).toBe(
      "Startup catalog is temporarily unavailable. Verify the Supabase URL, publishable key, and read access for the startups table on this deployment."
    )
  })
})
