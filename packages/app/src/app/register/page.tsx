import type { Metadata } from "next"
import { redirect } from "next/navigation"

import { RegisterForm } from "@/app/register/register-form"
import { isAuthenticated } from "@/lib/auth"

export const metadata: Metadata = {
  title: "Register"
}

export const dynamic = "force-dynamic"

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
          Accounts are stored in Supabase Auth. If email confirmation is
          enabled, confirm the address before the first sign in.
        </p>
      </div>
      <RegisterForm nextPath={nextPath} />
    </section>
  )
}
