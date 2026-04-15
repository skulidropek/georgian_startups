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

  it("prefers server Supabase env vars when they exist", () => {
    expect(
      getSupabaseConfig({
        NEXT_PUBLIC_SUPABASE_URL: "https://broken.supabase.co",
        NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_public",
        SUPABASE_ANON_KEY: "anon_server",
        SUPABASE_URL: "https://server.supabase.co"
      })
    ).toMatchObject({
      url: "https://server.supabase.co",
      publishableKey: "anon_server"
    })
  })

  it("accepts the public anon key env var", () => {
    expect(
      getSupabaseConfig({
        NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon_public",
        NEXT_PUBLIC_SUPABASE_URL: "https://project.supabase.co"
      })
    ).toMatchObject({
      url: "https://project.supabase.co",
      publishableKey: "anon_public"
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
