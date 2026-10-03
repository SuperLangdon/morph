import type { ContactInformationProps } from "~/interfaces"
import { omit } from "lodash-es"
import { getReferenceLinkHref } from "~/utils/getReferenceLinkHref"

import { NativeContactInformation } from "./NativeContactInformation"

export const ContactInformation = ({
  url,
  site,
  ...rest
}: ContactInformationProps) => {
  const uiProps = {
    ...rest,
    referenceLinkHref: getReferenceLinkHref(
      url,
      site.siteMapArray,
      site.assetsBaseUrl,
    ),
  }

  return <NativeContactInformation {...uiProps} />
}
