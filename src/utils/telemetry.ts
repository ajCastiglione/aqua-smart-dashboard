import type {
  CustomerPressureData,
  CustomerFlowRateData,
  CustomerTempData,
} from "../api/types";

export const parseNumericString = (
  raw: string | null | undefined,
): number | undefined => {
  if (raw == null || raw === "") return undefined;
  const parsed = Number.parseFloat(raw);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const maxByDateTime = <T extends { DateTime: string }>(
  rows: T[],
): T | undefined => {
  if (rows.length === 0) return undefined;
  let bestRow = rows[0]!;
  let bestTimeMs = new Date(bestRow.DateTime).getTime();
  for (let index = 1; index < rows.length; index++) {
    const candidateRow = rows[index]!;
    const candidateTimeMs = new Date(candidateRow.DateTime).getTime();
    if (candidateTimeMs > bestTimeMs) {
      bestRow = candidateRow;
      bestTimeMs = candidateTimeMs;
    }
  }
  return bestRow;
};

export const latestPressureReading = (
  rows: CustomerPressureData[],
): CustomerPressureData | undefined => maxByDateTime(rows);

export const latestFlowReading = (
  rows: CustomerFlowRateData[],
): CustomerFlowRateData | undefined => maxByDateTime(rows);

/** Parse MM/DD/YYYY + HH:mm:ss for sorting and charts. Returns NaN if Date/Time are missing or invalid. */
export const tempRowToTimestamp = (row: CustomerTempData): number => {
  const dateRaw = row.Date?.trim();
  if (!dateRaw) return Number.NaN;

  const dateSegments = dateRaw
    .split("/")
    .map(segment => Number.parseInt(segment, 10));
  if (
    dateSegments.length !== 3 ||
    dateSegments.some(segment => Number.isNaN(segment))
  ) {
    return Number.NaN;
  }
  const [month, day, year] = dateSegments;

  const timeRaw = row.Time?.trim();
  const timeSegments = timeRaw
    ? timeRaw.split(":").map(segment => Number.parseInt(segment, 10))
    : [0, 0, 0];
  const hour = timeSegments[0] ?? 0;
  const minute = timeSegments[1] ?? 0;
  const second = timeSegments[2] ?? 0;
  const ms = new Date(year, month - 1, day, hour, minute, second).getTime();
  return Number.isFinite(ms) ? ms : Number.NaN;
};

/**
 * Latest temperature **reading** (row with a numeric `Temp_Reading`). Uses Date/Time when
 * parseable; otherwise the last row with a temperature (typical chronological API order).
 * Avoids picking a clock-latest row with no temp while other rows still have readings (chart
 * would show data but metric tiles would show —).
 */
export const latestTempReading = (
  rows: CustomerTempData[],
): CustomerTempData | undefined => {
  if (rows.length === 0) return undefined;

  const withNumericTemp = rows.filter(
    row => parseNumericString(row.Temp_Reading) !== undefined,
  );
  if (withNumericTemp.length === 0) return undefined;

  let bestRow: CustomerTempData | undefined;
  let bestTimeMs = Number.NEGATIVE_INFINITY;
  for (const row of withNumericTemp) {
    const candidateTimeMs = tempRowToTimestamp(row);
    if (!Number.isFinite(candidateTimeMs)) continue;
    if (candidateTimeMs > bestTimeMs) {
      bestRow = row;
      bestTimeMs = candidateTimeMs;
    }
  }
  if (bestRow !== undefined) return bestRow;

  return withNumericTemp[withNumericTemp.length - 1];
};

export const sortTempDataChronological = (
  rows: CustomerTempData[],
): CustomerTempData[] =>
  [...rows].sort((earlierRow, laterRow) => {
    const ta = tempRowToTimestamp(earlierRow);
    const tb = tempRowToTimestamp(laterRow);
    const fa = Number.isFinite(ta);
    const fb = Number.isFinite(tb);
    if (!fa && !fb) return 0;
    if (!fa) return 1;
    if (!fb) return -1;
    return ta - tb;
  });
