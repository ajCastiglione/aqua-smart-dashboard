export type RowStatus = 'ACTIVE' | 'IDLE' | 'SERVICE'

export type CustomerRowMetrics = {
  openAlertCount: number
  pressurePsi?: number
  flowGpm?: number
  poolTempFahrenheit?: number
  pumpStatus?: string | null
}

/**
 * SERVICE: open alerts or zero flow/pressure (mockup “needs service”).
 * IDLE: pump reports off/idle when not in SERVICE.
 * ACTIVE: default.
 */
export const deriveCustomerRowStatus = (metrics: CustomerRowMetrics): RowStatus => {
  if (metrics.openAlertCount > 0) return 'SERVICE'
  if (metrics.pressurePsi === 0 || metrics.flowGpm === 0) return 'SERVICE'
  const pumpStatusNormalized = metrics.pumpStatus?.toLowerCase()
  if (pumpStatusNormalized === 'off' || pumpStatusNormalized === 'idle') return 'IDLE'
  return 'ACTIVE'
}
