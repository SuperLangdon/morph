import { format } from "date-fns"

// The current date in the server/browser local timezone.
export const getSiteDate = (): Date => new Date()

// Canonical "yyyy-MM-dd" in the local timezone for comparison/sorting — not
// for display. Uses date-fns so output stays deterministic on minimal-ICU
// runtimes.
export const getSiteDateYYYYMMDD = (date = getSiteDate()): string =>
  format(date, "yyyy-MM-dd")

// Human-readable date for display — locale formatting is appropriate here.
export const getSiteDateLong = (date = getSiteDate()): string =>
  new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date)
