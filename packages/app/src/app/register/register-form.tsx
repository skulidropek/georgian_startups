"use client"

import type { Route } from "next"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export const RegisterForm = ({
  nextPath
}: {
  readonly nextPath: string
}) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [message, setMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault()

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.")
      return
    }

    setIsLoading(true)
    setMessage(null)

    try {
      const registerResponse = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({
          email,
          password
        })
      })

      const registerResult = (await registerResponse.json()) as {
        readonly message?: string
      }

      if (!registerResponse.ok) {
        throw new Error(registerResult.message ?? "Could not create the account.")
      }

      router.push(nextPath as Route)
      router.refresh()
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Could not create the account."
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form className="form-grid" onSubmit={handleSubmit}>
      {message ? <p className="alert">{message}</p> : null}
      <div className="field">
        <label htmlFor="register-email">Email</label>
        <input
          autoComplete="email"
          id="register-email"
          onChange={(event) => setEmail(event.target.value)}
          required
          type="email"
          placeholder="founder@example.com"
          value={email}
        />
        <p className="field__hint">
          This email will be used for sign in and confirmation.
        </p>
      </div>
      <div className="field">
        <label htmlFor="register-password">Password</label>
        <input
          autoComplete="new-password"
          id="register-password"
          onChange={(event) => setPassword(event.target.value)}
          required
          type="password"
          placeholder="At least 8 characters"
          value={password}
        />
        <p className="field__hint">Use at least 8 characters.</p>
      </div>
      <div className="field">
        <label htmlFor="register-confirm-password">Confirm password</label>
        <input
          autoComplete="new-password"
          id="register-confirm-password"
          onChange={(event) => setConfirmPassword(event.target.value)}
          required
          type="password"
          value={confirmPassword}
        />
      </div>
      <div className="form-actions">
        <button className="button-link button-link--primary" disabled={isLoading} type="submit">
          {isLoading ? "Creating..." : "Create account"}
        </button>
      </div>
      <div className="form-actions">
        <Link
          className="button-link button-link--secondary"
          href={`/login?next=${encodeURIComponent(nextPath)}`}
        >
          Back to login
        </Link>
      </div>
    </form>
  )
}
