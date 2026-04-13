import type { CustomerAlert } from '../api/types'

/** Treat unknown/null status as open until explicitly closed in the API. */
export const isOpenAlert = (alert: CustomerAlert): boolean => {
  const normalizedStatus = alert.Status?.trim().toLowerCase()
  if (!normalizedStatus) return true
  return (
    normalizedStatus !== 'closed' &&
    normalizedStatus !== 'resolved' &&
    normalizedStatus !== 'cleared'
  )
}
