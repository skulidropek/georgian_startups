import type { Metadata } from "next"

import { StartupCard } from "@/components/startup-card"
import { listPublishedStartups } from "@/lib/startup-store"

export const metadata: Metadata = {
  title: "Startups"
}

export const dynamic = "force-dynamic"

export default async function StartupsPage() {
  const startups = await listPublishedStartups()

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
