import type { Static } from "@sinclair/typebox"
import { Type } from "@sinclair/typebox"

import { NativeDataSourceSchema } from "../integration"

const BaseSearchableTableSchema = Type.Object({
  title: Type.Optional(
    Type.String({
      title: "Title",
      description: "The title of the table",
    }),
  ),
})

const NativeSearchableTableSchema = Type.Intersect(
  [
    NativeDataSourceSchema,
    Type.Object({
      headers: Type.Array(Type.Union([Type.String(), Type.Number()])),
      items: Type.Array(Type.Array(Type.Union([Type.String(), Type.Number()]))),
    }),
  ],
  {
    title: "Native", // TODO: think of a better title that makes sense for user
    format: "hidden", // currently we don't support this for Studio users
  },
)

export const SearchableTableSchema = Type.Intersect(
  [BaseSearchableTableSchema, NativeSearchableTableSchema],
  {
    title: "Database",
    description: "Displays a table with search and pagination functionality.",
  },
)

type BaseSearchableTableClientProps = Static<typeof BaseSearchableTableSchema>

// note: ideally we should not pass entire "site" object to the client component
// as it can be quite large and increase page size
// but since this is not a common component, we will allow it for now :(
export type SearchableTableClientProps = BaseSearchableTableClientProps &
  Pick<NativeSearchableTableProps, "headers"> & {
    items: {
      row: NativeSearchableTableProps["items"][number]
      key: string
    }[]
  } & {
    isLoading?: boolean
    isError?: boolean
  }

export type NativeSearchableTableProps = BaseSearchableTableClientProps &
  Static<typeof NativeSearchableTableSchema>

export type SearchableTableProps = Static<typeof SearchableTableSchema>
