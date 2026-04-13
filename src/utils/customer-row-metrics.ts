/**
 * Aggregates per-customer telemetry for the list table. Each row triggers **four** parallel GETs
 * (alerts, pressure, flow, temp). With `PER_PAGE` rows this is **4×N** requests per list page — a
 * backend batch or dashboard endpoint would scale better; client-side caching (TanStack Query,
 * 5m stale) only helps repeat views.
 */
import { getCustomerAlertsForCustomer } from '../api/endpoints/customer-alerts'
import { getCustomerFlowRateDataForCustomer } from '../api/endpoints/customer-flowrate-data'
import { getCustomerPressureDataForCustomer } from '../api/endpoints/customer-pressure-data'
import { getCustomerTempDataForCustomer } from '../api/endpoints/customer-temp-data'
import { isOpenAlert } from './alerts'
import {
  latestFlowReading,
  latestPressureReading,
  latestTempReading,
  parseNumericString,
} from './telemetry'
import type { CustomerRowMetrics } from './customer-status'

export const fetchCustomerRowMetrics = async (
  customerNumber: string,
): Promise<CustomerRowMetrics> => {
  const [alertRows, pressureReadings, flowRateReadings, temperatureReadings] = await Promise.all([
    getCustomerAlertsForCustomer(customerNumber),
    getCustomerPressureDataForCustomer(customerNumber),
    getCustomerFlowRateDataForCustomer(customerNumber),
    getCustomerTempDataForCustomer(customerNumber),
  ])

  const openAlertCount = alertRows.filter(isOpenAlert).length
  const latestPressureRow = latestPressureReading(pressureReadings)
  const latestFlowRateRow = latestFlowReading(flowRateReadings)
  const latestTemperatureRow = latestTempReading(temperatureReadings)

  return {
    openAlertCount,
    pressurePsi: parseNumericString(latestPressureRow?.Pressure_Reading),
    flowGpm: parseNumericString(latestFlowRateRow?.Flow_Rate),
    poolTempFahrenheit: parseNumericString(latestTemperatureRow?.Temp_Reading),
    pumpStatus: latestFlowRateRow?.Pump_Status ?? null,
  }
}
