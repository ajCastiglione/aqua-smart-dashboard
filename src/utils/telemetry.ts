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

const dateTimeToMs = (raw: string | null | undefined): number => {
  if (raw == null || String(raw).trim() === "") return Number.NaN;
  const ms = new Date(raw).getTime();
  return Number.isFinite(ms) ? ms : Number.NaN;
};

/**
 * Latest row that has a numeric metric reading. Uses `DateTime` when parseable; otherwise the
 * last matching row (same pattern as {@link latestTempReading} for Date/Time + Temp_Reading).
 */
const latestReadingWithMetric = <T extends { DateTime?: string | null }>(
  rows: T[],
  metricRaw: (row: T) => string | null | undefined,
): T | undefined => {
  if (rows.length === 0) return undefined;

  const withMetric = rows.filter(
    row => parseNumericString(metricRaw(row)) !== undefined,
  );
  if (withMetric.length === 0) return undefined;

  let bestRow: T | undefined;
  let bestTimeMs = Number.NEGATIVE_INFINITY;
  for (const row of withMetric) {
    const candidateTimeMs = dateTimeToMs(row.DateTime);
    if (!Number.isFinite(candidateTimeMs)) continue;
    if (candidateTimeMs > bestTimeMs) {
      bestRow = row;
      bestTimeMs = candidateTimeMs;
    }
  }
  if (bestRow !== undefined) return bestRow;

  return withMetric[withMetric.length - 1];
};

export const latestPressureReading = (
  rows: CustomerPressureData[],
): CustomerPressureData | undefined =>
  latestReadingWithMetric(
    rows,
    row => row.Pressure_Reading ?? row.pressure_reading,
  );

/** Raw flow value from a row (Pascal or snake_case from API). */
export const flowRateRaw = (
  row: CustomerFlowRateData | undefined,
): string | null | undefined =>
  row == null ? undefined : (row.Flow_Rate ?? row.flow_rate);

/** Raw pressure value from a row (Pascal or snake_case from API). */
export const pressureReadingRaw = (
  row: CustomerPressureData | undefined,
): string | null | undefined =>
  row == null ? undefined : (row.Pressure_Reading ?? row.pressure_reading);

/**
 * Latest flow row for dashboards. The API often appends idle readings (`Flow_Rate` "0.00") with
 * the newest `DateTime`; non-zero history still exists on older rows. Prefer the latest row with a
 * **non-zero** numeric rate when any exist, otherwise the latest row including zeros.
 */
export const latestFlowReading = (
  rows: CustomerFlowRateData[],
): CustomerFlowRateData | undefined => {
  const nonZero = rows.filter(row => {
    const n = parseNumericString(flowRateRaw(row));
    return n !== undefined && n !== 0;
  });
  if (nonZero.length > 0) {
    return latestReadingWithMetric(nonZero, row => flowRateRaw(row));
  }
  return latestReadingWithMetric(rows, row => flowRateRaw(row));
};

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
