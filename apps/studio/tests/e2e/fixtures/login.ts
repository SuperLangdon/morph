import type { Locator, Page } from "@playwright/test"

import { overwriteToken } from "../utils"

export class LoginPage {
  readonly page: Page
  readonly emailInput: Locator
  readonly otpButton: Locator
  readonly tokenInput: Locator

  constructor(page: Page) {
    this.page = page
    this.emailInput = page.getByRole("textbox", { name: "email" })
    this.otpButton = page.getByRole("button", {
      name: "send one-time password",
    })
    this.tokenInput = page.getByRole("textbox")
  }

  async fillEmail(email: string) {
    await this.emailInput.fill(email)
    await this.otpButton.click()
  }

  async fillToken(email: string) {
    // NOTE: The function for verification of otp does a comparison between the hash of the submitted token
    // and the VerificationToken.token in db.
    const token = await overwriteToken({
      factory: () => "123456",
      identifier: email,
    })
    await this.tokenInput.fill(token)
  }
}
