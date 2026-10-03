import type {
  NativeSearchableTableProps,
  SearchableTableProps,
} from "~/interfaces"

import { NativeSearchableTable } from "./Native"

export const SearchableTable = (props: SearchableTableProps) => {
  return <NativeSearchableTable {...(props as NativeSearchableTableProps)} />
}
