import Link from "next/link"

export default function NotFound() {
  return (
    <section className="not-found">
      <p className="submit-shell__eyebrow">404</p>
      <h1>Startup not found.</h1>
      <p>
        The requested startup does not exist. Open the main list and select an
        available entry.
      </p>
      <Link className="button-link button-link--primary" href="/startups">
        Return to startups
      </Link>
    </section>
  )
}
