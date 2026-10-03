import { formatEnumLabel } from "../formatEnumLabel"

describe("formatEnumLabel", () => {
  it.each([
    ["Organization", "Organization"],
    ["LocalBusiness", "Local Business"],
    ["EducationalOrganization", "Educational Organization"],
    ["NGO", "NGO"],
    ["facebook", "Facebook"],
  ])("formats %s as %s", (value, expected) => {
    expect(formatEnumLabel(value)).toBe(expected)
  })
})
