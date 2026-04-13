import { api } from '../axios-instance'
import type { CustomerAlert, PaginatedResponse, PaginationParams } from '../types'

export type CustomerAlertsListParams = PaginationParams & {
  customer_number?: string
}

export const getCustomerAlerts = async (
  params?: CustomerAlertsListParams,
): Promise<PaginatedResponse<CustomerAlert>> => {
  const { data } = await api.get<PaginatedResponse<CustomerAlert>>('/customer-alerts', {
    params,
  })
  return data
}

export const getCustomerAlertsForCustomer = async (
  customerNumber: string,
): Promise<CustomerAlert[]> => {
  const { data } = await api.get<CustomerAlert[]>(
    `/customer-alerts/${encodeURIComponent(customerNumber)}`,
  )
  return data
}
