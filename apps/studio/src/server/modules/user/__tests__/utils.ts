import {
  setupAdminPermissions,
  setupUser,
} from "tests/integration/helpers/seed"
import { IsomerAdminRole } from "~prisma/generated/generatedEnums"
import { db } from "~server/db"

const ISOMER_ADMIN_TEST_EMAILS = [
  "admin1@example.com",
  "admin2@example.com",
  "migrator1@example.com",
  "migrator2@example.com",
]

export const isomerAdminsCount = ISOMER_ADMIN_TEST_EMAILS.length

export const setupIsomerAdmins = async ({ siteId }: { siteId: number }) => {
  for (const email of ISOMER_ADMIN_TEST_EMAILS) {
    const user = await setupUser({
      email,
      isDeleted: false,
    })
    await setupAdminPermissions({ userId: user.id, siteId })

    // Also insert into IsomerAdmin table
    const role = email.startsWith("admin")
      ? IsomerAdminRole.Core
      : IsomerAdminRole.Migrator
    await db
      .insertInto("IsomerAdmin")
      .values({
        userId: user.id,
        role,
        expiry: null,
      })
      .execute()
  }
}
