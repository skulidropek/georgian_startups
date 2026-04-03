import type { StartupStage } from "@/lib/startups"

const stageLabels: Record<StartupStage, string> = {
  "pre-seed": "Pre-seed",
  seed: "Seed",
  "series-a": "Series A",
  "series-b": "Series B",
  "series-c": "Series C",
  exit: "Exit"
}

export const StageBadge = ({
  stage
}: {
  readonly stage: StartupStage
}) => (
  <span className="stage-badge">{stageLabels[stage]}</span>
)
