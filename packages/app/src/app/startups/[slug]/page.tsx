import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { cache } from "react"

import { IndustryTags } from "@/components/industry-tags"
import { StageBadge } from "@/components/stage-badge"
import {
  getStartupCatalogErrorMessage,
  missingStartupCatalogConfigMessage
} from "@/lib/startup-catalog-errors"
import { hasSupabaseConfig } from "@/lib/supabase/config"
import { findPublishedStartupBySlug } from "@/lib/startup-store"

type StartupPageProps = {
  readonly params: Promise<{
    readonly slug: string
  }>
}

export const revalidate = 300

const detailDateFormatter = new Intl.DateTimeFormat("en", {
  month: "short",
  day: "numeric",
  year: "numeric"
})

const getPublishedStartupBySlug = cache(async (slug: string) =>
  findPublishedStartupBySlug(slug)
)

export const generateMetadata = async ({
  params
}: StartupPageProps): Promise<Metadata> => {
  if (!hasSupabaseConfig()) {
    return {
      title: "Catalog unavailable"
    }
  }

  const resolvedParams = await params
  const startup = await getPublishedStartupBySlug(resolvedParams.slug).catch(() => undefined)

  if (!startup) {
    return {
      title: "Catalog unavailable"
    }
  }

  return {
    title: startup.startupName,
    description: startup.tagline,
    openGraph: {
      title: startup.startupName,
      description: startup.tagline
    }
  }
}

export default async function StartupDetailsPage({
  params
}: StartupPageProps) {
  let catalogMessage: string | null = null

  if (!hasSupabaseConfig()) {
    catalogMessage = missingStartupCatalogConfigMessage
  }

  const resolvedParams = await params
  const startup =
    catalogMessage === null
      ? await getPublishedStartupBySlug(resolvedParams.slug).catch((error) => {
          catalogMessage = getStartupCatalogErrorMessage(error)
          return undefined
        })
      : undefined

  if (catalogMessage) {
    return (
      <section className="submit-shell">
        <div className="page-intro">
          <p className="submit-shell__eyebrow">Catalog unavailable</p>
          <h1 className="page-title">Startup details are not available.</h1>
          <p className="alert">{catalogMessage}</p>
        </div>
        <div className="form-actions">
          <Link className="button-link button-link--secondary" href="/startups">
            Back to startups
          </Link>
        </div>
      </section>
    )
  }

  if (!startup) {
    notFound()
  }

  return (
    <section className="section-grid">
      <div className="detail-hero">
        <Link className="link-chip" href="/startups">
          Back to startups
        </Link>
        <div className="detail-meta">
          <StageBadge stage={startup.stage} />
          <span>{startup.market}</span>
          <span>{detailDateFormatter.format(new Date(startup.createdAt))}</span>
        </div>
        <div>
          <h1>{startup.startupName}</h1>
          <p className="detail-hero__lead">{startup.tagline}</p>
        </div>
        <IndustryTags industries={startup.industries} />
      </div>

      <div className="detail-grid">
        <div className="detail-grid__panel">
          <h2>About</h2>
          <p>{startup.about}</p>
          <h2>Traction</h2>
          <p>{startup.traction}</p>
          <h2>Funding request</h2>
          <p>{startup.request}</p>
        </div>

        <div className="detail-grid__stack">
          <div className="detail-grid__panel">
            <h2>Needs</h2>
            <ul>
              {startup.needs.map((need) => (
                <li key={need}>{need}</li>
              ))}
            </ul>
          </div>
          <div className="detail-grid__panel">
            <h2>Links and contact</h2>
            {startup.websiteUrl ? (
              <p>
                <a className="site-footer__link" href={startup.websiteUrl}>
                  Website
                </a>
              </p>
            ) : null}
            <p>
              <a className="site-footer__link" href={startup.pitchDeckUrl}>
                Pitch deck
              </a>
            </p>
            <p>
              <a className="site-footer__link" href={`mailto:${startup.email}`}>
                {startup.email}
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
