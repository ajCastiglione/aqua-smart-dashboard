import { api } from '../axios-instance'
import type { CustomerFlowRateData, PaginatedResponse, PaginationParams } from '../types'

export type CustomerFlowRateListParams = PaginationParams & {
  customer_number?: string
}

export const getCustomerFlowRateDataList = async (
  params?: CustomerFlowRateListParams,
): Promise<PaginatedResponse<CustomerFlowRateData>> => {
  const { data } = await api.get<PaginatedResponse<CustomerFlowRateData>>(
    '/customer-flow-rate-data',
    { params },
  )
  return data
}

export const getCustomerFlowRateDataForCustomer = async (
  customerNumber: string,
): Promise<CustomerFlowRateData[]> => {
  const { data } = await api.get<CustomerFlowRateData[]>(
    `/customer-flow-rate-data/${encodeURIComponent(customerNumber)}`,
  )
  return data
}
