import type { IsomerSiteProps } from "~/types"

interface RenderApplicationHeadScriptsProps {
  site: Pick<IsomerSiteProps, "environment">
}

export const RenderApplicationHeadScripts = ({
  site,
}: RenderApplicationHeadScriptsProps) => {
  return <></>
}
