import type { User } from "~prisma/generated/generatedTypes"

export type isUserOnboardedProps = Pick<User, "name" | "phone">

// NOTE: Accept any plausible phone number: an optional leading + followed by
// 7 to 15 digits (loose E.164). At the current stage we don't do 2FA to
// validate that it's a real, reachable number.
const isPlausiblePhoneNumber = (phone: string) => {
  // Return false if phone is null, undefined, or not a string
  if (!phone || typeof phone !== "string") {
    return false
  }

  // Reject internal whitespace; allow an optional country-code prefix
  return /^\+?\d{7,15}$/.test(phone)
}

export const isUserOnboarded = ({ name, phone }: isUserOnboardedProps) => {
  return !!name && !!phone && isPlausiblePhoneNumber(phone)
}
