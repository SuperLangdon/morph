import type {
  IsomerSiteProps,
  IsomerSiteThemeProps,
  ScriptComponentType,
} from "~/types"

import {
  GoogleTagManagerBody,
  GoogleTagManagerHeader,
  GoogleTagManagerPreload,
} from "../templates/next/components/internal/GoogleTagManager"
import { MicrosoftClarity } from "../templates/next/components/internal/MicrosoftClarity"
import { ZendeskWidget } from "../templates/next/components/internal/Zendesk"

interface RenderApplicationScriptsProps {
  site: Omit<IsomerSiteProps, "lastUpdated" | "navbar" | "footerItems">
  /** Unused since the third-party webchat widget was removed; kept for API stability. */
  themeColors?: IsomerSiteThemeProps["colors"]
  ScriptComponent: ScriptComponentType
}

export const RenderApplicationScripts = ({
  site,
  ScriptComponent,
}: RenderApplicationScriptsProps) => {
  return (
    <>
      {!!site.siteGtmId && (
        <>
          <GoogleTagManagerPreload />
          <GoogleTagManagerHeader
            siteGtmId={site.siteGtmId}
            ScriptComponent={ScriptComponent}
          />
          <GoogleTagManagerBody siteGtmId={site.siteGtmId} />
        </>
      )}

      {!!site.isomerMsClarityId && (
        <MicrosoftClarity msClarityId={site.isomerMsClarityId} />
      )}

      {/* Ensures that the webchat widget only loads after the page has loaded */}
      {site.zendesk && <ZendeskWidget {...site.zendesk} />}
    </>
  )
}
