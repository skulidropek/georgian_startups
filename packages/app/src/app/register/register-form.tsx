"use client"

import Link from "next/link"
import { useActionState } from "react"
import { useFormStatus } from "react-dom"

import {
  type RegisterFormState,
  registerAction
} from "@/app/register/actions"

const idleRegisterFormState: RegisterFormState = {
  message: null
}

const SubmitButton = () => {
  const { pending } = useFormStatus()

  return (
    <button className="button-link button-link--primary" type="submit">
      {pending ? "Creating..." : "Create account"}
    </button>
  )
}

export const RegisterForm = ({
  nextPath
}: {
  readonly nextPath: string
}) => {
  const [state, formAction] = useActionState(
    registerAction,
    idleRegisterFormState
  )

  return (
    <form action={formAction} className="form-grid">
      <input name="next" type="hidden" value={nextPath} />
      {state.message ? <p className="alert">{state.message}</p> : null}
      <div className="field">
        <label htmlFor="register-email">Email</label>
        <input
          autoComplete="email"
          id="register-email"
          name="email"
          required
          type="email"
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
          name="password"
          required
          type="password"
        />
        <p className="field__hint">Use at least 8 characters.</p>
      </div>
      <div className="field">
        <label htmlFor="register-confirm-password">Confirm password</label>
        <input
          autoComplete="new-password"
          id="register-confirm-password"
          name="confirmPassword"
          required
          type="password"
        />
      </div>
      <div className="form-actions">
        <SubmitButton />
        <Link className="button-link button-link--secondary" href="/login">
          Back to login
        </Link>
      </div>
    </form>
  )
}
