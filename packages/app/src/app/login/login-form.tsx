"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"

import {
  type LoginFormState,
  loginAction
} from "@/app/login/actions"

const idleLoginFormState: LoginFormState = {
  message: null
}

const SubmitButton = () => {
  const { pending } = useFormStatus()

  return (
    <button className="button-link button-link--primary" type="submit">
      {pending ? "Signing in..." : "Sign in"}
    </button>
  )
}

export const LoginForm = ({
  nextPath
}: {
  readonly nextPath: string
}) => {
  const [state, formAction] = useActionState(loginAction, idleLoginFormState)

  return (
    <form action={formAction} className="form-grid">
      <input name="next" type="hidden" value={nextPath} />
      {state.message ? <p className="alert">{state.message}</p> : null}
      <div className="field">
        <label htmlFor="email">Email</label>
        <input autoComplete="email" id="email" name="email" required type="email" />
      </div>
      <div className="field">
        <label htmlFor="password">Password</label>
        <input
          autoComplete="current-password"
          id="password"
          name="password"
          required
          type="password"
        />
      </div>
      <div className="form-actions">
        <SubmitButton />
      </div>
    </form>
  )
}
