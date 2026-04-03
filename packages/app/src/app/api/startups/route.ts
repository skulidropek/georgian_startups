import { NextResponse, type NextRequest } from "next/server"

import { getAuthenticatedUser } from "@/lib/auth"
import { createStartup, listPublishedStartups, parseStartupSubmissionInput } from "@/lib/startup-store"

export const GET = async (): Promise<Response> =>
  NextResponse.json(await listPublishedStartups())

export async function POST(request: NextRequest): Promise<Response> {
  const currentUser = await getAuthenticatedUser()

  if (!currentUser) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    )
  }

  const formData = await request.formData()
  const input = parseStartupSubmissionInput(formData)

  try {
    const record = await createStartup(input, currentUser)
    return NextResponse.redirect(
      new URL(`/submit?success=${record.slug}`, request.url),
      303
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to save startup"

    return NextResponse.redirect(
      new URL(`/submit?error=${encodeURIComponent(message)}`, request.url),
      303
    )
  }
}
