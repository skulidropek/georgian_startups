import type { Metadata } from "next"

import { logoutAction } from "@/app/actions/logout"
import { SubmitForm } from "@/app/submit/submit-form"
import { requireAuthentication } from "@/lib/auth"

export const metadata: Metadata = {
  title: "Add startup"
}

export default async function SubmitPage() {
  await requireAuthentication()

  return (
    <section className="submit-shell">
      <div className="page-intro">
        <p className="submit-shell__eyebrow">Add startup</p>
        <h1 className="page-title">Add a startup to the directory.</h1>
        <p className="section-copy">
          Keep the profile concise. Authentication and catalog persistence both
          go directly through Supabase.
        </p>
      </div>
      <div className="form-actions">
        <form action={logoutAction}>
          <button className="button-link button-link--secondary" type="submit">
            Logout
          </button>
        </form>
      </div>
      <SubmitForm />
    </section>
  )
}
