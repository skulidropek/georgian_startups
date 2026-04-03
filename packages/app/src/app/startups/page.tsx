import type { Metadata } from "next"

import { StartupCard } from "@/components/startup-card"
import { hasSupabaseConfig } from "@/lib/supabase/config"
import { listPublishedStartups } from "@/lib/startup-store"

export const metadata: Metadata = {
  title: "Startups"
}

export const dynamic = "force-dynamic"

export default async function StartupsPage() {
  const isSupabaseReady = hasSupabaseConfig()
  const startups = isSupabaseReady ? await listPublishedStartups() : []

  return (
    <section className="section-grid">
      <div className="toolbar">
        <div className="page-intro">
          <p className="submit-shell__eyebrow">Startups</p>
          <h1 className="page-title">Simple public list of startups.</h1>
          <p className="section-copy">
            Open any entry to read details, traction, links, and current needs.
          </p>
        </div>
      </div>
      {!isSupabaseReady ? (
        <p className="alert">
          This deployment is missing Supabase environment variables. Add
          `NEXT_PUBLIC_SUPABASE_URL` and
          `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` in Vercel, then redeploy.
        </p>
      ) : null}
      {startups.length > 0 ? (
        <div className="startup-grid">
          {startups.map((startup) => (
            <StartupCard key={startup.slug} startup={startup} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          No startups yet. Use the protected add startup page to create the
          first one.
        </div>
      )}
    </section>
  )
}
