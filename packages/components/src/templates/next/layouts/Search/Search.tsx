import { type SearchPageSchemaType } from "~/types"

import { Skeleton } from "../Skeleton"

export const SearchLayout = ({ site, page, layout }: SearchPageSchemaType) => {
  return (
    <Skeleton site={site} page={page} layout={layout}>
      {/* Search results are rendered by the configured search provider. */}
    </Skeleton>
  )
}
