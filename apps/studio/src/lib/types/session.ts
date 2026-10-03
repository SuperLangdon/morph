import type { Tagged } from "type-fest"
import { type IronSession } from "iron-session"
import { type User } from "~prisma/generated/prisma/client"

// Tagged type that represents the current logged in user's ID
type CurrentUserId = Tagged<User["id"], "CurrentUserId">

export interface SessionData {
  userId?: CurrentUserId
}

export type Session = IronSession<SessionData>
