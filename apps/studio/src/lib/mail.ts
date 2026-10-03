import { partition } from "lodash-es"
import { env } from "~/env.mjs"
import { createBaseLogger } from "~/lib/logger"
import { isEmailWhitelisted } from "~/server/modules/whitelist/whitelist.service"

interface SendMailParams {
  recipient: string
  body: string
  subject: string
  cc?: string[]
}

const logger = createBaseLogger({ path: "lib/mail" })

// Lazily-created nodemailer transport. SMTP is optional: when SMTP_HOST is
// not configured, outgoing mail (including login OTPs) is logged to the
// console instead — enough for local development without any mail server.
let transportPromise: Promise<
  import("nodemailer").Transporter | undefined
> | null = null

const getTransport = async () => {
  if (!transportPromise) {
    transportPromise = (async () => {
      if (!env.SMTP_HOST) return undefined
      const nodemailer = await import("nodemailer")
      return nodemailer.createTransport({
        host: env.SMTP_HOST,
        port: env.SMTP_PORT,
        secure: env.SMTP_SECURE ?? env.SMTP_PORT === 465,
        ...(env.SMTP_USER && env.SMTP_PASS
          ? {
              auth: {
                user: env.SMTP_USER,
                pass: env.SMTP_PASS,
              },
            }
          : {}),
      })
    })()
  }
  return transportPromise
}

export const sendMail = async (params: SendMailParams): Promise<void> => {
  // Safe guard to prevent sending emails to non-whitelisted emails
  const isWhitelisted = await isEmailWhitelisted(params.recipient)
  if (!isWhitelisted) {
    throw new Error("Email not whitelisted")
  }

  // Same safeguard for cc recipients, but drop the non-whitelisted ones
  // instead of failing the whole send.
  const [whitelistedCc, droppedCc] = partition(
    await Promise.all(
      (params.cc ?? []).map(async (email) => ({
        email,
        isWhitelisted: await isEmailWhitelisted(email),
      })),
    ),
    (r) => r.isWhitelisted,
  )
  if (droppedCc.length > 0) {
    logger.warn({
      error: "Dropping non-whitelisted cc recipients",
      cc: droppedCc.map((r) => r.email),
      subject: params.subject,
    })
  }
  const cc = whitelistedCc.map((r) => r.email)

  const transport = await getTransport()

  if (!transport) {
    console.warn(
      "SMTP_HOST is not configured. Logging the following mail instead of sending: ",
      params,
    )
    return
  }

  try {
    await transport.sendMail({
      from: env.SMTP_FROM ?? params.recipient,
      to: params.recipient,
      ...(cc.length > 0 && { cc }),
      subject: params.subject,
      html: params.body,
    })

    logger.info({
      event: "email_send_succeeded",
      recipient: params.recipient,
      subject: params.subject,
    })
  } catch (error) {
    logger.error({
      error: "SMTP send failed",
      originalError: error,
      recipient: params.recipient,
      subject: params.subject,
    })
    throw error
  }
}
