import type { Metadata } from "next"

import { SubmitForm } from "@/app/submit/submit-form"
import { requireAuthentication } from "@/lib/auth"

export const metadata: Metadata = {
  title: "Add startup"
}

export const dynamic = "force-dynamic"

export default async function SubmitPage() {
  await requireAuthentication()

  return (
    <section className="submit-shell">
      <div className="page-intro">
        <p className="submit-shell__eyebrow">Add startup</p>
        <h1 className="page-title">Create a new startup entry.</h1>
        <p className="section-copy">
          The form is intentionally simple. Auth and catalog persistence both
          run directly through Supabase.
        </p>
      </div>
      <SubmitForm />
    </section>
  )
}
