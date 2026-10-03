export const ENABLE_CODEBUILD_JOBS = "enable-codebuild-jobs"
export const ENABLE_EMAILS_FOR_SCHEDULED_PUBLISHES_FEATURE_KEY =
  "enable-emails-for-scheduled-publishes"
export const ENABLE_EMAILS_FOR_REGULAR_PUBLISHES_FEATURE_KEY =
  "enable-emails-for-regular-publishes"
export const BANNER_FEATURE_KEY = "isomer-next-banner"
// Gates the audit-log export surface (settings sidenav entry + page). OFF by
// default so the feature can ship dark and be enabled per-environment.
export const IS_AUDIT_LOG_ENABLED_FEATURE_KEY = "is-audit-log-enabled"
// Gates the whole unpublish feature: manual (unpublishPage, which also
// handles Folder/Collection ids) and scheduled (scheduleUnpublish/
// cancelScheduleUnpublish) alike, since the latter presupposes the former
// exists. OFF by default so the feature can ship dark and be enabled
// per-environment.
export const IS_UNPUBLISH_ENABLED_FEATURE_KEY = "is-unpublish-enabled"

// Gates the "Date filter" option when adding a new collection tag filter.
export const IS_DATE_FILTERS_ENABLED_FEATURE_KEY = "is-date-filters-enabled"
export const IS_DATE_FILTERS_ENABLED_FEATURE_KEY_FALLBACK_VALUE = false
