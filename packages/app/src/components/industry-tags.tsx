export const IndustryTags = ({
  industries
}: {
  readonly industries: ReadonlyArray<string>
}) => (
  <ul className="industry-tags" aria-label="Industries">
    {industries.map((industry) => (
      <li key={industry} className="industry-tags__item">
        {industry}
      </li>
    ))}
  </ul>
)
