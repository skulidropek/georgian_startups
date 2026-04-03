import Link from "next/link"

import { IndustryTags } from "@/components/industry-tags"
import { StageBadge } from "@/components/stage-badge"
import type { StartupRecord } from "@/lib/startups"

const formatLaunchDate = (createdAt: string): string =>
  new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(new Date(createdAt))

export const StartupCard = ({
  startup
}: {
  readonly startup: StartupRecord
}) => (
  <article className="startup-card">
    <div className="startup-card__meta">
      <StageBadge stage={startup.stage} />
      <span>{startup.market}</span>
      <span>{formatLaunchDate(startup.createdAt)}</span>
    </div>
    <div className="startup-card__body">
      <div>
        <h2 className="startup-card__title">{startup.startupName}</h2>
        <p className="startup-card__tagline">{startup.tagline}</p>
      </div>
      <p className="startup-card__about">{startup.about}</p>
      <IndustryTags industries={startup.industries} />
    </div>
    <div className="startup-card__footer">
      <p className="startup-card__label">Open startup</p>
      <Link className="link-chip" href={`/startups/${startup.slug}`}>
        View startup
      </Link>
    </div>
  </article>
)
