import { describe, expect, it } from "vitest"

import type { isUserOnboardedProps } from "../isUserOnboarded"
import { isUserOnboarded } from "../isUserOnboarded"

describe("isUserOnboarded", () => {
  describe("user validation", () => {
    it("should return true for valid user with name and phone number", () => {
      // Arrange
      const validUsers = [
        { name: "John Doe", phone: "91234567" },
        { name: "Jane Smith", phone: "+14155552671" },
        { name: "Bob Lee", phone: "61234567" },
      ]

      // Act & Assert
      validUsers.forEach((user) => {
        expect(isUserOnboarded(user)).toBe(true)
      })
    })

    it("should return false when name is missing", () => {
      // Arrange
      const usersWithoutName = [
        { name: "", phone: "91234567" },
        { name: undefined, phone: "81234567" },
        { name: null, phone: "61234567" },
      ]

      // Act & Assert
      usersWithoutName.forEach((user) => {
        expect(isUserOnboarded(user as isUserOnboardedProps)).toBe(false)
      })
    })

    it("should return false when phone is missing", () => {
      // Arrange
      const usersWithoutPhone = [
        { name: "John Doe", phone: "" },
        { name: "Jane Smith", phone: undefined },
        { name: "Bob Lee", phone: null },
      ]

      // Act & Assert
      usersWithoutPhone.forEach((user) => {
        expect(isUserOnboarded(user as isUserOnboardedProps)).toBe(false)
      })
    })
  })

  describe("phone number validation", () => {
    it("should return true for plausible phone numbers with or without a + prefix", () => {
      // Arrange
      const validUsers = [
        { name: "Test User", phone: "61234567" },
        { name: "Test User", phone: "81234567" },
        { name: "Test User", phone: "91234567" },
        { name: "Test User", phone: "+6591234567" },
        { name: "Test User", phone: "+14155552671" },
        { name: "Test User", phone: "0201234567" },
      ]

      // Act & Assert
      validUsers.forEach((user) => {
        expect(isUserOnboarded(user)).toBe(true)
      })
    })

    it("should return false for numbers with incorrect length", () => {
      // Arrange
      const invalidUsers = [
        { name: "Test User", phone: "912345" }, // Too short (6 digits)
        { name: "Test User", phone: "91234567890123456" }, // Too long (17 digits)
      ]

      // Act & Assert
      invalidUsers.forEach((user) => {
        expect(isUserOnboarded(user)).toBe(false)
      })
    })

    it("should return false for non-numeric inputs", () => {
      // Arrange
      const invalidUsers = [
        { name: "Test User", phone: "abcdefgh" }, // Letters
        { name: "Test User", phone: "9123456a" }, // Mix of numbers and letters
        { name: "Test User", phone: "91234-67" }, // With hyphen
        { name: "Test User", phone: "9123 456" }, // With space
      ]

      // Act & Assert
      invalidUsers.forEach((user) => {
        expect(isUserOnboarded(user)).toBe(false)
      })
    })

    it("should return false for empty or invalid inputs", () => {
      // Arrange
      const invalidUsers = [
        { name: "Test User", phone: "" }, // Empty string
        { name: "Test User", phone: " " }, // Space
        { name: "Test User", phone: "null" }, // String "null"
        { name: "Test User", phone: "undefined" }, // String "undefined"
      ]

      // Act & Assert
      invalidUsers.forEach((user) => {
        expect(isUserOnboarded(user)).toBe(false)
      })
    })
  })
})
