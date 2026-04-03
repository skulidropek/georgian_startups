import type { Metadata } from "next"

import { StartupCard } from "@/components/startup-card"
import {
  getStartupCatalogErrorMessage,
  missingStartupCatalogConfigMessage
} from "@/lib/startup-catalog-errors"
import { hasSupabaseConfig } from "@/lib/supabase/config"
import { listPublishedStartups } from "@/lib/startup-store"
import type { StartupRecord } from "@/lib/startups"

export const metadata: Metadata = {
  title: "Startups"
}

export const dynamic = "force-dynamic"

export default async function StartupsPage() {
  const isSupabaseReady = hasSupabaseConfig()
  let catalogMessage: string | null = isSupabaseReady
    ? null
    : missingStartupCatalogConfigMessage
  let startups: Array<StartupRecord> = []

  if (isSupabaseReady) {
    try {
      startups = await listPublishedStartups()
    } catch (error) {
      catalogMessage = getStartupCatalogErrorMessage(error)
    }
  }

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
      {catalogMessage ? <p className="alert">{catalogMessage}</p> : null}
      {startups.length > 0 ? (
        <div className="startup-grid">
          {startups.map((startup) => (
            <StartupCard key={startup.slug} startup={startup} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          {catalogMessage
            ? "The catalog will appear here after Supabase becomes available."
            : "No startups yet. Use the protected add startup page to create the first one."}
        </div>
      )}
    </section>
  )
}
