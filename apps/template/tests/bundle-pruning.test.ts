import { beforeAll, describe, expect, it } from "vitest"

import { buildTemplate } from "./helpers/buildTemplate"
import { scanBundleForZod } from "./helpers/scanBundle"

describe("template (bundle pruning)", () => {
  let defaultOutDir: string

  beforeAll(() => {
    defaultOutDir = buildTemplate()
  })

  it("excludes zod from the client bundle", () => {
    // Arrange (default template built in beforeAll) / Act
    const result = scanBundleForZod(defaultOutDir)

    // Assert
    expect(result.matchedMarkers, result.matchedMarkers.join(", ")).toEqual([])
  })
})
