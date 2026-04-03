import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"

import { LoginForm } from "@/app/login/login-form"
import { isAuthenticated } from "@/lib/auth"

export const metadata: Metadata = {
  title: "Login"
}

export default async function LoginPage({
  searchParams
}: {
  readonly searchParams: Promise<{
    next?: string
    notice?: string
    error?: string
  }>
}) {
  if (await isAuthenticated()) {
    redirect("/submit")
  }

  const resolvedSearchParams = await searchParams
  const nextPath =
    resolvedSearchParams.next && resolvedSearchParams.next.startsWith("/")
      ? resolvedSearchParams.next
      : "/submit"
  const noticeMessage =
    resolvedSearchParams.notice === "confirmation-sent"
      ? "Check your email, confirm the account, then sign in."
      : null
  const errorMessage =
    resolvedSearchParams.error === "auth-callback"
      ? "Could not confirm the account. Try the link again."
      : null

  return (
    <section className="submit-shell">
      <div className="page-intro">
        <p className="submit-shell__eyebrow">Login</p>
        <h1 className="page-title">Sign in to submit a startup.</h1>
        <p className="section-copy">
          Use the account stored in Supabase Auth. Nothing extra is required on
          this screen.
        </p>
      </div>
      {noticeMessage ? <p className="alert">{noticeMessage}</p> : null}
      {errorMessage ? <p className="alert">{errorMessage}</p> : null}
      <LoginForm nextPath={nextPath} />
      <div className="form-actions">
        <Link className="button-link button-link--secondary" href="/register">
          Create account
        </Link>
      </div>
    </section>
  )
}
