import isEmail from "validator/lib/isEmail"

/**
 * Returns whether the passed value is a valid email.
 */
export const isValidEmail = (value: unknown) => {
  return typeof value === "string" && isEmail(value)
}
