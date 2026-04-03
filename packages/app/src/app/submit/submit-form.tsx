"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"

import { createStartupAction } from "@/app/submit/actions"
import {
  idleStartupFormState,
  startupStages
} from "@/lib/startups"

const SubmitButton = () => {
  const { pending } = useFormStatus()

  return (
    <button className="button-link button-link--primary" type="submit">
      {pending ? "Saving..." : "Save startup"}
    </button>
  )
}

export const SubmitForm = () => {
  const [state, formAction] = useActionState(
    createStartupAction,
    idleStartupFormState
  )

  return (
    <form action={formAction} className="form-grid">
      {state.message ? <p className="alert">{state.message}</p> : null}

      <div className="field">
        <label htmlFor="startupName">Startup name</label>
        <input
          defaultValue={state.values.startupName}
          id="startupName"
          name="startupName"
          required
        />
      </div>

      <div className="field">
        <label htmlFor="tagline">Tagline</label>
        <input
          defaultValue={state.values.tagline}
          id="tagline"
          name="tagline"
          required
        />
      </div>

      <div className="field">
        <label htmlFor="stage">Stage</label>
        <select defaultValue={state.values.stage} id="stage" name="stage">
          {startupStages.map((stage) => (
            <option key={stage} value={stage}>
              {stage}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="market">Market</label>
        <input defaultValue={state.values.market} id="market" name="market" required />
      </div>

      <div className="field">
        <label htmlFor="industriesRaw">Industries</label>
        <input
          defaultValue={state.values.industriesRaw}
          id="industriesRaw"
          name="industriesRaw"
          placeholder="Fintech, SaaS, AI"
          required
        />
        <p className="field__hint">Comma separated list.</p>
      </div>

      <div className="field">
        <label htmlFor="about">About</label>
        <textarea
          defaultValue={state.values.about}
          id="about"
          name="about"
          required
        />
      </div>

      <div className="field">
        <label htmlFor="traction">Traction</label>
        <textarea
          defaultValue={state.values.traction}
          id="traction"
          name="traction"
          required
        />
      </div>

      <div className="field">
        <label htmlFor="request">Request</label>
        <textarea
          defaultValue={state.values.request}
          id="request"
          name="request"
          required
        />
      </div>

      <div className="field">
        <label htmlFor="needsRaw">Needs</label>
        <textarea
          defaultValue={state.values.needsRaw}
          id="needsRaw"
          name="needsRaw"
          placeholder={"Mentor introductions\nPilot customers"}
          required
        />
        <p className="field__hint">One item per line.</p>
      </div>

      <div className="field">
        <label htmlFor="websiteUrl">Website / MVP URL</label>
        <input
          defaultValue={state.values.websiteUrl}
          id="websiteUrl"
          name="websiteUrl"
          placeholder="https://example.com"
        />
      </div>

      <div className="field">
        <label htmlFor="pitchDeckUrl">Pitch deck URL</label>
        <input
          defaultValue={state.values.pitchDeckUrl}
          id="pitchDeckUrl"
          name="pitchDeckUrl"
          placeholder="https://example.com/deck"
          required
        />
      </div>

      <div className="field">
        <label htmlFor="email">Contact email</label>
        <input
          defaultValue={state.values.email}
          id="email"
          name="email"
          required
          type="email"
        />
      </div>

      <div className="form-actions">
        <SubmitButton />
      </div>
    </form>
  )
}
