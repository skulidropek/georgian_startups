import Link from "next/link"

import { StartupCard } from "@/components/startup-card"
import {
  getStartupCatalogErrorMessage,
  missingStartupCatalogConfigMessage
} from "@/lib/startup-catalog-errors"
import { hasSupabaseConfig } from "@/lib/supabase/config"
import {
  listFeaturedStartups,
  listPublishedStartups
} from "@/lib/startup-store"
import type { StartupRecord } from "@/lib/startups"

export const dynamic = "force-dynamic"

export default async function HomePage() {
  const isSupabaseReady = hasSupabaseConfig()
  let catalogMessage: string | null = isSupabaseReady
    ? null
    : missingStartupCatalogConfigMessage
  let featuredStartups: Array<StartupRecord> = []
  let allStartups: Array<StartupRecord> = []

  if (isSupabaseReady) {
    try {
      ;[featuredStartups, allStartups] = await Promise.all([
        listFeaturedStartups(2),
        listPublishedStartups()
      ])
    } catch (error) {
      catalogMessage = getStartupCatalogErrorMessage(error)
    }
  }

  return (
    <section className="section-grid">
      <section className="section-card hero">
        <div className="hero__content">
          <p className="eyebrow">Startup directory</p>
          <h1>Browse startups. Add new ones through a protected form.</h1>
          <p className="lead">
            Minimal interface for viewing companies and adding a new startup
            without extra UI noise.
          </p>
          <div className="hero__actions">
            <Link className="button-link button-link--primary" href="/startups">
              Browse startups
            </Link>
            <Link className="button-link button-link--secondary" href="/submit">
              Add startup
            </Link>
          </div>
        </div>
        <div className="hero__panel">
          <div className="hero__stats">
            <div className="stat-row">
              <span>Total startups</span>
              <strong className="stat-row__value">{allStartups.length}</strong>
            </div>
            <div className="stat-row">
              <span>Visible now</span>
              <strong className="stat-row__value">{featuredStartups.length}</strong>
            </div>
          </div>
          <p className="auth-note">
            Adding a startup is protected by a basic login step.
          </p>
          {catalogMessage ? <p className="alert">{catalogMessage}</p> : null}
        </div>
      </section>

      <section className="section-card">
        <div className="section-card__header">
          <div className="page-intro">
            <p className="submit-shell__eyebrow">Latest startups</p>
            <h2 className="page-title">Recent entries</h2>
          </div>
          <Link className="link-chip" href="/startups">
            See all
          </Link>
        </div>
        <div className="startup-grid">
          {featuredStartups.length > 0 ? (
            featuredStartups.map((startup) => (
              <StartupCard key={startup.slug} startup={startup} />
            ))
          ) : (
            <div className="empty-state">
              {catalogMessage
                ? "The catalog will appear here after Supabase becomes available."
                : "No featured startups yet. Add one through the protected form."}
            </div>
          )}
        </div>
      </section>
    </section>
  )
}
