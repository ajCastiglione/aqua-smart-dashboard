import type {
  CustomerPressureData,
  CustomerFlowRateData,
  CustomerTempData,
} from '../api/types'

export const parseNumericString = (raw: string | null | undefined): number | undefined => {
  if (raw == null || raw === '') return undefined
  const parsed = Number.parseFloat(raw)
  return Number.isFinite(parsed) ? parsed : undefined
}

const maxByDateTime = <T extends { DateTime: string }>(rows: T[]): T | undefined => {
  if (rows.length === 0) return undefined
  let bestRow = rows[0]!
  let bestTimeMs = new Date(bestRow.DateTime).getTime()
  for (let index = 1; index < rows.length; index++) {
    const candidateRow = rows[index]!
    const candidateTimeMs = new Date(candidateRow.DateTime).getTime()
    if (candidateTimeMs > bestTimeMs) {
      bestRow = candidateRow
      bestTimeMs = candidateTimeMs
    }
  }
  return bestRow
}

export const latestPressureReading = (
  rows: CustomerPressureData[],
): CustomerPressureData | undefined => maxByDateTime(rows)

export const latestFlowReading = (
  rows: CustomerFlowRateData[],
): CustomerFlowRateData | undefined => maxByDateTime(rows)

/** Parse MM/DD/YYYY + HH:mm:ss for sorting and charts */
export const tempRowToTimestamp = (row: CustomerTempData): number => {
  const dateSegments = row.Date.split('/').map((segment) => Number.parseInt(segment, 10))
  if (dateSegments.length !== 3 || dateSegments.some((segment) => Number.isNaN(segment))) return 0
  const [month, day, year] = dateSegments
  const timeSegments = row.Time.split(':').map((segment) => Number.parseInt(segment, 10))
  const hour = timeSegments[0] ?? 0
  const minute = timeSegments[1] ?? 0
  const second = timeSegments[2] ?? 0
  return new Date(year, month - 1, day, hour, minute, second).getTime()
}

export const latestTempReading = (rows: CustomerTempData[]): CustomerTempData | undefined => {
  if (rows.length === 0) return undefined
  let bestRow = rows[0]!
  let bestTimeMs = tempRowToTimestamp(bestRow)
  for (let index = 1; index < rows.length; index++) {
    const candidateRow = rows[index]!
    const candidateTimeMs = tempRowToTimestamp(candidateRow)
    if (candidateTimeMs > bestTimeMs) {
      bestRow = candidateRow
      bestTimeMs = candidateTimeMs
    }
  }
  return bestRow
}

export const sortTempDataChronological = (rows: CustomerTempData[]): CustomerTempData[] =>
  [...rows].sort(
    (earlierRow, laterRow) => tempRowToTimestamp(earlierRow) - tempRowToTimestamp(laterRow),
  )
