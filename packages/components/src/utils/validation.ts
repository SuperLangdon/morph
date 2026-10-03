import { COLLECTION_SORT_ORDER } from "~/types/constants"

const ALLOWED_URL_REGEXES = {
  external: "^https:\\/\\/",
  phone: "^tel:",
  sms: "^sms:",
  mail: "^mailto:",
  internal: "^\\[resource:(\\d+):(\\d+)\\]$",
  // NOTE: This is taken with reference from `convertAssetLinks`
  // and should remain in sync.
  // Unfortunately, typebox requires a string and hence, doubly escaped characters
  // but `re.source` only gives us the actual string
  // regex for asset links: /^\/(\d+)\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/
  files:
    "^\\/(\\d+)\\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\\/",
  // These are the standard internal links that are used by sites on GitHub.
  // We can drop them once all sites have fully migrated to Studio.
  legacy: "^\\/",
} as const

export const LINK_HREF_PATTERN =
  `(${ALLOWED_URL_REGEXES.external})|(${ALLOWED_URL_REGEXES.phone})|(${ALLOWED_URL_REGEXES.sms})|(${ALLOWED_URL_REGEXES.mail})|(${ALLOWED_URL_REGEXES.internal})|(${ALLOWED_URL_REGEXES.files})|(${ALLOWED_URL_REGEXES.legacy})` as const
export const REF_HREF_PATTERN =
  `(${ALLOWED_URL_REGEXES.external})|(${ALLOWED_URL_REGEXES.internal})|(${ALLOWED_URL_REGEXES.files})|(${ALLOWED_URL_REGEXES.legacy})` as const
export const REF_INTERNAL_HREF_PATTERN =
  `(${ALLOWED_URL_REGEXES.internal})|(${ALLOWED_URL_REGEXES.legacy})` as const

// Validation for video-related embed URLs
export const YOUTUBE_PRIVACY_ENHANCED_DOMAINS = [
  "www.youtube-nocookie.com",
  "youtube-nocookie.com",
] as const

export const YOUTUBE_PRIVACY_ENHANCED_HOST = YOUTUBE_PRIVACY_ENHANCED_DOMAINS[0]

export const isYoutubePrivacyEnhancedHost = (hostname: string): boolean =>
  YOUTUBE_PRIVACY_ENHANCED_DOMAINS.some((h) => h === hostname)

export const VALID_VIDEO_DOMAINS = {
  youtube: [
    "www.youtube.com",
    "youtube.com",
    ...YOUTUBE_PRIVACY_ENHANCED_DOMAINS,
  ],
  vimeo: ["player.vimeo.com"],
  fbvideo: ["www.facebook.com"],
}

export const isValidVideoUrl = (url: string) => {
  if (!url) {
    return false
  }

  try {
    const urlObject = new URL(url)
    const allValidVideoDomains = Object.values(VALID_VIDEO_DOMAINS).flat()

    return (
      allValidVideoDomains.includes(urlObject.hostname) &&
      new RegExp(VIDEO_EMBED_URL_PATTERN).test(url)
    )
  } catch (_) {
    return false
  }
}

// NOTE: This validation is still needed as this is the only validation method
// that is supported inside the JSON schema. Components rely on the URL object
// validation for better security.
export const VIDEO_EMBED_URL_REGEXES = {
  fbvideo: "^https://www\\.facebook\\.com/plugins/video\\.php(?:\\?.*)?$",
  vimeo: "^https://player\\.vimeo\\.com/video/.*$",
  youtube:
    "^https://www\\.(youtube|youtube-nocookie)\\.com/(embed/|watch\\?v=).*$",
} as const

export const VIDEO_EMBED_URL_PATTERN = Object.values(VIDEO_EMBED_URL_REGEXES)
  .map((re) => `(${re})`)
  .join("|")

// Validation for audio embed URLs (Spotify or Apple Podcast) for the "audio" component
// Only these variants are supported: Spotify episode, show, or playlist; Apple Podcast show or episode
const VALID_AUDIO_EMBED_DOMAINS = {
  spotify: "open.spotify.com",
  applepodcast: "embed.podcasts.apple.com",
}

export const AUDIO_EMBED_URL_REGEXES = {
  spotify:
    "^https://open\\.spotify\\.com/embed/(episode|show|playlist)/[a-zA-Z0-9]+.*$",
  applepodcast: "^https://embed\\.podcasts\\.apple\\.com/[a-z]{2}/[a-z-]+/.*$",
} as const

export const AUDIO_EMBED_URL_PATTERN = Object.values(AUDIO_EMBED_URL_REGEXES)
  .map((re) => `(${re})`)
  .join("|")

export const isValidAudioEmbedUrl = (url: string) => {
  if (!url) {
    return false
  }

  try {
    const urlObject = new URL(url)
    const allValidAudioEmbedDomains = Object.values(
      VALID_AUDIO_EMBED_DOMAINS,
    ).flat()
    return (
      allValidAudioEmbedDomains.includes(urlObject.hostname) &&
      new RegExp(AUDIO_EMBED_URL_PATTERN).test(url)
    )
  } catch (_) {
    return false
  }
}

export const isApplePodcastUrl = (url: string) => {
  try {
    return new URL(url).hostname === VALID_AUDIO_EMBED_DOMAINS.applepodcast
  } catch {
    return false
  }
}

// ✅ "hello"
// ✅ " hello " (has non-whitespace in the middle)
// ✅ " a " (one letter surrounded by spaces)
// ❌ "" (empty string)
// ❌ " " (only whitespace)
export const NON_EMPTY_STRING_REGEX = "^(?=.*\\S)"

// Stricter variant: rejects leading/trailing whitespace in addition to empty/whitespace-only.
// ✅ "hello"
// ✅ "a"
// ✅ "ab cd" (internal whitespace allowed)
// ❌ "" (empty string)
// ❌ " " (only whitespace)
// ❌ " hello" (leading whitespace)
// ❌ "hello " (trailing whitespace)
// ❌ " a " (surrounded by spaces)
export const TRIMMED_NON_EMPTY_STRING_REGEX = "^\\S(.*\\S)?$"

// ✅ "" (empty string — used when a label should be hidden)
// ✅ "ab cd" (internal whitespace allowed)
// ❌ " " (only whitespace)
// ❌ " hello" (leading whitespace)
// ❌ "hello " (trailing whitespace)
export const TRIMMED_STRING_OR_EMPTY_REGEX = "^$|^\\S(.*\\S)?$"

// Matches Google tag IDs across the formats observed in the wild:
//   GTM-XXXXXX  — Google Tag Manager containers (official)
//   G-XXXXXX    — Google Analytics 4 measurement IDs (officially loaded via gtag.js, not GTM,
//                 but users paste them into the GTM field and they work in practice)
//   GT-XXXXXX   — Google Tag IDs (observed working in manual testing; not documented by Google)
// All three share the same GTM snippet format at runtime, so we accept them all even though
// only GTM- is officially documented.
// Examples:
// ✅ "GTM-ABC123"
// ✅ "G-ABC123"
// ✅ "GT-ABC123"
// ❌ "gtm-abc123" (lowercase)
// ❌ "GTM-" (missing container ID)
// ❌ "');alert(document.cookie);//" (XSS payload)
// NOTE: Official documentation does not specify allowed length,
// so we use ^GTM-[A-Z0-9]+$ (one or more chars) for future proofing.
export const GTM_ID_STRING_REGEX = "^(GTM|G|GT)-[A-Z0-9]+$"

// Collection page `sortOrder`: one of the four `COLLECTION_SORT_ORDER`
// literals, or `date-filter-{uuid}-asc|desc` for a collection date filter
// (tag category of type date).
// ✅ COLLECTION_SORT_ORDER.DateDesc ("date-desc")
// ✅ "date-filter-550e8400-e29b-41d4-a716-446655440000-asc"
// ❌ "totally-made-up"
// ❌ "date-filter-not-a-uuid-desc"
const DATE_FILTER_SORT_ORDER_UUID =
  "[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}"

const DATE_FILTER_SORT_ORDER_PATTERN = `date-filter-${DATE_FILTER_SORT_ORDER_UUID}-(?:asc|desc)`

export const DATE_FILTER_SORT_ORDER_REGEX = new RegExp(
  `^date-filter-(${DATE_FILTER_SORT_ORDER_UUID})-(asc|desc)$`,
)

export const COLLECTION_SORT_ORDER_PATTERN = `^(${COLLECTION_SORT_ORDER.DateDesc}|${COLLECTION_SORT_ORDER.DateAsc}|${COLLECTION_SORT_ORDER.TitleAsc}|${COLLECTION_SORT_ORDER.TitleDesc}|${DATE_FILTER_SORT_ORDER_PATTERN})$`
