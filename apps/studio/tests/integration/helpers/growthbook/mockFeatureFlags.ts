import { IS_UNPUBLISH_ENABLED_FEATURE_KEY } from "~/lib/growthbook"

const mockFeatureFlags = new Map<string, unknown>([
  // ON by default in tests, unlike production, so existing unpublish
  // coverage doesn't need to know the flag exists. Tests for the flag
  // itself explicitly force it off.
  [IS_UNPUBLISH_ENABLED_FEATURE_KEY, true],
])

export { mockFeatureFlags }
