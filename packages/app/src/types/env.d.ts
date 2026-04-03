declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_SITE_URL?: string
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY?: string
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?: string
    NEXT_PUBLIC_SUPABASE_URL?: string
    SUPABASE_SECRET_KEY?: string
    SUPABASE_SERVICE_ROLE_KEY?: string
  }
}
