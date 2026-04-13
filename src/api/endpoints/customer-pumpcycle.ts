import { api } from '../axios-instance'
import type { CustomerProfilePumpCycle, PaginatedResponse, PaginationParams } from '../types'

export type CustomerPumpCyclesListParams = PaginationParams & {
  customer_number?: string
}

export const getCustomerProfilePumpCyclesList = async (
  params?: CustomerPumpCyclesListParams,
): Promise<PaginatedResponse<CustomerProfilePumpCycle>> => {
  const { data } = await api.get<PaginatedResponse<CustomerProfilePumpCycle>>(
    '/customer-profile-pump-cycles',
    { params },
  )
  return data
}

export const getCustomerProfilePumpCycle = async (
  customerNumber: string,
  sequenceNumber: string,
): Promise<CustomerProfilePumpCycle> => {
  const { data } = await api.get<CustomerProfilePumpCycle>(
    `/customer-profile-pump-cycles/${encodeURIComponent(customerNumber)}/${encodeURIComponent(sequenceNumber)}`,
  )
  return data
}
