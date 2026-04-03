import { describe, expect, it } from "vitest"

import { normalizeNextPath } from "../../src/lib/auth"

describe("auth helpers", () => {
  it("keeps safe relative next paths", () => {
    expect(normalizeNextPath("/submit")).toBe("/submit")
    expect(normalizeNextPath("/startups/atlasfreight")).toBe(
      "/startups/atlasfreight"
    )
  })

  it("falls back to the protected page for unsafe next paths", () => {
    expect(normalizeNextPath("https://example.com")).toBe("/submit")
    expect(normalizeNextPath("submit")).toBe("/submit")
    expect(normalizeNextPath(undefined)).toBe("/submit")
  })
})
