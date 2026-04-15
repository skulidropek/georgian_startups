"use client"

import type { Route } from "next"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export const LoginForm = ({
  nextPath
}: {
  readonly nextPath: string
}) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault()

    setIsLoading(true)
    setMessage(null)

    try {
      const loginResponse = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({
          email,
          password
        })
      })

      const loginResult = (await loginResponse.json()) as {
        readonly message?: string
      }

      if (!loginResponse.ok) {
        throw new Error(loginResult.message ?? "Authentication failed.")
      }

      router.push(nextPath as Route)
      router.refresh()
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Authentication failed."
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form className="form-grid" onSubmit={handleSubmit}>
      {message ? <p className="alert">{message}</p> : null}
      <div className="field">
        <label htmlFor="email">Email</label>
        <input
          autoComplete="email"
          id="email"
          onChange={(event) => setEmail(event.target.value)}
          required
          type="email"
          value={email}
        />
      </div>
      <div className="field">
        <label htmlFor="password">Password</label>
        <input
          autoComplete="current-password"
          id="password"
          onChange={(event) => setPassword(event.target.value)}
          required
          type="password"
          value={password}
        />
      </div>
      <div className="form-actions">
        <button className="button-link button-link--primary" disabled={isLoading} type="submit">
          {isLoading ? "Signing in..." : "Sign in"}
        </button>
      </div>
      <div className="form-actions">
        <Link
          className="button-link button-link--secondary"
          href={`/register?next=${encodeURIComponent(nextPath)}`}
        >
          Create account
        </Link>
      </div>
    </form>
  )
}
