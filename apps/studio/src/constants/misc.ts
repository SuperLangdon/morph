// Where users are directed when they need help. Point these at your own
// support channel when self-hosting Morph.
export const MORPH_SUPPORT_EMAIL = "support@example.com"
export const MORPH_ISSUES_LINK = "https://github.com/morph-cms/morph/issues"

// How long an audit-log export stays downloadable — the Download Window shown
// to users. Single source of truth for that window: the email copy that tells
// the requester when the link dies (~/features/mail) and the download-token TTL
// are both derived from it. It is NOT the S3 presign expiry: the click-time
// presign (~/lib/s3) uses its own short default, since the URL is signed fresh
// on each redemption rather than once at export time.
// NOTE: the exported CSV objects themselves are deleted 7 days after upload
// by an S3 lifecycle rule (rule `expire-audit-log-exports` on the
// `audit-log-exports/` prefix, provisioned by the infrastructure layer).
// Raising this constant past that window — or reusing an artifact late in its
// life (ADR 0005) — produces links that outlive the object; keep the infra
// expiry comfortably above this value.
export const AUDIT_LOG_EXPORT_URL_EXPIRY_DAYS = 3
