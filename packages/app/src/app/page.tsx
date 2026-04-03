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

export const revalidate = 300

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
          <p className="eyebrow">Georgian startup directory</p>
          <h1>Simple catalog for browsing and submitting startups.</h1>
          <p className="lead">
            Open public startup profiles, review the essentials, and submit a
            new company after sign in.
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
              <span>Published startups</span>
              <strong className="stat-row__value">{allStartups.length}</strong>
            </div>
            <div className="stat-row">
              <span>Featured right now</span>
              <strong className="stat-row__value">{featuredStartups.length}</strong>
            </div>
          </div>
          <p className="auth-note">
            Submission stays behind a basic auth step. Browsing stays public.
          </p>
          {catalogMessage ? <p className="alert">{catalogMessage}</p> : null}
        </div>
      </section>

      <section className="section-card">
        <div className="section-card__header">
          <div className="page-intro">
            <p className="submit-shell__eyebrow">Featured</p>
            <h2 className="page-title">Current startup snapshot</h2>
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
                : "No featured startups yet. Add the first one through the protected form."}
            </div>
          )}
        </div>
      </section>
    </section>
  )
}
