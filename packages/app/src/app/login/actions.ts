"use server"

import type { Route } from "next"
import { redirect } from "next/navigation"

import {
  isAuthenticated,
  normalizeNextPath,
  signInWithPassword
} from "@/lib/auth"

export type LoginFormState = {
  readonly message: string | null
}

export const loginAction = async (
  _previousState: LoginFormState,
  formData: FormData
): Promise<LoginFormState> => {
  if (await isAuthenticated()) {
    redirect("/submit")
  }

  const email = String(formData.get("email") ?? "").trim()
  const password = String(formData.get("password") ?? "")
  const nextPath = normalizeNextPath(String(formData.get("next") ?? "/submit"))
  const result = await signInWithPassword(email, password)

  if (!result.ok) {
    return {
      message: result.message
    }
  }

  redirect(nextPath as Route)
}
