export type Database = {
  public: {
    Tables: {
      startups: {
        Row: {
          slug: string
          startup_name: string
          tagline: string
          stage:
            | "pre-seed"
            | "seed"
            | "series-a"
            | "series-b"
            | "series-c"
            | "exit"
          market: string
          industries: Array<string>
          about: string
          traction: string
          request: string
          needs: Array<string>
          website_url: string | null
          pitch_deck_url: string
          email: string
          created_at: string
          is_featured: boolean
          is_published: boolean
          created_by: string | null
        }
        Insert: {
          slug: string
          startup_name: string
          tagline: string
          stage:
            | "pre-seed"
            | "seed"
            | "series-a"
            | "series-b"
            | "series-c"
            | "exit"
          market: string
          industries: Array<string>
          about: string
          traction: string
          request: string
          needs: Array<string>
          website_url?: string | null
          pitch_deck_url: string
          email: string
          created_at?: string
          is_featured?: boolean
          is_published?: boolean
          created_by?: string | null
        }
        Update: Partial<Database["public"]["Tables"]["startups"]["Insert"]>
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
