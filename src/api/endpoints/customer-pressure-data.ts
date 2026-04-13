import { api } from '../axios-instance'
import type { CustomerPressureData, PaginatedResponse, PaginationParams } from '../types'

export type CustomerPressureListParams = PaginationParams & {
  customer_number?: string
}

export const getCustomerPressureDataList = async (
  params?: CustomerPressureListParams,
): Promise<PaginatedResponse<CustomerPressureData>> => {
  const { data } = await api.get<PaginatedResponse<CustomerPressureData>>(
    '/customer-pressure-data',
    { params },
  )
  return data
}

export const getCustomerPressureDataForCustomer = async (
  customerNumber: string,
): Promise<CustomerPressureData[]> => {
  const { data } = await api.get<CustomerPressureData[]>(
    `/customer-pressure-data/${encodeURIComponent(customerNumber)}`,
  )
  return data
}
