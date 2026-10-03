"use client"

interface ClientCopyrightProps {
  agencyName?: string
  siteName: string
}

// Rendered on the client so the copyright year reflects the visitor's current
// year rather than the (static) build-time year.
export const ClientCopyright = ({
  agencyName,
  siteName,
}: ClientCopyrightProps) => {
  return `© ${new Date().getFullYear()} ${agencyName || siteName}. All rights reserved.`
}
