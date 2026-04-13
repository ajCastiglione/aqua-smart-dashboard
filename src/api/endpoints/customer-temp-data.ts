import { api } from '../axios-instance'
import type { CustomerTempData, PaginatedResponse, PaginationParams } from '../types'

export type CustomerTempDataListParams = PaginationParams & {
  customer_number?: string
}

export const getCustomerTempDataList = async (
  params?: CustomerTempDataListParams,
): Promise<PaginatedResponse<CustomerTempData>> => {
  const { data } = await api.get<PaginatedResponse<CustomerTempData>>('/customer-temp-data', {
    params,
  })
  return data
}

export const getCustomerTempDataForCustomer = async (
  customerNumber: string,
): Promise<CustomerTempData[]> => {
  const { data } = await api.get<CustomerTempData[]>(
    `/customer-temp-data/${encodeURIComponent(customerNumber)}`,
  )
  return data
}
