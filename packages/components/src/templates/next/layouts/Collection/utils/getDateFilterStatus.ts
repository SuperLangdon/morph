import { DATE_FILTER_STATUS, type DateFilterStatusId } from "~/types/constants"
import { getSiteDateYYYYMMDD } from "~/utils/getSiteDate"

interface DateFilterValue {
  date: string
  endDate?: string
}

// Compares "yyyy-MM-dd" strings against today in the local timezone.
// Inclusive range: upcoming | ongoing | ended (no `endDate` = single-day range).
export const getDateFilterStatus = ({
  date,
  endDate,
}: DateFilterValue): DateFilterStatusId => {
  const today = getSiteDateYYYYMMDD()
  const end = endDate ?? date

  if (today < date) {
    return DATE_FILTER_STATUS.Upcoming.id
  }

  if (today > end) {
    return DATE_FILTER_STATUS.Ended.id
  }

  return DATE_FILTER_STATUS.Ongoing.id
}
