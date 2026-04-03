import fs from "node:fs"
import path from "node:path"
import os from "node:os"

import { describe, expect, it } from "vitest"

import { createStartupStore } from "../../src/lib/startup-store"

const createTempStorePath = (): string => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "gs-startup-store-"))
  return path.join(directory, "startups.json")
}

describe("startup store", () => {
  it("persists submissions to a local json file", async () => {
    const filePath = createTempStorePath()
    const store = createStartupStore({ filePath })

    const saved = await store.add(
      {
        startupName: "Port Nova",
        tagline: "Logistics OS",
        stage: "seed",
        market: "Logistics",
        traction: "3 pilots",
        request: "Looking for angels",
        industriesRaw: "supply chain, b2b",
        about: "Simple description",
        needsRaw: "intro to shippers\nintro to ports",
        websiteUrl: "https://portnova.example",
        pitchDeckUrl: "https://portnova.example/deck",
        email: "hello@portnova.example"
      },
      {
        id: "user-1",
        email: "founder@example.com"
      }
    )

    expect(saved.slug).toBe("port-nova")
    expect(store.list()).toHaveLength(1)
    expect(JSON.parse(fs.readFileSync(filePath, "utf8"))).toHaveLength(1)
  })

  it("generates a unique slug for duplicate startup names", async () => {
    const filePath = createTempStorePath()
    const store = createStartupStore({ filePath })

    const first = await store.add(
      {
        startupName: "Port Nova",
        tagline: "Logistics OS",
        stage: "seed",
        market: "Logistics",
        traction: "3 pilots",
        request: "Looking for angels",
        industriesRaw: "supply chain",
        about: "Simple description",
        needsRaw: "intro to shippers",
        websiteUrl: "https://portnova.example",
        pitchDeckUrl: "https://portnova.example/deck",
        email: "hello@portnova.example"
      },
      {
        id: "user-1",
        email: "founder@example.com"
      }
    )

    const second = await store.add(
      {
        startupName: "Port Nova",
        tagline: "Another listing",
        stage: "seed",
        market: "Logistics",
        traction: "5 pilots",
        request: "More angels",
        industriesRaw: "supply chain",
        about: "Another description",
        needsRaw: "intro to ports",
        websiteUrl: "https://portnova.example",
        pitchDeckUrl: "https://portnova.example/deck",
        email: "hello@portnova.example"
      },
      {
        id: "user-1",
        email: "founder@example.com"
      }
    )

    expect(first.slug).toBe("port-nova")
    expect(second.slug).toBe("port-nova-2")
  })
})
