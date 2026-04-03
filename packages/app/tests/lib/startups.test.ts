import { describe, expect, it } from "vitest"

import {
  createUniqueSlug,
  isValidEmail,
  isValidUrl,
  normalizeCommaSeparated,
  normalizeLineSeparated,
  seedStartups,
  slugifyStartupName
} from "../../src/lib/startups"

describe("startup helpers", () => {
  it("slugifies startup names", () => {
    expect(slugifyStartupName(" Hello, Atlas Freight ")).toBe("hello-atlas-freight")
  })

  it("creates a unique slug when the base one already exists", () => {
    const slug = createUniqueSlug(
      "AtlasFreight",
      new Set(seedStartups.map((startup) => startup.slug))
    )

    expect(slug).toBe("atlasfreight-2")
  })

  it("normalizes industries and needs", () => {
    expect(normalizeCommaSeparated("Fintech, SaaS , AI")).toEqual([
      "Fintech",
      "SaaS",
      "AI"
    ])

    expect(normalizeLineSeparated("Mentor intros\n\nPilot customers\n")).toEqual([
      "Mentor intros",
      "Pilot customers"
    ])
  })

  it("validates email and url fields", () => {
    expect(isValidEmail("founder@example.com")).toBe(true)
    expect(isValidEmail("founder.example.com")).toBe(false)
    expect(isValidUrl("https://example.com")).toBe(true)
    expect(isValidUrl("notaurl")).toBe(false)
  })
})
