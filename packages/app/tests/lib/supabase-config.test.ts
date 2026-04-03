import { describe, expect, it } from "vitest"

import { getSupabaseConfig, hasSupabaseConfig } from "../../src/lib/supabase/config"

describe("supabase config", () => {
  it("reads the canonical publishable key env var", () => {
    expect(
      getSupabaseConfig({
        NEXT_PUBLIC_SUPABASE_URL: "https://project.supabase.co",
        NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_123"
      })
    ).toMatchObject({
      url: "https://project.supabase.co",
      publishableKey: "sb_publishable_123"
    })
  })

  it("accepts the connect-dialog default key env var", () => {
    expect(
      getSupabaseConfig({
        NEXT_PUBLIC_SUPABASE_URL: "https://project.supabase.co",
        NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY: "sb_publishable_456"
      })
    ).toMatchObject({
      url: "https://project.supabase.co",
      publishableKey: "sb_publishable_456"
    })
  })

  it("detects incomplete configuration", () => {
    expect(
      hasSupabaseConfig({
        NEXT_PUBLIC_SUPABASE_URL: "https://project.supabase.co"
      })
    ).toBe(false)
  })
})
