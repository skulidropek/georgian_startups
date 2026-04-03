import { describe, expect, it } from "vitest"

import {
  parseStartupSubmissionInput,
  validateStartupInput
} from "../../src/lib/startup-store"

describe("startup store helpers", () => {
  it("parses submission input and normalizes an unknown stage", () => {
    const formData = new FormData()

    formData.set("startupName", "Port Nova")
    formData.set("tagline", "Logistics OS")
    formData.set("stage", "unknown-stage")
    formData.set("market", "Logistics")
    formData.set("industriesRaw", "supply chain, b2b")
    formData.set("about", "Simple description")
    formData.set("traction", "3 pilots")
    formData.set("request", "Looking for angels")
    formData.set("needsRaw", "intro to shippers\nintro to ports")
    formData.set("websiteUrl", "https://portnova.example")
    formData.set("pitchDeckUrl", "https://portnova.example/deck")
    formData.set("email", "hello@portnova.example")

    expect(parseStartupSubmissionInput(formData)).toEqual({
      startupName: "Port Nova",
      tagline: "Logistics OS",
      stage: "pre-seed",
      market: "Logistics",
      industriesRaw: "supply chain, b2b",
      about: "Simple description",
      traction: "3 pilots",
      request: "Looking for angels",
      needsRaw: "intro to shippers\nintro to ports",
      websiteUrl: "https://portnova.example",
      pitchDeckUrl: "https://portnova.example/deck",
      email: "hello@portnova.example"
    })
  })

  it("validates required fields, email, and urls", () => {
    expect(
      validateStartupInput({
        startupName: "Port Nova",
        tagline: "Logistics OS",
        stage: "seed",
        market: "Logistics",
        industriesRaw: "supply chain",
        about: "Simple description",
        traction: "3 pilots",
        request: "Looking for angels",
        needsRaw: "intro to shippers",
        websiteUrl: "notaurl",
        pitchDeckUrl: "https://portnova.example/deck",
        email: "hello@portnova.example"
      })
    ).toBe("Website URL must be valid.")

    expect(
      validateStartupInput({
        startupName: "Port Nova",
        tagline: "Logistics OS",
        stage: "seed",
        market: "Logistics",
        industriesRaw: "supply chain",
        about: "Simple description",
        traction: "3 pilots",
        request: "Looking for angels",
        needsRaw: "intro to shippers",
        websiteUrl: "https://portnova.example",
        pitchDeckUrl: "https://portnova.example/deck",
        email: "bad-email"
      })
    ).toBe("Enter a valid contact email.")

    expect(
      validateStartupInput({
        startupName: "Port Nova",
        tagline: "Logistics OS",
        stage: "seed",
        market: "Logistics",
        industriesRaw: "supply chain",
        about: "Simple description",
        traction: "3 pilots",
        request: "Looking for angels",
        needsRaw: "intro to shippers",
        websiteUrl: "https://portnova.example",
        pitchDeckUrl: "https://portnova.example/deck",
        email: "hello@portnova.example"
      })
    ).toBeNull()
  })
})
