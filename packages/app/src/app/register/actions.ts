"use server"

import type { Route } from "next"
import { redirect } from "next/navigation"

import {
  isAuthenticated,
  normalizeNextPath,
  registerWithPassword
} from "@/lib/auth"

export type RegisterFormState = {
  readonly message: string | null
}

export const registerAction = async (
  _previousState: RegisterFormState,
  formData: FormData
): Promise<RegisterFormState> => {
  if (await isAuthenticated()) {
    redirect("/submit")
  }

  const email = String(formData.get("email") ?? "").trim()
  const password = String(formData.get("password") ?? "")
  const confirmPassword = String(formData.get("confirmPassword") ?? "")
  const nextPath = normalizeNextPath(String(formData.get("next") ?? "/submit"))

  if (password !== confirmPassword) {
    return {
      message: "Passwords do not match."
    }
  }

  const result = await registerWithPassword(email, password, nextPath)

  if (result.status === "error") {
    return {
      message: result.message
    }
  }

  if (result.status === "confirmation_required") {
    redirect("/login?notice=confirmation-sent")
  }

  redirect(nextPath as Route)
}
