import path from "path"
import { fileURLToPath } from "url"

export const ROLES = [
  "editor",
  "publisher",
  "admin",
  "nomember",
  "core",
  "migrator",
] as const
export type Role = (typeof ROLES)[number]

export const TEST_EMAILS: Record<Role, string> = {
  editor: "editor@example.com",
  publisher: "publisher@example.com",
  admin: "admin-e2e@example.com",
  nomember: "nomember-e2e@example.com",
  core: "core-e2e@example.com",
  migrator: "migrator-e2e@example.com",
}

const STORAGE_DIR = fileURLToPath(new URL("../storage-state", import.meta.url))

export const storageStateFor = (role: Role): string =>
  path.join(STORAGE_DIR, `${role}.json`)
