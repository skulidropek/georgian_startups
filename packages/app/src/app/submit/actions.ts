"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import {
  createStartup,
  parseStartupSubmissionInput,
  validateStartupInput
} from "@/lib/startup-store"
import { requireAuthentication } from "@/lib/auth"
import {
  type StartupFormState,
} from "@/lib/startups"

export const createStartupAction = async (
  _previousState: StartupFormState,
  formData: FormData
): Promise<StartupFormState> => {
  const values = parseStartupSubmissionInput(formData)
  const validationMessage = validateStartupInput(values)

  if (validationMessage) {
    return {
      status: "error",
      message: validationMessage,
      values
    }
  }

  const currentUser = await requireAuthentication("/submit")
  const startup = await createStartup(values, currentUser)

  revalidatePath("/")
  revalidatePath("/startups")
  revalidatePath(`/startups/${startup.slug}`)
  redirect(`/startups/${startup.slug}`)
}
