"use server"

import { redirect } from "next/navigation"

import { clearSession } from "@/lib/auth"

export const logoutAction = async (): Promise<void> => {
  await clearSession()
  redirect("/login")
}
