import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"

import { RegisterForm } from "@/app/register/register-form"
import { isAuthenticated } from "@/lib/auth"

export const metadata: Metadata = {
  title: "Register"
}

export default async function RegisterPage({
  searchParams
}: {
  readonly searchParams: Promise<{ next?: string }>
}) {
  if (await isAuthenticated()) {
    redirect("/submit")
  }

  const resolvedSearchParams = await searchParams
  const nextPath =
    resolvedSearchParams.next && resolvedSearchParams.next.startsWith("/")
      ? resolvedSearchParams.next
      : "/submit"

  return (
    <section className="submit-shell">
      <div className="page-intro">
        <p className="submit-shell__eyebrow">Register</p>
        <h1 className="page-title">Create a new account.</h1>
        <p className="section-copy">
          Create an account first, then continue back to startup submission. If
          email confirmation is enabled, confirm the address before the first
          sign in.
        </p>
      </div>
      <RegisterForm nextPath={nextPath} />
      <div className="form-actions">
        <Link
          className="button-link button-link--secondary"
          href={`/login?next=${encodeURIComponent(nextPath)}`}
        >
          Back to login
        </Link>
      </div>
    </section>
  )
}
